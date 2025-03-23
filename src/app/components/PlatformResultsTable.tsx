"use client";

import { motion } from "framer-motion";

interface PlatformResultsTableProps {
  data: any[];
}

const PlatformResultsTable = ({ data }: PlatformResultsTableProps) => {
  return (
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
          {data.map((row) => (
            <tr key={row.id} className="border-b border-gray-800">
              <td className="py-3 px-4 text-gray-300">
                {new Date(row.signal_data.tweet_timestamp).toLocaleDateString()}
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
              <td className="py-3 px-4 text-gray-300">{row.exit_price}</td>
              <td className="py-3 px-4 text-gray-300">{row.p_and_l}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default PlatformResultsTable;
