"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
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
        <div className="relative w-64">
          {/* Added icon for better UX since HeroUI Input might have had one */}
          <Input
            placeholder="İçerik ara..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ANAHTAR</TableHead>
              <TableHead>DEĞER</TableHead>
              <TableHead>AÇIKLAMA</TableHead>
              <TableHead>SON GÜNCELLEME</TableHead>
              <TableHead>İŞLEMLER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  İçerik bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              contents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium text-gray-900">{content.key}</TableCell>
                  <TableCell>
                    <div
                      className="max-w-md line-clamp-2 text-sm text-gray-500"
                      dangerouslySetInnerHTML={{ __html: content.value }}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{content.description}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(content.updatedAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(content)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                          setSelectedContent(content);
                          onOpen();
                        }}
                        disabled={isDeleting}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
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

      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İçerik Sil</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedContent?.key}</strong> anahtarlı içeriği silmek
              istediğinizden emin misiniz?
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
