import { db } from "@/lib/db.lib";
import { PageTitle } from "../components/page-title";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddHousingSheet } from "./components/add-housing-sheet";
import { getAdminPageSession } from "@/auth/lucia";
import { eq } from "drizzle-orm";
import { housingsTable } from "@/schemas";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Perumahan",
  description: "Kelola perumahan anda",
};

export default async function DashboardPage() {
  const session = await getAdminPageSession();
  const housings = await db.query.housingsTable.findMany({
    where: eq(
      housingsTable.housing_developer_id,
      session.housing_developer_account.housing_developer_id
    ),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageTitle>Kelola Perumahan</PageTitle>
        <AddHousingSheet>
          <Button>Tambah Perumahan</Button>
        </AddHousingSheet>
      </div>
      <div className="grid grid-cols-4 gap-6 mt-6">
        {housings.map((housing) => (
          <Card key={housing.id}>
            <CardHeader>
              <CardTitle>{housing.name}</CardTitle>
              <CardDescription>{housing.address}</CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex justify-end">
                <Button variant="secondary" asChild>
                  <Link href={`/admin/housings/${housing.slug}`}>Kelola</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
