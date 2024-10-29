using Application.Core;
using MediatR;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Books
{
    public class DeleteBook
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int BookId { get; set; }
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

                _context.Books.Remove(book);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success)
                {
                    return Result<Unit>.Failure("Problem deleting the book.");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
