namespace Domain;
public class Book
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
    // Relationships
    public ICollection<CustomerReview> CustomerReviews { get; set; } = new List<CustomerReview>();
    public ICollection<BookCheckout> BookCheckouts { get; set; }

}
