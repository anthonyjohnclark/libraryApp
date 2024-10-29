using MediatR;
using Api.Extensions;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class BaseAPIController : ControllerBase
{
    private IMediator _mediator;

    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if (result == null) return NoContent();

        if (result.IsSuccess && result.Value != null)
            return Ok(result);
        if (result.IsSuccess && result.Value == null)
            return NoContent();
        return BadRequest(result.Error);
    }

    protected ActionResult HandleRefreshResult<T>(Result<RefreshTokenResponse<T>> result)
    {

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = System.DateTime.UtcNow.AddDays(7)
        };

        if (result == null) { return NoContent(); }

        if (result.IsSuccess && result.Value != null)
        {
            Response.Cookies.Append("refreshToken", result.Value.RefreshToken.Token, cookieOptions);
            return Ok(result.Value.UserDTO);
        }

        if (result.IsSuccess && result.Value == null)
        {
            return NoContent();
        }
        return BadRequest(result);
    }


    protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
    {
        if (result == null) return NoContent();

        if (result.IsSuccess && result.Value != null)
        {
            Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize, result.Value.TotalCount, result.Value.TotalPages);
            return Ok(result);
        }
        if (result.IsSuccess && result.Value == null)
            return NoContent();
        return BadRequest(result);
    }

}
