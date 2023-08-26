"use client";

import React from "react";
import {
  CreatePropertyData,
  createPropertySchema,
} from "@/schemas/property.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api.lib";
import { useParams, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CreatePropertySheet() {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = React.useState(false);

  const createPropertyForm = useForm<CreatePropertyData>({
    resolver: zodResolver(createPropertySchema),
  });

  const handleSubmit = createPropertyForm.handleSubmit(async (data) => {
    await api.post(
      data,
      `/admin/api/housings/${params.housingSlug}/properties`
    );

    createPropertyForm.reset();
    router.refresh();

    setOpen(false);
  });

  return (
    <Sheet open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <SheetTrigger asChild>
        <Button>Tambah Properti</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah Properti</SheetTitle>
          <SheetDescription>
            Tambahkan data properti ke perumahan
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Nama</Label>
              <Input
                {...createPropertyForm.register("name")}
                id="name"
                disabled={createPropertyForm.formState.isSubmitting}
                placeholder="Masukkan nama properti"
              />
            </div>
            <div className="flex justify-end">
              <Button
                disabled={createPropertyForm.formState.isSubmitting}
                type="submit"
              >
                Tambah Properti
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
