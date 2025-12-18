import {
  Modal,
  Button,
} from "@heroui/react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: Props) {
  return (
    <Modal isOpen={open} onOpenChange={onClose}>
      <Modal.Container>
          <Modal.Dialog>
        {(renderProps) => {
          const handleClose = () => {
            onClose();
          };
          const handleConfirm = () => {
            onConfirm();
          };
          return (
            <>
              <Modal.Header>{title}</Modal.Header>
              <Modal.Body>{description}</Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onClick={handleClose}>
                  İptal
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                  Sil
                </Button>
              </Modal.Footer>
            </>
          );
        }}
      </Modal.Dialog>
        </Modal.Container>
    </Modal>
  );
}
