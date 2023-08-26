import { Metadata } from "next";
import { db } from "@/lib/db.lib";
import { CreateResidentSheet } from "./components/create-resident-sheet";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { housingsTable, residentAccountsTable, usersTable } from "@/schemas";
import { PageTitle } from "../../../components/page-title";
import { ResidentTable } from "./components/resident-table";
import { Filters } from "./components/filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daftar Penghuni",
  description: "",
};

type ResidentsPageProps = {
  params: {
    housingSlug: string;
  };
  searchParams?: {
    q?: string;
    deleted?: "1";
    page?: `${number}`;
    sort: "updated_at" | "created_at";
    order: "asc" | "desc";
  };
};

export default async function ResidentsPage({
  params,
  searchParams,
}: ResidentsPageProps) {
  const housingSlug = params.housingSlug;
  const page = Number(searchParams?.page ?? 1);
  const perPage = 10;

  const sort = searchParams?.sort ?? "created_at";
  const orderFn = searchParams?.order === "asc" ? asc : desc;

  const residents = await db
    .select({
      id: usersTable.id,
      avatar: usersTable.avatar,
      full_name: usersTable.full_name,
      email: usersTable.email,
      resident_account_id: residentAccountsTable.id,
      resident_account_created_at: residentAccountsTable.created_at,
      resident_account_deleted_at: residentAccountsTable.deleted_at,
    })
    .from(usersTable)
    .innerJoin(
      residentAccountsTable,
      and(eq(usersTable.id, residentAccountsTable.user_id))
    )
    .innerJoin(
      housingsTable,
      eq(residentAccountsTable.housing_id, housingsTable.id)
    )
    .where(
      and(
        eq(housingsTable.slug, housingSlug),
        eq(residentAccountsTable.housing_id, housingsTable.id),
        or(
          ilike(usersTable.full_name, `%${searchParams?.q ?? ""}%`),
          ilike(usersTable.email, `%${searchParams?.q ?? ""}%`)
        ),
        searchParams?.deleted === "1"
          ? isNotNull(residentAccountsTable.deleted_at)
          : isNull(residentAccountsTable.deleted_at)
      )
    )
    .groupBy(
      usersTable.id,
      residentAccountsTable.id,
      residentAccountsTable.created_at
    )
    .limit(perPage)
    .offset((page - 1) * perPage)
    .orderBy(orderFn(usersTable[sort]));

  const countTotal = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(usersTable)
    .innerJoin(
      residentAccountsTable,
      eq(usersTable.id, residentAccountsTable.user_id)
    )
    .innerJoin(
      housingsTable,
      eq(residentAccountsTable.housing_id, housingsTable.id)
    )
    .where(
      and(
        eq(housingsTable.slug, housingSlug),
        ilike(usersTable.full_name, `%${searchParams?.q ?? ""}%`),
        searchParams?.deleted === "1"
          ? isNotNull(usersTable.archived_at)
          : isNull(usersTable.archived_at)
      )
    )
    .then((rows) => Number(rows[0].total));

  const startNumber = (page - 1) * perPage + 1;
  const endNumber = (page - 1) * perPage + residents.length;

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <PageTitle>Daftar Penghuni</PageTitle>
        <div className="flex items-center space-x-2">
          <CreateResidentSheet />
        </div>
      </div>
      <div>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Filters />
          </div>
          <div className="rounded-md border">
            <ResidentTable
              residents={residents}
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
