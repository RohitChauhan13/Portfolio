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

const ABUSIVE_TERMS = [
  "lavdya", "lavde", "lavadya", "lavdi", "lavdey",
  "chutiya", "chutya", "chutiye", "chutiyer",
  "bhosdike", "bhosdi", "bhosde", "bhosadi",
  "madarchod", "mc", "maa chod", "ma chud",
  "bhenchod", "bc", "behnchod",
];

const ABUSE_PATTERNS = ABUSIVE_TERMS.map(
  (term) => new RegExp(`\\b${escapeRegExp(term)}\\b`, "i"),
);

const LEAKED_REASONING_PHRASES = [
  "let me", "i should", "the user wants", "as an ai",
  "response should", "i need to", "i will now",
];

const REQUEST_TIMEOUT_MS = 12_000;

const MAX_TOKENS = 1000;

const SYSTEM_PROMPT = [
  "You are Rohit Chauhan's AI contact assistant for his software developer portfolio.",
  "Review the name, email, subject and message.",
  "Users may write in English, Hindi, Marathi, Hinglish or mixed languages. Understand intent before judging.",
  "Reject ONLY fake emails, spam, abusive/vulgar messages or meaningless text.",
  "Do NOT reject genuine questions, bug reports, suggestions, appreciation, project requests, jobs, internships, freelance offers or collaborations.",
  "Classify emotion as exactly one of: angry, happy, normal.",

  "When accepted, write a natural email reply FROM Rohit Chauhan.",
  "Use the english language when appropriate.",
  "If the subject is generic (other, help, hi, hello), infer the topic from the message body.",
  "Match the sender's tone and acknowledge their intent.",
  "Avoid repetitive templates and robotic wording.",
  "Never invent facts or promise pricing, timelines, bug fixes, hiring decisions, refunds or project acceptance.",

  "If rejected, set rejectionType to one of: spam, vulgar, fake, random.",
  "For spam or vulgar messages, provide a short professional warningTitle and warningMessage.",

  'Return ONLY compact valid JSON with keys: accepted, emotion, emailSubject, emailBody, rejectionType, invalidFields, suggestion, warningTitle and warningMessage.',
  "When accepted, rejectionType, invalidFields, suggestion, warningTitle and warningMessage must be empty.",
  "When rejected, emailSubject and emailBody must be empty."
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
        temperature: 0.7,
        top_p: 0.9,
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
