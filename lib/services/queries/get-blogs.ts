"use server"
import escapeStringRegexp from "escape-string-regexp"
import { PER_PAGE } from "@/config";
import connect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import {  TBlog } from "@/types";
import { parseStringify } from "@/lib/utils";

type TBlogSearch = {
    userId: string,
    sortBy?: string,
    orderBy?: string,
    limitNumber?: number,
    pageNumber?: number,
    title?: string,
}
export async function getBlogs({
    userId,
    sortBy,
    orderBy,
    limitNumber,
    pageNumber,
    title,
} : TBlogSearch
) {

 const currentPage = Math.max(pageNumber || 1, 1)

 const escapedTitle = title && escapeStringRegexp(title)

 const sortCase = () => {
    const orderByNum = orderBy == "asc" ? 1 : -1
    switch (sortBy) {
      case "title":
        return {
          title: orderByNum,
        };
      case "author":
        return {
          author: orderByNum,
        };
      case "metaDescription":
        return {
          metaDescription: orderByNum,
        };
      case "views":
        return {
          blogViews: {
            _count: orderByNum,
          },
        };
      case "status":
        return {
          published: orderByNum,
        };
      case "created at":
        return {
          createdAt: orderByNum,
        };

      default:
        break;
    }
  };

  const sorting = sortCase() as any

  const take = limitNumber || PER_PAGE

  const skip = (currentPage - 1) * (limitNumber || PER_PAGE) || 0;

  try {

    await connect()

    const blogs  = await Blog.find({userId: userId})
  .skip(skip)
  .limit(take)
  .sort(sorting)

  const blogsCount = await Blog.countDocuments({userId : userId});

  // const blogs = JSON.parse(JSON.stringify(response))
  const result = {
    blogs: blogs,
    blogsCount: blogsCount,
  }

  return parseStringify(result)
    
  } catch (error) {

    console.log(error)
    return parseStringify({error: error})
    
  }


}
