using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Books;
public class AddBook
{
    public class Command : IRequest<Result<Unit>>
    {
        public AddBookDTO BookRequest { get; set; }
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
            var newBook = _mapper.Map<Book>(request.BookRequest);

            _context.Books.Add(newBook);

            var success = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (success)
            {
                return Result<Unit>.Success(Unit.Value);
            }
            else
            {
                return Result<Unit>.Failure("Problem saving the book to the library.");
            }
        }
    }
}
