import { getAdminPageSession } from "@/auth/lucia";
import { db } from "@/lib/db.lib";
import { housingsTable, propertiesTable } from "@/schemas";
import {
  InsertPropertyOccupancyData,
  createPropertyOccupancySchema,
  propertyOccupanciesTable,
} from "@/schemas/property-occupancy.schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      housingSlug: string;
      propertySlug: string;
    };
  }
) {
  const createPropertyOccupancyData = createPropertyOccupancySchema.parse(
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

  const property = await db.query.propertiesTable.findFirst({
    columns: { id: true },
    where: and(
      eq(propertiesTable.slug, params.propertySlug),
      eq(propertiesTable.housing_id, housing.id)
    ),
  });

  if (!property) {
    return NextResponse.json(
      {
        data: null,
        message: "Properti tidak ditemukan",
      },
      {
        status: 400,
      }
    );
  }

  const insertPropertyOccupancyData: InsertPropertyOccupancyData = {
    property_id: property.id,
    resident_account_id: createPropertyOccupancyData.resident_account_id,
  };

  const newPropertyOccupancy = await db
    .insert(propertyOccupanciesTable)
    .values(insertPropertyOccupancyData)
    .returning()
    .then((res) => res[0]);

  return NextResponse.json({
    data: newPropertyOccupancy,
    message: "Berhasil menambahkan data penghuni properti",
  });
}
