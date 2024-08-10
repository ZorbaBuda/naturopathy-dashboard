import { getAuthSession } from "@/lib/next-auth";
import connect from "@/lib/db";
import escapeStringRegexp from "escape-string-regexp";
import { revalidatePath } from "next/cache";
import ContactForm from "@/lib/models/contact-form.model";
import { TContactForm } from "@/types";
import { ContactFormProps, ContactFormSchema } from "@/lib/schemas/contact-form-schema";

export async function addContactForm( values : TContactForm) {
 
 
    
  
    const {name, phone, email, message, date, privacyConsent} = values
 
   
    try {
    await connect();

    const response = await ContactForm.create({
     name,
     phone,
     email,
     message,
     date,
     privacyConsent
  });


    revalidatePath("/", "layout");

    return {
      success: "Contact form data created successfully",
    //   data: response,
    };
  } catch (error) {
    return { error: "Something went wrong", data: error };
  }
}
