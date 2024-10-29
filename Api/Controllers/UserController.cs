using Application.Authentication;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : BaseAPIController
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login([FromBody] LoginDTO loginDto)
    {
        return HandleRefreshResult(await Mediator.Send(new Login.Query { LoginDto = loginDto }));
    }

    [AllowAnonymous]
    [HttpPost("signUp")]
    public async Task<IActionResult> SignUp(SignUpDTO signUpDto)
    {
        // var origin = Request.Headers["origin"];
        return HandleResult(await Mediator.Send(new SignUp.Command { SignUpDto = signUpDto }));
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDTO>> GetCurrentUser()
    {
        string claim = User.FindFirstValue(ClaimTypes.Email);

        if (claim is null)
        {
            return BadRequest("No user found.");
        }

        return HandleRefreshResult(await Mediator.Send(new GetCurrentUser.Query { Claim = claim }));
    }

    [Authorize]
    [HttpPost("refreshToken")]
    public async Task<ActionResult<UserDTO>> ValidateRefreshToken()
    {
        string claim = User.FindFirstValue(ClaimTypes.Email);
        var token = Request.Cookies["refreshToken"];
        return HandleResult(await Mediator.Send(new ValidateRefreshToken.Query { Claim = claim, Token = token }));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        Response.Cookies.Delete("refreshToken");
        return HandleResult(await Mediator.Send(new Logout.Command { UserId = userId }));
    }


    // [AllowAnonymous]
    // [HttpPost("verifyEmail")]

    // public async Task<IActionResult> VerifyEmail(string token, string email)
    // {
    //     var user = await _userManager.FindByEmailAsync(email);

    //     if (user == null) return Unauthorized();

    //     var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
    //     var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

    //     var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

    //     if (!result.Succeeded) return BadRequest("Could not verify email address.");

    //     return Ok("Email confirmed.");
    // }

    // [AllowAnonymous]
    // [HttpGet("resendEmail/{email}")]

    // public async Task<IActionResult> ResendEmailConfirmationLink(string email)
    // {

    //     var user = await _userManager.FindByEmailAsync(email);

    //     if (user == null) return Unauthorized();

    //     var origin = Request.Headers["origin"];
    //     var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
    //     token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

    //     var verifyUrl = $"{origin}/user/verifyEmail?token={token}&email={user.Email}";

    //     var message = $"<p>Please click the below link to verify your email address: </p> <p> <a href = '{verifyUrl}'>Click to verify email.</a> </p>";

    //     try
    //     {
    //         _emailService.SendEmail(message, user.Email, "Verify your email with Orchard!");
    //     }
    //     catch (Exception e)
    //     {

    //         return BadRequest("Something went wrong trying to send email token.");

    //         throw e;
    //     }

    //     return Ok("Email link resent.");
    // }


    // [AllowAnonymous]
    // [HttpPost("forgotPassword")]
    // public async Task<ActionResult> ForgotPassword(string email)
    // {
    //     var user = await _userManager.FindByEmailAsync(email);

    //     if (user == null)
    //     {
    //         return BadRequest("Can not find user.");
    //     }

    //     var origin = Request.Headers["origin"];
    //     var token = await _userManager.GeneratePasswordResetTokenAsync(user);
    //     token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

    //     var forgotPasswordUrl = $"{origin}/user/forgotPassword?token={token}&email={user.Email}";

    //     var message = $"<p>Please click the below link to change your password: </p> <p> <a href = '{forgotPasswordUrl}'>Click to change password.</a> </p>";

    //     try
    //     {
    //         _emailService.SendEmail(message, user.Email, "Forgot your password? No problem!");
    //     }
    //     catch (Exception e)
    //     {

    //         return BadRequest("Something went wrong trying to send email token.");

    //         throw e;
    //     }

    //     return Ok();
    // }


    // [AllowAnonymous]
    // [HttpPost("passwordReset")]

    // public async Task<IActionResult> PasswordReset(string token, string email, [FromForm] string password)
    // {
    //     var user = await _userManager.FindByEmailAsync(email);

    //     if (user == null) return Unauthorized();

    //     var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
    //     var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

    //     var result = await _userManager.ResetPasswordAsync(user, decodedToken, password);

    //     if (!result.Succeeded) return BadRequest("Could not reset password.");

    //     return Ok("Password reset.");
    // }
}