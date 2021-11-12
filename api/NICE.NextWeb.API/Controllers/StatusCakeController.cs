using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NICE.NextWeb.API.Controllers
{
    public class StatusCakeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
