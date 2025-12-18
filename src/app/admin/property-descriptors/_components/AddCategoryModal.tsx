"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { Select, ListBox } from "@heroui/react";
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
              <Modal.Header>Yeni Kategori Ekle</Modal.Header>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <Modal.Body>
                    <div>
                      <label htmlFor="value" className="block text-sm font-medium mb-2">Kategori Adı</label>
                      <Input
                        id="value"
                        value={form.watch("value") || ""}
                        onChange={(e) => form.setValue("value", e.target.value)}
                        onBlur={() => form.trigger("value")}
                      />
                      {form.formState.errors.value && (
                        <p className="text-danger text-sm mt-1">{form.formState.errors.value.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium mb-2">Slug</label>
                      <Input
                        id="slug"
                        value={form.watch("slug") || ""}
                        onChange={(e) => form.setValue("slug", e.target.value)}
                        onBlur={() => form.trigger("slug")}
                      />
                      {form.formState.errors.slug && (
                        <p className="text-danger text-sm mt-1">{form.formState.errors.slug.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="typeId" className="block text-sm font-medium mb-2">Mülk Tipi</label>
                      <Select
                        selectedKey={form.getValues("typeId")?.toString() || undefined}
                        onSelectionChange={(key) => {
                          const selectedKey = key?.toString() || "";
                          form.setValue("typeId", Number(selectedKey));
                        }}
                      >
                        {propertyTypes.map((type) => (
                          <ListBox.Item key={type.id.toString()}>
                            {type.value}
                          </ListBox.Item>
                        ))}
                      </Select>
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
              </Form>
            </>
          );
        }}
      </Modal.Dialog>
        </Modal.Container>
    </Modal>
  );
}
