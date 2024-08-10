import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/schemas/contact-form-schema";
import { TContactForm } from "@/types";
import { addContactForm } from "@/lib/services/mutations/add-contact-form";
import { stringify } from "querystring";

// https://www.youtube.com/watch?v=-MFiza7ZRzs
// https://github.com/gitdagray/next-js-course/tree/main/next08

export async function POST(request: NextRequest) {
  
    
    const body   = await request.json()

    console.log(body.email)
    const result = await addContactForm(body)

    

    return NextResponse.json("ok")
  
    //check again is good practice?
    // const parsedBody = messageSchema.safeParse(body);
  
  
    }
  
  