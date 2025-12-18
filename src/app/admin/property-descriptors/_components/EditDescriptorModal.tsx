"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { Select, ListBox } from "@heroui/react";
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
  PropertyType,
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

  return (
    <Modal isOpen={true} onOpenChange={onClose} >
      <Modal.Container>
          <Modal.Dialog>
        {(renderProps) => {
          const handleClose = () => {
            onClose();
          };
          return (
            <>
              <Modal.Header className="flex flex-col gap-1 text-xl font-semibold">
                Tanımlayıcı Düzenle
              </Modal.Header>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Modal.Body className="space-y-6">
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
                            placeholder="Kategori seçiniz"
                            selectedKey={field.value?.toString() || undefined}
                            onSelectionChange={(key) => {
                              const selectedKey = key?.toString() || "";
                              const value = selectedKey ? Number(selectedKey) : null;
                              field.onChange(value);
                            }}
                            className="max-w-full"
                          >
                              {categories.map((category) => (
                               <ListBox.Item
                                  key={category.id.toString()}
                                >
                                  {category.value}
                               </ListBox.Item>
                              ))}
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger-soft" onClick={handleClose}>
                    İptal
                  </Button>
                  <Button variant="primary" type="submit">
                    Güncelle
                  </Button>
                </Modal.Footer>
              </form>
            </Form>
          </>
        );
        }}
      </Modal.Dialog>
        </Modal.Container>
    </Modal>
  );
}
