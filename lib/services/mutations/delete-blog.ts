"use server"

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/next-auth";
import connect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import { parseStringify } from "@/lib/utils";

export async function deleteBlog({
    deleteId,
  }: {
    deleteId: string | string[];
  }) {
    const session = await getAuthSession();
  
    const isUser = session?.user.role === "USER";
  
    if (!isUser) {
      return { error: "Unauthorized" };
    }
  
    if (!deleteId) {
      return { error: "Need to pass blog Id" };
    }
  
    const userId = session.user.id;
  
    if (typeof deleteId === "string") {
      try {
        
        await connect()

        console.log(deleteId)
        const response = await Blog.findByIdAndDelete(deleteId)
        
        revalidatePath("/", "layout");
  
        return {
          success: `Blog deleted`,
          data: response,
        };
      } catch (error) {
        return { error: "Something went wrong", data: error };
      }
    }
  
    if (Array.isArray(deleteId)) {
      try {
        const response = await Blog.deleteMany({
          where: {
            id: {
              in: deleteId,
            },
            userId: userId,
          },
        });

        const result = parseStringify(response)
  
        revalidatePath("/", "layout");
  
        return {
          success: `${deleteId.length} blogs deleted`,
          data: result,
        };
      } catch (error) {
        return { error: "Something went wrong", data: error };
      }
    }
  }
  
  export type DeleteBlogProps = typeof deleteBlog;
  