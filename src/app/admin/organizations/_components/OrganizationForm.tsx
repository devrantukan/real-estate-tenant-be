"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Textarea } from "@nextui-org/react";
import { Organization } from "@prisma/client";
import {
  createOrganization,
  updateOrganization,
  OrganizationFormData,
} from "@/lib/actions/organization";
import SubmitButton from "@/app/components/SubmitButton";
import Link from "next/link";

interface Props {
  organization?: Organization;
}

const OrganizationForm = ({ organization }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!organization;

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const data: OrganizationFormData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || undefined,
      logoUrl: (formData.get("logoUrl") as string) || undefined,
    };

    let result;
    if (isEdit) {
      result = await updateOrganization(organization.id, data);
    } else {
      result = await createOrganization(data);
    }

    if (result.success) {
      router.push("/admin/organizations");
      router.refresh();
    } else {
      setError(result.error || "Bir hata oluştu");
    }
  };

  return (
    <Card className="p-6 max-w-2xl">
      <form action={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Organizasyon Adı"
          name="name"
          defaultValue={organization?.name || ""}
          isRequired
          variant="bordered"
        />
        <Input
          label="Slug"
          name="slug"
          defaultValue={organization?.slug || ""}
          isRequired
          variant="bordered"
          description="URL'de kullanılacak benzersiz tanımlayıcı (örn: my-organization)"
        />
        <Textarea
          label="Açıklama"
          name="description"
          defaultValue={organization?.description || ""}
          variant="bordered"
          minRows={3}
        />
        <Input
          label="Logo URL"
          name="logoUrl"
          defaultValue={organization?.logoUrl || ""}
          variant="bordered"
          description="Organizasyon logosunun URL'i"
        />

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/admin/organizations">
            <Button variant="light">İptal</Button>
          </Link>
          <SubmitButton type="submit" color="primary">
            {isEdit ? "Güncelle" : "Oluştur"}
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
};

export default OrganizationForm;
