import { NextResponse } from "next/server";
import { api } from "..";

export const POST = async(req: Request) => {
    const { userData }  = await req.json();
    
    try {

        const { data }  = await api.post('/auth/local/register', userData )
        return NextResponse.json({ message: "User Created", data }, { status:201 })

    } catch (error) {
        return NextResponse.json({ message: "Error", error },{ status:500 })
    }
}