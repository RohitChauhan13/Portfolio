import "server-only";

type ContactEmailArgs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactEmail({ name, email, subject, message }: ContactEmailArgs) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? "Rohit Chauhan Portfolio";
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "rohitchauhan6232@gmail.com";

  if (!apiKey || !senderEmail) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[dev contact] ${name} <${email}>: ${subject}\n${message}`);
      console.info(`[dev thank-you] ${name} <${email}>: Thanks for contacting us.`);
      return;
    }
    throw new Error("Brevo email configuration is missing.");
  }

  await sendBrevoEmail({
    sender: { email: senderEmail, name: senderName },
    replyTo: { email: toEmail, name: "Rohit Chauhan" },
    to: [{ email, name }],
    subject: `Thank you for reaching out, ${name}`,
    htmlContent: thankYouEmailHtml({ name, subject }),
    textContent: thankYouEmailText({ name, subject })
  });
}

async function sendBrevoEmail(payload: Record<string, unknown>) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY ?? "",
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to send email. ${response.status} ${response.statusText}: ${errorText}`);
  }
}

function thankYouEmailHtml({ name, subject }: { name: string; subject: string }) {
  return `
<!doctype html>
<html>
  <body style="margin:0;background:#f7fafc;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            <tr><td style="background:#0f172a;color:#ffffff;padding:24px 28px;font-size:22px;font-weight:700;">Thank you for reaching out</td></tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;">Hi ${escapeHtml(name)},</p>
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;">Thank you for contacting me through the portfolio site. I have received your message regarding <span style="color:#0ea5e9;font-weight:700">${escapeHtml(subject)}</span> and will review it carefully.</p>
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;">I appreciate you taking the time to get in touch. I'll respond as soon as possible, typically within one business day.</p>
                <div style="margin-top:20px;padding:18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;color:#334155;line-height:1.6;font-size:15px;">
                  If you need to share any additional information, just reply to this email and I will make sure it is included in my response.
                </div>
                <p style="margin:24px 0 0;font-size:16px;line-height:1.75;">Warm regards,<br /><strong>Rohit Chauhan</strong></p>
                <hr style="border:none;border-top:1px solid #e6eef6;margin:20px 0;" />
                <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">Contact information</p>
                <p style="margin:6px 0 0;font-size:14px;color:#0f172a;line-height:1.6;">Email: <a href="mailto:rohitchauhan6232@gmail.com" style="color:#0ea5e9;text-decoration:none;">rohitchauhan6232@gmail.com</a></p>
                <p style="margin:6px 0 0;font-size:14px;color:#0f172a;line-height:1.6;">Mobile: <a href="tel:+17024756186" style="color:#0ea5e9;text-decoration:none;">702-475-6186</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function thankYouEmailText({ name, subject }: { name: string; subject: string }) {
  return `Hi ${name},

Thank you for contacting me through the portfolio site. I have received your message regarding "${subject}" and will review it carefully.

I appreciate you taking the time to get in touch. I'll respond as soon as possible, typically within one business day.

If you need to share any additional information, feel free to reply to this email.

Warm regards,
Rohit Chauhan

Contact information:
Email: rohitchauhan6232@gmail.com
Mobile: 702-475-6186`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char] ?? char));
}
