namespace Application.Books;
public class EditBookDTO
{
    public string Title { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public string CoverImage { get; set; } // URL of the cover image
    public bool IsAvailable { get; set; }
    public string Publisher { get; set; }
    public DateTime PublicationDate { get; set; }
    public string Category { get; set; }
    public string ISBN { get; set; }
    public int PageCount { get; set; }
}
