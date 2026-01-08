"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DescriptorFormData,
  descriptorSchema,
} from "@/lib/validations/property-descriptor";
import { createDescriptor } from "@/lib/actions/property-descriptor";
import { PropertyDescriptorCategory } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  categories: (PropertyDescriptorCategory & {
    type: { id: number; value: string };
  })[];
  onSuccess: (descriptor: any) => void;
}

export default function AddDescriptorModal({
  open,
  onClose,
  categories,
  onSuccess,
}: Props) {
  const router = useRouter();
  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<DescriptorFormData>({
    resolver: zodResolver(descriptorSchema),
  });

  const onSubmit = async (data: DescriptorFormData) => {
    try {
      const result = await createDescriptor({
        value: data.value,
        slug: data.slug,
        categoryId: Number(data.categoryId),
      });
      toast.success("Tanımlayıcı başarıyla oluşturuldu");
      onSuccess(result);
      reset();
      onClose();
      //  router.refresh();
      window.location.reload();
    } catch (error) {
      toast.error("Tanımlayıcı oluşturulurken bir hata oluştu");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Tanımlayıcı Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="value" className="block text-sm font-medium mb-2">
                Tanımlayıcı Adı
              </label>
              <Input
                id="value"
                value={watch("value") || ""}
                onChange={(e) => setValue("value", e.target.value)}
                onBlur={() => trigger("value")}
              />
              {errors.value && (
                <p className="text-destructive text-sm mt-1">
                  {errors.value.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-2">
                Slug
              </label>
              <Input
                id="slug"
                value={watch("slug") || ""}
                onChange={(e) => setValue("slug", e.target.value)}
                onBlur={() => trigger("slug")}
              />
              {errors.slug && (
                <p className="text-destructive text-sm mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
                Kategori
              </label>
              <Select
                value={watch("categoryId")?.toString() || ""}
                onValueChange={(value) => {
                  setValue("categoryId", value ? Number(value) : 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-destructive text-sm mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              İptal
            </Button>
            <Button type="submit">Ekle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
