import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OfficeForm from "../../_components/OfficeForm";

export default async function EditOfficePage({
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

  const office = await prisma.office.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      images: true,
      city: true,
      country: true,
      district: true,
      neighborhood: true,
      workers: true,
    },
  });

  // console.log("office is:", office);

  if (!office) {
    redirect("/admin/offices");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Ofis Düzenle: {office.name}</h1>
      <OfficeForm mode="edit" office={office} />
    </div>
  );
}
