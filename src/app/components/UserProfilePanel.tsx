"use client";
import {
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/react";
import { User as PrismaUser } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import React from "react";

interface Props {
  user: PrismaUser;
  role: string | null;
}
const UserProfilePanel = ({ user, role }: Props) => {
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = role === "site-admin";

  // Debug: Console'da role bilgisini göster
  React.useEffect(() => {
    console.log("UserProfilePanel - Role:", role);
    console.log("UserProfilePanel - isAdmin:", isAdmin);
    console.log("UserProfilePanel - Admin section should render:", isAdmin);
  }, [role, isAdmin]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: user.avatarUrl ?? "/profile.png",
          }}
          className="transition-transform"
          name={`${user.firstName} ${user.lastName}`}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownSection title="Hesap">
          <DropdownItem 
            key="profile-link"
            as={Link}
            href="/user/profile"
          >
            Profil
          </DropdownItem>
          <DropdownItem 
            key="property-list-link"
            as={Link}
            href="/user/properties"
          >
            İlan Listesi
          </DropdownItem>
        </DropdownSection>
        {isAdmin ? (
          <DropdownSection title="Yönetim">
            <DropdownItem 
              key="admin-organizations-link"
              as={Link}
              href="/admin/organizations"
            >
              Organizasyonlar
            </DropdownItem>
            <DropdownItem 
              key="admin-dashboard-link"
              as={Link}
              href="/admin"
            >
              Admin Paneli
            </DropdownItem>
          </DropdownSection>
        ) : null}
        <DropdownSection>
          <DropdownItem key="logout" color="danger" onClick={handleLogout}>
            Çıkış
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfilePanel;
