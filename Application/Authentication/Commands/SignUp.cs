using MediatR;
using Application.Core;
using Microsoft.AspNetCore.Identity;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Authentication;

public class SignUp
{
    public class Command : IRequest<Result<Unit>>
    {
        public SignUpDTO SignUpDto { get; set; }
    }
    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly UserManager<AppUser> _userManager;

        public Handler(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == request.SignUpDto.Email))
            {
                return Result<Unit>.Failure("Email already exists.");
            }

            var user = new AppUser();

            var result = await _userManager.CreateAsync(user, request.SignUpDto.Password);

            var roleAdded = await _userManager.AddToRoleAsync(user, request.SignUpDto.Role);

            // var origin = request.Origin;

            // var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            // token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            // var verifyUrl = $"{origin}/user/verifyEmail?token={token}&email={user.Email}";

            // var message = $"<p>Please click the below link to verify your email address: </p> <p> <a href = '{verifyUrl}'>Click to verify email.</a> </p>";

            if (result.Succeeded && roleAdded.Succeeded)
            {
                return Result<Unit>.Success(Unit.Value);
            }

            else
                return Result<Unit>.Failure("Problem registering user.");
        }

    }
}
