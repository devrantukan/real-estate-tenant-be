"use client";
import { deleteProperty } from "@/lib/actions/property";
import {
  Button,
  Modal,
} from "@heroui/react";

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

  const handldeDelete = async () => {
    try {
      await deleteProperty(Number(params.id));

      //  router.push("/user/properties");
      router.refresh();

      setIsOpen(false);
    } catch (e) {
      throw e;
    }
  };

  const handleCancel = () => {
    //  router.push("/user/properties");
    window.location.assign("/user/properties");
    setIsOpen(false);
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={handleCancel}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.Header className="flex flex-col gap-1">İlanı Sil</Modal.Header>
          <Modal.Body>
            <p>İlanı silmek istediğinizden emin misiniz?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCancel}>İptal</Button>
            <Button onClick={handldeDelete} variant="danger-soft">
              Sil
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
};

export default ModalDeletePropertyPage;
