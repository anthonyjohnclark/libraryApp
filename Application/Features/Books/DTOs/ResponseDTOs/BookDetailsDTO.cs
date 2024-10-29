namespace Application.Books;
public class BookDetailsDTO
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public string CoverImage { get; set; }
    public double AverageRating { get; set; }
    public string Publisher { get; set; }
    public DateTime PublicationDate { get; set; }
    public string Category { get; set; }
    public string ISBN { get; set; }
    public int PageCount { get; set; }
    public List<CustomerReviewDTO> CustomerReviews { get; set; }
    public bool IsAvailable { get; set; }
}
