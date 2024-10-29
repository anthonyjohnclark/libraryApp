import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { IBookDetails } from "../BookDetails";
import { useModal } from "../../../../hooks/GlobalHooks/useModalHook";
import useAPIRequest from "../../../../hooks/GlobalHooks/useAPIRequest";
import AsyncComponent from "../../../hoc/AsyncComponent";
import agent from "../../../../api/agent";

interface EditBookModalProps {
  book: IBookDetails;
  fetchBookDetails: (id: string) => Promise<void>;
}

interface EditBookForm {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isAvailable: boolean;
  publisher: string;
  publicationDate: string;
  category: string;
  isbn: string;
  pageCount: number;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  book,
  fetchBookDetails,
}) => {
  const { handleClose } = useModal();
  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();

  const { register, handleSubmit } = useForm<EditBookForm>({
    defaultValues: {
      title: book.title,
      author: book.author,
      description: book.description,
      coverImage: book.coverImage,
      isAvailable: book.isAvailable,
      publisher: book.publisher,
      publicationDate: new Date(book.publicationDate)
        .toISOString()
        .substring(0, 10), // Convert to yyyy-mm-dd format
      category: book.category,
      isbn: book.isbn,
      pageCount: book.pageCount,
    },
  });

  const onSubmit = async (data: EditBookForm) => {
    const updatedBookData = { ...book, ...data };
    await executeAPIRequest(() =>
      agent.Books.editBook(book.id, updatedBookData)
    ).then((result) => {
      if (result?.isSuccess) {
        fetchBookDetails(book.id.toString());
      }
    });

    handleClose(); // Close modal after successful submission
  };

  return (
    <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control {...register("title")} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control {...register("author")} />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("description")}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control {...register("coverImage")} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Publisher</Form.Label>
              <Form.Control {...register("publisher")} />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Publication Date</Form.Label>
              <Form.Control type="date" {...register("publicationDate")} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control {...register("category")} />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>ISBN</Form.Label>
              <Form.Control {...register("isbn")} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Page Count</Form.Label>
              <Form.Control type="number" {...register("pageCount")} />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </Form>
    </AsyncComponent>
  );
};

export default EditBookModal;
