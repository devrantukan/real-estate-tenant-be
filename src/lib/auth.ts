import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  // Create user in database if doesn't exist
  if (!dbUser) {
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.user_metadata?.first_name || user.email?.split("@")[0] || "",
        lastName: user.user_metadata?.last_name || "",
        email: user.email || "",
      },
    });
    return { authUser: user, dbUser: newUser };
  }

  return { authUser: user, dbUser };
}

export async function getUserRole(userId: string): Promise<string | null> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      officeWorker: {
        include: {
          role: true,
        },
      },
    },
  });

  return dbUser?.officeWorker?.role?.slug || null;
}

/**
 * Kullanıcının admin rolüne sahip olup olmadığını kontrol eder
 * @param userId - Kontrol edilecek kullanıcının ID'si
 * @returns true eğer kullanıcı "site-admin" rolüne sahipse, aksi halde false
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === "site-admin";
}

/**
 * Mevcut oturum açmış kullanıcının admin olup olmadığını kontrol eder
 * @returns true eğer kullanıcı giriş yapmış ve admin ise, aksi halde false
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return false;
  }
  return isAdmin(currentUser.dbUser.id);
}

