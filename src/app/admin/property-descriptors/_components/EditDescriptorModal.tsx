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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DescriptorFormData,
  descriptorSchema,
} from "@/lib/validations/property-descriptor";
import { updateDescriptor } from "@/lib/actions/property-descriptor";
import {
  PropertyDescriptor,
  PropertyDescriptorCategory,
} from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  descriptor: PropertyDescriptor;
  categories: (PropertyDescriptorCategory & {
    type: { id: number; value: string };
  })[];
  onClose: () => void;
  onSuccess: (descriptor: any) => void;
}

export default function EditDescriptorModal({
  descriptor,
  categories,
  onClose,
  onSuccess,
}: Props) {
  const router = useRouter();
  const form = useForm<DescriptorFormData>({
    resolver: zodResolver(descriptorSchema),
    defaultValues: {
      value: descriptor.value,
      slug: descriptor.slug,
      categoryId: descriptor.categoryId,
    },
  });

  const onSubmit = async (data: DescriptorFormData) => {
    try {
      const result = await updateDescriptor(descriptor.id, data);
      toast.success("Tanımlayıcı başarıyla güncellendi", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onSuccess(result);
      onClose();
      window.location.assign("/admin/property-descriptors");
    } catch (error) {
      toast.error("Tanımlayıcı güncellenirken bir hata oluştu", {
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
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tanımlayıcı Düzenle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-6 py-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanımlayıcı Adı</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Tanımlayıcı adını giriniz"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Slug değerini giriniz"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => {
                          const numValue = value ? Number(value) : null;
                          field.onChange(numValue);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id.toString()}
                              value={category.id.toString()}
                            >
                              {category.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
