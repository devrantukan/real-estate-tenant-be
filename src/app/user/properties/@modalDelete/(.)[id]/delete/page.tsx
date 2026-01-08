"use client";
import { deleteProperty } from "@/lib/actions/property";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  params: { id: string };
}
const ModalDeletePropertyPage = ({ params }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleDelete = async () => {
    try {
      await deleteProperty(Number(params.id));
      router.refresh();
      setIsOpen(false);
    } catch (e) {
      throw e;
    }
  };

  const handleCancel = () => {
    window.location.assign("/user/properties");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleCancel();
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>İlanı Sil</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>İlanı silmek istediğinizden emin misiniz?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            İptal
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeletePropertyPage;
