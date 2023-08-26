import { db } from "@/lib/db.lib";
import { and, eq, ilike, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { usersTable } from "@/schemas/user.schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const type = searchParams.get("type");

  if (type !== "resident" && type !== "housing_developer") {
    return NextResponse.json(
      {
        data: null,
        message: "Tipe pengguna tidak valid",
      },
      {
        status: 400,
      }
    );
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.type, type),
        or(
          ilike(usersTable.full_name, `%${search}%`),
          ilike(usersTable.email, `%${search}%`)
        )
      )
    );

  return NextResponse.json({
    data: users,
    message: "Berhasil mendapatkan data pengguna",
  });
}
