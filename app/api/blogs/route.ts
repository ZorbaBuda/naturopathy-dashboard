import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/models/blog.model";

export async function GET() {
 

  try {
    await connect()
    const blogs = await Blog.find({published : true})
    .sort({createdAt : -1})
     
    return new NextResponse(JSON.stringify(blogs), {status : 200})
    // return NextResponse.json(
    //   { success: true, data: blogs },
    //   { status: 200 }
    // );
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "Something went wrong", data: error },
      { status: 500 }
    );
  }
}
