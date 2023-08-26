"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api.lib";
import { RegisterData, registerSchema } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { UserError } from "@/utils/error.util";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter();
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const handleSubmit = registerForm.handleSubmit(async (data) => {
    try {
      await api.post(data, "/admin/api/register");

      router.refresh();
    } catch (error) {
      if (error instanceof UserError === false) {
        registerForm.setError("root", {
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
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <Input
              {...registerForm.register("full_name")}
              id="full_name"
              disabled={registerForm.formState.isSubmitting}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              {...registerForm.register("email")}
              type="email"
              id="email"
              disabled={registerForm.formState.isSubmitting}
              placeholder="Masukkan email"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              {...registerForm.register("password")}
              type="password"
              id="password"
              disabled={registerForm.formState.isSubmitting}
              placeholder="Masukkan password"
            />
          </div>
          <Button type="submit" disabled={registerForm.formState.isSubmitting}>
            Daftar
          </Button>
        </div>
        {registerForm.formState.errors.root && (
          <div className="text-red-500 text-sm text-center mt-4">
            {registerForm.formState.errors.root.message}
          </div>
        )}
      </form>
    </div>
  );
}
