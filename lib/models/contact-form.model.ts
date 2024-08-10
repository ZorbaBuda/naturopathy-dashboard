import { Schema, model, models } from "mongoose";

const ContactFormSchema = new Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    message: { type: String },
    date: { type: String },
    privacyConsent: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const ContactForm =
  models.ContactForm || model("ContactForm", ContactFormSchema);

export default ContactForm;
