using FluentValidation;

namespace Application.Authentication;
public class SignUpValidator : AbstractValidator<SignUpDTO>
{
    public SignUpValidator()
    {
        RuleFor(x => x.DisplayName)
            .NotEmpty().WithMessage("Display Name is required.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long.")
            .Matches(@"(?=.*[A-Z])").WithMessage("Password must contain at least one uppercase letter.")
            .Matches(@"(?=.*\d)").WithMessage("Password must contain at least one number.")
            .Matches(@"(?=.*[@$!%*?&])").WithMessage("Password must contain at least one special character.");

    }
}
