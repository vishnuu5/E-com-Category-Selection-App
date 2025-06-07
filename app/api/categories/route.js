import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page")) || 1;
    const limit = Number.parseInt(searchParams.get("limit")) || 6;

    const client = await clientPromise;
    const db = client.db();
    const categories = db.collection("categories");

    const skip = (page - 1) * limit;

    const [categoriesData, totalCount] = await Promise.all([
      categories.find({}).skip(skip).limit(limit).toArray(),
      categories.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      categories: categoriesData,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
