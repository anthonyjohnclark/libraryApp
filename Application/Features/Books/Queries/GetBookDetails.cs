using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Application.Core;

namespace Application.Books;
public class GetBookDetails
{
    public class Query : IRequest<Result<BookDetailsDTO>>
    {
        public int BookId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<BookDetailsDTO>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<BookDetailsDTO>> Handle(Query request, CancellationToken cancellationToken)
        {
            var book = await _context.Books
                .Include(b => b.CustomerReviews)
                    .ThenInclude(cr => cr.Customer)
                .Include(b => b.BookCheckouts)
                .FirstOrDefaultAsync(b => b.Id == request.BookId);

            if (book?.CustomerReviews == null || !book.CustomerReviews.Any())
            {
                Console.WriteLine("No customer reviews found for book.");
            }


            if (book == null) return Result<BookDetailsDTO>.Failure("Book not found");

            var bookDetails = _mapper.Map<BookDetailsDTO>(book);

            return Result<BookDetailsDTO>.Success(bookDetails);
        }
    }
}

