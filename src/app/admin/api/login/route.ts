import { auth } from "@/auth/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LuciaError } from "lucia";
import type { NextRequest } from "next/server";
import { loginSchema } from "@/schemas/auth.schema";
import { ZodError } from "zod";
import { db } from "@/lib/db.lib";
import { housingDeveloperAccountsTable } from "@/schemas";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const loginData = loginSchema.parse(await request.json());
    const { email, password } = loginData;

    const key = await auth.useKey("email", email.toLowerCase(), password);

    const housingDeveloperAccount =
      await db.query.housingDeveloperAccountsTable.findFirst({
        where: eq(housingDeveloperAccountsTable.user_id, key.userId),
      });

    if (!housingDeveloperAccount) {
      return NextResponse.json(
        {
          data: null,
          message: "Email atau password salah",
        },
        {
          status: 404,
        }
      );
    }

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {
        housing_developer_account: {
          role: housingDeveloperAccount.role,
          housing_developer_id: housingDeveloperAccount.housing_developer_id,
        },
      },
    });

    const authRequest = auth.handleRequest({
      request,
      cookies,
    });

    authRequest.setSession(session);

    return NextResponse.json({
      data: null,
      message: "Berhasil login",
    });
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // user does not exist
      // or invalid password
      return NextResponse.json(
        {
          data: null,
          message: "Email atau password salah",
        },
        {
          status: 400,
        }
      );
    }

    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          data: null,
          message: e.message,
          error: e.errors,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: "Terjadi kesalahan, mohon hubungi administrator",
      },
      {
        status: 500,
      }
    );
  }
}
