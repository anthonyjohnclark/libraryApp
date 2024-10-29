import React from "react";
import { Button } from "react-bootstrap";
import dayjs from "dayjs";
import { IBookDetails } from "../BookDetails";
import { useModal } from "../../../../hooks/GlobalHooks/useModalHook";
import useAPIRequest from "../../../../hooks/GlobalHooks/useAPIRequest";
import agent from "../../../../api/agent";
import AsyncComponent from "../../../hoc/AsyncComponent";
import { useIdentity } from "../../../../hooks/GlobalHooks/useIdentityHook";

interface CheckoutModalProps {
  book: IBookDetails;
  fetchBookDetails: (id: string) => Promise<void>;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  book,
  fetchBookDetails,
}) => {
  const { handleClose } = useModal();
  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();
  const user = useIdentity();

  const dueDate = dayjs().add(5, "days").format("MM/DD/YYYY");

  const handleCheckout = async () => {
    await executeAPIRequest(() =>
      agent.Books.checkoutBook(book.id, user.loggedInUser?.id)
    ).then((result) => {
      if (result?.isSuccess) {
        fetchBookDetails(book.id.toString());
      }
    });
    handleClose();
  };

  return (
    <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
      Are you sure you want to check out <strong>{book.title}</strong> by{" "}
      <strong>{book.author}</strong>?
      <p>
        The book is due on <strong>{dueDate}</strong>.
      </p>
      <Button
        onClick={() => {
          handleCheckout();
        }}
        type="submit"
        variant="primary"
        className="mt-3"
      >
        Checkout Book
      </Button>
    </AsyncComponent>
  );
};

export default CheckoutModal;
