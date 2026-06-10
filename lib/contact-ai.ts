import "server-only";

type ContactAiInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactEmotion = "angry" | "happy" | "normal";

export type ContactAiEmail = {
  subject: string;
  body: string;
};

export type ContactAiReview =
  | { available: true; accepted: true; emotion: ContactEmotion; email?: ContactAiEmail }
  | {
      available: true;
      accepted: false;
      error: string;
      showWarning: boolean;
      warningTitle: string;
      warningMessage: string;
    }
  | { available: false; reason: string };

type RawContactReview = {
  accepted?: unknown;
  emotion?: unknown;
  emailSubject?: unknown;
  emailBody?: unknown;
  rejectionType?: unknown;
  invalidFields?: unknown;
  suggestion?: unknown;
  warningTitle?: unknown;
  warningMessage?: unknown;
};

const CONTACT_FIELDS = ["name", "email", "subject", "message"] as const;
type ContactField = (typeof CONTACT_FIELDS)[number];

const FIELD_LABELS: Record<ContactField, string> = {
  name: "your name",
  email: "your email address",
  subject: "the subject",
  message: "your message",
};

const DEFAULT_WARNING_TITLE = "Message blocked";
const DEFAULT_WARNING_MESSAGE =
  "Your message appears to contain spam, abusive, or inappropriate content. " +
  "Please send a respectful and accurate message if you want to contact Rohit.";

/** Word-boundary–aware abusive terms (Romanised Marathi/Hindi). */
const ABUSIVE_TERMS = [
  "lavdya", "lavde", "lavadya",
  "chutiya", "chutya",
  "bhosdike", "bhosdi",
  "madarchod", "mc",
  "bhenchod", "bc",
];

// Pre-compile patterns once at module load.
const ABUSE_PATTERNS = ABUSIVE_TERMS.map(
  (term) => new RegExp(`\\b${escapeRegExp(term)}\\b`, "i"),
);

/** Phrases that indicate leaked chain-of-thought in an email body. */
const LEAKED_REASONING_PHRASES = [
  "let me", "i should", "the user wants", "as an ai",
  "response should", "i need to", "i will now",
];

/** Groq request timeout in milliseconds. */
const REQUEST_TIMEOUT_MS = 12_000;

/**
 * Token budget for the model reply.
 * A complete thank-you email body can reach ~300 tokens;
 * 220 was too low and caused truncated/invalid JSON.
 */
const MAX_TOKENS = 512;

// ---------------------------------------------------------------------------
// System prompt (assembled once)
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = [
  "You are a strict but fair contact form quality checker for a software developer portfolio.",
  "Review the full payload: name, email, subject, and message.",

  // Language tolerance
  "Users may write in English, Hindi, Marathi, Hinglish, Marathi written in English letters, or a mix of Indian languages and English.",
  "Romanized Indian-language words are valid contact text, not random gibberish.",
  "Translate mentally before judging whether the subject or message is meaningful.",

  // Rejection criteria
  "Reject ONLY when: the email is clearly fake, disposable, or randomly generated; OR the subject/message is clearly abusive, vulgar, or meaningless even after multilingual interpretation; OR the message is pure spam with no actionable intent.",
  "Do NOT reject normal hiring inquiries, project requests, freelance offers, collaboration proposals, questions, or appreciation messages.",
  "Accept multilingual messages with a clear intent even if grammar, spelling, or transliteration is imperfect.",

  // Abusive terms
  "Treat Marathi/Hindi/Hinglish abusive words written in English letters as vulgar and reject them. Examples: lavdya, lavde, chutiya, chutya, bhosdike, madarchod, bhenchod.",

  // Emotion
  "Classify the sender's emotion as exactly one of: angry, happy, normal.",

  // Reply rules
  "When accepted, write a concise thank-you reply email FROM Rohit Chauhan TO the sender.",
  "Write in the sender's primary language when natural; otherwise use plain English.",
  "The reply must: acknowledge their exact topic, match the sender's emotion, never invent facts, and state that Rohit will respond soon.",
  "Never promise pricing, availability, hiring decisions, refunds, bug fixes, or project acceptance.",

  // Rejection output
  "If rejected, set rejectionType to one of: spam, vulgar, fake, random.",
  "For spam or vulgar rejections, populate warningTitle and warningMessage with a firm, short, professional user-facing explanation.",

  // JSON contract — explicit schema with worked example
  'Return ONLY compact valid JSON in this exact shape (no markdown, no code fences, no prose):',
  '{"accepted":true,"emotion":"normal","emailSubject":"Thank you for reaching out","emailBody":"Hi [Name],\\n\\nThank you for your message about [topic]. Rohit will get back to you soon.\\n\\nBest regards,\\nRohit Chauhan","rejectionType":"","invalidFields":[],"suggestion":"","warningTitle":"","warningMessage":""}',
  "When rejected: accepted=false, emailSubject and emailBody must be empty strings, invalidFields may contain only: name, email, subject, message, suggestion must tell the user what to correct.",
  "When accepted: rejectionType, invalidFields, suggestion, warningTitle, warningMessage must all be empty.",
].join(" ");

