import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
