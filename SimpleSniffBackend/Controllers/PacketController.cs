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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Analyze([FromForm] AnalyzeRequest request)
        {
            var file = request.File;
            var filtersJson = request.FiltersJson;

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            Filter filters = new();

            if (!string.IsNullOrEmpty(filtersJson))
            {
                try
                {
                    filters = JsonSerializer.Deserialize<Filter>(filtersJson, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }) ?? new Filter();
                }
                catch
                {
                    filters = new Filter(); // fallback so app doesn’t crash
                }
            }

            // Write to temp file so SharpPcap can read it
            var tempPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            try
            {
                var parser = new PcapParser();
                IEnumerable<Models.Packet> packets = parser.Parse(tempPath);

                int startingTime = packets.Min(p => int.Parse(p.Time));
                int packetTime;

                if (!string.IsNullOrEmpty(filters?.Protocol) && filters.Protocol != "all")
                {
                    if (filters.Protocol == "Icmp")
                    {
                        packets = packets.Where(p => p.Details.Transport.SrcPort == 8 || p.Details.Transport.DstPort == 8).ToList();
                    }
                    else if (filters.Protocol == "Http")
                    {
                        packets = packets.Where(p => p.Details.Transport.SrcPort == 80 || p.Details.Transport.DstPort == 80).ToList();
                    }
                    else if (filters.Protocol == "Https")
                    {
                        packets = packets.Where(p => p.Details.Transport.SrcPort == 443 || p.Details.Transport.DstPort == 443).ToList();
                    }
                    else if (filters.Protocol == "Dns")
                    {
                        packets = packets.Where(p => p.Details.Transport.SrcPort == 53 || p.Details.Transport.DstPort == 53).ToList();
                    }
                    else if (filters.Protocol == "Ssh")
                    {
                        packets = packets.Where(p => p.Details.Transport.SrcPort == 22 || p.Details.Transport.DstPort == 22).ToList();
                    }
                    else if (filters.Protocol == "Ftp")
                    {
                        packets = packets.Where(p => p.Details.Transport.SrcPort == 20 || p.Details.Transport.DstPort == 20 || p.Details.Transport.SrcPort == 21 || p.Details.Transport.DstPort == 21).ToList();
                    }
                    else
                    {
                        packets = packets.Where(p => p.Protocol == filters.Protocol).ToList();
                    }
                }

                if (!string.IsNullOrEmpty(filters?.SourceIp))
                    packets = packets.Where(p => p.Source == filters.SourceIp).ToList();

                if (!string.IsNullOrEmpty(filters?.DestIp))
                    packets = packets.Where(p => p.Destination == filters.DestIp).ToList();
                /*
                if (!string.IsNullOrEmpty(filters?.TimeRange) && filters.TimeRange != "all")
                {
                    packets = packets.Where(p => int.Parse(p.Time) - startingTime < int.Parse(filters.TimeRange)).ToList();
                }
                */

                System.IO.File.Delete(tempPath);

                return Ok(new { packets });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error processing file: {ex.Message}");
            }
        }
    }
}
