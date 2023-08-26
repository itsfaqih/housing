"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";

interface MainNavProps extends React.ComponentPropsWithoutRef<"nav"> {}

export function MainNav({ className, ...props }: MainNavProps) {
  const params = useParams();
  const basePath = `/admin/housings/${params.housingSlug}`;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <MainNavMenu href={basePath} exact>
        Dasbor
      </MainNavMenu>
      <MainNavMenu href={`${basePath}/properties`}>Properti</MainNavMenu>
      <MainNavMenu href={`${basePath}/residents`}>Penghuni</MainNavMenu>
      <MainNavMenu href={`${basePath}/fees`}>Master Iuran</MainNavMenu>
      <MainNavMenu href={`${basePath}/transactions`}>Transaksi</MainNavMenu>
    </nav>
  );
}

interface MainNavMenuProps extends React.ComponentPropsWithoutRef<typeof Link> {
  exact?: boolean;
}

function MainNavMenu({ exact, href, className, ...props }: MainNavMenuProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href.toString());

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        {
          "text-muted-foreground": !isActive,
        }
      )}
      {...props}
    />
  );
}
