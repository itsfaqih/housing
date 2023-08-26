"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api.lib";
import { Property } from "@/schemas/property.schema";
import { useParams, useRouter } from "next/navigation";

type ArchivePropertyDialogProps = {
  property: Property;
  children: React.ReactNode;
};

export function ArchivePropertyDialog({
  property,
  children,
}: ArchivePropertyDialogProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const params = useParams();

  const archiveProperty = async () => {
    await api.delete(
      `/admin/api/housings/${params.housingSlug}/properties/${property.slug}`
    );

    setOpen(false);
    router.refresh();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Arsipkan Properti - {property.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin mengarsipkan properti ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={archiveProperty}>
            Arsipkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
