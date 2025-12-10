"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { Organization } from "@prisma/client";
import { deleteOrganization } from "@/lib/actions/organization";
import SubmitButton from "@/app/components/SubmitButton";
import Link from "next/link";

interface Props {
  organization: Organization;
}

const DeleteOrganizationForm = ({ organization }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    const result = await deleteOrganization(organization.id);

    if (result.success) {
      router.push("/admin/organizations");
      router.refresh();
    } else {
      setError(result.error || "Bir hata oluştu");
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-red-800 mb-4">
          Organizasyonu Silmek İstediğinizden Emin misiniz?
        </h2>
        <p className="text-red-700 mb-4">
          Bu işlem geri alınamaz. Organizasyon ve tüm ilişkili veriler kalıcı
          olarak silinecektir.
        </p>
        <div className="bg-white p-4 rounded border border-red-200">
          <p>
            <span className="font-semibold">Organizasyon Adı: </span>
            {organization.name}
          </p>
          <p>
            <span className="font-semibold">Slug: </span>
            {organization.slug}
          </p>
          {organization.description && (
            <p>
              <span className="font-semibold">Açıklama: </span>
              {organization.description}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form action={handleDelete} className="flex justify-center gap-3">
        <Link href="/admin/organizations">
          <Button variant="light">İptal</Button>
        </Link>
        <SubmitButton type="submit" color="danger" variant="light">
          Sil
        </SubmitButton>
      </form>
    </div>
  );
};

export default DeleteOrganizationForm;
