"use server";

import connect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import Media from "@/lib/models/media.model";
import { getAuthSession } from "@/lib/next-auth";
// import { prisma } from "@/lib/prisma";
import { BlogProps, blogSchema } from "@/lib/schemas/blog-schema";
import { getDescription } from "@/utils/get-description";
import escapeStringRegexp from "escape-string-regexp";
import { revalidatePath } from "next/cache";

export async function addBlog({ values }: { values: BlogProps }) {
  const session = await getAuthSession();

  const isUser = session?.user.role === "USER";

  if (!isUser) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  const parsedBody = blogSchema.safeParse(values);

  if (!parsedBody.success) {
    const { errors } = parsedBody.error;

    return { error: "Invalid request", data: errors };
  }

  const { data } = parsedBody;
  const {
    title,
    slug,
    body,
    author,
    categories,
    // categorySlug,
    featuredImage,
    metaDescription,
    published,
    bodyImages,
  } = data;

  const escapedTitle = escapeStringRegexp(title);
  const escapedSlug = escapeStringRegexp(slug);

  await connect()

  const titleExist = await Blog.findOne({title:escapedTitle, userId: userId})
  
  if (titleExist) {
    return { error: "Title already exists", errorType: "title" };
  }

  const slugExist = await Blog.findOne({slug: escapedSlug, userId: userId });
  
  if (slugExist) {
    return { error: "Slug already exists", errorType: "slug" };
  }

  try {
    const response  = await Blog.create({
        title,
        slug,
        body,
        author,
        categories,
        // categorySlug,
        metaDescription,
        published,
        featuredImage: {
          imageId: featuredImage.imageId,
          imageUrl: featuredImage.imageUrl,
          imageTitle: featuredImage.imageTitle,
          altText: featuredImage.altText,
        },
        userId: userId,
      
    });

    if (response.id) {
      const imageExist = await Media.find({imageUrl: featuredImage.imageUrl, userId: userId });


      const responseMedia =
        !(imageExist)  &&
        (await Media.create({
            ...featuredImage,
            userId: userId,
        }));

      if (bodyImages) {
        const imagesUrl = bodyImages.map((image) => image.imageUrl);

        const imagesExist = await Media.find({imageUrl : imagesUrl,  userId: userId});

        const imagesToSubmit = bodyImages
          .filter(
            (bodyImage) =>
              !imagesExist.some(
                (existingImage) => existingImage.imageUrl === bodyImage.imageUrl
              )
          )
          .map((filteredImage) => ({ ...filteredImage, userId }));

        const responseMedias =
          imagesToSubmit.length > 0 &&
          (await Media.create({imagesToSubmit }));

        console.log("response media", responseMedias);
      }
     }

     //TODO on demand revalidation on the client
    // if(published){} 

    revalidatePath("/", "layout");

     const result = JSON.parse(JSON.stringify(response))

    return {
      success: "Blog created successfully",
       data: result,
    };
  } catch (error) {
     return { error: "Something went wrong", data: error };
   
  }
}
