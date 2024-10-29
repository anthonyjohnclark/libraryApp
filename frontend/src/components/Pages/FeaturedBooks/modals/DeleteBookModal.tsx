import React from "react";
import { Button } from "react-bootstrap";
import { IBookDetails } from "../BookDetails";
import { useModal } from "../../../../hooks/GlobalHooks/useModalHook";
import useAPIRequest from "../../../../hooks/GlobalHooks/useAPIRequest";
import agent from "../../../../api/agent";
import AsyncComponent from "../../../hoc/AsyncComponent";
import { useNavigate } from "react-router-dom";

interface DeleteBookModalProps {
  book: IBookDetails;
}

const DeleteBookModal: React.FC<DeleteBookModalProps> = ({ book }) => {
  const { handleClose } = useModal();
  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await executeAPIRequest(() => agent.Books.deleteBook(book.id));
    handleClose();
    navigate("/books/featured"); // Redirect to the book list after deletion
  };

  return (
    <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
      <p>
        Are you sure you want to delete <strong>{book.title}</strong> by{" "}
        <strong>{book.author}</strong>?
      </p>
      <Button
        onClick={handleDelete}
        type="submit"
        variant="danger"
        className="mt-3"
      >
        Confirm Delete
      </Button>
    </AsyncComponent>
  );
};

export default DeleteBookModal;
