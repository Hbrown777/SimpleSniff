using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SharpPcap;
using PacketDotNet;
using SimpleSniffBackend.Controllers.Services;
using SimpleSniffBackend.Models;
using System.Text.Json;

namespace SimpleSniffBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacketController : ControllerBase
    {
        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze([FromForm] IFormFile file, [FromForm] string filtersJson)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var filters = JsonSerializer.Deserialize<Filter>(filtersJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Write to temp file so SharpPcap can read it
            var tempPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var parser = new PcapParser();
            IEnumerable<Models.Packet> packets = parser.Parse(tempPath);

            if (!string.IsNullOrEmpty(filters?.Protocol) && filters.Protocol != "all")
                packets = packets.Where(p => p.Protocol == filters.Protocol).ToList();

            if (!string.IsNullOrEmpty(filters?.SourceIp))
                packets = packets.Where(p => p.Source == filters.SourceIp).ToList();

            if (!string.IsNullOrEmpty(filters?.DestIp))
                packets = packets.Where(p => p.Destination == filters.DestIp).ToList();

            // Clean up temp file
            System.IO.File.Delete(tempPath);

            return Ok(new { packets });
        }
    }
}
