"use server";

import { getUser } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    // Önce User tablosundan rol kontrolü yap
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (user?.role) {
      // User tablosunda rol varsa onu kullan
      if (user.role.slug === "site-admin") {
        return "site-admin";
      }
      return user.role.slug;
    }

    // User'da rol yoksa OfficeWorker'dan kontrol et (fallback)
    const officeWorker = await prisma.officeWorker.findUnique({
      where: { userId },
      include: { role: true },
    });

    if (officeWorker?.role) {
      if (officeWorker.role.slug === "site-admin") {
        return "site-admin";
      }
      return officeWorker.role.slug;
    }

    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

export async function getCurrentUserWithRole() {
  const supabaseUser = await getUser();
  if (!supabaseUser) {
    return null;
  }

  // Prisma'da kullanıcıyı bul veya oluştur
  let dbUser = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
    include: { role: true },
  });

  if (!dbUser) {
    const userMetadata = supabaseUser.user_metadata || {};
    
    // Default role ID'yi bul (örneğin "user" rolü)
    const defaultRole = await prisma.role.findFirst({
      where: { slug: "user" },
    });

    dbUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        firstName: userMetadata.first_name || userMetadata.given_name || supabaseUser.email?.split("@")[0] || "User",
        lastName: userMetadata.last_name || userMetadata.family_name || "",
        email: supabaseUser.email ?? "",
        avatarUrl: userMetadata.avatar_url || null,
        roleId: defaultRole?.id || null, // Default role atanır
      },
      include: { role: true },
    });
  }

  const role = await getUserRole(supabaseUser.id);

  return {
    ...dbUser,
    role,
    supabaseUser,
  };
}

