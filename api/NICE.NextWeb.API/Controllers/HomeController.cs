using Microsoft.AspNetCore.Mvc;

namespace NICE.NextWeb.API.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
