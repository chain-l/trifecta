// apiSimulator.ts
import { toast } from "react-toastify";

interface SimulationResponse {
  success: boolean;
  data?: any[];
  error?: string;
  status?: number;
}

function generateCSV(data: any[]): string {
  const headers = [
    "Twitter Account",
    "Tweet",
    "Tweet Date",
    "Signal Generation Date",
    "Signal Message",
    "Token Mentioned",
    "Token ID",
    "Price at Tweet",
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
      signalData.twitterHandle,
      signalData.tweet_link,
      signalData.tweet_timestamp,
      signalData.tweet_timestamp,
      signalData.signal,
      signalData.tokenMentioned,
      signalData.tokenId,
      signalData.priceAtTweet,
      signalData.currentPrice,
      signalData.targets[0],
      signalData.targets[1],
      signalData.stopLoss,
      "", // Exit Price (null)
      "", // P&L (null)
    ]
      .map((field) => `"${field || ""}"`)
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

function downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const simulateApiCall = async (apiKey: string, platform: string) => {
  try {
    // First fetch from CTxbt API
    const ctxbtResponse = await fetch("/api/ctxbt-api-call", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!ctxbtResponse.ok) {
      throw new Error(`CTxbt API error: ${ctxbtResponse.status}`);
    }

    const ctxbtData = await ctxbtResponse.json();

    // Then process signals
    const processResponse = await fetch("/api/process-signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: ctxbtData.data }),
    });

    if (!processResponse.ok) {
      throw new Error("Signal processing failed");
    }

    const processedData = await processResponse.json();

    //   // Generate and download CSV on client-side
    //   if (processedData && processedData.data && processedData.data.length > 0) {
    //     const csvContent = generateCSV(processedData.data);
    //     //   downloadCSV(csvContent, "result.csv");
    //   }

    return {
      success: true,
      data: processedData.data,
    };
  } catch (error) {
    console.error("API Simulation Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
