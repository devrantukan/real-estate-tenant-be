import UserProfilePanel from "./UserProfilePanel";
import { getCurrentUserWithRole } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}

export default async function AppbarWrapper({ children }: Props) {
  const userWithRole = await getCurrentUserWithRole();

  if (!userWithRole) return null;

  return (
    <>
      <UserProfilePanel user={userWithRole} role={userWithRole.role} />
      {children}
    </>
  );
}
