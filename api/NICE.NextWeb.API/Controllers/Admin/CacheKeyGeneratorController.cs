using System;
using Microsoft.AspNetCore.Mvc;
using NICE.NextWeb.API.Models;
using Ocelot.Cache;

namespace NICE.NextWeb.API.Controllers.Admin
{
    public class CacheKeyGeneratorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Index(string unEncodedString)
        {
            var result = new CacheKeyGeneratorModel();
            if (!String.IsNullOrEmpty(unEncodedString))
            {
                var outputMd5 = MD5Helper.GenerateMd5(unEncodedString);
                result.MD5HashedString = outputMd5;
                result.UnEncodedString = unEncodedString;
            }
            return View(result);
        }
    }
}
