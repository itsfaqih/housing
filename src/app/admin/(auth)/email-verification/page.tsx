import { Metadata } from "next";
import { getAdminPageSession } from "@/auth/lucia";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verifikasi Email",
  description: "Verifikasi email untuk mengaktifkan akun Anda.",
};

export default async function EmailVerificationPage() {
  const session = await getAdminPageSession();

  if (!session) {
    return redirect("/admin/login");
  }

  if (session) {
    if (session.user.verified_at) {
      return redirect("/admin");
    }
  }

  return (
    <div className="container relative h-[100dvh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          IuranKu
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verifikasi Email
            </h1>
            <p className="text-sm text-muted-foreground">
              Link verifikasi email telah dikirim ke email Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
