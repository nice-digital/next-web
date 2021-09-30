using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
