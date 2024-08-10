"use server";

import cloudinary from "@/lib/cloudinary";
import { getAuthSession } from "@/lib/next-auth";
import connect from "@/lib/db";
import User from "@/lib/models/user.model";
import { LogoProps, logoSchema } from "@/schemas/settings-schema";
import { revalidatePath } from "next/cache";

export async function changeLogo({ values }: { values: LogoProps }) {
  const session = await getAuthSession();

  const isUser = session?.user.role === "USER";

  if (!isUser) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  await connect()

  const accountResponse = await User.find({userId });

  if (!accountResponse) {
    return { error: "Account not found" };
  }

  const parsedBody = logoSchema.safeParse(values);

  if (!parsedBody.success) {
    const { errors } = parsedBody.error;

    return { error: "Invalid request", data: errors };
  }

  const { data } = parsedBody;
  const { logoUrl, logoId } = data;

  const currentLogo = await User.find({
    where: {
      id: userId,
    },
    select: {
      logoId: true,
      logoUrl: true,
    },
  });

  try {
    const response = await User.updateOne({
      where: {
        id: userId,
      },
      data: {
        logoUrl: logoUrl,
        logoId: logoId,
      },
      select: {
        logoUrl: true,
      },
    });

    //TODO uncomment this
    // if (currentLogo?.logoId) {
    //   await cloudinary.v2.uploader.destroy(currentLogo.logoId);
    // }

    revalidatePath("/", "layout");

    return { success: "Logo changed", data: response };
  } catch (error) {
    return { error: "Something went wrong", data: error };
  }
}
