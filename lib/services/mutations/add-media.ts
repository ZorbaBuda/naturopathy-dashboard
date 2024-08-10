"use server";

import { getAuthSession } from "@/lib/next-auth";
import connect from "@/lib/db";
import { MediaProps, mediaSchema } from "@/schemas/media-schema";
import { revalidatePath } from "next/cache";
import Media from "@/lib/models/media.model";

export async function addMedia({ values }: { values: MediaProps }) {
  const session = await getAuthSession();

  const isUser = session?.user.role === "USER";

  if (!isUser) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  const parsedBody = mediaSchema.safeParse(values);

  if (!parsedBody.success) {
    const { errors } = parsedBody.error;

    return { error: "Invalid request", data: errors };
  }

  const { data } = parsedBody;
  const { imageUrl, imageId, imageTitle, altText } = data;


  try {
    console.log("🚀")
    await connect()
    const response = await Media.create({
        imageUrl,
        imageId,
        imageTitle,
        altText,
        userId,
     
    });

    revalidatePath("/", "layout");

    return {
      success: "Media added successfully",
      data: response,
    };
  } catch (error) {
    return {
      error: "Something went wrong",
      data: error,
    };
  }
}
