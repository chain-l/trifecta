import { NextResponse } from "next/server";
import { parseTweetDate } from "@/lib/date-utils";
import { fetchPriceData } from "@/lib/coingecko";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    const processedData = await processSignals(data);
    return NextResponse.json({ success: true, data: processedData });
  } catch (error) {
    console.error("Error processing signals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process signals" },
      { status: 500 }
    );
  }
}

async function processSignals(data: any[]) {
  // Extract unique token IDs
  const uniqueTokenIds = [
    ...new Set(data.map((item) => item.signal_data.tokenId)),
  ];

  // Fetch price data for all tokens concurrently
  const priceCache = new Map<string, [number, number][]>();
  await Promise.all(
    uniqueTokenIds.map(async (tokenId) => {
      const prices = await fetchPriceData(tokenId);
      if (prices) {
        priceCache.set(tokenId, prices);
      } else {
        console.warn(`No price data for ${tokenId}`);
      }
    })
  );

  // Process each signal
  const processedData = data.map((item) => {
    const signal = item.signal_data;
    const tokenId = signal.tokenId;

    // Check if price data exists for the token
    if (!priceCache.has(tokenId)) {
      return {
        ...item,
        exit_price: "N/A",
        p_and_l: "N/A",
      };
    }

    let tweetTimestamp: number;
    try {
      tweetTimestamp = parseTweetDate(signal.tweet_timestamp);
    } catch (error) {
      console.error(
        `Error parsing date for signal: ${signal.tweet_timestamp}`,
        error
      );
      return {
        ...item,
        exit_price: "N/A",
        p_and_l: "N/A",
      };
    }

    const prices = priceCache
      .get(tokenId)!
      .filter(([ts]) => ts >= tweetTimestamp);

    if (prices.length === 0) {
      return {
        ...item,
        exit_price: "N/A",
        p_and_l: "N/A",
      };
    }

    const priceAtTweet = signal.priceAtTweet; // Number from JSON
    const TP1 = signal.targets[0]; // Number from JSON
    const SL = signal.stopLoss; // Number from JSON

    // Skip if price at tweet is greater than TP1 or less than SL
    if (priceAtTweet > TP1 || priceAtTweet < SL) {
      return {
        ...item,
        exit_price: "N/A",
        p_and_l: "N/A",
      };
    }

    let exitPrice: number | null = null;
    let peakPrice = priceAtTweet; // Initialize peak as starting price
    let tp1Hit = false;

    // Iterate through price data
    for (const [ts, price] of prices) {
      // Check SL first
      if (price <= SL) {
        exitPrice = SL;
        break;
      }

      // Check if TP1 is hit
      if (price >= TP1) {
        tp1Hit = true;
      }

      // After TP1 is hit, implement trailing stop
      if (tp1Hit) {
        if (price > peakPrice) {
          peakPrice = price; // Update peak if price increases
        } else if (price <= peakPrice * 0.99) {
          // Exit if price drops 1% from peak
          exitPrice = price;
          break;
        }
      }
    }

    // If no exit condition was met, use the last price
    if (exitPrice === null) {
      exitPrice = prices[prices.length - 1][1];
    }

    // Calculate P&L
    const pnl = ((exitPrice - priceAtTweet) / priceAtTweet) * 100;

    return {
      ...item,
      exit_price: exitPrice.toFixed(6),
      p_and_l: `${pnl.toFixed(2)}%`,
    };
  });

  return processedData;
}