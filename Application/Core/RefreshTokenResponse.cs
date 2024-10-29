using System.Threading.Tasks;
using Application.Authentication;
using Domain;

namespace Application.Core;

public class RefreshTokenResponse<T>
{
    public RefreshToken RefreshToken { get; set; }

    public UserDTO UserDTO { get; set; }

    public RefreshTokenResponse(UserDTO user, RefreshToken refreshToken)
    {
        UserDTO = user;
        RefreshToken = refreshToken;
    }


    public static async Task<RefreshTokenResponse<T>> CreateResponse(AuthenticationServices service, AppUser user)
    {
        var userObject = service.CreateUserObject(user);
        RefreshToken refreshToken = await service.SetRefreshToken(user);

        return new RefreshTokenResponse<T>(userObject, refreshToken);
    }
}
