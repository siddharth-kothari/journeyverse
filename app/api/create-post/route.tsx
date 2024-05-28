import { NextResponse } from "next/server";
import { query } from "@/config/db";

export const POST = async (req: Request) => {
  const data = await req.json();

  try {
    let slug = data.title.toLowerCase();

    // Remove special characters (keep alphanumeric and spaces)
    slug = slug.replace(/[^a-z0-9\s-]/g, "");

    // Replace spaces and multiple hyphens with a single hyphen
    slug = slug.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
    const post = await query({
      query:
        "INSERT INTO posts(title,slug,content,category_id,author_id,thumbnail,coverimage,keywords,excerpt) VALUES (?,?,?,?,?,?,?,?,?)",
      data: [
        data.title,
        slug,
        data.content,
        data.category,
        data.userid,
        data.thumbnail_name,
        data.coverimage_name,
        data.keywords,
        data.excerpt,
      ],
    });

    return NextResponse.json(
      { message: "post_created", status: 200, data: slug },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error, status: 500 }, { status: 500 });
  }
};
