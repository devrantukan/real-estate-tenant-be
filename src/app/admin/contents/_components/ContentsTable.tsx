"use client";

import {
  Input,
  Button,
  Modal,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { useDeleteContent } from "@/hooks/useDeleteContent";
import { toast } from "sonner";

interface Content {
  id: number;
  key: string;
  value: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentsTableProps {
  contents: Content[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  searchTerm: string;
}

export default function ContentsTable({
  contents,
  totalPages,
  currentPage,
  totalCount,
  searchTerm,
}: ContentsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false); const onOpen = () => setIsOpen(true); const onClose = () => setIsOpen(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { mutate: deleteContent, isLoading: isDeleting } = useDeleteContent();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("pagenum", "1");
    router.push(`/admin/contents?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagenum", page.toString());
    router.push(`/admin/contents?${params.toString()}`);
  };

  const handleEdit = (content: Content) => {
    router.push(`/admin/contents/${content.id}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedContent) return;

    try {
      await deleteContent(selectedContent.id, {
        onSuccess: () => {
          toast.success("İçerik başarıyla silindi");
          router.refresh();
        },
        onError: () => {
          toast.error("İçerik silinirken bir hata oluştu");
        },
      });
    } finally {
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="İçerik ara..."
          
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ANAHTAR</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEĞER</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AÇIKLAMA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SON GÜNCELLEME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  İçerik bulunamadı
                </td>
              </tr>
            ) : (
              contents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{content.key}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div
                      className="max-w-md line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: content.value }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{content.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(content.updatedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() => handleEdit(content)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="danger-soft"
                        onPress={() => {
                          setSelectedContent(content);
                          onOpen();
                        }}
                        isDisabled={isDeleting}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
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

      <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>İçerik Sil</Modal.Header>
            <Modal.Body>
              <p>
                <strong>{selectedContent?.key}</strong> anahtarlı içeriği silmek
                istediğinizden emin misiniz?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={onClose}>
                İptal
              </Button>
              <Button
                variant="danger"
                onPress={handleDelete}
                isDisabled={isDeleting}
              >
                Sil
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
}
