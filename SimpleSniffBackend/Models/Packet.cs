namespace SimpleSniffBackend.Models
{
    public class Packet
    {
        public int Id { get; set; }
        public string Time { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public string Protocol { get; set; }
        public int Length { get; set; }
        public string Summary { get; set; }
        public PacketDetails Details { get; set; }
    }

    public class PacketDetails
    {
        public string Payload { get; set; }
        public EthernetDetails Ethernet { get; set; }
        public IPDetails IP { get; set; }
        public TransportDetails Transport { get; set; }
    }

    public class EthernetDetails
    {
        public string Source { get; set; }
        public string Destination { get; set; }
        public string Type { get; set; }
    }

    public class IPDetails
    {
        public string Version { get; set;  }
        public int TTL { get; set; }
    }

    public class TransportDetails
    {
        public int SrcPort { get; set; }
        public int DstPort { get; set; }
    }
}
