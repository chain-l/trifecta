"use client";

import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { simulateApiCall } from "../utils/apiSimulator";
import { Eye, EyeOff, Play, Loader2, InfoIcon } from "lucide-react";
import PlatformResultsTable from "./PlatformResultsTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const generateCSV = (data: any[]): any => {
  const headers = [
    "Signal Generation Date",
    "Signal Message",
    "Token Mentioned",
    "Token ID",
    "Current Price",
    "TP1",
    "TP2",
    "SL",
    "Exit Price",
    "P&L",
  ];

  const rows = data.map((item) => {
    const signalData = item.signal_data;
    return [
      signalData.tweet_timestamp,
      signalData.signal,
      signalData.tokenMentioned,
      signalData.tokenId,
      signalData.currentPrice,
      signalData.targets[0],
      signalData.targets[1],
      signalData.stopLoss,
      item.exit_price || "",
      item.p_and_l || "",
    ]
      .map((field) => `"${field || ""}"`)
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
};

const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Download successful", {
    position: "top-center",
    autoClose: 2000,
  });
};

const platforms = [
  { name: "CTxbt", image: "/assets/ctxbt.svg" },
  { name: "Kaito", image: "/assets/kaito.svg" },
  { name: "Dune", image: "/assets/dune.png" },
  { name: "Chainlink", image: "/assets/chainlink.png" },
  { name: "1Inch", image: "/assets/1inch.png" },
  { name: "dYdX", image: "/assets/dydx.svg" },
  { name: "Moralis", image: "/assets/moralis.png" },
];

interface PlatformSelectorProps {
  onSimulateSuccess: (data: any) => void;
}

const PlatformSelector = ({ onSimulateSuccess }: PlatformSelectorProps) => {
  const [apiKey, setApiKey] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef(null);
  const [summary, setSummary] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleApiSimulate = async () => {
    if (!apiKey || !selectedPlatform) {
      toast.warn("Please enter an API key and select a platform.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsSimulating(true);
    toast.info("Starting simulation process...", {
      position: "top-center",
      autoClose: 3000,
    });

    try {
      const result = await simulateApiCall(apiKey, selectedPlatform);
      if (result.success && result.data) {
        setResults(result.data);
        setShowResults(true);
        onSimulateSuccess?.(result.data);
        // toast.success("Simulation completed successfully", {
        //   position: "top-center",
        //   autoClose: 3000,
        // });
      } else {
        throw new Error("No data returned from simulation.");
      }
    } catch (error) {
      console.error("Simulation failed:", error);
      toast.error(`Simulation failed: ${error.message}. Please try again.`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const calculateAveragePnl = (results) => {
    const validPnls = results
      .map((item) => item.p_and_l)
      .filter((pnl) => pnl !== "N/A")
      .map((pnl) => parseFloat(pnl.replace("%", "")));

    if (validPnls.length === 0) return 0;

    const sum = validPnls.reduce((acc, val) => acc + val, 0);
    return sum / validPnls.length;
  };

  const fetchSummary = async (data) => {
    try {
      const response = await fetch("http://localhost:3001/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to fetch summary");

      const result = await response.json();
      const summaryString = result.summary;
      const jsonMatch = summaryString.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1].trim();
        const parsedJson = JSON.parse(jsonString);
        if (parsedJson.insights) return parsedJson.insights;
      }
      return summaryString;
    } catch (error) {
      console.error("Error fetching summary:", error);
      return "Failed to generate summary.";
    }
  };

  const handleSummarize = async () => {
    setIsLoadingSummary(true);
    toast.info("Generating summary...", {
      position: "top-center",
      autoClose: 3000,
    });

    const averagePnl = calculateAveragePnl(results);
    const dataToSend = {
      averagePnl,
      signals: results.map((item) => ({
        token: item.signal_data.tokenMentioned,
        pnl: item.p_and_l,
      })),
    };
    const fetchedSummary = await fetchSummary(dataToSend);
    setSummary(" " + fetchedSummary);
    setDisplayedSummary("");
    setIsTyping(true);
    setIsLoadingSummary(false);
    toast.success("Summary generated successfully!", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  useEffect(() => {
    if (isTyping && summary) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < summary.length) {
          setDisplayedSummary((prev) => prev + summary[index]);
          index++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isTyping, summary]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
          className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholderText="Select a date"
          dateFormat="MMMM d, yyyy"
          showPopperArrow={false}
        />
      </div>

      <div className="relative">
        <input
          type={showApiKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API Key"
          className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowApiKey(!showApiKey)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
        >
          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative">
        <div
          ref={triggerRef}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg cursor-pointer flex items-center justify-between"
        >
          {selectedPlatform ? (
            <div className="flex items-center">
              <img
                src={platforms.find((p) => p.name === selectedPlatform)?.image}
                alt={selectedPlatform}
                className="w-5 h-5 mr-2"
              />
              <span>{selectedPlatform}</span>
            </div>
          ) : (
            <span>Select Platform</span>
          )}
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {dropdownOpen && triggerRef.current && (
          <div
            style={{
              position: "absolute",
              top: triggerRef.current.getBoundingClientRect().height,
              left: 0,
              width: triggerRef.current.getBoundingClientRect().width,
              maxHeight: "200px",
              overflowY: "scroll",
              zIndex: 1000,
            }}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            {platforms.map((platform) => (
              <div
                key={platform.name}
                onClick={() => {
                  if (platform.name === "CTxbt") {
                    setSelectedPlatform(platform.name);
                    setDropdownOpen(false);
                  }
                }}
                className={`flex items-center p-3 ${
                  platform.name === "CTxbt"
                    ? "cursor-pointer hover:bg-gray-700"
                    : "cursor-not-allowed opacity-70"
                }`}
              >
                <img
                  src={platform.image}
                  alt={platform.name}
                  className="w-7 h-7 mr-2 bg-transparent"
                  style={{ background: "none" }}
                />
                <span>{platform.name}</span>
                {platform.name !== "CTxbt" && (
                  <span className="ml-2 text-gray-400">(Coming Soon ✨)</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleApiSimulate}
        disabled={isSimulating || !apiKey || !selectedPlatform}
        className={`flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-lg transition-colors ${
          isSimulating
            ? "bg-blue-600 text-white cursor-not-allowed"
            : apiKey && selectedPlatform
            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            : "bg-gray-800 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSimulating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        <span>{isSimulating ? "Simulating..." : "Simulate"}</span>
      </button>

      {showResults && (
        <div>
          <div className="flex items-start gap-2 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-200 text-sm">
          <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>
          You can download your backtested data in CSV. And Summarize it using 0G Computation as well.
          </span>
        </div>

          <button
            onClick={handleSummarize}
            disabled={isLoadingSummary}
            className={`mt-4 py-2 px-4 rounded ${
              isLoadingSummary
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            }`}
          >
            {isLoadingSummary ? "Summarizing..." : "Summarize Result"}
          </button>
          <button
            onClick={() => {
              const csvContent = generateCSV(results);
              downloadCSV(csvContent, "backtestingResult.csv");
            }}
            className="mt-4 ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
          >
            Download CSV
          </button>
          {summary && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300 font-mono">
                {displayedSummary}
                {isTyping && <span className="animate-blink">|</span>}
              </p>
            </div>
          )}
          <PlatformResultsTable data={results} />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default PlatformSelector;