using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Application.Authentication;

public class AuthenticationServices
{
    private readonly TokenService _tokenService;
    private readonly UserManager<AppUser> _userManager;

    public AuthenticationServices(TokenService tokenService, UserManager<AppUser> userManager)
    {
        _tokenService = tokenService;
        _userManager = userManager;
    }
    public async Task<RefreshToken> SetRefreshToken(AppUser user)
    {
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshTokens.Add(refreshToken);

        await _userManager.UpdateAsync(user);

        return refreshToken;
    }

    public UserDTO CreateUserObject(AppUser user)
    {
        return new UserDTO
        {
            DisplayName = user.DisplayName,
            Token = _tokenService.CreateToken(user).Result,
            Email = user.Email,
        };
    }
}
