import { DataTable } from "@/components/data-table";
import { getAuthSession } from "@/lib/next-auth";
import { getContactForms } from "@/lib/services/queries/get-contact-forms";
import { Metadata } from "next";
import { contactFormsColumn } from "./contact-forms-table/contact-forms-column";
import deleteContactForm from "@/lib/services/mutations/delete-contact-form";
import { TContactForm } from "@/types";


export const metadata: Metadata = {
    title: "Contact Forms Received",
  };

export default async function ContactFormPage({
    searchParams: { limit, page, search, sort },
}: {
  searchParams: SearchParams;
}) {
  const session = await getAuthSession();

  if (!session) return;

  

  const limitNumber = Number(limit);
  const pageNumber = Number(page);

  const sortValues = sort?.split(".");
  const sortBy = sortValues?.[0];
  const orderBy = sortValues?.[1];

  const { contactForms, contactFormsCount } = await getContactForms({
    sortBy,
    orderBy,
    limitNumber,
    pageNumber,
    name: search,
  });
  

  // console.log(contactForms, contactFormsCount)

  return (
    <>
      <div className="mt-10 flex justify-end">
       
      </div>

      <div className="my-10">
        {contactForms && (
          <DataTable
            columns={contactFormsColumn}
            data={contactForms}
            searchBy="contact-form"
            count={contactFormsCount}
            deleteAction={deleteContactForm}
            manualControl
          />
        )}
      </div>
    </>
  )
}
