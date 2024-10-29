using Application.Books;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : BaseAPIController
    {
        // Endpoint for Filtering, Sorting, and Pagination of Books
        [HttpGet("featured")]
        public async Task<IActionResult> GetBooks([FromQuery] BookSearchAndFilterParams searchAndfilterParams)
        {
            return HandlePagedResult(await Mediator.Send(new GetFeaturedBooks.Query { Params = searchAndfilterParams }));
        }

        [HttpGet("authors")]
        public async Task<IActionResult> GetAuthors()
        {
            return HandleResult(await Mediator.Send(new GetAuthors.Query { }));
        }


        // Endpoint to View Book Details
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookDetails(int id)
        {
            return HandleResult(await Mediator.Send(new GetBookDetails.Query { BookId = id }));
        }

        // Endpoint for Librarian to Manage Books (Add/Edit/Delete)
        [HttpPost]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> AddBook(AddBookDTO bookDto)
        {
            return Ok(await Mediator.Send(new AddBook.Command { BookRequest = bookDto }));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> EditBook(int id, EditBookDTO bookDto)
        {
            return Ok(await Mediator.Send(new EditBook.Command { BookId = id, BookDto = bookDto }));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            return Ok(await Mediator.Send(new DeleteBook.Command { BookId = id }));
        }

        // Endpoint for Book Checkout by a Customer
        [HttpPost("{id}/{custId}/checkout")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CheckoutBook(int id, string custId)
        {
            return Ok(await Mediator.Send(new CheckoutBook.Command { BookId = id, CustomerId = custId }));
        }

        // Endpoint for Librarian to Mark Book as Returned
        [HttpPost("{id}/return")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> ReturnBook(int id)
        {
            return Ok(await Mediator.Send(new ReturnBook.Command { BookId = id }));
        }

        // Endpoint for Customer to Leave a Review
        [HttpPost("review")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> AddReview(AddReviewDTO reviewDto)
        {
            return Ok(await Mediator.Send(new AddReview.Command { BookId = reviewDto.BookId, Review = reviewDto }));
        }
    }
}
