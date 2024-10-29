using MediatR;
using Application.Core;
using Microsoft.AspNetCore.Identity;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Authentication;

public class ValidateRefreshToken
{
    public class Query : IRequest<Result<UserDTO>>
    {
        public string Token { get; set; }
        public string Claim { get; set; }

    }

    public class Handler : IRequestHandler<Query, Result<UserDTO>>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AuthenticationServices _authServices;

        public Handler(UserManager<AppUser> userManager, TokenService tokenService, AuthenticationServices authServices)
        {
            _userManager = userManager;
            _authServices = authServices;
        }

        public async Task<Result<UserDTO>> Handle(Query request, CancellationToken cancellationToken)
        {

            var refreshToken = request.Token;

            var user = await _userManager.Users.Include(r => r.RefreshTokens)
                    .FirstOrDefaultAsync(x => x.Email == request.Claim);

            if (user == null) return Result<UserDTO>.Failure("Unauthorized.");

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.isActive) return Result<UserDTO>.Failure("Unauthorized.");

            if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            return Result<UserDTO>.Success(_authServices.CreateUserObject(user));
        }
    }
}
