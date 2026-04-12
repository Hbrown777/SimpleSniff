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

  const handleFileSelect = async (file: File) => {
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop()?.toLowerCase();

    if (fileExtension == "pcap" || fileExtension == "pcapng") {
      try {
        // 👇 Create form data
        const formData = new FormData();
        formData.append("file", file);

        // 👇 Send to backend
        const res = await fetch("https://localhost:7023/api/Packet/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();

        console.log("Upload success:", data);

        setUploadedFileName(fileName);
        setCurrentScreen("filter");
      } 
      catch (err) {
        console.error(err);
        setCurrentScreen("error");
      }
    } 
    else {
      setCurrentScreen("error");
    }
  };

  const handleTryAgain = () => {
    setCurrentScreen("home");
  };

  const handleAnalyze = async (filters: FilterOptions) => {
    try {
      const res = await fetch("https://localhost:7023/api/Packet/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      const data = await res.json();

      // assuming backend returns { packets: [...] }
      setPackets(data.packets);

      setCurrentScreen("results");
    } 
    catch (error) {
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
