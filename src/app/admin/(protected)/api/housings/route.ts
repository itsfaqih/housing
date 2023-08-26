import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { db } from "@/lib/db.lib";
import {
  housingsTable,
  createHousingSchema,
  InsertHousingData,
} from "@/schemas/housing.schema";
import { getAdminPageSession } from "@/auth/lucia";
import { and, eq, ilike } from "drizzle-orm";
import { generateRandomString } from "lucia/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";

  const session = await getAdminPageSession();

  const housings = await db.query.housingsTable.findMany({
    where: and(
      eq(
        housingsTable.housing_developer_id,
        session.housing_developer_account.housing_developer_id
      ),
      ilike(housingsTable.name, `%${search}%`)
    ),
  });

  return NextResponse.json({
    data: housings,
    message: "Berhasil mendapatkan data perumahan",
  });
}

export async function POST(request: NextRequest) {
  const session = await getAdminPageSession();

  const createHousingData = createHousingSchema.parse(await request.json());

  const insertHousingData: InsertHousingData = {
    name: createHousingData.name,
    slug: slugify(
      `${createHousingData.name}-${generateRandomString(5)}`
    ).toLowerCase(),
    address: createHousingData.address,
    housing_developer_id:
      session.housing_developer_account.housing_developer_id,
  };

  const newHousing = await db
    .insert(housingsTable)
    .values(insertHousingData)
    .returning()
    .then((res) => res[0]);

  return NextResponse.json({
    data: newHousing,
    message: "Berhasil menambahkan data perumahan",
  });
}
