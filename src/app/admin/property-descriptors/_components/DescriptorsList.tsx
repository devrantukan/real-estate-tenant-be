"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PropertyDescriptor,
  PropertyDescriptorCategory,
  PropertyType,
} from "@prisma/client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddCategoryModal from "./AddCategoryModal";
import AddDescriptorModal from "./AddDescriptorModal";
import EditCategoryModal from "./EditCategoryModal";
import EditDescriptorModal from "./EditDescriptorModal";
import DeleteDialog from "./DeleteDialog";
import {
  deleteCategory,
  deleteDescriptor,
} from "@/lib/actions/property-descriptor";
import { useRouter } from "next/navigation";

interface Props {
  initialCategories: (PropertyDescriptorCategory & {
    type: { id: number; value: string };
  })[];
  initialDescriptors: (PropertyDescriptor & {
    category: PropertyDescriptorCategory;
  })[];
  propertyTypes: PropertyType[];
}

export default function DescriptorsList({
  initialCategories,
  initialDescriptors,
  propertyTypes,
}: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [descriptors, setDescriptors] = useState(initialDescriptors);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddDescriptor, setShowAddDescriptor] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<PropertyDescriptorCategory | null>(null);
  const [editingDescriptor, setEditingDescriptor] =
    useState<PropertyDescriptor | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<number | null>(null);
  const [deletingDescriptor, setDeletingDescriptor] = useState<number | null>(
    null
  );
  const router = useRouter();

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory);
      setCategories(categories.filter((c) => c.id !== deletingCategory));
      toast.success("Kategori başarıyla silindi", {
        position: "top-right",
        autoClose: 3000,
      });
      setDeletingCategory(null);
    } catch (error) {
      toast.error("Kategori silinirken bir hata oluştu", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteDescriptor = async () => {
    if (!deletingDescriptor) return;
    try {
      await deleteDescriptor(deletingDescriptor);
      setDescriptors(descriptors.filter((d) => d.id !== deletingDescriptor));
      toast.success("Tanımlayıcı başarıyla silindi", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setDeletingDescriptor(null);
      // window.location.assign("/admin/property-descriptors");
      router.refresh();
    } catch (error) {
      toast.error("Tanımlayıcı silinirken bir hata oluştu", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCategorySuccess = (newCategory: any) => {
    setCategories((prev) => [...prev, newCategory]);
    router.refresh();
  };

  const handleDescriptorSuccess = (newDescriptor: any) => {
    setDescriptors((prev) => [...prev, newDescriptor]);
    router.refresh();
  };

  const handleCategoryEdit = (updatedCategory: any) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
    router.refresh();
  };

  const handleDescriptorEdit = (updatedDescriptor: any) => {
    setDescriptors((prev) =>
      prev.map((desc) =>
        desc.id === updatedDescriptor.id ? updatedDescriptor : desc
      )
    );
    router.refresh();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button onClick={() => setShowAddCategory(true)}>
            Yeni Kategori Ekle
          </Button>
          <Button onClick={() => setShowAddDescriptor(true)}>
            Yeni Tanımlayıcı Ekle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories Table */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Mülk Tipi</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                      >
                        Kategori bulunamadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.value}
                        </TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.type?.value || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditingCategory(category)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => setDeletingCategory(category.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Descriptors Table */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Tanımlayıcılar</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {descriptors.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                      >
                        Tanımlayıcı bulunamadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    descriptors.map((descriptor) => (
                      <TableRow key={descriptor.id}>
                        <TableCell className="font-medium">
                          {descriptor.value}
                        </TableCell>
                        <TableCell>{descriptor.slug}</TableCell>
                        <TableCell>
                          {descriptor.category?.value || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditingDescriptor(descriptor)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() =>
                                setDeletingDescriptor(descriptor.id)
                              }
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddCategoryModal
          open={showAddCategory}
          onClose={() => setShowAddCategory(false)}
          propertyTypes={propertyTypes}
          onSuccess={handleCategorySuccess}
        />
        <AddDescriptorModal
          open={showAddDescriptor}
          onClose={() => setShowAddDescriptor(false)}
          categories={categories}
          onSuccess={handleDescriptorSuccess}
        />
        {editingCategory && (
          <EditCategoryModal
            category={editingCategory}
            propertyTypes={propertyTypes}
            onClose={() => setEditingCategory(null)}
            onSuccess={handleCategoryEdit}
          />
        )}
        {editingDescriptor && (
          <EditDescriptorModal
            descriptor={editingDescriptor}
            categories={categories}
            onClose={() => setEditingDescriptor(null)}
            onSuccess={handleDescriptorEdit}
          />
        )}

        {/* Delete Confirmation Modals */}
        <DeleteDialog
          open={!!deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onConfirm={handleDeleteCategory}
          title="Kategoriyi Sil"
          description="Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        />

        <DeleteDialog
          open={!!deletingDescriptor}
          onClose={() => setDeletingDescriptor(null)}
          onConfirm={handleDeleteDescriptor}
          title="Tanımlayıcıyı Sil"
          description="Bu tanımlayıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        />
      </div>
      <ToastContainer />
    </>
  );
}
