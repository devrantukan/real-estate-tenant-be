"use client";

import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  DropdownSection,
  Button,
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
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split("@")[0] || "Kullanıcı";

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button
          variant="light"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <Avatar
            className="transition-transform"
            src={user?.avatarUrl || undefined}
            size="sm"
            name={displayName}
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {displayName}
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions">
        <DropdownItem
          key="profile"
          onPress={() => {
            setIsOpen(false);
            router.push("/user/profile");
          }}
        >
          Profil
        </DropdownItem>

        <DropdownItem
          key="properties"
          onPress={() => {
            setIsOpen(false);
            router.push("/user/properties");
          }}
        >
          İlan Listesi
        </DropdownItem>

        <DropdownItem
          key="project-property-share"
          onPress={() => {
            setIsOpen(false);
            router.push("/user/project-property-share");
          }}
        >
          Proje ve İlan Paylaşımı
        </DropdownItem>

        {isAdmin ? (
          <DropdownSection title="Admin">
            <DropdownItem
              key="admin-organizations"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/organizations");
              }}
            >
              Organizasyonlar
            </DropdownItem>
            <DropdownItem
              key="admin-offices"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/offices");
              }}
            >
              Ofisler
            </DropdownItem>
            <DropdownItem
              key="admin-office-workers"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/office-workers");
              }}
            >
              Ofis Çalışanları
            </DropdownItem>
            <DropdownItem
              key="admin-prospect-agents"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/prospect-agents");
              }}
            >
              Danışman Adayları
            </DropdownItem>
            <DropdownItem
              key="admin-prospect-customers"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/prospect-customers");
              }}
            >
              Müşteri Adayları
            </DropdownItem>
            <DropdownItem
              key="admin-office-worker-reviews"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/office-worker-reviews");
              }}
            >
              Yorumlar
            </DropdownItem>
            <DropdownItem
              key="admin-property-descriptors"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/property-descriptors");
              }}
            >
              Özellik Tanımlayıcıları
            </DropdownItem>
            <DropdownItem
              key="admin-contact-forms"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/contact-forms");
              }}
            >
              İletişim Formları
            </DropdownItem>
            <DropdownItem
              key="admin-location-management"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/location-management");
              }}
            >
              Lokasyon Yönetimi
            </DropdownItem>
            <DropdownItem
              key="admin-projects"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/projects");
              }}
            >
              Projeler
            </DropdownItem>
            <DropdownItem
              key="admin-contents"
              onPress={() => {
                setIsOpen(false);
                router.push("/admin/contents");
              }}
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
            setIsOpen(false);
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
