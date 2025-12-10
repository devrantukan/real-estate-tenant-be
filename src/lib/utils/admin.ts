/**
 * Admin kontrolü için yardımcı fonksiyonlar
 * 
 * Bu dosya admin kontrolü için pratik fonksiyonlar içerir.
 */

import { getCurrentUser, isAdmin, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Kullanıcının admin olup olmadığını kontrol eder ve değilse yönlendirir
 * 
 * @param redirectTo - Admin değilse yönlendirilecek sayfa (varsayılan: "/unauthorized")
 * @returns Admin ise true, değilse redirect eder
 * 
 * @example
 * ```typescript
 * // Sayfa başında kullanım
 * export default async function AdminPage() {
 *   await requireAdmin();
 *   return <div>Admin içeriği</div>;
 * }
 * ```
 */
export async function requireAdmin(redirectTo: string = "/unauthorized") {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  const adminMi = await isAdmin(currentUser.dbUser.id);
  
  if (!adminMi) {
    redirect(redirectTo);
  }

  return true;
}

/**
 * Kullanıcının admin olup olmadığını kontrol eder (redirect etmeden)
 * 
 * @returns Admin ise true, değilse false
 * 
 * @example
 * ```typescript
 * const adminMi = await checkIfAdmin();
 * if (adminMi) {
 *   // Admin işlemleri
 * }
 * ```
 */
export async function checkIfAdmin(): Promise<boolean> {
  return await requireAdminOrReturn();
}

/**
 * Admin kontrolü yapar, admin değilse redirect eder, admin ise true döner
 * 
 * @param redirectTo - Admin değilse yönlendirilecek sayfa
 * @returns Admin ise true
 */
async function requireAdminOrReturn(redirectTo: string = "/unauthorized"): Promise<boolean> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  const adminMi = await isAdmin(currentUser.dbUser.id);
  
  if (!adminMi) {
    redirect(redirectTo);
  }

  return true;
}

/**
 * Kullanıcı bilgilerini ve admin durumunu döndürür
 * 
 * @returns Kullanıcı bilgileri ve admin durumu
 * 
 * @example
 * ```typescript
 * const { user, isAdmin, role } = await getUserWithAdminStatus();
 * ```
 */
export async function getUserWithAdminStatus() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return {
      user: null,
      isAdmin: false,
      role: null,
    };
  }

  const role = await getUserRole(currentUser.dbUser.id);
  const adminMi = role === "site-admin";

  return {
    user: currentUser.dbUser,
    isAdmin: adminMi,
    role,
  };
}
