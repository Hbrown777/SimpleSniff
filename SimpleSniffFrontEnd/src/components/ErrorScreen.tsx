import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorScreenProps {
  onTryAgain: () => void;
}

export function ErrorScreen({ onTryAgain }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-lg border border-red-200 p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-3 text-slate-800">
              Unsupported file type
            </h2>
            <p className="text-slate-600">
              Please upload a valid .pcap or .pcapng file
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={onTryAgain} className="w-full">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
