using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NICE.NextWeb.API.Models
{
    public class CacheKeyGeneratorModel
    {
        public string MD5HashedString { get; set; }
        public string UnEncodedString { get; set; }
    }
}
