import { getAdminPageSession } from "@/auth/lucia";
import { db } from "@/lib/db.lib";
import {
  housingsTable,
  propertiesTable,
  propertyOccupanciesTable,
} from "@/schemas";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  _: NextRequest,
  {
    params,
  }: {
    params: {
      housingSlug: string;
      propertySlug: string;
      occupancyId: string;
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

  const property = await db.query.propertiesTable.findFirst({
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

  const restoredOccupancies = await db
    .update(propertyOccupanciesTable)
    .set({
      deleted_at: null,
    })
    .where(
      and(
        eq(propertyOccupanciesTable.id, Number(params.occupancyId)),
        eq(propertyOccupanciesTable.property_id, property.id)
      )
    )
    .returning();

  if (restoredOccupancies.length === 0) {
    return NextResponse.json(
      {
        data: null,
        message: "Penghuni properti tidak ditemukan",
      },
      {
        status: 400,
      }
    );
  }

  const restoredOccupancy = restoredOccupancies[0];

  return NextResponse.json({
    data: restoredOccupancy,
    message: "Berhasil memulihkan data penghuni properti",
  });
}
