"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label } from "@heroui/react";
import { ContentInputType, contentSchema } from "@/lib/validations/content";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/app/components/RichTextEditor"), {
  ssr: false,
});




interface ContentFormProps {
  initialData?: ContentInputType & { id: string };
}

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const REVALIDATION_TOKEN = process.env.NEXT_PUBLIC_REVALIDATION_TOKEN;

async function revalidateFrontend(path: string) {
  try {
    if (!FRONTEND_URL || !REVALIDATION_TOKEN) {
      console.warn("Missing revalidation environment variables");
      return;
    }

    const response = await fetch(`${FRONTEND_URL}/api/revalidate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REVALIDATION_TOKEN}`,
      },
      body: JSON.stringify({
        path,
        token: REVALIDATION_TOKEN,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Revalidation failed for ${path}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
    }
  } catch (error) {
    console.error(`Revalidation error for ${path}:`, error);
  }
}

const revalidatePages = async () => {
  await Promise.all([
    revalidateFrontend("/emlak/biz-kimiz/"),
    revalidateFrontend("/emlak/kvkk-ve-aydinlatma-metni/"),
  ]);
};

export function ContentForm({ initialData }: ContentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ContentInputType>({
    resolver: zodResolver(contentSchema),
    defaultValues: initialData,
  });

  const richTextValue = watch("value");

  const createContent = async (data: ContentInputType) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create content");
      }

      await revalidatePages();
      toast.success("İçerik başarıyla oluşturuldu");
      router.push("/admin/contents");
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error("İçerik oluşturulurken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateContent = async (data: ContentInputType) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/contents/${initialData?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update content");
      }

      await revalidatePages();
      toast.success("İçerik başarıyla güncellendi");
      router.push("/admin/contents");
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("İçerik güncellenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: ContentInputType) => {
    if (initialData) {
      updateContent(data);
    } else {
      createContent(data);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="key" className="block text-sm font-medium mb-2">Anahtar</label>
          <input
            id="key"
            type="text"
            {...register("key")}
            className={`w-full px-3 py-2 border rounded-md ${errors.key ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
          )}
        </div>

        <div>
          <div className="mb-4">
            <QuillEditor
              value={richTextValue || ""}
              onChange={(value) => setValue("value", value)}
              placeholder="Değer"
            />
          </div>
          {errors.value && (
            <p className="text-danger text-sm">{errors.value.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">Açıklama</label>
          <textarea
            id="description"
            {...register("description")}
            className={`w-full px-3 py-2 border rounded-md ${errors.description ? "border-red-500" : "border-gray-300"
              }`}
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="danger-soft"
            onPress={() => router.push("/admin/contents")}
          >
            İptal
          </Button>
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
            {initialData ? "Güncelle" : "Oluştur"}
          </Button>
        </div>
      </form>
    </>
  );
}
