using MediatR;
using Application.Core;
using Microsoft.AspNetCore.Identity;
using Domain;

namespace Application.Authentication;

public class Logout
{
    public class Command : IRequest<Result<Unit>>
    {
        public string UserId { get; set; }
    }
    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly UserManager<AppUser> _userManager;

        public Handler(UserManager<AppUser> userManager, AuthenticationServices authServices)
        {
            _userManager = userManager;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null) return Result<Unit>.Failure("User not found when logging out.");


            foreach (var token in user.RefreshTokens)
            {
                if (token.isActive)
                {
                    token.Revoked = DateTime.UtcNow;
                }
            }

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Result<Unit>.Success(Unit.Value);
            }

            else
                return Result<Unit>.Failure("Problem logging out user.");

        }
    }
}
