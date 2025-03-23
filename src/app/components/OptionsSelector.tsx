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
  // Convert the token symbol to lowercase
  const tokenSymbolLower = tokenSymbol.toLowerCase();

  // Search for the token symbol in the coins.json data
  const coin = coins.find((coin) => coin.symbol.toLowerCase() === tokenSymbolLower);

  // Return the coin ID if found, otherwise return null
  return coin ? coin.id : null;
}

const dummyTableData = [
  {
    id: 1,
    image: "https://picsum.photos/50/50?random=1",
    Twitter_Account: "cryptostasher",
    Tweet: "https://x.com/cryptostasher/status/1898008977801125996",
    Tweet_Date: "2025-03-07T13:52:58.000Z",
    Signal_Generation_Date: "2025-03-19T10:41:18.954Z",
    Signal_Message: "Buy",
    Token_Mentioned: "ZIG",
    Token_ID: "zignaly",
    Price_at_Tweet: 0.08839765311728418,
    Current_Price: 0.08332613939091653,
    TP1: 0.1,
    TP2: 0.15,
    SL: 0.0708,
    Exit_Price: 0.08437719090322876,
    P_and_L: "-4.55%",
  },
  {
    id: 2,
    image: "https://picsum.photos/50/50?random=2",
    Twitter_Account: "Cryptobullmaker",
    Tweet: "https://x.com/Cryptobullmaker/status/1898588132398027046",
    Tweet_Date: "2025-03-09T04:14:19.000Z",
    Signal_Generation_Date: "2025-03-19T10:42:38.487Z",
    Signal_Message: "Buy",
    Token_Mentioned: "AST",
    Token_ID: "astra-2",
    Price_at_Tweet: 0.238839765311728418,
    Current_Price: 0.00042143784946687166,
    TP1: 0.0005,
    TP2: 0.00055,
    SL: 0.0004,
    Exit_Price: 0.0005375392354823141,
    P_and_L: "21.44%",
  },
  {
    id: 3,
    image: "https://picsum.photos/50/50?random=3",
    Twitter_Account: "CryptoGemRnld",
    Tweet: "https://x.com/CryptoGemRnld/status/1898004492236603820",
    Tweet_Date: "2025-03-07T13:35:08.000Z",
    Signal_Generation_Date: "2025-03-19T10:45:27.110Z",
    Signal_Message: "Buy",
    Token_Mentioned: "LNQ",
    Token_ID: "linqai",
    Price_at_Tweet: 0.12439765311728418,
    Current_Price: 0.03137818737413583,
    TP1: 0.04,
    TP2: 0.045,
    SL: 0.028,
    Exit_Price: "N/A",
    P_and_L: "N/A",
  },
];

const OptionsSelector = () => {
  const [activeOption, setActiveOption] = useState<"option1" | "option2">(
    "option1"
  );
  const [telegramMessage, setTelegramMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false); // State for toggling API key visibility
  const [tableData, setTableData] = useState<any[]>([]);

  const handleTelegramSimulate = async () => {
    try {
      const response = await fetch('http://localhost:3001/infer', {
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
        // Convert tokenSymbol to lowercase and fetch coin ID from coins.json
        const tokenSymbolLower = parsedResult.tokenSymbol.toLowerCase();
        const coinId = getCoinIdFromJson(tokenSymbolLower);
        console.log("Coin ID: ", coinId);

        // Prepare data for process-signal API
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

        // Send data to process-signal API
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
      toast.error('Failed to perform inference. Please try again.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handlePlatformSimulateSuccess = (data: any) => {
    setTableData(data);
    setShowTable(true);
  };

  const options = {
    option1: {
      title: "Copy from Telegram",
      description:
        "Paste a message from Telegram to analyze crypto trading signals. This option extracts data such as tokens, prices, and signals directly from your Telegram messages, helping you simulate potential trades.",
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
          <button
            onClick={handleTelegramSimulate}
            disabled={!telegramMessage}
            className={`flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-lg transition-colors ${
              telegramMessage
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-800 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Simulate</span>
          </button>
        </div>
      ),
    },
    option2: {
      title: "Connect to platform API",
      description:
        "Connect to Web3 platforms using an API key to fetch real-time blockchain data. Select a platform (e.g., CTxbt) to retrieve crypto signals, token prices, and market insights for simulation.",
      icon: <Globe className="w-5 h-5" />,
      content: (
        <PlatformSelector onSimulateSuccess={handlePlatformSimulateSuccess} />
      ),
    },
  };

  return (
    <div className="w-[70vw] mx-auto p-6 hidden lg:block">
      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-visible">
        {/* Options Header */}
        <div className="flex border-b border-gray-800">
          {(["option1", "option2"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setActiveOption(option)}
              className={`relative flex-1 px-8 py-4 text-sm font-medium transition-colors
                ${
                  activeOption === option
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

        {/* Content Section */}
        <div className="p-8">
          <motion.div
            key={activeOption}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Description */}
            <div className="text-gray-400 text-sm mb-4 flex items-center gap-2">
              <InfoIcon color="rgb(61, 187, 245)" />
              <span>{options[activeOption].description}</span>
            </div>
            {options[activeOption].content}
          </motion.div>

          {/* Table Section */}
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
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.tokenSymbol}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.tokenId}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.currentPrice}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.tp1}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.tp2}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.sl}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.exit_price}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.p_and_l}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>
      {/* Toast Container for displaying messages */}
      <ToastContainer />
    </div>
  );
};


export default OptionsSelector;