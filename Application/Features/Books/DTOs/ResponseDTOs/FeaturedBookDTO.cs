namespace Application.Books;
public class FeaturedBookDTO
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public string CoverImage { get; set; }
    public double AverageRating { get; set; }
    public bool IsAvailable { get; set; }

}
