// AddBookModal.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Row, Col } from "react-bootstrap";
import useAPIRequest from "../../../../hooks/GlobalHooks/useAPIRequest";
import agent from "../../../../api/agent";
import { useModal } from "../../../../hooks/GlobalHooks/useModalHook";
import AsyncComponent from "../../../hoc/AsyncComponent";

interface AddBookFormInputs {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  publisher: string;
  publicationDate: string;
  category: string;
  isbn: string;
  pageCount: number;
}

interface AddBookModalProps {
  fetchBooks: () => Promise<void>;
}

const AddBookModal = ({ fetchBooks }: AddBookModalProps) => {
  const { handleClose } = useModal();
  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddBookFormInputs>();

  const onSubmit = async (data: AddBookFormInputs) => {
    await executeAPIRequest(() => agent.Books.addBook(data));
    fetchBooks();
    handleClose();
  };

  return (
    <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-danger">{errors.title.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="author">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                {...register("author", { required: "Author is required" })}
              />
              {errors.author && (
                <p className="text-danger">{errors.author.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="coverImage">
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control type="url" {...register("coverImage")} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="publisher">
              <Form.Label>Publisher</Form.Label>
              <Form.Control type="text" {...register("publisher")} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="publicationDate">
              <Form.Label>Publication Date</Form.Label>
              <Form.Control
                type="date"
                {...register("publicationDate", {
                  required: "Publication Date is required",
                })}
              />
              {errors.publicationDate && (
                <p className="text-danger">{errors.publicationDate.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" {...register("category")} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="isbn">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                {...register("isbn", { required: "ISBN is required" })}
              />
              {errors.isbn && (
                <p className="text-danger">{errors.isbn.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="pageCount">
              <Form.Label>Page Count</Form.Label>
              <Form.Control
                type="number"
                {...register("pageCount", {
                  required: "Page count is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Page count must be at least 1" },
                })}
              />
              {errors.pageCount && (
                <p className="text-danger">{errors.pageCount.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...register("description", {
              required: "Description is required",
              maxLength: {
                value: 2000,
                message: "Max length is 2000 characters",
              },
            })}
          />
          {errors.description && (
            <p className="text-danger">{errors.description.message}</p>
          )}
        </Form.Group>
        <Button type="submit" variant="primary">
          Add Book
        </Button>
      </Form>
    </AsyncComponent>
  );
};

export default AddBookModal;
