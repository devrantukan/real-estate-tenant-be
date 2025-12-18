import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OfficeForm from "../_components/OfficeForm";

export default async function AddOfficePage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  console.log("role is:", role);
  if (role !== "site-admin") {
    redirect("/");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Yeni Ofis Ekle</h1>
      <OfficeForm mode="add" />
    </div>
  );
}
