"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import SubmitButton from "@/app/components/SubmitButton";

interface DeletePropertyContentProps {
  propertyName: string;
  deleteAction: () => Promise<void>;
}

export default function DeletePropertyContent({
  propertyName,
  deleteAction,
}: DeletePropertyContentProps) {
  return (
    <form action={deleteAction} className="mt-9 flex flex-col items-center justify-center gap-3">
      <p>Are you sure to delete this property?</p>
      <p>
        <span className="text-slate-400">Name: </span>{" "}
        <span className="text-slate-700">{propertyName}</span>
      </p>
      <div className="flex justify-center gap-3">
        <Button as={Link} href="/user/properties">
          Cancel
        </Button>
        <SubmitButton type="submit" color="danger" variant="light">
          Delete
        </SubmitButton>
      </div>
    </form>
  );
}
