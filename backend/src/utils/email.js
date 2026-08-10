import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.email.resendApiKey);

/**
 * @param {string} to
 * @param {{ subject: string, body: string }} options
 */
const sentEmail = async (to, { subject, body }) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject,
    html: body,
  });

  if (error) {
    throw {
      statusCode: 502,
      message: `Failed to send email: ${error.message}`,
    };
  }

  return data;
};

export default sentEmail;
