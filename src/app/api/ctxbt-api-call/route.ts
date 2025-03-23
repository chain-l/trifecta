// /api/ctxbt-api-call/route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs"; 
import path from "path";

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
      "", // Exit Price
      "", // P&L
    ]
      .map((field) => `"${field || ""}"`)
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    const response = await fetch("https://app.ctxbt.com/api/get-my-signals", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.success && data.data && data.data.length > 0) {
      const csvContent = generateCSV(data.data);
      // Write to local filesystem in root directory
      const filePath = path.join(process.cwd(), "backtesting.csv");
      await fs.writeFile(filePath, csvContent, "utf8");
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  } catch (error) {
    console.error("Proxy API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch signals",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
