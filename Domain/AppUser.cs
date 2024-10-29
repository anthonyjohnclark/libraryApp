using Microsoft.AspNetCore.Identity;

namespace Domain;
public class AppUser : IdentityUser
{
    public string DisplayName { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}


public class Customer : AppUser
{
    public ICollection<CustomerReview> CustomerReviews { get; set; }
}

public class Librarian : AppUser
{ }
