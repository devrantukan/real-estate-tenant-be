import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OfficeWorkerForm } from "../../_components/OfficeWorkerForm";
import { getOfficeWorker } from "@/lib/actions/office-worker";

export default async function EditOfficeWorkerPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  console.log("role is:", role);
  if (role !== "site-admin") {
    redirect("/");
  }

  const worker = await getOfficeWorker(parseInt(params.id));

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Çalışan Düzenle</h1>
      <OfficeWorkerForm worker={worker} />
    </div>
  );
}
