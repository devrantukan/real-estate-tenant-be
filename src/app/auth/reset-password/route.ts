import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");

  // Handle password reset callback
  if (code && type === "recovery") {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL("/reset-password?error=invalid_token", request.url)
      );
    }

    // Redirect to reset password page
    return NextResponse.redirect(new URL("/reset-password", request.url));
  }

  // If no code or wrong type, redirect to forgot password page
  return NextResponse.redirect(new URL("/forgot-password", request.url));
}
