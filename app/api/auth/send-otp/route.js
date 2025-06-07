import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Dynamically import email functions only when needed
async function getEmailFunctions() {
  try {
    const emailModule = await import("@/lib/email");
    return emailModule;
  } catch (error) {
    console.log("Email module not available:", error.message);
    return null;
  }
}

export async function POST(request) {
  try {
    const { email, purpose = "verification" } = await request.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Generate OTP
    let otp = "12345678"; // Default OTP for development
    let emailSent = false;

    // Try to use email functions if available
    const emailFunctions = await getEmailFunctions();
    if (emailFunctions) {
      otp = emailFunctions.generateOTP();

      // Send OTP email (only if email service is configured)
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const emailResult = await emailFunctions.sendOTPEmail(
          email,
          otp,
          "User"
        );
        emailSent = emailResult.success;
        if (!emailResult.success) {
          console.error("Failed to send OTP email:", emailResult.error);
        }
      }
    }

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const client = await clientPromise;
    const db = client.db();
    const otpCollection = db.collection("otps");

    // Store OTP in database (separate collection for flexibility)
    await otpCollection.insertOne({
      email,
      otp,
      purpose,
      otpExpiry,
      createdAt: new Date(),
      verified: false,
    });

    return NextResponse.json(
      {
        message: emailSent
          ? "OTP sent successfully to your email"
          : "OTP generated successfully (email service not configured)",
        emailSent,
        // In development, show the OTP in response (remove in production)
        ...(process.env.NODE_ENV === "development" && { devOTP: otp }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
