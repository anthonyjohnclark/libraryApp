namespace Application.Books;
public class AddReviewDTO
{
    public int BookId { get; set; } // ID of the book being reviewed
    public string Message { get; set; } // Review message
    public int Rating { get; set; } // Rating between 1 to 5
    public string CustomerId { get; set; } // ID of the customer leaving the review
}

