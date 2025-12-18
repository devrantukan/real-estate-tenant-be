"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  
} from "@heroui/react";
import { PencilIcon } from "@heroicons/react/16/solid";
import FileInput from "@/app/components/fileUpload";
import {
  getOfficeWorkerDetails,
  updateAvatarInDb,
} from "@/app/actions/updateAvatar";
import { uploadAvatar } from "@/lib/upload";
import { useRouter } from "next/navigation";

const UploadAvatar = ({ userId }: { userId: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [image, setImage] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!image) {
      onOpenChange();
      return;
    }

    setIsSubmitting(true);
    try {
      const officeWorker = await getOfficeWorkerDetails(userId);

      // Get the new avatar URL
      // const newUrl = await uploadAvatar(
      //   image,
      //   officeWorker.name,
      //   officeWorker.surname
      // );

      // Only update if the URL has changed
      // if (newUrl !== officeWorker.avatarUrl) {
      //   await updateAvatarInDb(userId, newUrl);
      //   router.refresh();
      // }

      onOpenChange();
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button onClick={onOpen}>
        <PencilIcon className="w-6 text-slate-400 hover:text-primary transition-colors hidden " />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header className="flex flex-col gap-1">
              Profil Fotoğrafı Yükle
            </Modal.Header>
            <Modal.Body>
              <FileInput
                onChange={(e) => setImage((e as any).target.files[0])}
                className="h-full"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger-soft" onPress={onOpenChange}>
                İptal
              </Button>
              <Button
                isDisabled={isSubmitting}
                variant="primary"
                onPress={handleUpload}
              >
                Fotoğrafı Değiştir
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
};

export default UploadAvatar;
