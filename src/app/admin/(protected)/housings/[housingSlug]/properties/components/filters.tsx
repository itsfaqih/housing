"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stringSearchParams = searchParams.toString();
  const [_, startTransition] = React.useTransition();
  const search = searchParams.get("q") ?? "";
  const archived = searchParams.get("archived") === "1" ? "1" : "0";

  const onSearch = React.useCallback(
    (searchVal: string) => {
      startTransition(() => {
        debounce(() => {
          const newSearchParams = new URLSearchParams(stringSearchParams);
          newSearchParams.delete("page");
          newSearchParams.set("q", searchVal);

          router.push(`${pathname}?${newSearchParams.toString()}`);
        })();
      });
    },
    [router, pathname, stringSearchParams]
  );

  return (
    <div className="flex w-full gap-4">
      <Input
        type="search"
        defaultValue={search}
        placeholder="Cari nama properti..."
        onChange={(event) => {
          onSearch(event.target.value);
        }}
        className="w-96"
      />
      <Select
        defaultValue={archived}
        onValueChange={(val) => {
          const newSearchParams = new URLSearchParams(stringSearchParams);
          newSearchParams.delete("page");

          if (val === "1") {
            newSearchParams.set("archived", val);

            router.push(`${pathname}?${newSearchParams.toString()}`);
          } else {
            newSearchParams.delete("archived");

            router.push(`${pathname}?${newSearchParams.toString()}`);
          }
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Tersedia</SelectItem>
          <SelectItem value="1">Terarsipkan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
