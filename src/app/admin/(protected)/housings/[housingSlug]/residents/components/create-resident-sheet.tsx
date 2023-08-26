"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  CreateResidentAccountData,
  createResidentAccountSchema,
} from "@/schemas/resident-account.schema";
import { Combobox } from "@/components/derived/combobox";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { apiResponseUserSchema } from "@/schemas/user.schema";

export function CreateResidentSheet() {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = React.useState(false);

  const createResidentForm = useForm<CreateResidentAccountData>({
    resolver: zodResolver(createResidentAccountSchema),
  });

  const [searchUser, setSearchUser] = React.useState("");

  const debouncedSearchUser = useDebounce(searchUser);

  const usersQuery = useQuery({
    queryKey: ["users", { search: debouncedSearchUser, type: "resident" }],
    async queryFn() {
      const res = await api.get(
        `/admin/api/users?type=resident&search=${debouncedSearchUser}`
      );
      const parsed = apiResponseUserSchema.array().parse(res.data);

      return parsed;
    },
  });

  const userOptions =
    usersQuery?.data?.map((user) => ({
      label: user.full_name,
      value: user.id,
      avatar: user.avatar,
      hasAvatar: true,
    })) ?? [];

  const handleSubmit = createResidentForm.handleSubmit(async (data) => {
    await api.post(data, `/admin/api/housings/${params.housingSlug}/residents`);

    createResidentForm.reset();
    router.refresh();

    setOpen(false);
  });

  return (
    <Sheet open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <SheetTrigger asChild>
        <Button>Tambah Penghuni</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah Penghuni</SheetTitle>
          <SheetDescription>
            Tambahkan data penghuni ke perumahan
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="user_id">Pengguna</Label>
              <Controller
                control={createResidentForm.control}
                name="user_id"
                render={({ field: { name, value, onChange, ref } }) => (
                  <Combobox
                    ref={ref}
                    name={name}
                    options={userOptions}
                    placeholder="Pilih pengguna"
                    emptyMessage="Tidak ada pengguna yang ditemukan"
                    inputPlaceholder="Cari nama atau email..."
                    onChange={(option) => {
                      onChange(option.value);
                    }}
                    value={userOptions.find((option) => option.value === value)}
                  />
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button
                disabled={createResidentForm.formState.isSubmitting}
                type="submit"
              >
                Tambah Penghuni
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
