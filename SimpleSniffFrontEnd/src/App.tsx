import * as React from "react";
import { HomeScreen } from "./components/HomeScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { FilterScreen, FilterOptions } from "./components/FilterScreen";
import { ResultsScreen, Packet } from "./components/ResultsScreen";
import { PacketDetailScreen } from "./components/PacketDetailScreen";

type Screen =
  | "home"
  | "error"
  | "filter"
  | "results"
  | "detail";

function App() {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>("home");
  const [uploadedFileName, setUploadedFileName] = React.useState<string>("");
  const [packets, setPackets] = React.useState<Packet[]>([]);
  const [selectedPacket, setSelectedPacket] = React.useState<Packet | null>(
    null
  );

const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

const handleFileSelect = async (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension === "pcap" || fileExtension === "pcapng") {
        setUploadedFile(file);           // ← just store it, no fetch
        setUploadedFileName(file.name);
        setCurrentScreen("filter");
    } else {
        setCurrentScreen("error");
    }
};

  const handleTryAgain = () => {
    setCurrentScreen("home");
  };

const handleAnalyze = async (filters: FilterOptions) => {
    if (!uploadedFile) return;
    try {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("filtersJson", JSON.stringify(filters));

        const res = await fetch("https://simplesniff.onrender.com/api/Packet/analyze", {
            method: "POST",
            body: formData,   // ← no Content-Type header, let browser set it
        });
        const data = await res.json();
        setPackets(data.packets);
        setCurrentScreen("results");
    } catch (error) {
        console.error("API error:", error);
        setCurrentScreen("error");
    }
};

  const handlePacketSelect = (packet: Packet) => {
    setSelectedPacket(packet);
    setCurrentScreen("detail");
  };

  const handleChangeFilters = () => {
    setCurrentScreen("filter");
  };

  const handleUploadNew = () => {
    setCurrentScreen("home");
    setUploadedFileName("");
    //setPackets(mockPackets);
  };

  const handleBackToResults = () => {
    setCurrentScreen("results");
  };

  return (
    <>
      {currentScreen === "home" && (
        <HomeScreen onFileSelect={handleFileSelect} />
      )}
      {currentScreen === "error" && (
        <ErrorScreen onTryAgain={handleTryAgain} />
      )}
      {currentScreen === "filter" && (
        <FilterScreen
          fileName={uploadedFileName}
          onAnalyze={handleAnalyze}
          onUploadNew={handleUploadNew}
        />
      )}
      {currentScreen === "results" && (
        <ResultsScreen
          packets={packets}
          onPacketSelect={handlePacketSelect}
          onChangeFilters={handleChangeFilters}
          onUploadNew={handleUploadNew}
        />
      )}
      {currentScreen === "detail" && selectedPacket && (
        <PacketDetailScreen
          packet={selectedPacket}
          onBack={handleBackToResults}
        />
      )}
    </>
  );
}

export default App;
