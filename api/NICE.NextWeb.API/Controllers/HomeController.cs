using Microsoft.AspNetCore.Mvc;

namespace NICE.NextWeb.API.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            this.HttpContext.Response.StatusCode = 404;
            return View();
        }
    }
}
