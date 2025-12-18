import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  return await updateSession(req);
}

export const config = {
  matcher: ["/user/:path*"],
};

