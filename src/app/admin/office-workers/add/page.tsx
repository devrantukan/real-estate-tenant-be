import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OfficeWorkerForm } from "../_components/OfficeWorkerForm";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AddOfficeWorkerPage() {
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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Çalışan Ekle</h1>
      <OfficeWorkerForm />
    </div>
  );
}
