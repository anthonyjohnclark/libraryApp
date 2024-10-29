import { useCallback, useEffect, useState } from "react";
import { useIdentity } from "../../../hooks/GlobalHooks/useIdentityHook";
import { useModal } from "../../../hooks/GlobalHooks/useModalHook";
import FeaturedBooksList from "./FeaturedBooksList";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AsyncComponent from "../../hoc/AsyncComponent";
import useAPIRequest from "../../../hooks/GlobalHooks/useAPIRequest";
import agent from "../../../api/agent";
import AddBookModal from "./modals/AddBookModal";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  averageRating: number;
  isAvailable: boolean;
}

export interface IQueryParams {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  title: string;
  authors: string[];
  isAvailable: boolean | undefined;
  sortBy: string;
  isSortAscending: boolean;
}

const FeaturedBooks = () => {
  const { renderModal } = useModal();
  const { loggedInUser } = useIdentity();

  const [books, setBooks] = useState<Book[]>([]);
  const [authorOptions, setAuthorOptions] = useState<any[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);

  const { executeAPIRequest, requestStatus, apiError } = useAPIRequest();

  // Fetch authors once on mount
  // Filter author options from stored `authorOptions`
  const loadAuthorOptions = (inputValue: string, callback: any) => {
    const filteredOptions = authorOptions.filter((author) =>
      author.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filteredOptions);
  };

  // Handle author selection from the autocomplete component
  const handleAuthorChange = (selectedOptions: any) => {
    console.log("hi");
    const authors = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    console.log(authors);
    console.log(selectedOptions);

    setSelectedAuthors(selectedOptions);
    updateQueryParams({
      ...queryParams,
      authors,
      currentPage: 1,
    });
  };

  // Fetch authors once on mount
  useEffect(() => {
    const fetchAuthors = async () => {
      const response = await executeAPIRequest(() => agent.Books.getAuthors());
      if (response) {
        const options = response.value.map((author: string) => ({
          value: author,
          label: author,
        }));
        setAuthorOptions(options);
      }
    };

    fetchAuthors();
  }, []);

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    title: "",
    authors: [],
    isAvailable: undefined, // This should match `boolean | undefined` type
    sortBy: "title",
    isSortAscending: true,
  });

  console.log("queryParams:", queryParams);

  // Fetch books based on all filters, sorting, pagination, and search
  const fetchBooks = useCallback(async () => {
    const {
      currentPage,
      itemsPerPage,
      title,
      authors,
      isAvailable,
      sortBy,
      isSortAscending,
    } = queryParams;
    const response = await executeAPIRequest<Book[]>(() =>
      agent.Books.getBooks({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        title,
        authors,
        isAvailable,
        sortBy,
        isSortAscending,
      })
    );

    if (response) {
      setBooks(response.value);
      setQueryParams((prev: any) => ({
        ...prev,
        totalItems: response?.paginationObject?.totalItems,
        totalPages: response?.paginationObject?.totalPages,
      }));
    }
  }, [
    queryParams.currentPage,
    queryParams.itemsPerPage,
    queryParams.title,
    queryParams.authors,
    queryParams.isAvailable,
    queryParams.sortBy,
    queryParams.isSortAscending,
  ]);

  const updateQueryParams = (newParams: Partial<IQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...newParams }));
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddBook = () => {
    renderModal({
      modalTitle: "Add a New Book",
      modalBody: <AddBookModal fetchBooks={fetchBooks} />,
      confirmButton: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Close",
      continueButtonText: "",
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Featured Books</h2>
        {loggedInUser?.role === "Librarian" && ( // Display button only for librarians
          <Button variant="success" onClick={handleAddBook}>
            <FaPlus className="me-2" /> Add A Book
          </Button>
        )}
      </div>
      <AsyncComponent requestStatus={requestStatus} apiError={apiError}>
        <FeaturedBooksList
          books={books}
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          selectedAuthors={selectedAuthors} // Pass selectedAuthors
          loadAuthorOptions={loadAuthorOptions}
          handleAuthorChange={handleAuthorChange}
          setSelectedAuthors={setSelectedAuthors} // Pass author options loader
        />
      </AsyncComponent>
    </>
  );
};

export default FeaturedBooks;