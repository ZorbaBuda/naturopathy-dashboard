"use server";

import connect from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/next-auth";
import { CategoryProps, categorySchema } from "@/schemas/category-schema";
import escapeStringRegexp from "escape-string-regexp";
import Category from "@/lib/models/category.model";

export async function editCategory({
  categoryId,
  values,
}: {
  categoryId: string;
  values: CategoryProps;
}) {
  const session = await getAuthSession();

  const isUser = session?.user.role === "USER";

  if (!isUser) {
    return { error: "Unauthorized" };
  }

  if (!categoryId) {
    return { error: "Need to pass category Id" };
  }

  const userId = session.user.id;

  const parsedBody = categorySchema.safeParse(values);

  if (!parsedBody.success) {
    const { errors } = parsedBody.error;

    return { error: "Invalid request", data: errors };
  }

  const { data } = parsedBody;
  const { categoryName, description, slug } = data;

  const escapedCategoryName = escapeStringRegexp(categoryName);
  const escapedSlug = escapeStringRegexp(slug);

  await connect()

  const categoryExists = await Category.findOne({
    categoryName : escapedCategoryName,
    userId : userId,
    id : {"$ne" : categoryId}
  });
 
  if (categoryExists) {
    return { error: "Category already exists", errorType: "categoryName" };
  }

  const slugExist = await Category.findOne({
    slug : escapedSlug,
    userId : userId,
    id : {"$ne" : categoryId}
  });

  //TODO using insensitive quering?
  // const slugExist = await Category.find({
  //   where: {
  //     slug: {
  //       equals: escapedSlug,
  //       mode: "insensitive",
  //     },
  //     AND: {
  //       userId,
  //     },
  //     NOT: {
  //       id: categoryId,
  //     },
  //   },
  // });

  if (slugExist) {
    return { error: "Category slug already exists", errorType: "slug" };
  }

  try {
    const response = await Category.findOneAndUpdate({
      _id : categoryId,
      userId : userId},
      data,
      { new : true});


    revalidatePath("/", "layout");

    const result = JSON.parse(JSON.stringify(response))

    return {
      success: "Category updated successfully",
      data: result,
    };
  } catch (error) {
    return { error: "Something went wrong", data: error };
  }
}
