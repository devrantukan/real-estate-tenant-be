import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProspectAgentsTable from "./_components/ProspectAgentsTable";

export default async function ProspectAgentsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  console.log("role is:", role);
  if (role !== "site-admin") {
    redirect("/");
  }

  const prospectAgents = await prisma.prospectAgent.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danışman Adayları</h1>
      <ProspectAgentsTable prospectAgents={prospectAgents} />
    </div>
  );
}
