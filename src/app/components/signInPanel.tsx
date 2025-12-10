import { createClient } from "@/lib/supabase/server";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import UserProfilePanel from "./UserProfilePanel";
import prisma from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

const signInPanel = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // Create user in database if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          firstName: user.user_metadata?.first_name || user.email?.split("@")[0] || "",
          lastName: user.user_metadata?.last_name || "",
          email: user.email || "",
        },
      });
      const role = await getUserRole(newUser.id);
      return <>{newUser && <UserProfilePanel user={newUser} role={role} />}</>;
    }

    const role = await getUserRole(dbUser.id);
    return <>{dbUser && <UserProfilePanel user={dbUser} role={role} />}</>;
  }

  return (
    <div className="flex gap-3">
      <Button color="primary" as={Link} href="/login">
        Giriş Yap
      </Button>
      <Button as={Link} href="/login">
        Kayıt Ol
      </Button>
    </div>
  );
};

export default signInPanel;
