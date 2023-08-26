import { getAdminPageSession } from "@/auth/lucia";
import { redirect } from "next/navigation";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await getAdminPageSession();

  if (!session) {
    return redirect("/admin/login");
  }

  if (!session.user.verified_at) {
    return redirect("/admin/email-verification");
  }

  if (!session.housing_developer_account) {
    return redirect("/");
  }

  return <>{children}</>;
}
