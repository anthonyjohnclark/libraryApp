using Domain;

public class BookCheckout
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book Book { get; set; }
    public string CustomerId { get; set; }
    public Customer Customer { get; set; }
    public DateTime CheckoutDate { get; set; }
    public DateTime DueDate { get; set; }
}
