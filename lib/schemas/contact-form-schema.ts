import { z } from "zod";

//TODO i18n ?

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const ContactFormSchema = z
.object({
    name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_\s]+$/,
      "Invalid name. Letters, numbers, spaces or underscores only"
    )
    .regex(/^[a-zA-Z][a-zA-Z0-9_\s]*$/, "Name must start with a letter"),
   
  phone: z
  .string()
  .regex(phoneRegex, "Invalid number!"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  message: z
  .string()
  .min(1, "Body is required")
  .max(30, "at most 30 characters"),
  
  // date: z.string(),
  
  privacyConsent: z.boolean().default(false).refine((val) => val === true, {
    message: "Please read and accept the terms and conditions",
  })
  
})

export type ContactFormProps = z.infer<typeof ContactFormSchema>;