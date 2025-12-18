"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@heroui/react";
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
import {
  Modal,
} from "@heroui/react";
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

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Kategori başarıyla silindi", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Kategori silinirken bir hata oluştu", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteDescriptor = async (id: number) => {
    try {
      await deleteDescriptor(id);
      setDescriptors(descriptors.filter((d) => d.id !== id));
      toast.success("Tanımlayıcı başarıyla silindi", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      window.location.assign("/admin/property-descriptors");
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
          <Button variant="primary" onPress={() => setShowAddCategory(true)}>
            Yeni Kategori Ekle
          </Button>
          <Button variant="primary" onPress={() => setShowAddDescriptor(true)}>
            Yeni Tanımlayıcı Ekle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories Table */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mülk Tipi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Kategori bulunamadı
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.type?.value || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="ghost"
                              onPress={() => setEditingCategory(category)}
                            >
                              <PencilIcon />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="danger-soft"
                              onClick={() => setDeletingCategory(category.id)}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Descriptors Table */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Tanımlayıcılar</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {descriptors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Tanımlayıcı bulunamadı
                      </td>
                    </tr>
                  ) : (
                    descriptors.map((descriptor) => (
                      <tr key={descriptor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{descriptor.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{descriptor.slug}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{descriptor.category?.value || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="ghost"
                              onPress={() => setEditingDescriptor(descriptor)}
                            >
                              <PencilIcon />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="danger-soft"
                              onClick={() => setDeletingDescriptor(descriptor.id)}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
        <Modal
          isOpen={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
        >
          <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>Kategoriyi Sil</Modal.Header>
            <Modal.Body>
              Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={() => setDeletingCategory(null)}>
                İptal
              </Button>
              <Button
                variant="danger"
                onPress={() => {
                  if (deletingCategory) handleDeleteCategory(deletingCategory);
                  setDeletingCategory(null);
                }}
              >
                Sil
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
        </Modal>

        <Modal
          isOpen={!!deletingDescriptor}
          onOpenChange={(open) => !open && setDeletingDescriptor(null)}
        >
          <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>Tanımlayıcıyı Sil</Modal.Header>
            <Modal.Body>
              Bu tanımlayıcıyı silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="ghost"
                onPress={() => setDeletingDescriptor(null)}
              >
                İptal
              </Button>
              <Button
                variant="danger"
                onPress={() => {
                  if (deletingDescriptor)
                    handleDeleteDescriptor(deletingDescriptor);
                  setDeletingDescriptor(null);
                }}
              >
                Sil
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
}
