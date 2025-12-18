import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProspectsTable from "./_components/ProspectsTable";

export default async function MusteriAdaylariPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  if (role !== "site-admin") {
    redirect("/");
  }

  const prospects = await prisma.prospectCustomer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Müşteri Adayları Yönetimi</h1>
      </div>
      <div className="card">
        <ProspectsTable prospects={prospects} />
      </div>
    </div>
  );
}
