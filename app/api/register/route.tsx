import { NextResponse } from "next/server";
import { api } from "..";
import { query } from "@/config/db";

export const POST = async (req: Request) => {
  const data = await req.json();

  try {
    //const { data } = await api.post("/auth/local/register", userData);

    const emailExists = await query({
      query: "SELECT * FROM users WHERE email = ?",
      data: [data.email],
    });

    const usernameExists = await query({
      query: "SELECT * FROM users WHERE username = ?",
      data: [data.username],
    });

    if (emailExists.length == 0) {
      if (usernameExists.length == 0) {
        const result = await query({
          query:
            "INSERT INTO users(name,username,email,password,location,image,bio) VALUES(?,?,?,?,?,?,?)",
          data: [
            data.name,
            data.username,
            data.email,
            data.password,
            data.location,
            data.image,
            data.bio,
          ],
        });

        return NextResponse.json(
          { message: "user_created", status: 201 },
          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { message: "Please select a different Username", status: 500 },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "User already exists", status: 500 },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error, status: 500 }, { status: 500 });
  }
};
