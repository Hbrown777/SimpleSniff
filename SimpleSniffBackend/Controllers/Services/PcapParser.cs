using PacketDotNet;
using PacketDotNet.Ieee80211;
using SharpPcap;
using SharpPcap.LibPcap;
using SimpleSniffBackend.Models;

namespace SimpleSniffBackend.Controllers.Services
{
    public class PcapParser
    {
        public List<Models.Packet> Parse(string filePath)
        {
            var packets = new List<Models.Packet>();

            int id = 1;

            using (var device = new CaptureFileReaderDevice(filePath))
            {
                device.Open();

                PacketCapture capture;

                while (device.GetNextPacket(out capture) == GetPacketStatus.PacketRead)
                {
                    var raw = capture.GetPacket();
                    var packet = PacketDotNet.Packet.ParsePacket(raw.LinkLayerType, raw.Data);

                    var ethernetPacket = packet.Extract<EthernetPacket>();
                    var ipPacket = packet.Extract<IPPacket>();
                    var tcpPacket = packet.Extract<TcpPacket>();
                    var udpPacket = packet.Extract<UdpPacket>();
                    var arpPacket = packet.Extract<ArpPacket>();
                    var icmpPacket = packet.Extract<IcmpPacket>();

                    string srcMac = "", dstMac = "", type = "";

                    if (ethernetPacket != null)
                    {
                        srcMac = ethernetPacket.SourceHardwareAddress.ToString();
                        dstMac = ethernetPacket.DestinationHardwareAddress.ToString();
                        type = ethernetPacket.Type.ToString();
                    }

                    string payload = BitConverter.ToString(raw.Data).Replace("-", " "); ;

                    if (ipPacket != null)
                    {
                        packets.Add(new Models.Packet
                        {
                            Id = id,
                            Time = raw.Timeval.Date.ToString("HH:mm:ss.fff"),
                            Source = ipPacket.SourceAddress.ToString(),
                            Destination = ipPacket.DestinationAddress.ToString(),
                            Protocol = ipPacket.Protocol.ToString(),
                            Length = raw.Data.Length,
                            Summary = ipPacket.PayloadPacket.ToString(),
                            Details = new PacketDetails
                            {
                                Payload = payload,
                                Ethernet = new EthernetDetails
                                {
                                    Source = ethernetPacket?.SourceHardwareAddress?.ToString() ?? "N/A",
                                    Destination = ethernetPacket?.DestinationHardwareAddress?.ToString() ?? "N/A",
                                    Type = ethernetPacket?.Type.ToString() ?? raw.LinkLayerType.ToString()
                                },
                                IP = new IPDetails
                                {
                                    Version = ipPacket.Version.ToString(),
                                    TTL = ipPacket.TimeToLive,
                                },
                                Transport = new TransportDetails
                                {
                                    SrcPort = tcpPacket?.SourcePort ?? udpPacket?.SourcePort ?? 0,
                                    DstPort = tcpPacket?.DestinationPort ?? udpPacket?.DestinationPort ?? 0
                                }
                            }
                        });
                        id++;
                    }
                }

                device.Close();
            }



            return packets;
        }
    }
}