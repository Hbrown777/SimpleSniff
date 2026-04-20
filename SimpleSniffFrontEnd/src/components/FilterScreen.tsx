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
import * as React from "react";

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

  // NEW: loading state
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);

    // simulate loading (remove later if backend call exists)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    onAnalyze({ protocol, sourceIp, destIp, port, timeRange });

    setIsLoading(false);
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

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          <div className="space-y-6">

            <div>
              <Label className="text-base mb-2 block">Protocol</Label>
              <Select value={protocol} onValueChange={setProtocol}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Protocols</SelectItem>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="icmp">ICMP</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="https">HTTPS</SelectItem>
                  <SelectItem value="dns">DNS</SelectItem>
                  <SelectItem value="ssh">SSH</SelectItem>
                  <SelectItem value="ftp">FTP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base mb-2 block">
                Source IP Address
              </Label>
              <Input
                value={sourceIp}
                onChange={(e) => setSourceIp(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-base mb-2 block">
                Destination IP Address
              </Label>
              <Input
                value={destIp}
                onChange={(e) => setDestIp(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-base mb-2 block">Port</Label>
              <Input
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-base mb-2 block">Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full">
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
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        {/* Buttons */}
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