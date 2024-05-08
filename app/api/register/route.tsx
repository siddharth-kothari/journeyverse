import { NextResponse } from "next/server";
import { api } from "..";
import { query } from "@/config/db";

export const POST = async (req: Request) => {
  const data = await req.json();

  console.log("userData", data.username);

  try {
    //const { data } = await api.post("/auth/local/register", userData);

    const results = await query({
      query: "SELECT * FROM users WHERE email = ?",
      data: [data.email],
    });

    console.log("result", results);

    // Assuming query function returns an object with a property `newUser`

    const res = results;

    if (res.length == 0) {
      const result = await query({
        query: "INSERT INTO users(name,email) VALUES(?,?)",
        data: [data.username, data.email],
      });

      console.log("results", result.insertId);

      return NextResponse.json({ message: "User Created" }, { status: 201 });
    } else {
      return NextResponse.json({ message: "User Exists!!" }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};
