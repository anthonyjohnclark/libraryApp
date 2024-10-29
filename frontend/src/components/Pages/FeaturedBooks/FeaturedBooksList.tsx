import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import AsyncSelect from "react-select/async"; // Import AsyncSelect for autocomplete
import { useTable, usePagination } from "react-table";
import debounce from "lodash.debounce";
import classes from "./FeaturedBooksList.module.css";

import {
  Table,
  Form,
  Button,
  Pagination,
  InputGroup,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
} from "react-icons/fa"; // Import sort icons and additional icons
import { Book, IQueryParams } from "./FeaturedBooks";
import AddBookModal from "./modals/AddBookModal";
import { useModal } from "../../../hooks/GlobalHooks/useModalHook";
import { useIdentity } from "../../../hooks/GlobalHooks/useIdentityHook";

interface IFeaturedBookList {
  books: Book[];
  updateQueryParams: (queryParams: IQueryParams) => void;
  queryParams: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    title: string;
    authors: string[];
    isAvailable: boolean | undefined;
    sortBy: string;
    isSortAscending: boolean;
  };
  selectedAuthors: any[]; // New prop for selected authors
  setSelectedAuthors: (selectedOptions: any) => void; // New prop to handle author selection
  loadAuthorOptions: (
    inputValue: string,
    callback: (options: any[]) => void
  ) => void; // New prop to load author options
  handleAuthorChange: (selectedOptions: any) => void;
  fetchBooks: () => Promise<void>;
}

