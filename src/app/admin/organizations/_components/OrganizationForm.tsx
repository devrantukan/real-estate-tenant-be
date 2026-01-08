"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganizationFormSchema,
  OrganizationFormType,
} from "@/lib/validations/organization";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { saveOrganization, updateOrganization } from "@/lib/actions/organization";

interface OrganizationFormProps {
  mode: "add" | "edit";
  organization?: any;
}

export default function OrganizationForm({
  mode,
  organization,
}: OrganizationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OrganizationFormType>({
    resolver: zodResolver(OrganizationFormSchema),
    defaultValues:
      mode === "edit"
        ? {
          name: organization?.name || "",
          slug: organization?.slug || "",
          description: organization?.description || "",
        }
        : undefined,
  });

  const onSubmit = async (data: OrganizationFormType) => {
    setIsSubmitting(true);
    try {
      const slug = slugify(data.name, { lower: true, strict: true });
      const formData = {
        ...data,
        slug,
      };

      if (mode === "edit" && organization) {
        await updateOrganization(organization.id, formData);
      } else {
        await saveOrganization(formData);
      }

      toast.success(
        mode === "edit"
          ? "Organizasyon güncellendi!"
          : "Organizasyon başarıyla oluşturuldu!"
      );
      router.push("/admin/organizations");
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-generate slug from name
  const nameValue = watch("name");
  if (nameValue && mode === "add") {
    const autoSlug = slugify(nameValue, { lower: true, strict: true });
    if (watch("slug") !== autoSlug) {
      setValue("slug", autoSlug);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">Organizasyon Adı</label>
          <Input
            id="name"
            {...register("name")}
            value={watch("name") || ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-2">Slug</label>
          <Input
            id="slug"
            {...register("slug")}
            value={watch("slug") || ""}
          />
          <p className="text-xs text-gray-500 mt-1">URL için kullanılacak benzersiz tanımlayıcı</p>
          {errors.slug && (
            <p className="text-sm text-red-500 mt-1">{errors.slug.message as string}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">Açıklama</label>
        <textarea
          id="description"
          {...register("description")}
          value={watch("description") || ""}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message as string}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/organizations")}
        >
          İptal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {mode === "add" ? "Ekle" : "Güncelle"}
        </Button>
      </div>
    </form>
  );
}

