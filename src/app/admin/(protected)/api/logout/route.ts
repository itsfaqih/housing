import { auth } from "@/auth/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import env from "../../../../../../env";

export async function POST(request: NextRequest) {
  const authRequest = auth.handleRequest({ request, cookies });

  const session = await authRequest.validate();
  if (!session) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/admin/login`);
  }

  await auth.invalidateSession(session.sessionId);

  authRequest.setSession(null);

  return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/admin/login`);
}
