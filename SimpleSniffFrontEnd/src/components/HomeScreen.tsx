import { Upload } from "lucide-react";
import { Button } from "./ui/button";

interface HomeScreenProps {
  onFileSelect: (file: File) => void;
}

export function HomeScreen({ onFileSelect }: HomeScreenProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-slate-800">SimpleSniff</h1>
          <p className="text-xl text-slate-600">
            Analyze network traffic without the complexity
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-12 text-center hover:border-blue-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-12 h-12 text-blue-600" />
            </div>

            <div>
              <p className="text-lg text-slate-700 mb-2">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-slate-500">
                Supports .pcap and .pcapng files only
              </p>
            </div>

            <div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pcap,.pcapng"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button size="lg" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
