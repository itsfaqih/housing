import { getAdminPageSession } from "@/auth/lucia";
import { db } from "@/lib/db.lib";
import { housingsTable, residentAccountsTable } from "@/schemas";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  _: NextRequest,
  {
    params,
  }: {
    params: {
      housingSlug: string;
      residentAccountId: string;
    };
  }
) {
  const housing = await db.query.housingsTable.findFirst({
    columns: { id: true, housing_developer_id: true },
    where: eq(housingsTable.slug, params.housingSlug),
  });

  if (!housing) {
    return NextResponse.json(
      {
        data: null,
        message: "Perumahan tidak ditemukan",
      },
      {
        status: 400,
      }
    );
  }

  const session = await getAdminPageSession();

  if (
    session.housing_developer_account.housing_developer_id !==
    housing.housing_developer_id
  ) {
    return NextResponse.json(
      {
        data: null,
        message: "Perumahan tidak ditemukan",
      },
      {
        status: 400,
      }
    );
  }

  const restoredResidentAccount = await db
    .update(residentAccountsTable)
    .set({
      deleted_at: null,
    })
    .where(eq(residentAccountsTable.id, Number(params.residentAccountId)))
    .returning()
    .then((res) => res[0]);

  return NextResponse.json({
    data: restoredResidentAccount,
    message: "Berhasil memulihkan data penghuni",
  });
}
