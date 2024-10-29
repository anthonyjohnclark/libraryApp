import { ReactNode } from "react";
import { Button, Container, Modal } from "react-bootstrap";

import classes from "./ModalStyles.module.css";

type Props = {
  handleClose: (() => void) | undefined;
  modalTitle: string | undefined;
  modalBody: ReactNode;
  continueButtonText: string | undefined;
  modalAction: () => any;
  confirmButton?: boolean | undefined;
  showConfirmButton?: boolean | undefined;
  showCancelButton?: boolean | undefined;
  cancelButtonText?: string | undefined;
};

const ModalContent = ({
  handleClose,
  modalTitle,
  modalBody,
  continueButtonText,
  modalAction,
  confirmButton,
  showConfirmButton,
  showCancelButton,
  cancelButtonText,
}: Props) => {
  return (
    <Container className={classes.ModalStyles}>
      <Modal.Header className={classes.ModalHeader}>
        <Modal.Title>
          <h1>{modalTitle}</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={classes.ModalBody}>{modalBody as any}</Modal.Body>
      <Modal.Footer className={classes.ModalFooter}>
        {showCancelButton ? (
          <Button variant="secondary" onClick={handleClose}>
            {cancelButtonText}
          </Button>
        ) : null}
        {showConfirmButton ? (
          <Button
            variant={confirmButton ? "danger" : "primary"}
            onClick={() => {
              modalAction();
            }}
          >
            {continueButtonText}
          </Button>
        ) : null}
      </Modal.Footer>
    </Container>
  );
};

export default ModalContent;
