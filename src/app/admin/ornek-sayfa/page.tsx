/**
 * Admin kontrolü örnek sayfası
 * 
 * Bu sayfa admin kontrolünün nasıl yapıldığını gösterir.
 * Gerçek projede bu dosyayı silebilirsiniz.
 */

import { requireAdmin, getUserWithAdminStatus } from "@/lib/utils/admin";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export default async function OrnekAdminSayfasi() {
  // YÖNTEM 1: En kolay yol - requireAdmin kullan
  // Admin değilse otomatik olarak /unauthorized'a yönlendirir
  await requireAdmin();

  // YÖNTEM 2: Manuel kontrol
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div>Giriş yapmanız gerekiyor</div>;
  }

  const adminMi = await isAdmin(currentUser.dbUser.id);
  if (!adminMi) {
    return <div>Bu sayfaya erişim yetkiniz yok</div>;
  }

  // YÖNTEM 3: Kullanıcı bilgileriyle birlikte kontrol
  const { user, isAdmin: adminDurumu, role } = await getUserWithAdminStatus();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Kontrolü Örnek Sayfası</h1>
      
      <div className="space-y-4">
        <div className="bg-green-100 p-4 rounded">
          <p className="font-semibold">✅ Admin kontrolü başarılı!</p>
          <p>Bu sayfayı görebiliyorsanız admin yetkisine sahipsiniz.</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Kullanıcı Bilgileri:</h2>
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Ad:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Rol:</strong> {role || "Rol atanmamış"}</p>
          <p><strong>Admin:</strong> {adminDurumu ? "Evet ✅" : "Hayır ❌"}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Kullanılan Yöntemler:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><code>requireAdmin()</code> - Otomatik yönlendirme ile</li>
            <li><code>isAdmin(userId)</code> - Manuel kontrol</li>
            <li><code>getUserWithAdminStatus()</code> - Detaylı bilgi ile</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
