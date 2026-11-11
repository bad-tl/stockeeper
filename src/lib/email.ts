
import { BrevoClient } from "@getbrevo/brevo";

type AuthEmailInput = {
  to: string;
  subject: string;
  heading: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
  expiryMessage: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSender(from: string) {
  const match = from.match(/^(.*?)\s*<([^<>]+)>$/);

  const sender = match
    ? {
        name: match[1].trim(),
        email: match[2].trim(),
      }
    : {
        name: "Stockeeper",
        email: from.trim(),
      };

  if (!sender.email || !sender.email.includes("@")) {
    throw new Error("The configured email sender address is invalid.");
  }

  return sender;
}

export async function sendAuthEmail({
  to,
  subject,
  heading,
  message,
  actionLabel,
  actionUrl,
  expiryMessage,
}: AuthEmailInput) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("Brevo email delivery is not configured.");
  }

  // Only allow HTTP or HTTPS links in authentication emails.
  let validatedActionUrl: string;

  try {
    const parsedUrl = new URL(actionUrl);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Unsupported URL protocol.");
    }

    validatedActionUrl = parsedUrl.toString();
  } catch {
    throw new Error("The authentication email action URL is invalid.");
  }

  const sender = getSender(from);

  const brevo = new BrevoClient({
    apiKey,
    timeoutInSeconds: 30,
    maxRetries: 2,
  });

  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  const safeActionLabel = escapeHtml(actionLabel);
  const safeExpiryMessage = escapeHtml(expiryMessage);
  const safeActionUrl = escapeHtml(validatedActionUrl);

  const textContent = `${heading}

${message}

${actionLabel}: ${validatedActionUrl}

${expiryMessage}

Stockeeper`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${safeHeading}</title>
      </head>
      <body style="margin:0;padding:40px 16px;background:#f7f8fc;font-family:Arial,sans-serif;color:#172033;">
        <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:36px 28px;">
          <div style="margin-bottom:28px;color:#4f46e5;font-size:22px;font-weight:700;">
            Stockeeper
          </div>

          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;">
            ${safeHeading}
          </h1>

          <p style="font-size:15px;line-height:1.7;color:#667085;">
            ${safeMessage}
          </p>

          <div style="margin:28px 0;">
            <a
              href="${safeActionUrl}"
              style="display:inline-block;padding:13px 22px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;"
            >
              ${safeActionLabel}
            </a>
          </div>

          <p style="font-size:13px;line-height:1.6;color:#667085;">
            ${safeExpiryMessage}
          </p>

          <p style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#98a2b3;">
            If you didn't request this email, you can safely ignore it.
            <br />© 2026 Stockeeper
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender,
      to: [{ email: to }],
      subject,
      textContent,
      htmlContent,
    });

    if (!result.messageId) {
      throw new Error("Brevo did not return an email message ID.");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown email delivery error.";

    throw new Error(`Brevo email delivery failed: ${errorMessage}`);
  }
}
