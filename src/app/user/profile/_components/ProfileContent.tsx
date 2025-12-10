"use client";

import { Avatar, Card } from "@nextui-org/react";
import UploadAvatar from "../_components/UploadAvatar";
import UserProfileForm from "@/app/components/UserProfileForm";
import SectionTitle from "../_components/sectionTitle";
import { OfficeWorker, User } from "@prisma/client";

interface ProfileContentProps {
  dbUser: User;
  role: string | null;
  officeWorker: OfficeWorker | null;
}

const Attribute = ({ title, value }: { title: string; value: string | number | null | undefined }) => (
  <div className="flex flex-col text-sm">
    <span className="text-slate-800 font-semibold">{title}</span>
    <span className="text-slate-600">{value ?? "-"}</span>
  </div>
);

export default function ProfileContent({ dbUser, role, officeWorker }: ProfileContentProps) {
  return (
    <>
      <Card className="m-4 p-4 flex flex-col gap-5">
        <SectionTitle title="Kullanıcı Bilgileri" />
        <div className="flex lg:flex-row flex-col">
          <div className="flex flex-col items-center lg:w-1/3 w-full mb-6">
            <Avatar
              className="w-40 h-40 border-1 border-gray-200"
              src={officeWorker?.avatarUrl ?? "/profile.png"}
            />
            <UploadAvatar userId={dbUser.id} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:w-2/3 w-full">
            <Attribute
              title="Adı Soyadı"
              value={`${dbUser.firstName} ${dbUser.lastName}`}
            />
            <Attribute title="E-posta" value={dbUser.email} />
            <Attribute
              title="Kayıt Tarihi"
              value={dbUser.createdAt.toLocaleDateString()}
            />
            <Attribute title="Kullanıcı Rolü" value={role || "Rol atanmamış"} />
            <Attribute title="Emlak sayısı" value={1} />
          </div>
        </div>
      </Card>
      {role === "office-workers" && (
        <Card className="m-4 p-4 flex flex-col gap-5">
          <SectionTitle title="Danışman Bilgileri" />
          {officeWorker && <UserProfileForm officeWorker={officeWorker} />}
        </Card>
      )}
    </>
  );
}
