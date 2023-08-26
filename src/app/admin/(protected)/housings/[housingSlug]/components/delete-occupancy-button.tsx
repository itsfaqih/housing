"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api.lib";

interface DeleteOccupancyButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  housingSlug: string;
  propertySlug: string;
  occupancyId: number;
}

export const DeleteOccupancyButton = React.forwardRef<
  React.ElementRef<"button">,
  DeleteOccupancyButtonProps
>(({ housingSlug, propertySlug, occupancyId, onClick, ...props }, ref) => {
  const router = useRouter();

  const handleClick = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onClick?.(e);

      await api.delete(
        `/admin/api/housings/${housingSlug}/properties/${propertySlug}/occupancies/${occupancyId}`
      );

      router.refresh();
    },
    [onClick, housingSlug, propertySlug, occupancyId, router]
  );

  return <button ref={ref} onClick={handleClick} {...props} />;
});

DeleteOccupancyButton.displayName = "DeleteOccupancyButton";
