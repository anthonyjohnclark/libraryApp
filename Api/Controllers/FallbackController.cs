
namespace API.Controllers;

[AllowAnonymous]
public class FallbackController : Controller
{
    public IActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/dist", "index.html"), "text/HTML");
    }
}
