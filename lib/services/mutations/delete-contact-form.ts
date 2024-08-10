"use server"
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/next-auth";
import connect from "@/lib/db";
import ContactForm from "@/lib/models/contact-form.model";


export default async function deleteContactForm({deleteId} : {deleteId : string}) {

  const session = await getAuthSession();

  const isUser = session?.user.role === "USER";

  if (!isUser) {
    return { error: "Unauthorized" };
  }

  if (!deleteId) {
    return { error: "Need to pass contact form Id" };
  }

  

  await connect()

  try {
    const response = await ContactForm.findByIdAndDelete({deleteId})

    revalidatePath("/", "layout");

    return {
     
      success: `Contact form message deleted`,
      data: response,
    };
  } catch (error) {
    return { error: "Something went wrong", data: error };
  }
}

export type DeleteContactFormProps = typeof deleteContactForm;

