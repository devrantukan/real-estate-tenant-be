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
import { createCategory } from "@/lib/actions/property-descriptor";
import { PropertyType } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  propertyTypes: PropertyType[];
  onSuccess: (category: any) => void;
}

export default function AddCategoryModal({
  open,
  onClose,
  propertyTypes,
  onSuccess,
}: Props) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      value: "",
      slug: "",
      typeId: 0,
    },
  });
  const router = useRouter();

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const result = await createCategory(data);
      toast.success("Kategori başarıyla oluşturuldu", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onSuccess(result);
      form.reset();
      onClose();
      //router.refresh();
      window.location.reload();
    } catch (error) {
      toast.error("Kategori oluşturulurken bir hata oluştu", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Kategori Ekle</DialogTitle>
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
              <Button type="submit">Ekle</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
