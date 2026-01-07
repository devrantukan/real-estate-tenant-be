"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "@heroicons/react/16/solid";
import FileInput from "@/app/components/fileUpload";
import {
  getOfficeWorkerDetails,
} from "@/app/actions/updateAvatar";
import { useRouter } from "next/navigation";

const UploadAvatar = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!image) {
      setIsOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const officeWorker = await getOfficeWorkerDetails(userId);
      console.log("Ready to upload for:", officeWorker.name);
      setIsOpen(false);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="mt-2 text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <PencilIcon className="w-4 h-4" />
          <span>Fotoğrafı Değiştir</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profil Fotoğrafı Yükle</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <FileInput
            onChange={(e) => setImage((e as any).target.files[0])}
            className="h-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            İptal
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={handleUpload}
          >
            {isSubmitting ? "Yükleniyor..." : "Yükle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadAvatar;
