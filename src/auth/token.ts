import jwt from "jsonwebtoken";
import { generateRandomString } from "lucia/utils";
import env from "../../env";
import { z } from "zod";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

const emailVerificationTokenSchema = z.object({
  data: z.object({
    userId: z.string().nonempty(),
    token: z.string().nonempty(),
    type: z.literal("email_verification"),
  }),
});

const passwordResetTokenSchema = z.object({
  data: z.object({
    userId: z.string().nonempty(),
    token: z.string().nonempty(),
    type: z.literal("password_reset"),
  }),
});

export function generateEmailVerificationToken(userId: string) {
  const token = generateRandomString(32);

  const signedToken = jwt.sign(
    {
      data: {
        userId,
        token,
        type: "email_verification",
      },
    },
    env.APP_SECRET_KEY,
    { expiresIn: EXPIRES_IN }
  );

  return signedToken;
}

export function validateEmailVerificationToken(token: string) {
  const decoded = emailVerificationTokenSchema.parse(
    jwt.verify(token, env.APP_SECRET_KEY)
  );

  return decoded.data.userId;
}

export function generatePasswordResetToken(userId: string) {
  const token = generateRandomString(32);

  const signedToken = jwt.sign(
    {
      data: {
        userId,
        token,
        type: "password_reset",
      },
    },
    env.APP_SECRET_KEY,
    { expiresIn: EXPIRES_IN }
  );

  return signedToken;
}

export function validatePasswordResetToken(token: string) {
  const decoded = passwordResetTokenSchema.parse(
    jwt.verify(token, env.APP_SECRET_KEY)
  );

  return decoded.data.userId;
}
