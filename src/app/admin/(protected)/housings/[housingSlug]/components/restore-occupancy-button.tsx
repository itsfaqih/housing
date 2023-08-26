"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api.lib";

interface RestoreOccupancyButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  housingSlug: string;
  propertySlug: string;
  occupancyId: number;
}

export const RestoreOccupancyButton = React.forwardRef<
  React.ElementRef<"button">,
  RestoreOccupancyButtonProps
>(({ housingSlug, propertySlug, occupancyId, onClick, ...props }, ref) => {
  const router = useRouter();

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onClick?.(e);

    await api.put(
      undefined,
      `/admin/api/housings/${housingSlug}/properties/${propertySlug}/occupancies/${occupancyId}/restore`
    );

    router.refresh();
  };

  return <button ref={ref} onClick={handleClick} {...props} />;
});

RestoreOccupancyButton.displayName = "RestoreOccupancyButton";