export async function reviewContactWithAi(
  input: ContactAiInput,
): Promise<ContactAiReview> {
  // 1. Fast local abuse check — skip AI entirely if obviously abusive.
  const localBlock = getLocalAbuseBlock(input);
  if (localBlock) return localBlock;

  // 2. Resolve configuration.
  const apiKey = process.env.GROQ_API_KEY;
  const models = (process.env.GROQ_MODELS ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  if (!apiKey || models.length === 0) {
    return { available: false, reason: "Groq API key or model list is missing." };
  }

  const userPrompt = buildUserPrompt(input);

  // 3. Try each model in order; return the first successful review.
  for (const model of models) {
    const review = await callGroq(apiKey, model, userPrompt);
    if (review) return review;
  }

  // 4. All models failed — degrade gracefully.
  return { available: false, reason: "AI contact review failed for every configured model." };
}

async function callGroq(
  apiKey: string,
  model: string,
  userPrompt: string,
): Promise<ContactAiReview | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: MAX_TOKENS,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "(unreadable)");
      console.error(`Groq ${model} → HTTP ${response.status}: ${errorText}`);
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const raw = data.choices?.[0]?.message?.content;
    return parseContactAiReview(raw);
  } catch (err) {
    const label = err instanceof Error && err.name === "AbortError" ? "timeout" : "error";
    console.error(`Groq contact review ${label} (${model}):`, err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function buildUserPrompt(input: ContactAiInput): string {
  return [
    "Contact form payload:",
    `Name: ${input.name.trim()}`,
    `Email: ${input.email.trim()}`,
    `Subject: ${input.subject.trim()}`,
    "Message:",
    input.message.trim(),
  ].join("\n");
}

function getLocalAbuseBlock(input: ContactAiInput): ContactAiReview | null {
  const haystack = `${input.subject} ${input.message}`;
  const isAbusive = ABUSE_PATTERNS.some((re) => re.test(haystack));
  if (!isAbusive) return null;

  return {
    available: true,
    accepted: false,
    error: "Please remove abusive or inappropriate language before sending.",
    showWarning: true,
    warningTitle: DEFAULT_WARNING_TITLE,
    warningMessage: DEFAULT_WARNING_MESSAGE,
  };
}

function parseContactAiReview(content: string | undefined): ContactAiReview | null {
  const cleaned = stripReasoning(content ?? "");
  if (!cleaned) return null;

  let parsed: RawContactReview;
  try {
    parsed = JSON.parse(cleaned) as RawContactReview;
  } catch {
    // Attempt to extract a JSON object if there's surrounding noise.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      parsed = JSON.parse(match[0]) as RawContactReview;
    } catch {
      return null;
    }
  }

  if (parsed.accepted === true) {
    return {
      available: true,
      accepted: true,
      emotion: parseEmotion(parsed.emotion),
      email: parseAiEmail(parsed),
    };
  }

  if (parsed.accepted === false) {
    const fields = parseInvalidFields(parsed.invalidFields);
    const suggestion = safeString(parsed.suggestion);
    const { showWarning, warningTitle, warningMessage } = parseWarning(parsed);

    return {
      available: true,
      accepted: false,
      error: buildCorrectionMessage(fields, suggestion),
      showWarning,
      warningTitle,
      warningMessage,
    };
  }

  return null;
}

function parseWarning(parsed: RawContactReview): {
  showWarning: boolean;
  warningTitle: string;
  warningMessage: string;
} {
  const rejectionType = safeString(parsed.rejectionType).toLowerCase();
  const showWarning = rejectionType === "spam" || rejectionType === "vulgar";

  if (!showWarning) {
    return { showWarning: false, warningTitle: "", warningMessage: "" };
  }

  return {
    showWarning: true,
    warningTitle: sanitizeWarningText(parsed.warningTitle, DEFAULT_WARNING_TITLE, 80),
    warningMessage: sanitizeWarningText(parsed.warningMessage, DEFAULT_WARNING_MESSAGE, 360),
  };
}

function parseAiEmail(parsed: RawContactReview): ContactAiEmail | undefined {
  const subject = safeString(parsed.emailSubject);
  const body = safeString(parsed.emailBody);

  if (!isValidEmailSubject(subject) || !isValidEmailBody(body)) return undefined;
  return { subject, body };
}

function isValidEmailSubject(value: string): boolean {
  return value.length > 0 && value.length <= 120 && !/[<>{}]/.test(value);
}

function isValidEmailBody(value: string): boolean {
  if (value.length < 60 || value.length > 1_600) return false;
  if (/[<>{}]/.test(value)) return false;
  const lower = value.toLowerCase();
  return !LEAKED_REASONING_PHRASES.some((phrase) => lower.includes(phrase));
}

function parseEmotion(value: unknown): ContactEmotion {
  const text = safeString(value).toLowerCase();
  if (text === "angry" || text === "happy") return text;
  return "normal";
}

function parseInvalidFields(value: unknown): ContactField[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((f) => safeString(f).toLowerCase())
    .filter((f): f is ContactField =>
      CONTACT_FIELDS.includes(f as ContactField),
    );
}

function buildCorrectionMessage(fields: ContactField[], suggestion: string): string {
  if (suggestion) return suggestion;
  if (fields.length === 0) return "Please check your details and try again.";

  const labels = fields.map((f) => FIELD_LABELS[f]);
  const joined =
    labels.length === 1
      ? labels[0]
      : `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;

  return `Please correct ${joined} before sending.`;
}

/** Safely coerce an unknown value to a trimmed string. */
function safeString(value: unknown): string {
  return String(value ?? "").trim();
}

/** Strip model reasoning tags and code-fence wrappers. */
function stripReasoning(value: string): string {
  return value
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

function sanitizeWarningText(
  value: unknown,
  fallback: string,
  maxLength: number,
): string {
  const text = stripReasoning(safeString(value));
  if (!text || text.length > maxLength || /[<>{}]/.test(text)) return fallback;
  return text;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
