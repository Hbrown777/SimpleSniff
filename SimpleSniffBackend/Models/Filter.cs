namespace SimpleSniffBackend.Models
{
    public class Filter
    {
        public string Protocol { get; set; }
        public string SourceIp { get; set; }
        public string DestIp { get; set; }
        public string Port { get; set; }
    }
}
