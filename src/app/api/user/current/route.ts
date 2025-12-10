import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getUserRole } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ user: null, role: null });
    }

    const role = await getUserRole(currentUser.dbUser.id);
    
    // Debug: Console'da role bilgisini göster
    console.log("API /user/current - User ID:", currentUser.dbUser.id);
    console.log("API /user/current - Role:", role);
    console.log("API /user/current - Is Admin:", role === "site-admin");

    return NextResponse.json({
      user: currentUser.dbUser,
      role,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
