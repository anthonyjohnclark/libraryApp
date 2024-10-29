using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Books
{
    public class ReturnBook
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int BookId { get; set; }
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
                var checkoutRecord = await _context.BookCheckouts
                    .Include(bc => bc.Book)
                    .FirstOrDefaultAsync(bc => bc.BookId == request.BookId && bc.DueDate >= DateTime.UtcNow, cancellationToken);

                if (checkoutRecord == null)
                {
                    return Result<Unit>.Failure("No active checkout record found for the book.");
                }

                _context.BookCheckouts.Remove(checkoutRecord);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!success)
                {
                    return Result<Unit>.Failure("Failed to return the book.");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
