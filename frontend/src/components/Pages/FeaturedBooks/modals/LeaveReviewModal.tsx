import { useForm, Controller } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import useAPIRequest from "../../../../hooks/GlobalHooks/useAPIRequest";
import { useModal } from "../../../../hooks/GlobalHooks/useModalHook";
import { useIdentity } from "../../../../hooks/GlobalHooks/useIdentityHook";
import agent from "../../../../api/agent";
import AsyncComponent from "../../../hoc/AsyncComponent";

interface LeaveReviewModalProps {
  bookId: number;
  fetchBookDetails: (id: string) => Promise<void>;
}

interface ReviewFormInputs {
  rating: number;
  message: string;
}

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  bookId,
  fetchBookDetails,
}) => {
  const { register, handleSubmit, control, reset } =
    useForm<ReviewFormInputs>();
  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();
  const { handleClose } = useModal();
  const { loggedInUser } = useIdentity();

  const onSubmit = async (data: ReviewFormInputs) => {
    const reviewData = {
      bookId,
      rating: data.rating,
      message: data.message,
      customerId: loggedInUser?.id, // Add CustomerId from loggedInUser
    };

    await executeAPIRequest(() => agent.Books.addReview(reviewData)).then(
      (result) => {
        if (result?.isSuccess) {
          fetchBookDetails(reviewData.bookId.toString());
        }
      }
    );
    handleClose();
    reset(); // Reset the form after submission
  };

  return (
    <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="rating">
          <Form.Label>Rating</Form.Label>
          <Controller
            name="rating"
            control={control}
            defaultValue={1}
            rules={{ required: true, min: 1, max: 5 }}
            render={({ field }) => (
              <Form.Control
                type="number"
                min="1"
                max="5"
                {...field}
                placeholder="Rate between 1 and 5"
              />
            )}
          />
        </Form.Group>

        <Form.Group controlId="message" className="mt-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            maxLength={2000}
            placeholder="Leave a message (max 2000 characters)"
            {...register("message", { required: true, maxLength: 2000 })}
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Submit Review
        </Button>
      </Form>
    </AsyncComponent>
  );
};

export default LeaveReviewModal;
