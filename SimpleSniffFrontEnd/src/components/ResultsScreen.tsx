import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface Packet {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  summary: string;
  details: {
    ethernet: {
      source: string;
      destination: string;
      type: string;
    };
    ip: {
      version: string;
      srcIp: string;
      dstIp: string;
      ttl: number;
      protocol: string;
    };
    transport: {
      srcPort?: number;
      dstPort?: number;
      sequence?: number;
      flags?: string;
    };
    payload: string;
  };
}

interface ResultsScreenProps {
  packets: Packet[];
  onPacketSelect: (packet: Packet) => void;
  onChangeFilters: () => void;
  onUploadNew: () => void;
}

export function ResultsScreen({
  packets,
  onPacketSelect,
  onChangeFilters,
  onUploadNew,
}: ResultsScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-slate-800">SimpleSniff</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onChangeFilters}>
              Change Filters
            </Button>
            <Button variant="outline" onClick={onUploadNew}>
              Upload New File
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-8">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {/* Results Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <p className="text-slate-700">
              Found <span className="font-semibold">{packets.length}</span>{" "}
              packets
            </p>
          </div>

          {/* Packet Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-24">Packet #</TableHead>
                  <TableHead className="w-32">Time</TableHead>
                  <TableHead className="w-40">Source</TableHead>
                  <TableHead className="w-40">Destination</TableHead>
                  <TableHead className="w-28">Protocol</TableHead>
                  <TableHead className="w-24">Length</TableHead>
                  <TableHead>Info</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packets.map((packet) => (
                  <TableRow
                    key={packet.id}
                    onClick={() => onPacketSelect(packet)}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="font-medium">{packet.id}</TableCell>
                    <TableCell className="text-slate-600">
                      {packet.time}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {packet.source}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {packet.destination}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {packet.protocol}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {packet.length}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {packet.summary}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
