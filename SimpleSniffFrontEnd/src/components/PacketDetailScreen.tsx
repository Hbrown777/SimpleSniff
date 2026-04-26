import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Packet } from "./ResultsScreen";
import * as React from "react";

interface PacketDetailScreenProps {
  packet: Packet;
  onBack: () => void;
}

export function PacketDetailScreen({ packet, onBack }: PacketDetailScreenProps) {
  const [expandedSections, setExpandedSections] = React.useState({
    ethernet: true,
    ip: true,
    transport: true,
    payload: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatPayload = (payload: string) => {
  try {
    return JSON.stringify(JSON.parse(payload), null, 2);
  } catch {
    return payload;
  }
};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-slate-800">SimpleSniff</h1>
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>
      </div>

      {/* Detail Content */}
      <div className="p-8">
        {/* Packet Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl mb-3 text-slate-800">
            Packet #{packet.id} Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Time:</span>{" "}
              <span className="text-slate-800 font-medium">{packet.time}</span>
            </div>
            <div>
              <span className="text-slate-600">Protocol:</span>{" "}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-900">
                {packet.protocol}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Source:</span>{" "}
              <span className="text-slate-800 font-medium">
                {packet.source}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Destination:</span>{" "}
              <span className="text-slate-800 font-medium">
                {packet.destination}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Length:</span>{" "}
              <span className="text-slate-800 font-medium">
                {packet.length} bytes
              </span>
            </div>
            <div>
              <span className="text-slate-600">Info:</span>{" "}
              <span className="text-slate-800">{packet.summary}</span>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4">
          {/* Ethernet Information */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggleSection("ethernet")}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-lg text-slate-800">
                Ethernet Information
              </span>
              {expandedSections.ethernet ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {expandedSections.ethernet && (
              <div className="px-6 py-4 space-y-3">
                <DetailRow
                  label="Source MAC Address"
                  value={packet.details.ethernet.source}
                />
                <DetailRow
                  label="Destination MAC Address"
                  value={packet.details?.ethernet?.destination}
                />
                <DetailRow
                  label="Type"
                  value={packet.details?.ethernet?.type}
                />
              </div>
            )}
          </div>

          {/* IP Information */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggleSection("ip")}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-lg text-slate-800">IP Information</span>
              {expandedSections.ip ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {expandedSections.ip && (
              <div className="px-6 py-4 space-y-3">
                <DetailRow
                  label="Version"
                  value={packet.details?.ip?.version?.toString() ?? "N/A"}
                />
                <DetailRow
                  label="Source IP"
                  value={packet.details?.ip?.srcIp ?? packet.source}
                />
                <DetailRow
                  label="Destination IP"
                  value={packet.details?.ip?.dstIp ?? packet.destination}
                />
                <DetailRow
                  label="TTL (Time to Live)"
                  value={packet.details?.ip?.ttl?.toString() ?? "N/A"}
                />
                <DetailRow
                  label="Protocol"
                  value={packet.details?.ip?.protocol ?? packet.protocol}
                />
              </div>
            )}
          </div>

          {/* Transport Layer Information */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggleSection("transport")}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-lg text-slate-800">
                Transport Layer Information
              </span>
              {expandedSections.transport ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {expandedSections.transport && (
              <div className="px-6 py-4 space-y-3">
                {packet.details?.transport?.srcPort !== undefined && (
                  <DetailRow
                    label="Source Port"
                    value={packet.details.transport.srcPort.toString()}
                  />
                )}

                {packet.details?.transport?.dstPort !== undefined && (
                  <DetailRow
                    label="Destination Port"
                    value={packet.details.transport.dstPort.toString()}
                  />
                )}

                {packet.details?.transport?.sequence && (
                  <DetailRow
                    label="Sequence Number"
                    value={packet.details.transport.sequence.toString()}
                  />
                )}

                {packet.details?.transport?.flags && (
                  <DetailRow
                    label="Flags"
                    value={packet.details.transport.flags}
                  />
                )}
              </div>
            )}
          </div>

          {/* Payload */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggleSection("payload")}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-lg text-slate-800">Raw Data</span>
              {expandedSections.payload ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {expandedSections.payload && (
              <div className="px-6 py-4">
                <div className="bg-slate-50 rounded p-4 font-mono text-sm text-slate-700 overflow-x-auto">
                  {formatPayload(packet.details.payload) ?? "No payload available"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="text-slate-600 w-48">{label}:</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}
