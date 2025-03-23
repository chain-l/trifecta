// apiSimulator.ts
import { toast } from "react-toastify";

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
