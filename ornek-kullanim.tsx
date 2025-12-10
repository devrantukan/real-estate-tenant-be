// ============================================
// BASIT KULLANIM ÖRNEKLERİ
// ============================================

// ÖRNEK 1: Bir sayfada admin kontrolü
// Dosya: src/app/admin/organizations/page.tsx

import { getCurrentUser, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrganizationsPage() {
  // 1. Giriş yapmış kullanıcıyı al
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect("/login"); // Giriş yapmamışsa login'e yönlendir
  }

  // 2. Admin mi kontrol et
  const adminMi = await isAdmin(currentUser.dbUser.id);
  
  if (!adminMi) {
    redirect("/unauthorized"); // Admin değilse yetkisiz sayfasına yönlendir
  }

  // 3. Admin ise sayfayı göster
  return <div>Organizasyonlar sayfası</div>;
}

// ============================================
// ÖRNEK 2: Daha kolay yol - isCurrentUserAdmin
// ============================================

import { isCurrentUserAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  // Tek satırda kontrol!
  const adminMi = await isCurrentUserAdmin();
  
  if (!adminMi) {
    redirect("/unauthorized");
  }

  return <div>Ayarlar sayfası</div>;
}

// ============================================
// ÖRNEK 3: Koşullu içerik gösterme
// ============================================

import { getCurrentUser, isAdmin } from "@/lib/auth";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  const adminMi = await isAdmin(currentUser.dbUser.id);

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Herkes görebilir */}
      <div>Normal içerik burada</div>
      
      {/* Sadece admin görebilir */}
      {adminMi && (
        <div>
          <h2>Admin Paneli</h2>
          <a href="/admin/organizations">Organizasyonları Yönet</a>
        </div>
      )}
    </div>
  );
}

// ============================================
// ÖRNEK 4: Belirli bir kullanıcıyı kontrol etme
// ============================================

import { isAdmin } from "@/lib/auth";

export default async function UserProfilePage({ userId }: { userId: string }) {
  // Bu kullanıcı admin mi?
  const buKullaniciAdminMi = await isAdmin(userId);
  
  return (
    <div>
      <h1>Kullanıcı Profili</h1>
      {buKullaniciAdminMi && (
        <span className="badge bg-red-500 text-white px-2 py-1 rounded">
          Admin
        </span>
      )}
    </div>
  );
}
