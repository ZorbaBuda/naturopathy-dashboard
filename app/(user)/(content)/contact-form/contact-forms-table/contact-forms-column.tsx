"use client";

// import type { Blog } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ClientFormattedDate } from "@/components/formats/client-formatted-date";
import { ContactFormsAction } from "./contact-forms-action";
// import { BlogQueryProps } from "@/db/user/queries/get-blogs";
import { TContactForm } from "@/types";

export const contactFormsColumn: ColumnDef<TContactForm>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" manualSort />
    ),
    cell: ({ row }) => <div className="w-[400px]">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" manualSort />
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
        manualSort
      />
    ),
    cell: ({ row }) => (
      <div className="w-[400px]">{row.getValue("email")}</div>
    ),
  },
 
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" manualSort />
    ),
    cell: ({ row }) => (
      <div>{row.getValue("message")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" manualSort />
    ),
    cell: ({ row }) => (
      <div className="w-[220px]">
        <ClientFormattedDate date={row.getValue("createdAt")} />
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <div>
        <ContactFormsAction row={row} />
      </div>
    ),
  },
];
