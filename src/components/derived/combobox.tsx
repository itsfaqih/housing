"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretUpDown, Check } from "phosphor-react-sc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/text.util";

type ComboboxOption = {
  label: string;
  value: string;
  avatar?: string | null;
  hasAvatar?: boolean;
};

type ComboboxProps = {
  options: ComboboxOption[];
  placeholder: string;
  inputPlaceholder: string;
  emptyMessage: string;
  onChange?: (option: ComboboxOption) => void;
  value?: ComboboxOption;
  shouldFilter?: boolean;
  name?: string;
  trigger?: React.ReactNode;
  contentProps?: React.ComponentPropsWithoutRef<typeof PopoverContent>;
};

export const Combobox = React.forwardRef<
  React.ElementRef<typeof Button>,
  ComboboxProps
>(
  (
    {
      options,
      placeholder,
      inputPlaceholder,
      emptyMessage,
      onChange,
      value,
      shouldFilter,
      name,
      trigger,
      contentProps,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState<
      ComboboxOption | undefined
    >(value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger ?? (
            <Button
              ref={ref}
              name={name}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                {selectedOption?.hasAvatar && (
                  <Avatar className="h-6 w-6 text-xs">
                    <AvatarImage
                      src={selectedOption.avatar ?? undefined}
                      alt=""
                    />
                    <AvatarFallback className="bg-slate-200 border border-slate-300">
                      {getInitials(selectedOption.label)}
                    </AvatarFallback>
                  </Avatar>
                )}
                {selectedOption?.label ?? placeholder}
              </span>
              <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          {...contentProps}
          className={cn(
            "p-0 w-[--radix-popover-trigger-width]",
            contentProps?.className
          )}
        >
          <Command shouldFilter={shouldFilter}>
            <CommandInput placeholder={inputPlaceholder} className="h-9" />
            <CommandEmpty className="px-4">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    setSelectedOption(option);
                    onChange?.(option);
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    {option.hasAvatar && (
                      <Avatar className="h-6 w-6 text-xs">
                        <AvatarImage src={option.avatar ?? undefined} alt="" />
                        <AvatarFallback className="bg-slate-200 border border-slate-300">
                          {getInitials(option.label)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {option.label}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOption?.value === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = "Combobox";
