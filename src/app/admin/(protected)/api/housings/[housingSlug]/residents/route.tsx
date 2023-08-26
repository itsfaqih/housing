import { getAdminPageSession } from "@/auth/lucia";
import { db } from "@/lib/db.lib";
import { housingsTable, residentAccountsTable, usersTable } from "@/schemas";
import { createResidentAccountSchema } from "@/schemas/resident-account.schema";
import { and, eq, ilike, isNull, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { housingSlug: string } }
) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";

  const residents = await db
    .select({
      id: residentAccountsTable.id,
      user: {
        full_name: usersTable.full_name,
        email: usersTable.email,
        avatar: usersTable.avatar,
      },
    })
    .from(residentAccountsTable)
    .innerJoin(usersTable, eq(usersTable.id, residentAccountsTable.user_id))
    .innerJoin(
      housingsTable,
      eq(housingsTable.id, residentAccountsTable.housing_id)
    )
    .where(
      and(
        eq(housingsTable.slug, params.housingSlug),
        isNull(residentAccountsTable.deleted_at),
        isNull(usersTable.archived_at),
        or(
          ilike(usersTable.full_name, `%${search}%`),
          ilike(usersTable.email, `%${search}%`)
        )
      )
    );

  return NextResponse.json({
    data: residents,
    message: "Berhasil memuat data penghuni",
  });
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      housingSlug: string;
    };
  }
) {
  const createResidentAccountData = createResidentAccountSchema.parse(
    await request.json()
  );

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

  const residentAccount = await db
    .insert(residentAccountsTable)
    .values({
      housing_id: housing.id,
      user_id: createResidentAccountData.user_id,
    })
    .returning()
    .then((row) => row[0]);

  return NextResponse.json({
    data: residentAccount,
    message: "Berhasil menambahkan data penghuni",
  });
}
