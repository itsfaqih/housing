import { auth } from "@/auth/lucia";
import { validateEmailVerificationToken } from "@/auth/token";
import { db } from "@/lib/db.lib";
import { housingDeveloperAccountsTable } from "@/schemas";
import { eq } from "drizzle-orm";

import { NextResponse, type NextRequest } from "next/server";

export const GET = async (
  _: NextRequest,
  {
    params,
  }: {
    params: {
      token: string;
    };
  }
) => {
  const { token } = params;
  try {
    const userId = validateEmailVerificationToken(token);
    const user = await auth.getUser(userId);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateUserAttributes(user.userId, {
      verified_at: new Date().toISOString(),
    });

    const housingDeveloperAccount =
      await db.query.housingDeveloperAccountsTable.findFirst({
        where: eq(housingDeveloperAccountsTable.user_id, user.userId),
      });

    if (!housingDeveloperAccount) {
      return NextResponse.json(
        {
          data: null,
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        housing_developer_account: {
          role: housingDeveloperAccount.role,
          housing_developer_id: housingDeveloperAccount.housing_developer_id,
        },
      },
    });
    const sessionCookie = auth.createSessionCookie(session);

    const response = NextResponse.redirect("/admin", { status: 302 });

    response.cookies.set(sessionCookie);

    return response;
  } catch {
    return NextResponse.json(
      {
        data: null,
        message: "Invalid verification link",
      },
      {
        status: 400,
      }
    );
  }
};
