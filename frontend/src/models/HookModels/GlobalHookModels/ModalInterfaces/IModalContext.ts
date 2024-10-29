import { ReactNode } from "react";

export interface IModalContent {
  modalTitle: string;
  continueButtonText: string;
  modalBody: ReactNode;
  modalAction: () => any | null;
  cancelButtonText?: string | undefined;
  confirmButton?: boolean;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
}

export interface IModalContext {
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
  renderModal: (
    modalTitle: string,
    continueButtonText: string,
    modalBody: ReactNode,
    modalAction: () => any,
    cancelButtonText?: string | undefined,
    confirmButton?: boolean,
    showConfirmButton?: boolean,
    showCancelButton?: boolean
  ) => void;
  modalContent: IModalContent;
  onModalHidden: () => void;
}
