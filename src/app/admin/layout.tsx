import { getCurrentUser, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Admin kontrolü - daha basit ve okunabilir!
  const adminMi = await isAdmin(currentUser.dbUser.id);

  if (!adminMi) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
