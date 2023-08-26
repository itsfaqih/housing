import { sendEmailVerificationLink } from "@/auth/email";
import { auth } from "@/auth/lucia";
import { generateEmailVerificationToken } from "@/auth/token";
import { registerSchema } from "@/schemas/auth.schema";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const registerData = registerSchema.parse(await request.json());
    const { full_name, email, password } = registerData;

    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: email,
        password,
      },
      attributes: {
        email,
        full_name,
        type: "housing_developer",
        verified_at: null,
        avatar: null,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest({
      request,
      cookies,
    });

    authRequest.setSession(session);

    const token = generateEmailVerificationToken(user.userId);

    await sendEmailVerificationLink(token);

    return NextResponse.json({
      data: null,
      message: "Berhasil mendaftar",
    });
  } catch (e) {
    return NextResponse.json(
      {
        data: null,
        message: "An unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
