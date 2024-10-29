using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Core;

namespace Application.Books
{
    public class GetAuthors
    {
        public class Query : IRequest<Result<List<string>>> { }

        public class Handler : IRequestHandler<Query, Result<List<string>>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<string>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var authors = await _context.Books
                    .Select(b => b.Author)
                    .Distinct()
                    .ToListAsync(cancellationToken);

                return Result<List<string>>.Success(authors);
            }
        }
    }
}
