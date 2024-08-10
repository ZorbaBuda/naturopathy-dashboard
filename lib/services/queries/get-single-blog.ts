 "use server"
import connect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import { parseStringify } from "@/lib/utils";


export async function getSingleBlog({
  decodedSlug,
  userId,
}: {
  decodedSlug: string;
  userId: string;
})  {

  await connect() 

  const blog  = await Blog.findOne({userId: userId, slug: decodedSlug})
   console.log(blog)
  // const blog = await prisma.blog.findFirst({
  //   where: {
  //     userId: userId,
  //     slug: decodedSlug,
  //   },
  // });
 

  // console.log(blog)

   if(!blog) return null

   
    // const blog1  = parseStringify(blog)

  return  parseStringify(blog) ;
}
