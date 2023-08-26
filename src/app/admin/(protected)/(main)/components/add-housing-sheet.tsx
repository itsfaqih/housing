"use client";

import React from "react";
import {
  CreateHousingSchema,
  createHousingSchema,
} from "@/schemas/housing.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api.lib";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type AddHousingSheetProps = {
  children: React.ReactNode;
};

export function AddHousingSheet({ children }: AddHousingSheetProps) {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const addHousingForm = useForm<CreateHousingSchema>({
    resolver: zodResolver(createHousingSchema),
  });

  const handleSubmit = addHousingForm.handleSubmit(async (data) => {
    await api.post(data, "/admin/api/housings");

    addHousingForm.reset();
    router.refresh();

    setOpen(false);
  });

  return (
    <Sheet open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah Perumahan</SheetTitle>
          <SheetDescription>
            Tambahkan data perumahan milik perusahaan Anda
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Nama</Label>
              <Input
                {...addHousingForm.register("name")}
                id="name"
                placeholder="Masukkan nama perumahan"
                disabled={addHousingForm.formState.isSubmitting}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                {...addHousingForm.register("address")}
                id="address"
                placeholder="Masukkan alamat perumahan"
                rows={4}
                disabled={addHousingForm.formState.isSubmitting}
              />
            </div>
            <div className="flex justify-end">
              <Button
                disabled={addHousingForm.formState.isSubmitting}
                type="submit"
              >
                Tambah
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
