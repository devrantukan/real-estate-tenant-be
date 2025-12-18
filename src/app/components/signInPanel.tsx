import { Button } from "@heroui/react";
import React from "react";
import Link from "next/link";
import UserProfilePanel from "./UserProfilePanel";
import { getCurrentUserWithRole } from "@/lib/auth";

const signInPanel = async () => {
  const userWithRole = await getCurrentUserWithRole();

  if (userWithRole) {
    return (
      <>
        {userWithRole && (
          <UserProfilePanel user={userWithRole} role={userWithRole.role} />
        )}
      </>
    );
  }

  return (
    <div className="flex gap-3">
      <Link href="/login">
        <Button variant="primary">
          Sign In
        </Button>
      </Link>
      <Link href="/signup">
        <Button>
          Sign Up
        </Button>
      </Link>
    </div>
  );
};
export default signInPanel;
