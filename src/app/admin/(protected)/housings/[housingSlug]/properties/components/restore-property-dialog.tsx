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

type RestorePropertyDialogProps = {
  property: Property;
  children: React.ReactNode;
};

export function RestorePropertyDialog({
  property,
  children,
}: RestorePropertyDialogProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const params = useParams();

  const restoreProperty = async () => {
    await api.put(
      null,
      `/admin/api/housings/${params.housingSlug}/properties/${property.slug}/restore`
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
            Pulihkan Properti - {property.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin memulihkan properti ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={restoreProperty}>
            Pulihkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
