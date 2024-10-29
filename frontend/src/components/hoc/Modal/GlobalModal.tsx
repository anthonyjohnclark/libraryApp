import ModalContent from "./ModalContent";
import { Modal } from "react-bootstrap";
import { useModal } from "../../../hooks/GlobalHooks/useModalHook";

const GlobalModal = () => {
  const modal = useModal();

  return (
    <Modal
      centered
      show={modal.show}
      onHide={modal.handleClose}
      style={{ maxWidth: "90vw" }}
      onExited={modal.onModalHidden}
    >
      <ModalContent
        handleClose={modal.handleClose}
        modalTitle={modal.modalContent.modalTitle}
        modalBody={modal.modalContent.modalBody}
        continueButtonText={modal.modalContent.continueButtonText}
        modalAction={modal.modalContent.modalAction}
        confirmButton={modal.modalContent.confirmButton}
        showConfirmButton={modal.modalContent.showConfirmButton}
        showCancelButton={modal.modalContent.showCancelButton}
        cancelButtonText={modal.modalContent.cancelButtonText}
      ></ModalContent>
    </Modal>
  );
};

export default GlobalModal;
