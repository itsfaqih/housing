import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  full_name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().nonempty(),
});

export type RegisterData = z.infer<typeof registerSchema>;
