using System.ComponentModel.DataAnnotations;

namespace Application.Authentication;
public class SignUpDTO
{
    [Required]
    public string DisplayName { get; set; }

    [Required]
    [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", ErrorMessage = "Password must be complex")]
    public string Password { get; set; }

    [Required]
    [EmailAddress]

    public string Email { get; set; }

    [Required]
    public string Role { get; set; }
}
