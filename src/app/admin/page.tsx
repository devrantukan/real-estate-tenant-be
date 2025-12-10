import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { dbUser } = currentUser;
  const role = await getUserRole(dbUser.id);

  // Only site-admin can access
  if (role !== "site-admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Organizasyonlar Kartı */}
        <Link href="/admin/organizations">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Organizasyonlar</h2>
            <p className="text-gray-600">Organizasyonları görüntüle, düzenle ve yönet</p>
          </div>
        </Link>

        {/* Kullanıcılar Kartı (gelecekte eklenebilir) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 opacity-50">
          <h2 className="text-xl font-semibold mb-2">Kullanıcılar</h2>
          <p className="text-gray-600">Yakında gelecek</p>
        </div>

        {/* Raporlar Kartı (gelecekte eklenebilir) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 opacity-50">
          <h2 className="text-xl font-semibold mb-2">Raporlar</h2>
          <p className="text-gray-600">Yakında gelecek</p>
        </div>
      </div>

      {/* Admin Bilgileri */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Bilgileri</h2>
        <div className="space-y-2">
          <p><strong>Kullanıcı ID:</strong> {dbUser.id}</p>
          <p><strong>Email:</strong> {dbUser.email}</p>
          <p><strong>Ad Soyad:</strong> {dbUser.firstName} {dbUser.lastName}</p>
          <p><strong>Rol:</strong> {role || "Rol atanmamış"}</p>
          <p><strong>Admin Durumu:</strong> {role === "site-admin" ? "✅ Admin" : "❌ Admin Değil"}</p>
        </div>
      </div>
    </div>
  );
}
