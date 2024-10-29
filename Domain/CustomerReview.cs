using System;

namespace Domain
{
    public class CustomerReview
    {
        public int Id { get; set; } // Primary key
        public string Message { get; set; }
        public int Rating { get; set; } // Rating between 1 to 5 stars

        // Relationships
        public int BookId { get; set; }
        public Book Book { get; set; }

        public string CustomerId { get; set; }
        public Customer Customer { get; set; }
    }
}
