import { getAdminPageSession } from "@/auth/lucia";
import { db } from "@/lib/db.lib";
import { housingsTable } from "@/schemas";
import {
  InsertPropertyData,
  createPropertySchema,
  propertiesTable,
} from "@/schemas/property.schema";
import { and, eq, ilike, isNull } from "drizzle-orm";
import { generateRandomString } from "lucia/utils";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(
  request: NextRequest,
  { params }: { params: { housingSlug: string } }
) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";

  const properties = await db
    .select({
      id: propertiesTable.id,
      name: propertiesTable.name,
      slug: propertiesTable.slug,
    })
    .from(propertiesTable)
    .innerJoin(housingsTable, eq(housingsTable.id, propertiesTable.housing_id))
    .where(
      and(
        eq(housingsTable.slug, params.housingSlug),
        isNull(propertiesTable.archived_at),
        ilike(propertiesTable.name, `%${search}%`)
      )
    );

  return NextResponse.json({
    data: properties,
    message: "Berhasil memuat data properti",
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
  const createPropertyData = createPropertySchema.parse(await request.json());

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

  const insertPropertyData: InsertPropertyData = {
    name: createPropertyData.name,
    housing_id: housing.id,
    slug: slugify(
      `${createPropertyData.name}-${generateRandomString(5)}`
    ).toLowerCase(),
  };

  const newProperty = await db
    .insert(propertiesTable)
    .values(insertPropertyData)
    .returning()
    .then((res) => res[0]);

  return NextResponse.json({
    data: newProperty,
    message: "Berhasil menambahkan data properti",
  });
}
