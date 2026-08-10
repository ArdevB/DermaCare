import { resend } from "../utils/email.js";
import config from "../config/config.js";

const templates = {
  welcome: ({ name }) => ({
    subject: "Welcome to DermaCare",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2>Welcome, ${name}!</h2>
        <p>Thanks for joining DermaCare — your destination for skin, hair, body care, and makeup essentials.</p>
        <p>Start exploring products tailored to your skin and hair type.</p>
      </div>
    `,
  }),

  resetPassword: ({ name, resetUrl }) => ({
    subject: "Reset your DermaCare password",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2>Hi ${name},</h2>
        <p>We received a request to reset your password. This link expires in 30 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#2b2b2b;color:#fff;text-decoration:none;border-radius:4px;">
          Reset Password
        </a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  }),

  orderConfirmation: ({ name, orderNumber, grandTotal, items }) => ({
    subject: `Order Confirmed — ${orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2>Thank you for your order, ${name}!</h2>
        <p>Order <strong>${orderNumber}</strong> has been placed successfully.</p>
        <ul>
          ${items.map((i) => `<li>${i.name} × ${i.quantity} — Rs. ${i.price * i.quantity}</li>`).join("")}
        </ul>
        <p><strong>Total: Rs. ${grandTotal}</strong></p>
      </div>
    `,
  }),

  paymentSuccess: ({ name, orderNumber, amount }) => ({
    subject: `Payment Received — ${orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2>Payment confirmed, ${name}</h2>
        <p>We've received your payment of <strong>Rs. ${amount}</strong> for order <strong>${orderNumber}</strong>.</p>
      </div>
    `,
  }),
};

/**
 * @param {object} params
 * @param {string} params.to
 * @param {string} [params.subject]
 * @param {keyof typeof templates} params.template
 * @param {object} params.data
 */
export const sendEmail = async ({ to, subject, template, data }) => {
  const templateFn = templates[template];
  if (!templateFn) throw new Error(`Unknown email template: ${template}`);

  const { subject: defaultSubject, html } = templateFn(data);

  const { data: result, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject: subject || defaultSubject,
    html,
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }

  return result;
};
