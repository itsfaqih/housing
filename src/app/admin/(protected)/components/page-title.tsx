import { cn } from "@/lib/utils";

interface PageTitle extends React.ComponentPropsWithoutRef<"h2"> {}

export function PageTitle({ className, ...props }: PageTitle) {
  return (
    <h2
      className={cn("text-3xl font-bold tracking-tight", className)}
      {...props}
    />
  );
}
