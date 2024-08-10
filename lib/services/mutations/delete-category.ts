"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/next-auth";
import connect from "@/lib/db";
import Category from "@/lib/models/category.model";

export async function deleteCategory({
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
    return { error: "Need to pass category Id" };
  }

  const userId = session.user.id;

  await connect()
  // TODO what abot grouped deletings?
  if (typeof deleteId === "string") {
    try {
      const response = await Category.findByIdAndDelete(deleteId)

      revalidatePath("/", "layout");

      return {
        // success: `Category ${response.categoryName} deleted`,
        success: `Category  deleted`,
        data: response,
      };
    } catch (error) {
      return { error: "Something went wrong", data: error };
    }
  }

  if (Array.isArray(deleteId)) {
    try {
      const response = await Category.deleteMany({
        where: {
          id: {
            in: deleteId,
          },
          userId,
        },
      });

      const result = JSON.parse(JSON.stringify(response))

      revalidatePath("/", "layout");

      return {
        success: `${deleteId.length} categories deleted`,
        data: result,
      };
    } catch (error) {
      return { error: "Something went wrong", data: error };
    }
  }
}

export type DeleteCategoryProps = typeof deleteCategory;
