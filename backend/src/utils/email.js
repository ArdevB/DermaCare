import { Resend } from "resend";
import config from "../config/config.js";
import ApiError from "./ApiError.js";

let resend = null;
if (config.email.isConfigured) {
  resend = new Resend(config.email.apiKey);
}

/**
 * @param {string} to
 * @param {{ subject: string, body: string }} options
 */
const sendEmail = async (to, { subject, body }) => {
  if (!config.email.isConfigured) {
    // Fail loudly and immediately rather than letting `new Resend(undefined)`
    // fail mysteriously deep inside the SDK.
    throw new ApiError(
      503,
      "Email sending is not configured on this server. Set RESEND_API_KEY and EMAIL_FROM in .env."
    );
  }

  const { data, error } = await resend.emails.send({
    from: config.email.from,
    to,
    subject,
    html: body,
  });

  if (error) {
    throw ApiError.internal(`Failed to send email: ${error.message}`);
  }

  return data;
};

export default sendEmail;