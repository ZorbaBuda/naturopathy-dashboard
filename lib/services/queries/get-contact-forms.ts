import escapeStringRegexp from "escape-string-regexp"
import { PER_PAGE } from "@/config";
import connect from "@/lib/db";
import ContactForm from "@/lib/models/contact-form.model";
import { parseStringify } from "@/lib/utils";

type TContactFormSearch = {
    sortBy?: string,
    orderBy?: string,
    limitNumber?: number,
    pageNumber?: number,
    name?: string,
}
export async function getContactForms({
    sortBy,
    orderBy,
    limitNumber,
    pageNumber,
    name,
} : TContactFormSearch
) {

 const currentPage = Math.max(pageNumber || 1, 1)

 const escapedTitle = name && escapeStringRegexp(name)

 const sortCase = () => {
    const orderByNum = orderBy == "asc" ? 1 : -1
    switch (sortBy) {
      case "name":
        return {
          name: orderByNum,
        };
      case "phone":
        return {
          phone: orderByNum,
        };
      case "email":
        return {
          email: orderByNum,
        };
      case "message":
        return {
          message: orderByNum,
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

    const contactForms  = await ContactForm.find()
  .skip(skip)
  .limit(take)
  .sort(sorting)


  const contactFormsCount = await ContactForm.countDocuments();

  // const blogs = JSON.parse(JSON.stringify(response))
  const result = {
    contactForms : contactForms,
    contactFormsCount : contactFormsCount,
  }

  return parseStringify(result)
    
  } catch (error) {

    console.log(error)
    return parseStringify({error: error})
    
  }


}
