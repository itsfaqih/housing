import { db } from "@/lib/db.lib";
import { HousingSwitcher } from "./components/housing-switcher";
import { MainNav } from "./components/main-nav";
import { UserNav } from "../../components/user-nav";
import { eq } from "drizzle-orm";
import { housingsTable } from "@/schemas";
import { notFound } from "next/navigation";

type AdminLayoutProps = {
  children: React.ReactNode;
  params: {
    housingSlug: string;
  };
};

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const housing = await db.query.housingsTable.findFirst({
    where: eq(housingsTable.slug, params.housingSlug),
  });

  if (!housing) {
    return notFound();
  }

  return (
    <div className="flex-col flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <HousingSwitcher selectedHousing={housing} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 p-8 pt-6">{children}</div>
    </div>
  );
}
