"use client";

import React from "react";
import { Plus } from "phosphor-react-sc";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Combobox } from "@/components/derived/combobox";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/lib/api.lib";
import { apiResponseResidentAccountSchema } from "@/schemas/resident-account.schema";

export function CreatePropertyOccupancyCombobox() {
  const router = useRouter();
  const params = useParams();
  const [searchResidentFullName, setSearchResidentFullName] =
    React.useState("");

  const debouncedSearchResidentFullName = useDebounce(searchResidentFullName);

  const residentsQuery = useQuery({
    queryKey: [
      "residents",
      {
        search: debouncedSearchResidentFullName,
        housingSlug: params.housingSlug,
      },
    ],
    async queryFn() {
      const res = await api.get(
        `/admin/api/housings/${params.housingSlug}/residents?search=${debouncedSearchResidentFullName}`
      );
      const parsed = apiResponseResidentAccountSchema.array().parse(res.data);

      return parsed;
    },
  });

  const residentOptions =
    residentsQuery?.data?.map((resident) => ({
      label: resident.user.full_name,
      value: resident.id.toString(),
      avatar: resident.user.avatar,
      hasAvatar: true,
    })) ?? [];

  return (
    <Combobox
      emptyMessage="Tidak ada penghuni yang ditemukan"
      inputPlaceholder="Cari nama atau email..."
      options={residentOptions}
      placeholder="Pilih pengguna"
      contentProps={{ className: "w-64" }}
      onChange={async (option) => {
        await api.post(
          { resident_account_id: Number(option.value) },
          `/admin/api/housings/${params.housingSlug}/properties/${params.propertySlug}/occupancies`
        );

        router.refresh();
      }}
      trigger={
        <Button variant="secondary" size="sm">
          <Plus className="h-3 w-3 mr-2" />
          Tambah Penghuni
        </Button>
      }
    />
  );
}
