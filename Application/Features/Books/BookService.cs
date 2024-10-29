using Persistence;

namespace Application.Books;
public class BookService
{
    private readonly DataContext _context;

    public BookService(DataContext context)
    {
        _context = context;
    }
}
