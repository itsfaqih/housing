import { getAdminPageSession } from "@/auth/lucia";
import { db } from "@/lib/db.lib";
import { housingsTable, propertiesTable } from "@/schemas";
import { updatePropertySchema } from "@/schemas/property.schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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
  const updatePropertyData = updatePropertySchema.parse(await request.json());

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

  const updatedProperties = await db
    .update(propertiesTable)
    .set({
      name: updatePropertyData.name,
      updated_at: new Date(),
    })
    .where(
      and(
        eq(propertiesTable.slug, params.propertySlug),
        eq(propertiesTable.housing_id, housing.id)
      )
    )
    .returning();

  if (updatedProperties.length === 0) {
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

  const updatedProperty = updatedProperties[0];

  return NextResponse.json({
    data: updatedProperty,
    message: "Berhasil memperbarui data properti",
  });
}

export async function DELETE(
  _: NextRequest,
  {
    params,
  }: {
    params: {
      housingSlug: string;
      propertySlug: string;
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

  const archivedProperty = await db
    .update(propertiesTable)
    .set({
      archived_at: new Date(),
    })
    .where(eq(propertiesTable.slug, params.propertySlug))
    .returning()
    .then((res) => res[0]);

  return NextResponse.json({
    data: archivedProperty,
    message: "Berhasil mengarsipkan data properti",
  });
}
