import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const role = await getUserRole(user.id);
  if (role !== "site-admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
