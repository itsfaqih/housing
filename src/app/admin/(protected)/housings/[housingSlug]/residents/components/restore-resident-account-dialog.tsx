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
import { useParams, useRouter } from "next/navigation";
import { User } from "@/schemas/user.schema";
import { ResidentAccount } from "@/schemas/resident-account.schema";

type RestoreResidentAccountDialogProps = {
  residentFullName: User["full_name"];
  residentAccountId: ResidentAccount["id"];
  children: React.ReactNode;
};

export function RestoreResidentAccountDialog({
  residentFullName,
  residentAccountId,
  children,
}: RestoreResidentAccountDialogProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const params = useParams();

  const restoreResident = async () => {
    await api.put(
      null,
      `/admin/api/housings/${params.housingSlug}/residents/${residentAccountId}/restore`
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
            Pulihkan Penghuni - {residentFullName}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin memulihkan penghuni ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={restoreResident}>
            Pulihkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
