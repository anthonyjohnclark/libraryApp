import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, Badge, Button } from "react-bootstrap";
import AsyncComponent from "../../hoc/AsyncComponent";
import styles from "./BookDetails.module.css";
import { useIdentity } from "../../../hooks/GlobalHooks/useIdentityHook";
import { useModal } from "../../../hooks/GlobalHooks/useModalHook";
import BookCheckoutModal from "./modals/BookCheckoutModal";
import LeaveReviewModal from "./modals/LeaveReviewModal";
import DeleteBookModal from "./modals/DeleteBookModal";
import EditBookModal from "./modals/EditBookModal";
import ReturnBookModal from "./modals/ReturnBookModal"; // Import the new ReturnBookModal
import useAPIRequest from "../../../hooks/GlobalHooks/useAPIRequest";
import agent from "../../../api/agent";
import { Book } from "./FeaturedBooks";

export interface IBookDetails {
  id: number;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  averageRating: number;
  publisher: string;
  publicationDate: string;
  category: string;
  isbn: string;
  pageCount: number;
  customerReviews: ICustomerReview[];
  isAvailable: boolean;
}

interface ICustomerReview {
  customerName: string;
  rating: number;
  message: string;
}

const BookDetails = () => {
  const [book, setBook] = useState<IBookDetails>();

  const { id } = useParams<{ id: string }>();
  const { loggedInUser } = useIdentity();
  const { renderModal } = useModal();
  const navigate = useNavigate();
  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();

  const fetchBookDetails = async (id: string) => {
    const response = await executeAPIRequest<IBookDetails>(() =>
      agent.Books.getBookDetails(id)
    );
    if (response) setBook(response.value);
  };

  useEffect(() => {
    if (id) fetchBookDetails(id);
  }, [id]);

  const handleLeaveReview = () => {
    renderModal({
      modalTitle: "Leave a Review",
      modalBody: (
        <LeaveReviewModal
          bookId={book?.id!}
          fetchBookDetails={fetchBookDetails}
        />
      ),
      confirmButton: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Close",
      continueButtonText: "",
    });
  };

  const handleCheckoutBook = () => {
    renderModal({
      modalTitle: "Check Out Book",
      modalBody: (
        <BookCheckoutModal book={book!} fetchBookDetails={fetchBookDetails} />
      ),
      confirmButton: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Close",
      continueButtonText: "",
    });
  };

  const handleEditBook = () => {
    renderModal({
      modalTitle: "Edit Book",
      modalBody: (
        <EditBookModal book={book!} fetchBookDetails={fetchBookDetails} />
      ),
      confirmButton: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Close",
      continueButtonText: "",
    });
  };

  const handleDeleteBook = () => {
    renderModal({
      modalTitle: "Delete Book",
      modalBody: <DeleteBookModal book={book!} />,
      confirmButton: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Close",
      continueButtonText: "",
    });
  };

  const handleReturnBook = () => {
    renderModal({
      modalTitle: "Return Book",
      modalBody: (
        <ReturnBookModal book={book!} fetchBookDetails={fetchBookDetails} />
      ),
      confirmButton: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Close",
      continueButtonText: "",
    });
  };

  return (
    <>
      <Button
        variant="link"
        onClick={() => navigate("/books/featured")}
        className="mb-3"
      >
        Back to Featured Book List
      </Button>

      <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
        {book ? (
          <div className={styles.container}>
            <Row>
              <Col md={4}>
                <Image
                  src={book.coverImage}
                  className={styles.coverImage}
                  alt={book.title}
                />
              </Col>
              <Col md={8}>
                <h2>{book.title}</h2>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>
                  <strong>Category:</strong> {book.category}
                </p>
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <p>
                  <strong>Publisher:</strong> {book.publisher}
                </p>
                <p>
                  <strong>Publication Date:</strong>{" "}
                  {new Date(book.publicationDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Page Count:</strong> {book.pageCount}
                </p>
                <p>
                  <strong>Average Rating:</strong>{" "}
                  {book.averageRating.toFixed(2)}
                </p>
                <p className={styles.status}>
                  <strong>Status:</strong>{" "}
                  {book.isAvailable ? (
                    <Badge bg="success">Available</Badge>
                  ) : (
                    <Badge bg="danger">Unavailable</Badge>
                  )}
                </p>
                {loggedInUser?.role === "Customer" && book.isAvailable && (
                  <Button
                    variant="primary"
                    className="ms-2"
                    onClick={handleCheckoutBook}
                  >
                    Check Out Book
                  </Button>
                )}
                {loggedInUser?.role === "Customer" && (
                  <Button
                    variant="secondary"
                    onClick={handleLeaveReview}
                    className="ms-2"
                  >
                    Leave a Review
                  </Button>
                )}
                {loggedInUser?.role === "Librarian" && (
                  <>
                    <Button
                      variant="danger"
                      onClick={handleDeleteBook}
                      className="ms-2"
                    >
                      Delete Book
                    </Button>
                    <Button
                      variant="warning"
                      onClick={handleEditBook}
                      className="ms-2"
                    >
                      Edit Book
                    </Button>
                    {!book.isAvailable && (
                      <Button
                        variant="success"
                        onClick={handleReturnBook}
                        className="ms-2"
                      >
                        Mark as Returned
                      </Button>
                    )}
                  </>
                )}
              </Col>
            </Row>

            <div className={styles.details}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p>{book.description}</p>
            </div>

            <div className={styles.details}>
              <h3 className={styles.sectionTitle}>Customer Reviews</h3>
              {book.customerReviews.length > 0 ? (
                book.customerReviews.map((review, index) => (
                  <div key={index} className={styles.reviewItem}>
                    <p>
                      <strong>Reviewer:</strong> {review.customerName}
                    </p>
                    <p>
                      <strong>Rating:</strong> {review.rating}
                    </p>
                    <p>
                      <strong>Comment:</strong> {review.message}
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews available.</p>
              )}
            </div>
          </div>
        ) : (
          <div>Loading book details...</div>
        )}
      </AsyncComponent>
    </>
  );
};

export default BookDetails;
