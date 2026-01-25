"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserProfilePanel from "./UserProfilePanel";
import { User } from "@prisma/client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserWithRole {
  user: User;
  role: string | null;
}

export default function SignInPanelWrapper() {
  const [userData, setUserData] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user/current");
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserData({ user: data.user, role: data.role });
        } else {
          setUserData(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUser();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        // Refetch user data when auth state changes
        fetchUser();
        // Refresh router to update server components
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="flex gap-3">...</div>;
  }

  if (userData) {
    return <UserProfilePanel user={userData.user} role={userData.role} />;
  }

  return (
    <div className="flex gap-3">
      <Link href="/login">
        <Button>
          Giriş Yap
        </Button>
      </Link>
      <Link href="/signup">
        <Button variant="outline">
          Kayıt Ol
        </Button>
      </Link>
    </div>
  );
}
