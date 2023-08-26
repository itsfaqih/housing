"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api.lib";
import {
  CreateHousingSchema,
  Housing,
  apiResponseHousingSchema,
  createHousingSchema,
} from "@/schemas/housing.schema";
import { getInitials } from "@/utils/text.util";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface HousingSwitcherProps extends PopoverTriggerProps {
  selectedHousing?: Housing;
}

export function HousingSwitcher({
  className,
  selectedHousing,
}: HousingSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewHousing, setShowNewHousingDialog] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search);

  const housingsQuery = useQuery({
    queryKey: ["housings", { search: debouncedSearch }],
    async queryFn() {
      const res = await api.get(
        `/admin/api/housings?search=${debouncedSearch}`
      );
      const parsed = apiResponseHousingSchema.array().parse(res.data);

      return parsed;
    },
  });

  const housingData = housingsQuery.data ?? [];

  return (
    <Dialog open={showNewHousing} onOpenChange={setShowNewHousingDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Pilih perumahan"
            className={cn("w-[200px] justify-between", className)}
            title={selectedHousing?.name ?? "Pilih perumahan"}
          >
            {selectedHousing ? (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${selectedHousing.slug}.png`}
                    alt={selectedHousing.name}
                  />
                  <AvatarFallback>
                    {getInitials(selectedHousing.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-left">
                  {selectedHousing.name}
                </span>
              </>
            ) : (
              "Pilih perumahan"
            )}

            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command shouldFilter={false}>
            <CommandList>
              <CommandInput
                placeholder="Cari perumahan..."
                value={search}
                onValueChange={(val) => setSearch(val)}
              />
              <CommandEmpty>Perumahan tidak ditemukan.</CommandEmpty>
              {housingData.map((housing) => (
                <Link key={housing.id} href={`/admin/housings/${housing.slug}`}>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${housing.slug}`}
                        alt={housing.name}
                      />
                      <AvatarFallback>
                        {getInitials(housing.name)}
                      </AvatarFallback>
                    </Avatar>
                    {housing.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedHousing?.slug === housing.slug
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </Link>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewHousingDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Tambah Perumahan
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Perumahan</DialogTitle>
          <DialogDescription>
            Tambahkan perumahan baru untuk mengelola data perumahan.
          </DialogDescription>
        </DialogHeader>
        <CreateHousingForm
          formId="create-housing-form"
          onSuccess={() => setShowNewHousingDialog(false)}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowNewHousingDialog(false)}
          >
            Batal
          </Button>
          <Button form="create-housing-form" type="submit">
            Tambah
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type CreateHousingFormProps = {
  formId: string;
  onSuccess: () => void;
};

function CreateHousingForm({ formId, onSuccess }: CreateHousingFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const addHousingForm = useForm<CreateHousingSchema>({
    resolver: zodResolver(createHousingSchema),
  });

  const handleSubmit = addHousingForm.handleSubmit(async (data) => {
    await api.post(data, "/admin/api/housings");

    addHousingForm.reset();
    router.refresh();

    queryClient.invalidateQueries(["housings"]);

    onSuccess();
  });

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Perumahan</Label>
        <Input
          {...addHousingForm.register("name")}
          id="name"
          placeholder="Masukkan nama perumahan"
          disabled={addHousingForm.formState.isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Alamat</Label>
        <Textarea
          {...addHousingForm.register("address")}
          id="address"
          placeholder="Masukkan alamat perumahan"
          rows={4}
          disabled={addHousingForm.formState.isSubmitting}
        />
      </div>
    </form>
  );
}
