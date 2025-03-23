// app/api/process-signals/route.ts
import { NextResponse } from "next/server";
import { parseTweetDate } from "@/lib/date-utils";
import { fetchPriceData } from "@/lib/coingecko";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    // Process data
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
  const tokenIds = [...new Set(data.map((item) => item.signal_data.tokenId))];

  // Fetch price data for all tokens
  const priceCache = new Map<string, [number, number][]>();
  await Promise.all(
    tokenIds.map(async (tokenId) => {
      const prices = await fetchPriceData(tokenId);
      if (prices) priceCache.set(tokenId, prices);
    })
  );

  return data.map((item) => {
    const signal = item.signal_data;
    try {
      const prices = priceCache.get(signal.tokenId) || [];
      const tweetTimestamp = parseTweetDate(signal.tweet_timestamp);
      const relevantPrices = prices.filter(([ts]) => ts >= tweetTimestamp);

      if (!relevantPrices.length)
        return { ...item, exit_price: "N/A", p_and_l: "N/A" };

      const priceAtTweet = parseFloat(signal.priceAtTweet);
      const TP1 = parseFloat(signal.targets[0]);
      const SL = parseFloat(signal.stopLoss);

      if (priceAtTweet > TP1 || priceAtTweet < SL) {
        return { ...item, exit_price: "N/A", p_and_l: "N/A" };
      }

      const exitPrice = calculateExitPrice(
        relevantPrices,
        priceAtTweet,
        TP1,
        SL
      );
      const pnl = ((exitPrice - priceAtTweet) / priceAtTweet) * 100;

      return {
        ...item,
        exit_price: exitPrice.toFixed(6),
        p_and_l: `${pnl.toFixed(2)}%`,
      };
    } catch (error) {
      return { ...item, exit_price: "N/A", p_and_l: "N/A" };
    }
  });
}

function calculateExitPrice(
  prices: [number, number][],
  entryPrice: number,
  TP1: number,
  SL: number
) {
  let exitPrice = prices[prices.length - 1][1];
  let peakPrice = entryPrice;
  let tp1Hit = false;

  for (const [ts, price] of prices) {
    if (price <= SL) {
      exitPrice = SL;
      break;
    }

    if (price >= TP1) tp1Hit = true;

    if (tp1Hit) {
      if (price > peakPrice) peakPrice = price;
      else if (price <= peakPrice * 0.99) {
        exitPrice = price;
        break;
      }
    }
  }

  return exitPrice;
}
