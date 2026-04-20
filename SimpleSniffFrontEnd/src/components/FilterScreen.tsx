import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

interface FilterScreenProps {
  fileName: string;
  onAnalyze: (filters: FilterOptions) => void;
  onUploadNew: () => void;
}

export interface FilterOptions {
  protocol: string;
  sourceIp: string;
  destIp: string;
  port: string;
  timeRange: string;
}

export function FilterScreen({
  fileName,
  onAnalyze,
  onUploadNew,
}: FilterScreenProps) {
  const [protocol, setProtocol] = React.useState("all");
  const [sourceIp, setSourceIp] = React.useState("");
  const [destIp, setDestIp] = React.useState("");
  const [port, setPort] = React.useState("");
  const [timeRange, setTimeRange] = React.useState("all");

  const [isLoading, setIsLoading] = React.useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);

    try {
      await onAnalyze({
        protocol,
        sourceIp,
        destIp,
        port,
        timeRange,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-slate-800">Choose Filters</h1>
          <p className="text-lg text-slate-600">
            Select how you want to filter the network traffic
          </p>
          <p className="text-sm text-slate-500 mt-2">File: {fileName}</p>
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          <div className="space-y-6">
            {/* Protocol Filter */}
            <div>
              <Label htmlFor="protocol" className="text-base mb-2 block">
                Protocol
              </Label>
              <Select value={protocol} onValueChange={setProtocol}>
                <SelectTrigger id="protocol" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Protocols</SelectItem>
                  <SelectItem value="Tcp">TCP</SelectItem>
                  <SelectItem value="Udp">UDP</SelectItem>
                  <SelectItem value="Icmp">ICMP</SelectItem>
                  <SelectItem value="Http">HTTP</SelectItem>
                  <SelectItem value="Https">HTTPS</SelectItem>
                  <SelectItem value="Dns">DNS</SelectItem>
                  <SelectItem value="Ssh">SSH</SelectItem>
                  <SelectItem value="Ftp">FTP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source IP */}
            <div>
              <Label htmlFor="source-ip" className="text-base mb-2 block">
                Source IP Address (optional)
              </Label>
              <Input
                id="source-ip"
                type="text"
                placeholder="e.g., 192.168.1.1"
                value={sourceIp}
                onChange={(e) => setSourceIp(e.target.value)}
              />
            </div>

            {/* Destination IP */}
            <div>
              <Label htmlFor="dest-ip" className="text-base mb-2 block">
                Destination IP Address (optional)
              </Label>
              <Input
                id="dest-ip"
                type="text"
                placeholder="e.g., 192.168.1.100"
                value={destIp}
                onChange={(e) => setDestIp(e.target.value)}
              />
            </div>

            {/* Port Number */}
            <div>
              <Label htmlFor="port" className="text-base mb-2 block">
                Port Number (optional)
              </Label>
              <Input
                id="port"
                type="text"
                placeholder="e.g., 80, 443, 22"
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>

            {/* Time Range */}
            <div>
              <Label htmlFor="time-range" className="text-base mb-2 block">
                Time Range
              </Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="time-range" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="first-minute">First Minute</SelectItem>
                  <SelectItem value="first-5-minutes">
                    First 5 Minutes
                  </SelectItem>
                  <SelectItem value="first-10-minutes">
                    First 10 Minutes
                  </SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              "Analyze Traffic"
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onUploadNew}
            className="flex-1"
          >
            Upload New File
          </Button>
        </div>
      </div>
    </div>
  );
}

// Add React import at the top
import * as React from "react";
