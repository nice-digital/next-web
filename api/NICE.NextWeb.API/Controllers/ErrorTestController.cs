using Microsoft.AspNetCore.Mvc;
using System;

namespace NICE.NextWeb.API.Controllers
{
    public class ErrorTestController : Controller
    {
        public IActionResult Index()
        {
            throw new Exception("Testing global exception handler - ignore");
        }
    }
}
