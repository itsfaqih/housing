import { Metadata } from "next";
import { db } from "@/lib/db.lib";
import { propertiesTable } from "@/schemas/property.schema";
import { CreatePropertySheet } from "./components/create-property-sheet";
import { and, asc, desc, eq, ilike, isNotNull, isNull, sql } from "drizzle-orm";
import {
  housingsTable,
  propertyOccupanciesTable,
  residentAccountsTable,
} from "@/schemas";
import { PageTitle } from "../../../components/page-title";
import { PropertyTable } from "./components/property-table";
import { Filters } from "./components/filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daftar Properti",
  description: "",
};

type PropertiesPageProps = {
  params: {
    housingSlug: string;
  };
  searchParams?: {
    q?: string;
    archived?: "1";
    page?: `${number}`;
    sort: "resident_count" | "updated_at" | "created_at";
    order: "asc" | "desc";
  };
};

export default async function PropertiesPage({
  params,
  searchParams,
}: PropertiesPageProps) {
  const housingSlug = params.housingSlug;
  const page = Number(searchParams?.page ?? 1);
  const perPage = 10;

  const sort = searchParams?.sort ?? "created_at";
  const orderFn = searchParams?.order === "asc" ? asc : desc;

  const properties = await db
    .select({
      id: propertiesTable.id,
      name: propertiesTable.name,
      slug: propertiesTable.slug,
      housing_id: propertiesTable.housing_id,
      created_at: propertiesTable.created_at,
      updated_at: propertiesTable.updated_at,
      archived_at: propertiesTable.archived_at,
      housing_slug: housingsTable.slug,
      occupancies_count: sql<number>`COUNT(${propertyOccupanciesTable.id})`,
    })
    .from(propertiesTable)
    .innerJoin(housingsTable, eq(propertiesTable.housing_id, housingsTable.id))
    .leftJoin(
      propertyOccupanciesTable,
      eq(propertiesTable.id, propertyOccupanciesTable.property_id)
    )
    .where(
      and(
        eq(housingsTable.slug, housingSlug),
        ilike(propertiesTable.name, `%${searchParams?.q ?? ""}%`),
        searchParams?.archived === "1"
          ? isNotNull(propertiesTable.archived_at)
          : isNull(propertiesTable.archived_at)
      )
    )
    .groupBy(propertiesTable.id, housingsTable.slug)
    .limit(perPage)
    .offset((page - 1) * perPage)
    .orderBy(
      orderFn(
        sort !== "resident_count"
          ? propertiesTable[sort]
          : sql`COUNT(${residentAccountsTable.id})`
      )
    );

  const countTotal = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(propertiesTable)
    .innerJoin(housingsTable, eq(propertiesTable.housing_id, housingsTable.id))
    .where(
      and(
        eq(housingsTable.slug, housingSlug),
        ilike(propertiesTable.name, `%${searchParams?.q ?? ""}%`),
        searchParams?.archived === "1"
          ? isNotNull(propertiesTable.archived_at)
          : isNull(propertiesTable.archived_at)
      )
    )
    .then((rows) => Number(rows[0].total));

  const startNumber = (page - 1) * perPage + 1;
  const endNumber = (page - 1) * perPage + properties.length;

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <PageTitle>Daftar Properti</PageTitle>
        <div className="flex items-center space-x-2">
          <CreatePropertySheet />
        </div>
      </div>
      <div>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Filters />
          </div>
          <div className="rounded-md border">
            <PropertyTable
              properties={properties}
              housingSlug={housingSlug}
              searchParams={searchParams}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm">
              Menampilkan {countTotal === 0 && "0"}
              {countTotal !== 0 && `${startNumber} - ${endNumber}`} dari{" "}
              {countTotal} properti
            </div>

            <div>
              {page === 1 ? (
                <Button disabled variant="ghost">
                  Sebelumnya
                </Button>
              ) : (
                <Button asChild variant="ghost">
                  <Link
                    href={{
                      query: {
                        ...searchParams,
                        page: page - 1,
                      },
                    }}
                  >
                    Sebelumnya
                  </Link>
                </Button>
              )}
              {countTotal === 0 || page === Math.ceil(countTotal / perPage) ? (
                <Button disabled variant="ghost">
                  Selanjutnya
                </Button>
              ) : (
                <Button asChild variant="ghost">
                  <Link
                    href={{
                      query: {
                        ...searchParams,
                        page: page + 1,
                      },
                    }}
                  >
                    Selanjutnya
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
