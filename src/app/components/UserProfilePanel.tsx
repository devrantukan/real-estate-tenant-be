"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function UserProfilePanel({
  user,
  role,
}: {
  user: any;
  role?: string | null;
}) {
  const router = useRouter();
  const isAdmin = role === "site-admin";

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split("@")[0] || "Kullanıcı";

  const menuItems = [
    { label: "Profil", path: "/user/profile" },
    { label: "İlan Listesi", path: "/user/properties" },
    { label: "Proje ve İlan Paylaşımı", path: "/user/project-property-share" },
  ];

  const adminItems = [
    { label: "Organizasyonlar", path: "/admin/organizations" },
    { label: "Ofisler", path: "/admin/offices" },
    { label: "Ofis Çalışanları", path: "/admin/office-workers" },
    { label: "Danışman Adayları", path: "/admin/prospect-agents" },
    { label: "Müşteri Adayları", path: "/admin/prospect-customers" },
    { label: "Yorumlar", path: "/admin/office-worker-reviews" },
    { label: "Özellik Tanımlayıcıları", path: "/admin/property-descriptors" },
    { label: "İletişim Formları", path: "/admin/contact-forms" },
    { label: "Lokasyon Yönetimi", path: "/admin/location-management" },
    { label: "Projeler", path: "/admin/projects" },
    { label: "İçerik Yönetimi", path: "/admin/contents" },
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-gray-100 transition-colors"
        >
          <Avatar.Root className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-100 shadow-sm">
            <Avatar.Image
              src={user?.avatarUrl}
              className="h-full w-full object-cover"
              alt={displayName}
            />
            <Avatar.Fallback className="text-xs font-semibold text-gray-500 uppercase">
              {displayName.slice(0, 2)}
            </Avatar.Fallback>
          </Avatar.Root>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {displayName}
          </span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[220px] bg-white rounded-lg p-1.5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-100"
          align="end"
          sideOffset={5}
        >
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Hesap
          </div>
          {menuItems.map((item) => (
            <DropdownMenu.Item
              key={item.path}
              className="group flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 rounded-md cursor-pointer outline-none hover:bg-primary-50 hover:text-primary-600 focus:bg-primary-50 focus:text-primary-600 transition-colors"
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </DropdownMenu.Item>
          ))}

          {isAdmin && (
            <>
              <DropdownMenu.Separator className="h-px bg-gray-100 my-1.5" />
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Yönetici Paneli
              </div>
              {adminItems.map((item) => (
                <DropdownMenu.Item
                  key={item.path}
                  className="group flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 rounded-md cursor-pointer outline-none hover:bg-primary-50 hover:text-primary-600 focus:bg-primary-50 focus:text-primary-600 transition-colors"
                  onClick={() => router.push(item.path)}
                >
                  {item.label}
                </DropdownMenu.Item>
              ))}
            </>
          )}

          <DropdownMenu.Separator className="h-px bg-gray-100 my-1.5" />
          <DropdownMenu.Item
            className="group flex items-center px-2 py-1.5 text-sm font-medium text-red-600 rounded-md cursor-pointer outline-none hover:bg-red-50 focus:bg-red-50 transition-colors"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
          >
            Çıkış Yap
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
