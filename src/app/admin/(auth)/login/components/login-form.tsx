"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api.lib";
import { LoginData, loginSchema } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { UserError } from "@/utils/error.util";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = loginForm.handleSubmit(async (data) => {
    try {
      await api.post(data, "/admin/api/login");

      router.refresh();
    } catch (error) {
      if (error instanceof UserError) {
        loginForm.setError("root", {
          message: error.message,
        });
      } else {
        loginForm.setError("root", {
          message: "Terjadi kesalahan. Mohon hubungi administrator",
        });
      }
    }
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              {...loginForm.register("email")}
              type="email"
              id="email"
              disabled={loginForm.formState.isSubmitting}
              placeholder="Masukkan nama perumahan"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              {...loginForm.register("password")}
              type="password"
              id="password"
              disabled={loginForm.formState.isSubmitting}
              placeholder="Masukkan password"
            />
          </div>
          <Button type="submit" disabled={loginForm.formState.isSubmitting}>
            Masuk
          </Button>
        </div>
        {loginForm.formState.errors.root && (
          <div className="text-red-500 text-sm text-center mt-4">
            {loginForm.formState.errors.root.message}
          </div>
        )}
      </form>
    </div>
  );
}
