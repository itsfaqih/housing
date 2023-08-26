"use client";

import React from "react";
import { Plus } from "phosphor-react-sc";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Combobox } from "@/components/derived/combobox";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/lib/api.lib";
import { apiResponsePropertySchema } from "@/schemas/property.schema";

export function CreateResidentOccupancyCombobox() {
  const router = useRouter();
  const params = useParams();
  const [searchPropertyName, setSearchPropertyName] = React.useState("");

  const debouncedSearchPropertyName = useDebounce(searchPropertyName);

  const propertiesQuery = useQuery({
    queryKey: [
      "properties",
      {
        search: debouncedSearchPropertyName,
        housingSlug: params.housingSlug,
      },
    ],
    async queryFn() {
      const res = await api.get(
        `/admin/api/housings/${params.housingSlug}/properties?search=${debouncedSearchPropertyName}`
      );
      const parsed = apiResponsePropertySchema.array().parse(res.data);

      return parsed;
    },
  });

  const propertyOptions =
    propertiesQuery?.data?.map((property) => ({
      label: property.name,
      value: property.slug,
    })) ?? [];

  return (
    <Combobox
      emptyMessage="Tidak ada penghuni yang ditemukan"
      inputPlaceholder="Cari nama properti..."
      options={propertyOptions}
      placeholder="Pilih pengguna"
      contentProps={{ className: "w-64" }}
      onChange={async (option) => {
        await api.post(
          { resident_account_id: Number(params.residentAccountId) },
          `/admin/api/housings/${params.housingSlug}/properties/${option.value}/occupancies`
        );

        router.refresh();
      }}
      trigger={
        <Button variant="secondary" size="sm">
          <Plus className="h-3 w-3 mr-2" />
          Tambah Properti
        </Button>
      }
    />
  );
}
