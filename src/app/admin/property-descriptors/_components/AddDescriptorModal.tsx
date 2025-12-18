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
  DescriptorFormData,
  descriptorSchema,
} from "@/lib/validations/property-descriptor";
import { createDescriptor } from "@/lib/actions/property-descriptor";
import { PropertyDescriptorCategory, PropertyType } from "@prisma/client";
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
    register,
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

  return (
    <Modal isOpen={open} onOpenChange={(open) => !open && onClose()}>
      <Modal.Container>
          <Modal.Dialog>
        {(renderProps) => {
          const handleClose = () => {
            onClose();
          };
          return (
            <>
              <Modal.Header>Yeni Tanımlayıcı Ekle</Modal.Header>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Modal.Body>
                <div>
                  <label htmlFor="value" className="block text-sm font-medium mb-2">Tanımlayıcı Adı</label>
                  <Input
                    id="value"
                    value={watch("value") || ""}
                    onChange={(e) => setValue("value", e.target.value)}
                    onBlur={() => trigger("value")}
                  />
                  {errors.value && (
                    <p className="text-danger text-sm mt-1">{errors.value.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-2">Slug</label>
                  <Input
                    id="slug"
                    value={watch("slug") || ""}
                    onChange={(e) => setValue("slug", e.target.value)}
                    onBlur={() => trigger("slug")}
                  />
                  {errors.slug && (
                    <p className="text-danger text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium mb-2">Kategori</label>
                  <Select
                    selectedKey={watch("categoryId")?.toString() || undefined}
                    onSelectionChange={(key) => {
                      const selectedKey = key?.toString() || "";
                      setValue("categoryId", selectedKey ? Number(selectedKey) : 0);
                    }}
                  >
                    {categories.map((category) => (
                      <ListBox.Item key={category.id}>
                        {category.value}
                      </ListBox.Item>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <p className="text-danger text-sm mt-1">{errors.categoryId.message}</p>
                  )}
                </div>
              </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger-soft" onClick={handleClose}>
                    İptal
                  </Button>
                  <Button variant="primary" type="submit">
                    Ekle
                  </Button>
                </Modal.Footer>
              </form>
            </>
          );
        }}
      </Modal.Dialog>
        </Modal.Container>
    </Modal>
  );
}
