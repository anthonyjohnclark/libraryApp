using Application.Core;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Books
{
    public class EditBook
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int BookId { get; set; }
            public EditBookDTO BookDto { get; set; }
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
                var book = await _context.Books.FindAsync(request.BookId);

                if (book == null) return Result<Unit>.Failure("Book not found");

                _mapper.Map(request.BookDto, book);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to edit the book");
            }
        }
    }
}
