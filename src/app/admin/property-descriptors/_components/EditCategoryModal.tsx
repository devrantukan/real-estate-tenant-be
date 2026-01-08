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
import { Form } from "@/components/ui/form";
import {
  CategoryFormData,
  categorySchema,
} from "@/lib/validations/property-descriptor";
import { updateCategory } from "@/lib/actions/property-descriptor";
import { PropertyType, PropertyDescriptorCategory } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  category: PropertyDescriptorCategory;
  propertyTypes: PropertyType[];
  onClose: () => void;
  onSuccess: (category: any) => void;
}

export default function EditCategoryModal({
  category,
  propertyTypes,
  onClose,
  onSuccess,
}: Props) {
  const router = useRouter();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      value: category.value,
      slug: category.slug,
      typeId: category.typeId,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const result = await updateCategory(category.id, data);
      toast.success("Kategori başarıyla güncellendi", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onSuccess(result);
      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Kategori güncellenirken bir hata oluştu", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategori Düzenle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="value" className="block text-sm font-medium mb-2">
                  Kategori Adı
                </label>
                <Input
                  id="value"
                  value={form.watch("value") || ""}
                  onChange={(e) => form.setValue("value", e.target.value)}
                  onBlur={() => form.trigger("value")}
                />
                {form.formState.errors.value && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.value.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-2">
                  Slug
                </label>
                <Input
                  id="slug"
                  value={form.watch("slug") || ""}
                  onChange={(e) => form.setValue("slug", e.target.value)}
                  onBlur={() => form.trigger("slug")}
                />
                {form.formState.errors.slug && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="typeId" className="block text-sm font-medium mb-2">
                  Mülk Tipi
                </label>
                <Select
                  value={form.getValues("typeId")?.toString() || ""}
                  onValueChange={(value) => {
                    form.setValue("typeId", Number(value));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mülk tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem
                        key={type.id.toString()}
                        value={type.id.toString()}
                      >
                        {type.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button">
                İptal
              </Button>
              <Button type="submit">Güncelle</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
