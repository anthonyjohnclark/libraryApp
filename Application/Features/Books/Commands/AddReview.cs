using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Books;
public class AddReview
{
    public class Command : IRequest<Result<Unit>>
    {
        public int BookId { get; set; }
        public AddReviewDTO Review { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var book = await _context.Books
                .Include(b => b.CustomerReviews)
                .FirstOrDefaultAsync(b => b.Id == request.BookId);
            if (book == null)
            {
                return Result<Unit>.Failure("Book not found.");
            }

            var existingReview = book.CustomerReviews
                .FirstOrDefault(r => r.CustomerId == request.Review.CustomerId);
            if (existingReview != null)
            {
                return Result<Unit>.Failure("Customer has already reviewed this book.");
            }

            var review = _mapper.Map<CustomerReview>(request.Review);
            review.BookId = request.BookId;
            review.CustomerId = request.Review.CustomerId;

            book.CustomerReviews.Add(review);

            var totalReviews = book.CustomerReviews.Count;
            var totalRating = book.CustomerReviews.Sum(r => r.Rating);
            book.AverageRating = (double)totalRating / totalReviews;

            var success = await _context.SaveChangesAsync() > 0;

            if (!success) return Result<Unit>.Failure("Failed to add review.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
