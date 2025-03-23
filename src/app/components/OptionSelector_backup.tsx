"use client";

import { useState } from "react";
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

  const platforms = [
    { name: "CTxbt", image: "/assets/ctxbt.svg" },
    { name: "Kaito", image: "/assets/kaito.svg" },
    { name: "Dune", image: "/assets/dune.svg" },
    { name: "Chainlink", image: "/assets/chainlink.svg" },
    { name: "1Inch", image: "/assets/1inch.svg" },
    { name: "dYdX", image: "/assets/dydx.svg" },
    { name: "Moralis", image: "/assets/moralis.svg" },
  ];

  const handleSimulate = () => {
    setShowTable(true);
  };

  const handleApiSimulate = async () => {
    if (!apiKey || !selectedPlatform) return;

    const result = await simulateApiCall(
      apiKey,
      selectedPlatform
      // setShowTable
    );

    if (result.success && result.data) {
      setTableData(result.data); // Update table data with API response
      toast.success(
        "Simulation data fetched and CSV downloaded successfully!",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  };

  // Handle platform selection with toaster for non-CTxbt platforms
  const handlePlatformChange = (platformName: string) => {
    if (platformName === "CTxbt") {
      setSelectedPlatform(platformName);
    } else {
      toast.info(`${platformName} - Coming Soon!`, {
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
            onClick={handleSimulate}
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
      title: "Copy from Platforms",
      description:
        "Connect to Web3 platforms using an API key to fetch real-time blockchain data. Select a platform (e.g., CTxbt) to retrieve crypto signals, token prices, and market insights for simulation.",
      icon: <Globe className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
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
              {showApiKey ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="relative">
            <select
              value={selectedPlatform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Select Platform</option>
              {platforms.map((platform) => (
                <option key={platform.name} value={platform.name}>
                  {platform.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
          </div>
          <button
            onClick={handleApiSimulate}
            disabled={!apiKey || !selectedPlatform}
            className={`flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-lg transition-colors ${
              apiKey && selectedPlatform
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
  };

  return (
    <div className="w-[70vw] mx-auto p-6 hidden lg:block">
      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
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
          {showTable && (
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
                      Twitter Account
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      Tweet
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      Tweet Date
                    </th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">
                      Signal Generation Date
                    </th>
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
                      Price at Tweet
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
                  {tableData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.twitterHandle}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        <a
                          href={row.signal_data.tweet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Link
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(
                          row.signal_data.tweet_timestamp
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(
                          row.signal_data.tweet_timestamp
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.signal}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.tokenMentioned}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.tokenId}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.priceAtTweet}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.currentPrice}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.targets[0]}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.targets[1]}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {row.signal_data.stopLoss}
                      </td>
                      <td className="py-3 px-4 text-gray-300">N/A</td>
                      <td className="py-3 px-4 text-gray-300">N/A</td>
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
