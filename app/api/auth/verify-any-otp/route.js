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
    const otpCollection = db.collection("otps");

    // Find the most recent OTP for this email
    const otpRecord = await otpCollection.findOne(
      { email, verified: false },
      { sort: { createdAt: -1 } }
    );

    if (!otpRecord) {
      return NextResponse.json(
        { message: "No valid OTP found for this email" },
        { status: 404 }
      );
    }

    // In development mode, accept any 8-digit OTP OR the stored OTP
    const isValidOTP =
      process.env.NODE_ENV === "development"
        ? /^\d{8}$/.test(otp) || otp === otpRecord.otp
        : otp === otpRecord.otp;

    if (!isValidOTP) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Check if OTP has expired (only in production)
    if (
      process.env.NODE_ENV === "production" &&
      otpRecord.otpExpiry &&
      new Date() > otpRecord.otpExpiry
    ) {
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 });
    }

    // Mark OTP as verified
    await otpCollection.updateOne(
      { _id: otpRecord._id },
      { $set: { verified: true, verifiedAt: new Date() } }
    );

    return NextResponse.json(
      {
        message: "OTP verified successfully",
        email: email,
        purpose: otpRecord.purpose,
      },
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
