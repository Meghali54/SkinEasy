import nodemailer from "nodemailer"

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
): Promise<void> {
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:5173"
  const resetUrl = `${appUrl}/reset-password?token=${resetToken}`

  // In development, log the reset URL when SMTP is not configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("=== PASSWORD RESET EMAIL (dev mode) ===")
    console.log(`To: ${to}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log("=======================================")
    return
  }

  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"SkinEasy" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset your SkinEasy password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ec4899;">Reset Your Password</h2>
        <p>Hi there,</p>
        <p>We received a request to reset the password for your SkinEasy account.</p>
        <p>Click the button below to choose a new password. This link expires in <strong>30 minutes</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
            style="background: linear-gradient(to right, #ec4899, #f43f5e);
                   color: white; padding: 12px 32px; border-radius: 9999px;
                   text-decoration: none; font-weight: 600; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't request this, you can safely ignore this email — your password won't change.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Or copy and paste this URL into your browser:<br/>
          <a href="${resetUrl}" style="color: #ec4899;">${resetUrl}</a>
        </p>
      </div>
    `,
    text: `Reset your SkinEasy password by visiting: ${resetUrl}\n\nThis link expires in 30 minutes.\n\nIf you didn't request this, ignore this email.`,
  })
}
