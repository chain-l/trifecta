"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Globe, Play, Eye, EyeOff, InfoIcon } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OptionsSelector = () => {
  const [activeOption, setActiveOption] = useState<'option1' | 'option2'>('option1');
  const [telegramMessage, setTelegramMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false); // State for toggling API key visibility

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

  const tableData = [
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
      P_and_L: "-4.55%"
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
      P_and_L: "21.44%"
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
      P_and_L: "N/A"
    }
  ];

  const options = {
    option1: {
      title: "Copy from Telegram",
      description: "Paste a message from Telegram to analyze crypto trading signals. This option extracts data such as tokens, prices, and signals directly from your Telegram messages, helping you simulate potential trades.",
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
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
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
      description: "Connect to Web3 platforms using an API key to fetch real-time blockchain data. Select a platform (e.g., CTxbt) to retrieve crypto signals, token prices, and market insights for simulation.",
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
              {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <button
            onClick={handleSimulate}
            disabled={!apiKey || !selectedPlatform}
            className={`flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-lg transition-colors ${
              apiKey && selectedPlatform
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
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
          {(['option1', 'option2'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setActiveOption(option)}
              className={`relative flex-1 px-8 py-4 text-sm font-medium transition-colors
                ${activeOption === option ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400/80'}`}
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
            <div className="text-gray-400 text-sm mb-4 flex items-center gap-2"><InfoIcon color='rgb(61, 187, 245)' /><span>{options[activeOption].description}</span></div>
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
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Image</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Twitter Account</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Tweet</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Tweet Date</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Signal Generation Date</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Signal Message</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Token Mentioned</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Token ID</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Price at Tweet</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Current Price</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">TP1</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">TP2</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">SL</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Exit Price</th>
                    <th className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-gray-300">
                        <img src={row.image} alt="Platform Image" className="w-10 h-10 rounded-full" />
                      </td>
                      <td className="py-3 px-4 text-gray-300">{row.Twitter_Account}</td>
                      <td className="py-3 px-4 text-gray-300">
                        <a href={row.Tweet} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          Link
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{new Date(row.Tweet_Date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-300">{new Date(row.Signal_Generation_Date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-300">{row.Signal_Message}</td>
                      <td className="py-3 px-4 text-gray-300">{row.Token_Mentioned}</td>
                      <td className="py-3 px-4 text-gray-300">{row.Token_ID}</td>
                      <td className="py-3 px-4 text-gray-300">{row.Price_at_Tweet}</td>
                      <td className="py-3 px-4 text-gray-300">{row.Current_Price}</td>
                      <td className="py-3 px-4 text-gray-300">{row.TP1}</td>
                      <td className="py-3 px-4 text-gray-300">{row.TP2}</td>
                      <td className="py-3 px-4 text-gray-300">{row.SL}</td>
                      <td className="py-3 px-4 text-gray-300">{row.Exit_Price}</td>
                      <td className="py-3 px-4 text-gray-300">{row.P_and_L}</td>
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