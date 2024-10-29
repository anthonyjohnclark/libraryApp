using MediatR;
using Application.Core;
using Microsoft.AspNetCore.Identity;
using Domain;

namespace Application.Authentication;

public class GetCurrentUser
{
    public class Query : IRequest<Result<RefreshTokenResponse<UserDTO>>>
    {
        public string Claim { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<RefreshTokenResponse<UserDTO>>>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AuthenticationServices _authServices;

        public Handler(UserManager<AppUser> userManager, AuthenticationServices authServices)
        {
            _userManager = userManager;
            _authServices = authServices;
        }

        public async Task<Result<RefreshTokenResponse<UserDTO>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Claim);

            return Result<RefreshTokenResponse<UserDTO>>.Success(await RefreshTokenResponse<UserDTO>.CreateResponse(_authServices, user));
        }
    }
}
