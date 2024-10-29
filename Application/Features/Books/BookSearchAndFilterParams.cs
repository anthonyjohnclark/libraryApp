using Application.Core;

namespace Application.Books;

public class BookSearchAndFilterParams : PagingParams
{
    public string? Title { get; set; } = null; // Optional filtering by title
    public List<string>? Authors { get; set; } // Change this to accept multiple authors
    public bool? IsAvailable { get; set; } // Optional filtering by availability
    public string SortBy { get; set; } = "Title"; // Default to sorting by Title
    public bool IsSortAscending { get; set; } = true; // Default sorting order
    public string? SearchString { get; set; } // For text search on title
}
