"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteContactForm,
  updateContactForm,
} from "@/lib/actions/contact-form";
import { toast } from "sonner";

export default function ContactFormsTable({
  contactForms,
  currentPage,
  totalPages,
}: {
  contactForms: any[];
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (
    id: string,
    status: "PENDING" | "PROCESSED" | "REJECTED"
  ) => {
    try {
      await updateContactForm(id, { status });
      toast.success("Durum güncellendi");
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu formu silmek istediğinizden emin misiniz?")) {
      setIsDeleting(true);
      try {
        await deleteContactForm(id);
        toast.success("Form silindi");
      } catch (error) {
        toast.error("Bir hata oluştu");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/admin/contact-forms?pagenum=${page}`);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İsim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesaj</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contactForms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Form bulunamadı
                </td>
              </tr>
            ) : (
              contactForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {`${form.firstName} ${form.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {form.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {form.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="secondary" size="sm">
                          {form.status}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Status actions"
                        onAction={(key) =>
                          handleStatusChange(
                            form.id,
                            key.toString() as "PENDING" | "PROCESSED" | "REJECTED"
                          )
                        }
                      >
                        <DropdownItem key="PENDING">Bekliyor</DropdownItem>
                        <DropdownItem key="PROCESSED">İşlendi</DropdownItem>
                        <DropdownItem key="REJECTED">Reddedildi</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(form.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="danger"
                      size="sm"
                      isDisabled={isDeleting}
                      onPress={() => handleDelete(form.id)}
                    >
                      {isDeleting ? "Siliniyor..." : "Sil"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="ghost"
            onPress={() => handlePageChange(Math.max(1, currentPage - 1))}
            isDisabled={currentPage === 1}
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600">
            Sayfa {currentPage} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onPress={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            isDisabled={currentPage === totalPages}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  );
}
