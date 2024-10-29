using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Books;
public class CheckoutBook
{
    public class Command : IRequest<Result<Unit>>
    {
        public int BookId { get; set; }
        public string CustomerId { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var book = await _context.Books.FindAsync(request.BookId);
            if (book == null)
            {
                return Result<Unit>.Failure("Book not found.");
            }

            var isAvailable = await _context.BookCheckouts
                .Where(bc => bc.BookId == request.BookId && bc.DueDate > DateTime.UtcNow)
                .FirstOrDefaultAsync() == null;

            if (!isAvailable)
            {
                return Result<Unit>.Failure("Book is already checked out.");
            }

            var checkout = new BookCheckout
            {
                BookId = request.BookId,
                CustomerId = request.CustomerId,
                CheckoutDate = DateTime.UtcNow,
                DueDate = DateTime.UtcNow.AddDays(5)
            };

            _context.BookCheckouts.Add(checkout);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return Result<Unit>.Failure("Failed to checkout the book.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
