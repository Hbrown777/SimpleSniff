using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SharpPcap;
using PacketDotNet;
using SimpleSniffBackend.Controllers.Services;
using SimpleSniffBackend.Models;

namespace SimpleSniffBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacketController : ControllerBase
    {
        private static string _filepath = "";

        [HttpPost("upload")]
        public async Task<IActionResult> fileUpload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var filePath = Path.Combine(uploadPath, file.FileName);

            _filepath = filePath;

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { message = "File uploaded" });
        }

        [HttpPost("filter")]
        public IActionResult filterPackets([FromBody] Filter filters)
        {
            var parser = new PcapParser();

            IEnumerable<Models.Packet> packets = parser.Parse(_filepath);

            if (!string.IsNullOrEmpty(filters.Protocol) && filters.Protocol != "all")
            {
                packets = packets.Where(p => p.Protocol == filters.Protocol).ToList();
            }

            if (!string.IsNullOrEmpty(filters.SourceIp))
            {
                packets = packets.Where(p => p.Source == filters.SourceIp).ToList();
            }

            if (!string.IsNullOrEmpty(filters.DestIp))
            {
                packets = packets.Where(p => p.Destination == filters.DestIp).ToList();
            }

            return Ok(new { packets });
        }
    }
}
