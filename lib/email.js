import nodemailer from "nodemailer";

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  // Gmail configuration
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_PASS, // your-app-password
  },
  // Or use SMTP configuration
  // host: process.env.SMTP_HOST,
  // port: process.env.SMTP_PORT,
  // secure: true,
  // auth: {
  //   user: process.env.SMTP_USER,
  //   pass: process.env.SMTP_PASS,
  // },
});

export function generateOTP() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export async function sendOTPEmail(email, otp, name) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@ecommerce.com",
    to: email,
    subject: "Verify Your Email - ECOMMERCE",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000; text-align: center;">Verify Your Email</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up with ECOMMERCE. Please use the following 8-digit code to verify your email address:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #000; font-size: 32px; letter-spacing: 4px; margin: 0;">${otp}</h1>
        </div>
        
        <p>This code will expire in 10 minutes for security reasons.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          This email was sent by ECOMMERCE. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
}
