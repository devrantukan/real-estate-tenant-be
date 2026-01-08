"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteContactForm,
  updateContactForm,
} from "@/lib/actions/contact-form";
import { toast } from "sonner";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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
      router.refresh();
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
        router.refresh();
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
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İsim</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Mesaj</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactForms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Form bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              contactForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    {`${form.firstName} ${form.lastName}`}
                  </TableCell>
                  <TableCell>{form.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{form.message}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-[100px] justify-between">
                          {form.status === "PENDING"
                            ? "Bekliyor"
                            : form.status === "PROCESSED"
                              ? "İşlendi"
                              : "Reddedildi"}
                          <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleStatusChange(form.id, "PENDING")}>
                          Bekliyor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(form.id, "PROCESSED")}>
                          İşlendi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(form.id, "REJECTED")}>
                          Reddedildi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    {new Date(form.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => handleDelete(form.id)}
                    >
                      {isDeleting ? "Siliniyor..." : "Sil"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600">
            Sayfa {currentPage} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  );
}
