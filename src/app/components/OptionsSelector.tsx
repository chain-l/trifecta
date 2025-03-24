"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Globe,
  Play,
  Eye,
  EyeOff,
  InfoIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { simulateApiCall } from "../utils/apiSimulator";
import "react-toastify/dist/ReactToastify.css";
import PlatformSelector from "./PlatformSelector";
import coins from '../../../coins.json';

function getCoinIdFromJson(tokenSymbol: string): string | null {
  const tokenSymbolLower = tokenSymbol.toLowerCase();
  const coin = coins.find((coin) => coin.symbol.toLowerCase() === tokenSymbolLower);
  return coin ? coin.id : null;
}

const OptionsSelector = () => {
  const [activeOption, setActiveOption] = useState<"option1" | "option2">("option1");
  const [telegramMessage, setTelegramMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleTelegramSimulate = async () => {
    setIsLoading(true); // Start loading
    toast.info("Starting inference process...", {
      position: "top-center",
      autoClose: 3000,
    });

    try {
      const response = await fetch('https://ogxbt.xmutant.xyz/infer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: telegramMessage }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Raw inference response:', responseText);

      let data: { result: string; };
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Failed to parse response as JSON');
      }

      console.log('Inference result:', data.result);

      let parsedResult: { tokenSymbol: any; signal: any; tp1: any; tp2: any; sl: any; };
      try {
        parsedResult = JSON.parse(data.result);
      } catch (parseError) {
        throw new Error('Failed to parse result as JSON');
      }

      if (parsedResult && parsedResult.tokenSymbol && parsedResult.signal && parsedResult.tp1 && parsedResult.tp2 && parsedResult.sl) {
        const tokenSymbolLower = parsedResult.tokenSymbol.toLowerCase();
        const coinId = getCoinIdFromJson(tokenSymbolLower);
        console.log("Coin ID: ", coinId);

        const processData = {
          signal_data: {
            tokenSymbol: parsedResult.tokenSymbol,
            signal: parsedResult.signal,
            tp1: parsedResult.tp1,
            tp2: parsedResult.tp2,
            sl: parsedResult.sl,
            tokenId: coinId,
          }
        };

        console.log("Processed data", processData);

        toast.info("Processing signal data...", {
          position: "top-center",
          autoClose: 3000,
        });

        const processResponse = await fetch('/api/process-telegram-signals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processData),
        });

        if (!processResponse.ok) {
          throw new Error('Failed to process signals');
        }

        const processedData = await processResponse.json();
        console.log(processedData.data);
        setTableData([processedData.data]);
        setShowTable(true);
        toast.success("Signal processing completed! Displaying results...", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error('Invalid response format. Please try again.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error('Error during inference:', error);
      toast.error(`Failed to perform inference: ${error.message}. Please try again.`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handlePlatformSimulateSuccess = (data: any) => {
    setTableData(data);
    setShowTable(true);
  };

  const options = {
    option1: {
      title: "Copy from Telegram",
      description: (
        <div className="flex items-start gap-2 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-200 text-sm">
          <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>
            Paste a message from Telegram to analyze crypto trading signals. This option extracts data such as tokens, prices, and signals directly from your Telegram messages, helping you simulate potential trades.
          </span>
        </div>
      ),
      icon: <MessageSquare className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <textarea
              value={telegramMessage}
              onChange={(e) => setTelegramMessage(e.target.value)}
              placeholder="Paste your telegram message here..."
              className="w-full h-32 p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          {/* Add the new code here */}
          <div className="flex items-start gap-2 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
            <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>
              Please paste a Telegram message containing trading-related signals, including Target Price (TP), Stop Loss (SL), and other relevant data, to generate accurate trading insights.
            </span>
          </div>
          <button
            onClick={handleTelegramSimulate}
            disabled={!telegramMessage || isLoading} // Disable when loading
            className={`flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-lg transition-colors ${telegramMessage && !isLoading
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              : "bg-gray-800 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Simulate</span>
              </>
            )}
          </button>
        </div>
      ),
    },
    option2: {
      title: "Connect to platform API",
      description: (
        <div className="flex items-start gap-2 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-200 text-sm">
          <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>
            Connect to Web3 platforms using an API key to fetch real-time blockchain data. Select a platform (e.g., CTxbt) to retrieve crypto signals, token prices, and market insights for simulation.
          </span>
        </div>
      ),
      icon: <Globe className="w-5 h-5" />,
      content: (
        <PlatformSelector onSimulateSuccess={handlePlatformSimulateSuccess} />
      ),
    },
  };

  return (
    <div className="w-[70vw] mx-auto p-6 hidden lg:block">
      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-visible">
        <div className="flex border-b border-gray-800">
          {(["option1", "option2"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setActiveOption(option)}
              className={`relative flex-1 px-8 py-4 text-sm font-medium transition-colors
                ${activeOption === option
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-blue-400/80"
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {options[option].icon}
                <span>{options[option].title}</span>
              </div>
              {activeOption === option && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          <motion.div
            key={activeOption}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-gray-400 text-sm mb-4 flex items-center gap-2">
              <span>{options[activeOption].description}</span>
            </div>
            {options[activeOption].content}
          </motion.div>

          {showTable && activeOption === "option1" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8 overflow-x-auto"
            >
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      Signal Message
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      Token Mentioned
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      Token ID
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      Current Price
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      TP1
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      TP2
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      SL
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      Exit Price
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      P&L
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-gray-300">{row.signal}</td>
                      <td className="py-3 px-4 text-gray-300">{row.tokenSymbol}</td>
                      <td className="py-3 px-4 text-gray-300">{row.tokenId}</td>
                      <td className="py-3 px-4 text-gray-300">{row.currentPrice}</td>
                      <td className="py-3 px-4 text-gray-300">{row.tp1}</td>
                      <td className="py-3 px-4 text-gray-300">{row.tp2}</td>
                      <td className="py-3 px-4 text-gray-300">{row.sl}</td>
                      <td className="py-3 px-4 text-gray-300">{row.exit_price}</td>
                      <td className="py-3 px-4 text-gray-300">{row.p_and_l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OptionsSelector;