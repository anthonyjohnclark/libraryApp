using MediatR;
using Application.Core;
using Microsoft.AspNetCore.Identity;
using Domain;

namespace Application.Authentication;

public class Login
{
    public class Query : IRequest<Result<RefreshTokenResponse<LoginDTO>>>
    {
        public LoginDTO LoginDto { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<RefreshTokenResponse<LoginDTO>>>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AuthenticationServices _authServices;
        private readonly SignInManager<AppUser> _signInManager;

        public Handler(UserManager<AppUser> userManager, AuthenticationServices authServices, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _authServices = authServices;
            _signInManager = signInManager;
        }

        public async Task<Result<RefreshTokenResponse<LoginDTO>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.LoginDto.Email);

            if (user == null) return Result<RefreshTokenResponse<LoginDTO>>.Failure("Email not found.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.LoginDto.Password, false);

            if (result.Succeeded)
            {
                return Result<RefreshTokenResponse<LoginDTO>>.Success(await RefreshTokenResponse<LoginDTO>.CreateResponse(_authServices, user));
            }

            return Result<RefreshTokenResponse<LoginDTO>>.Failure("Invalid password.");

        }
    }
}
