"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  DropdownSection,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserProfilePanel({
  user,
  role,
}: {
  user: any;
  role?: string | null;
}) {
  const router = useRouter();
  const isAdmin = role === "site-admin";

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.email?.split("@")[0] || "Kullanıcı";

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <Avatar
            isBordered
            className="transition-transform"
            src={user?.avatarUrl || undefined}
            size="sm"
            name={displayName}
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {displayName}
          </span>
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="ghost">
        <DropdownItem
          key="profile"
          onPress={() => router.push("/user/profile")}
        >
          Profil
        </DropdownItem>

        <DropdownItem
          key="properties"
          onPress={() => router.push("/user/properties")}
        >
          İlan Listesi
        </DropdownItem>

        <DropdownItem
          key="project-property-share"
          onPress={() => router.push("/user/project-property-share")}
        >
          Proje ve İlan Paylaşımı
        </DropdownItem>

        {isAdmin ? (
          <DropdownSection title="Admin">
            <DropdownItem
              key="admin-organizations"
              onPress={() => router.push("/admin/organizations")}
            >
              Organizasyonlar
            </DropdownItem>
            <DropdownItem
              key="admin-offices"
              onPress={() => router.push("/admin/offices")}
            >
              Ofisler
            </DropdownItem>
            <DropdownItem
              key="admin-office-workers"
              onPress={() => router.push("/admin/office-workers")}
            >
              Ofis Çalışanları
            </DropdownItem>
            <DropdownItem
              key="admin-prospect-agents"
              onPress={() => router.push("/admin/prospect-agents")}
            >
              Danışman Adayları
            </DropdownItem>
            <DropdownItem
              key="admin-prospect-customers"
              onPress={() => router.push("/admin/prospect-customers")}
            >
              Müşteri Adayları
            </DropdownItem>
            <DropdownItem
              key="admin-office-worker-reviews"
              onPress={() => router.push("/admin/office-worker-reviews")}
            >
              Yorumlar
            </DropdownItem>
            <DropdownItem
              key="admin-property-descriptors"
              onPress={() => router.push("/admin/property-descriptors")}
            >
              Özellik Tanımlayıcıları
            </DropdownItem>
            <DropdownItem
              key="admin-contact-forms"
              onPress={() => router.push("/admin/contact-forms")}
            >
              İletişim Formları
            </DropdownItem>
            <DropdownItem
              key="admin-location-management"
              onPress={() => router.push("/admin/location-management")}
            >
              Lokasyon Yönetimi
            </DropdownItem>
            <DropdownItem
              key="admin-projects"
              onPress={() => router.push("/admin/projects")}
            >
              Projeler
            </DropdownItem>
            <DropdownItem
              key="admin-contents"
              onPress={() => router.push("/admin/contents")}
            >
              İçerik Yönetimi
            </DropdownItem>
          </DropdownSection>
        ) : null}

        <DropdownItem
          key="logout"
          variant="danger"
          className="text-danger p-2 h-full"
          onPress={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
        >
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
