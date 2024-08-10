"use client";

import type { TBlog, TContactForm } from "@/types";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/modals/delete-modal";
import { deleteBlog } from "@/lib/services/mutations/delete-blog";
import deleteContactForm from "@/lib/services/mutations/delete-contact-form";

interface ContactFormAction<TData> {
  row: Row<TData>;
}

export function ContactFormsAction<TData>({ row }: ContactFormAction<TData>) {
  const contactFormData = row.original as TContactForm;
 
  console.log("_id", contactFormData._id)

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // console.log("delete id", category.id);
    setIsDeleting(true);

    const result = await deleteContactForm({ deleteId: contactFormData._id });

    console.log("result", result);

    if (result?.success) {
      toast.success(result.success);
    } else if (result?.error) {
      toast.error(result.error);
    } else {
      toast.error("Error");
    }

    setShowDeleteModal(false);
    setIsDeleting(false);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <Link href={`/contact-form/view/${contactFormData._id}`}>
            <DropdownMenuItem>
              <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              View
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />


          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        key={contactFormData._id}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        title={`Do you want to delete "${contactFormData.name} message"?`}
        handleDelete={handleDelete}
        isPending={isDeleting}
      />
    </>
  );
}
