export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();

  if (!user || !user.id) {
    throw new Error("Something went wrong with authentication");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    // Get user metadata from Supabase
    const userMetadata = user.user_metadata || {};
    await prisma.user.create({
      data: {
        id: user.id,
        firstName: userMetadata.first_name || userMetadata.given_name || user.email?.split("@")[0] || "",
        lastName: userMetadata.last_name || userMetadata.family_name || "",
        email: user.email ?? "",
      },
    });

    return NextResponse.redirect(process.env.NEXT_PUBLIC_SITE_URL || "/");
  } else {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_SITE_URL || "/");
  }
}
