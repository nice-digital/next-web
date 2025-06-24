using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace NICE.NextWeb.API.Controllers
{
    public class VersionController : Controller
    {
        public IActionResult Index()
        {
            {
                var assembly = Assembly.GetExecutingAssembly();

                var assemblyVersion = assembly.GetName().Version?.ToString();

                var informationalVersion = assembly
                    .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?
                    .InformationalVersion;

                return Ok(new
                {
                    AssemblyVersion = assemblyVersion,
                    InformationalVersion = informationalVersion
                });
            }
        }
    }
}
