import { lucia } from "lucia";
import { nextjs } from "lucia/middleware";
import { pg } from "@lucia-auth/adapter-postgresql";
import { cache } from "react";
import { cookies } from "next/headers";
import { redis } from "@lucia-auth/adapter-session-redis";
import { pgPool } from "@/lib/db.lib";
import { redisClient } from "@/lib/redis.lib";
// import "lucia/polyfill/node";

export const auth = lucia({
  adapter: {
    user: pg(pgPool, {
      user: "users",
      key: "user_keys",
      session: null,
    }),
    session: redis(redisClient),
  },
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: (data) => {
    return {
      avatar: data.avatar,
      full_name: data.full_name,
      email: data.email,
      verified_at: data.verified_at,
    };
  },
  getSessionAttributes: (data) => {
    return data;
  },
});

export type Auth = typeof auth;

export const getAdminPageSession = cache(() => {
  const authRequest = auth.handleRequest({
    request: null,
    cookies,
  });
  return authRequest.validate();
});
