using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
using AutoMapper;

namespace Application.Books;
public class GetFeaturedBooks
{
    public class Query : IRequest<Result<PagedList<FeaturedBookDTO>>>
    {
        public BookSearchAndFilterParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<FeaturedBookDTO>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;


        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<PagedList<FeaturedBookDTO>>> Handle(Query request, CancellationToken cancellationToken)
        {
            IQueryable<Book> query = _context.Books
                .Include(b => b.CustomerReviews)
                .Include(b => b.BookCheckouts)
                .AsQueryable();

            // Apply Search
            if (!string.IsNullOrWhiteSpace(request.Params.SearchString))
            {
                query = query.Where(b => b.Title.Contains(request.Params.SearchString));
            }

            // Apply Filters
            if (!string.IsNullOrEmpty(request.Params.Title))
            {
                query = query.Where(b => b.Title.Contains(request.Params.Title));
            }

            if (request.Params.Authors != null && request.Params.Authors.Any())
            {
                query = query.Where(b => request.Params.Authors.Contains(b.Author));
            }

            if (request.Params.IsAvailable.HasValue)
            {
                if (request.Params.IsAvailable.Value)
                {
                    query = query.Where(b => !b.BookCheckouts.Any(bc => bc.DueDate > DateTime.UtcNow));
                }
                else
                {
                    query = query.Where(b => b.BookCheckouts.Any(bc => bc.DueDate > DateTime.UtcNow));
                }
            }

            if (!string.IsNullOrEmpty(request.Params.SortBy))
            {
                var sortBy = request.Params.SortBy.ToLower();
                query = sortBy switch
                {
                    "title" => request.Params.IsSortAscending
                        ? query.OrderBy(b => b.Title)
                        : query.OrderByDescending(b => b.Title),
                    "author" => request.Params.IsSortAscending
                        ? query.OrderBy(b => b.Author)
                        : query.OrderByDescending(b => b.Author),
                    "availability" => request.Params.IsSortAscending
                        ? query.OrderBy(b => !b.BookCheckouts.Any(bc => bc.DueDate > DateTime.UtcNow))
                        : query.OrderByDescending(b => !b.BookCheckouts.Any(bc => bc.DueDate > DateTime.UtcNow)),
                    _ => query
                };
            }

            var pagedResult = await PagedList<Book>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize);

            var FeaturedBookDTOs = _mapper.Map<List<FeaturedBookDTO>>(pagedResult);

            var pagedResultDto = await pagedResult.ToMappedPagedListAsync<Book, FeaturedBookDTO>(_mapper);

            return Result<PagedList<FeaturedBookDTO>>.Success(pagedResultDto);
        }
    }
}
