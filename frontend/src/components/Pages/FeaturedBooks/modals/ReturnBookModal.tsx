import React from "react";
import { Button } from "react-bootstrap";
import { IBookDetails } from "../BookDetails";
import { useModal } from "../../../../hooks/GlobalHooks/useModalHook";
import useAPIRequest from "../../../../hooks/GlobalHooks/useAPIRequest";
import agent from "../../../../api/agent";
import AsyncComponent from "../../../hoc/AsyncComponent";

interface ReturnBookModalProps {
  book: IBookDetails;
  fetchBookDetails: (id: string) => Promise<void>;
}

const ReturnBookModal: React.FC<ReturnBookModalProps> = ({
  book,
  fetchBookDetails,
}) => {
  const { handleClose } = useModal();
  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();

  const handleReturn = async () => {
    await executeAPIRequest(() => agent.Books.returnBook(book.id)).then(
      (result) => {
        if (result?.isSuccess) {
          fetchBookDetails(book.id.toString());
        }
      }
    );

    handleClose();
  };

  return (
    <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
      <h3>
        {" "}
        Are you sure you want to mark <strong>{book.title}</strong> as returned?
      </h3>
      <Button
        onClick={handleReturn}
        type="submit"
        variant="success"
        className="mt-3"
      >
        Confirm Return
      </Button>
    </AsyncComponent>
  );
};

export default ReturnBookModal;
