import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

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
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
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
        const emailResult = await emailFunctions.sendOTPEmail(email, otp, name);
        emailSent = emailResult.success;
        if (!emailResult.success) {
          console.error("Failed to send OTP email:", emailResult.error);
          // In production, you might want to return an error here
          if (process.env.NODE_ENV === "production") {
            return NextResponse.json(
              {
                message: "Failed to send verification email. Please try again.",
              },
              { status: 500 }
            );
          }
        }
      }
    }

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create user (not verified yet)
    const hashedPassword = hashPassword(password);
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      interests: [],
      emailVerified: false,
      otp: otp,
      otpExpiry: otpExpiry,
      createdAt: new Date(),
    });

    const response = {
      message: emailSent
        ? "User created successfully. Please check your email for the verification code."
        : "User created successfully. Please verify your email with the OTP.",
      userId: result.insertedId.toString(),
    };

    // ONLY show OTP in development mode
    if (process.env.NODE_ENV === "development") {
      response.devOTP = otp;
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
