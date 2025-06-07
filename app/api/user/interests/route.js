import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });

    return NextResponse.json({
      interests: user?.interests || [],
    });
  } catch (error) {
    console.error("Get interests error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { categoryIds } = await request.json();

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    await users.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { interests: categoryIds } }
    );

    return NextResponse.json({ message: "Interests saved successfully" });
  } catch (error) {
    console.error("Save interests error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const token = getTokenFromRequest(request);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { categoryId, action } = await request.json();

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const updateOperation =
      action === "add"
        ? { $addToSet: { interests: categoryId } }
        : { $pull: { interests: categoryId } };

    await users.updateOne(
      { _id: new ObjectId(decoded.userId) },
      updateOperation
    );

    return NextResponse.json({ message: "Interest updated successfully" });
  } catch (error) {
    console.error("Update interest error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