const FeaturedBookList: React.FC<IFeaturedBookList> = ({
  books,
  updateQueryParams,
  queryParams,
  selectedAuthors,
  setSelectedAuthors,
  loadAuthorOptions,
  handleAuthorChange,
  fetchBooks,
}) => {
  const navigate = useNavigate(); // Initialize navigate function for routing
  const [searchTitle, setSearchTitle] = useState(queryParams.title);
  const { renderModal } = useModal();
  const { loggedInUser } = useIdentity();

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

  const debouncedUpdateQueryParams = useCallback(
    debounce((newTitle: string) => {
      updateQueryParams({ ...queryParams, title: newTitle, currentPage: 1 });
    }, 500), // 500 ms debounce delay
    [updateQueryParams, queryParams]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setSearchTitle(newTitle);
    debouncedUpdateQueryParams(newTitle);
  };

  // Handle sorting when a header is clicked
  const handleSortChange = (sortBy: keyof Book) => {
    updateQueryParams({
      ...queryParams,
      sortBy,
      isSortAscending:
        queryParams.sortBy === sortBy ? !queryParams.isSortAscending : true,
      currentPage: 1,
    });
  };

  // Toggle availability filter
  const toggleAvailability = () => {
    updateQueryParams({
      ...queryParams,
      isAvailable: queryParams.isAvailable ? undefined : true,
      currentPage: 1,
    });
  };

  // Clear all filters and reset query params
  const handleClearFilters = () => {
    updateQueryParams({
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      title: "",
      authors: [],
      isAvailable: undefined,
      sortBy: "title",
      isSortAscending: true,
    });
    setSelectedAuthors([]);
  };

  // Handle row click for navigation to book details
  const handleRowClick = (bookId: string) => {
    navigate(`/book-details/${bookId}`);
  };

  const columns: Array<{
    Header: string | ((props: any) => JSX.Element);
    accessor: keyof Book;
    Cell?: ({ value }: { value: any }) => JSX.Element;
  }> = useMemo(
    () => [
      {
        Header: "", // Blank header for cover image column
        accessor: "coverImage",
        Cell: ({ value }: { value: string }) => (
          <img
            src={value}
            alt="Book Cover"
            style={{ width: "50px", height: "75px" }}
          />
        ),
      },
      {
        Header: () => (
          <span
            onClick={() => handleSortChange("title")}
            style={{ cursor: "pointer" }}
          >
            Title{" "}
            {queryParams.sortBy === "title" ? (
              queryParams.isSortAscending ? (
                <FaSortUp />
              ) : (
                <FaSortDown />
              )
            ) : null}
          </span>
        ),
        accessor: "title",
        Cell: ({ value }: { value: string }) => <span>{value}</span>,
      },
      {
        Header: () => (
          <span
            onClick={() => handleSortChange("author")}
            style={{ cursor: "pointer" }}
          >
            Author{" "}
            {queryParams.sortBy === "author" ? (
              queryParams.isSortAscending ? (
                <FaSortUp />
              ) : (
                <FaSortDown />
              )
            ) : null}
          </span>
        ),
        accessor: "author",
        Cell: ({ value }: { value: string }) => <span>{value}</span>,
      },
      { Header: "Description", accessor: "description" },
      {
        Header: "Average Rating",
        accessor: "averageRating",
        Cell: ({ value }: { value: number }) => (
          <span>{value.toFixed(2)}</span> // Round to 2 decimal places
        ),
      },
      {
        Header: "Availability",
        accessor: "isAvailable",
        Cell: ({ value }: { value: boolean }) => (
          <span>
            {value ? (
              <FaCheckCircle color="green" />
            ) : (
              <FaTimesCircle color="red" />
            )}
          </span>
        ),
      },
      {
        Header: "", // Hidden Id column
        accessor: "id",
        Cell: () => <></>, // Do not display Id
      },
    ],
    [queryParams]
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      {
        columns,
        data: books,
        initialState: {
          pageIndex: queryParams.currentPage - 1,
          hiddenColumns: ["id"],
        },
        manualPagination: true,
        pageCount: queryParams.totalPages,
      },
      usePagination
    );

  return (
    <div className="container mt-0 pt-3 mb-0">
      <h2 className={classes.BookListHeader}>Book List</h2>
      <Form>
        <Row className="align-items-center mb-3 justify-content-between">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <FormControl
                placeholder="Search by title..."
                value={searchTitle}
                onChange={handleTitleChange}
              />
              <Button variant="primary">
                <FaSearch /> Search
              </Button>
            </InputGroup>
          </Col>
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FaFilter />
              </InputGroup.Text>
              <AsyncSelect
                cacheOptions
                loadOptions={loadAuthorOptions}
                onChange={handleAuthorChange}
                isMulti
                value={selectedAuthors}
                isClearable
                placeholder="Filter by authors..."
              />
            </InputGroup>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            {loggedInUser?.role === "Librarian" && (
              <Col>
                <Button variant="success" onClick={handleAddBook}>
                  <FaPlus className="me-2" /> Add A Book
                </Button>
              </Col>
            )}
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              label="Show Available Only"
              onChange={toggleAvailability}
              checked={!!queryParams.isAvailable}
              className={classes.FormCheckWhite}
            />
          </Col>
          <Col md={1} className="d-flex justify-content-end">
            <Col>
              <Button variant="secondary" onClick={handleClearFilters}>
                <FaTimes /> Clear
              </Button>
            </Col>
          </Col>
        </Row>
      </Form>
      <Table
        striped
        bordered
        hover
        {...getTableProps()}
        responsive
        className="table-hover-pointer"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  style={{ cursor: "pointer" }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}
                onClick={() => handleRowClick(row.original.id)} // Pass Id to navigate
                style={{ cursor: "pointer" }}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination className="d-flex justify-content-center mt-3 mb-0 pb-2">
        <Pagination.Prev
          onClick={() =>
            updateQueryParams({
              ...queryParams,
              currentPage: queryParams.currentPage - 1,
            })
          }
          disabled={queryParams.currentPage <= 1}
        />
        {Array.from({ length: queryParams.totalPages }).map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === queryParams.currentPage}
            onClick={() =>
              updateQueryParams({ ...queryParams, currentPage: idx + 1 })
            }
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() =>
            updateQueryParams({
              ...queryParams,
              currentPage: queryParams.currentPage + 1,
            })
          }
          disabled={queryParams.currentPage >= queryParams.totalPages}
        />
      </Pagination>
    </div>
  );
};

export default FeaturedBookList;
