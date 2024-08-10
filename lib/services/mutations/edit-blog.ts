"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/next-auth";
import connect from "@/lib/db";
import { BlogProps, blogSchema } from "@/lib/schemas/blog-schema";
import escapeStringRegexp from "escape-string-regexp";
import Blog from "@/lib/models/blog.model";
import Media from "@/lib/models/media.model";
import { TBlog } from "@/types";

export async function editBlog({
  blogId,
  values,
}: {
  blogId: string;
  values: TBlog;
}) {
  const session = await getAuthSession();

  const isUser = session?.user.role === "USER";

  if (!isUser) {
    return { error: "Unauthorized" };
  }

  if (!blogId) {
    return { error: "Need to pass blog Id" };
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
    body,
    author,
    categories,
    featuredImage,
    metaDescription,
    published,
    slug,
    bodyImages,
  } = data;

  const escapedTitle = escapeStringRegexp(title);
  const escapedSlug = escapeStringRegexp(slug);

  await connect()

  const titleExist = await Blog.findOne({title: escapedTitle, userId : userId, id: {"$ne" : blogId}});

  if (titleExist) {
    return { error: "Title already exists", errorType: "title" };
  }

  const slugExist = await Blog.findOne({slug: escapedSlug, userId : userId, id: {"$ne" : blogId}});
   

  if (slugExist) {
    return { error: "Slug already exists", errorType: "slug" };
  }

  try {
    // const blog = await Blog.findById(blogId)
    // console.log(blogId)
    // console.log("😒",blog)

    const response = await Blog.findOneAndUpdate({_id: blogId,  userId : userId}, data, {new: true});

    // console.log(data)
    // console.log('❤',response)

    if (response && response.id) {
      const imageExist = await Media.findOne({imageUrl: featuredImage.imageUrl, userId : userId})

      const response =
        !imageExist &&
        (await Media.create({...featuredImage,userId }));

      console.log("response featured image", response);

      if (bodyImages) {
        const imagesUrl = bodyImages.map((image) => image.imageUrl);

  const imagesExist = await Media.find({imageUrl : {"$in" : imagesUrl}, userId : userId})
//TODO is using in!
        // const imagesExist = await Media.find({
        //   where: {
        //     imageUrl: {
        //       in: imagesUrl,
        //     },
        //     AND: {
        //       userId,
        //     },
        //   },
        // });

        // console.log("imagesExist", imagesExist);

        const imagesToSubmit = bodyImages
          .filter(
            (bodyImage) =>
              !imagesExist.some(
                (existingImage) => existingImage.imageUrl === bodyImage.imageUrl
              )
          )
          .map((filteredImage) => ({ ...filteredImage, userId }));

        const response =
          imagesToSubmit.length > 0 &&
          (await Media.create({imagesToSubmit}));

        console.log("response body images", response);
      }
    }

    revalidatePath("/", "layout");

    const result = JSON.parse(JSON.stringify(response))

    return {
      success: "Blog updated successfully",
      data: result,
    };
  } catch (error) {
    return { error: "Something went wrong", data: error };
  }
}
