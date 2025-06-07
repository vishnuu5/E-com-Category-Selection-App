import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    if (otp.length !== 8) {
      return NextResponse.json(
        { message: "OTP must be 8 digits" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Find user by email
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    // PRODUCTION: Only accept the stored OTP
    // DEVELOPMENT: Accept any 8-digit OTP OR the stored OTP
    const isValidOTP =
      process.env.NODE_ENV === "development"
        ? /^\d{8}$/.test(otp) || otp === user.otp
        : otp === user.otp;

    if (!isValidOTP) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Check if OTP has expired
    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark user as verified and clear OTP
    await users.updateOne(
      { _id: user._id },
      {
        $set: { emailVerified: true, verifiedAt: new Date() },
        $unset: { otp: "", otpExpiry: "" },
      }
    );

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
