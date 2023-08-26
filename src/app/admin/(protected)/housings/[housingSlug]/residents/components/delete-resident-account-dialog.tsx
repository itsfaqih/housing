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
import { ResidentAccount } from "@/schemas/resident-account.schema";

type DeleteResidentAccountDialogProps = {
  residentFullName: string;
  residentAccountId: ResidentAccount["id"];
  children: React.ReactNode;
};

export function DeleteResidentAccountDialog({
  residentFullName,
  residentAccountId,
  children,
}: DeleteResidentAccountDialogProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const params = useParams();

  const deleteResidentAccount = async () => {
    await api.delete(
      `/admin/api/housings/${params.housingSlug}/residents/${residentAccountId}`
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
            Hapus Penghuni - {residentFullName}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin menghapus penghuni ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={deleteResidentAccount}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
