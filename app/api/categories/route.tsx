import { NextResponse } from "next/server";
import { query } from "@/config/db";

export const GET = async (req: Request) => {
  try {
    const categories = await query({
      query: "SELECT id, title, slug FROM categories WHERE is_deleted != 1",
      data: [],
    });

    return NextResponse.json(
      { data: categories, status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error, status: 500 }, { status: 500 });
  }
};
