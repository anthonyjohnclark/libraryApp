import React, { useState, useContext, createContext, ReactNode } from "react";

export interface IModalContent {
  modalTitle: string;
  continueButtonText: string;
  modalBody: ReactNode;
  modalAction?: any;
  cancelButtonText?: string | undefined;
  confirmButton?: boolean;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  show?: boolean;
  returnButton?: boolean;
}

export interface IModalContext {
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
  renderModal: (modal: IModalContent) => void;
  resetModal: () => void;
  modalContent: IModalContent;
  handleSetModalFunction: any;
  onModalHidden: () => void;
}

const modalContext = createContext<IModalContext>({} as IModalContext);

interface Props {
  children: React.ReactNode;
}

export const useModal = (): IModalContext => {
  return useContext(modalContext);
};

export const ProvideModal = ({ children }: Props): JSX.Element => {
  const identity = useProvideModal();
  return (
    <modalContext.Provider value={identity}>{children}</modalContext.Provider>
  );
};

const useProvideModal = () => {
  const [show, setShow] = useState(false);

  const [modalContent, setModalContent] = useState<IModalContent>({
    modalTitle: "",
    modalBody: (<></>) as ReactNode,
    continueButtonText: "",
    confirmButton: false,
    showConfirmButton: false,
    modalAction: null,
    showCancelButton: true,
    cancelButtonText: "",
    show: false,
    returnButton: false,
  });

  // Hide the modal without resetting the content
  const handleClose = () => {
    setShow(false);
  };

  // Called after the hide animation ends to reset the content
  const onModalHidden = () => {
    setModalContent({
      modalTitle: "",
      modalBody: (<></>) as ReactNode,
      continueButtonText: "",
      confirmButton: false,
      showConfirmButton: false,
      modalAction: null,
      showCancelButton: true,
      cancelButtonText: "",
      show: false,
      returnButton: false,
    });
  };

  const handleShow = () => setShow(true);

  const [prevModalContent, setPrevModalContent] =
    useState<IModalContent>(modalContent);

  const renderModal = (newModalContent: IModalContent) => {
    setShow(true);

    setPrevModalContent(modalContent);

    setModalContent(newModalContent);
  };

  const resetModal = () => {
    setModalContent(prevModalContent);
  };

  const handleSetModalFunction = (modalAction: () => unknown) => {
    setModalContent({
      ...modalContent,
      modalAction: modalAction,
    });
  };

  return {
    show,
    handleClose,
    handleShow,
    renderModal,
    modalContent,
    setModalContent,
    resetModal,
    handleSetModalFunction,
    onModalHidden,
  };
};
