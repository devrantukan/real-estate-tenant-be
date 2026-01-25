import { createSiteAdminRole } from "@/lib/actions/create-site-admin-role";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateSiteAdminRolePage() {
  const result = await createSiteAdminRole();

  if (result.success) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Site-Admin Rolü Oluşturuldu</h1>
        <p className="text-green-600">
          ✅ Site-admin rolü başarıyla oluşturuldu!
        </p>
        <p className="mt-2">Role ID: {result.role?.id}</p>
        <p className="mt-2">Role Slug: {result.role?.slug}</p>
        <p className="mt-4 text-gray-600">
          Artık kullanıcılarınızın roleId'sini bu ID'ye ({result.role?.id})
          ayarlayarak admin yapabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Hata</h1>
      <p className="text-red-600">❌ {result.error}</p>
    </div>
  );
}

