
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";

const marketIndexes = [
  {
    name: "S&P 500",
    value: "4,687.35",
    change: "+28.45",
    percentChange: "+0.61%",
    isPositive: true,
  },
  {
    name: "Nasdaq",
    value: "16,742.13",
    change: "+211.49",
    percentChange: "+1.28%",
    isPositive: true,
  },
  {
    name: "Dow Jones",
    value: "38,976.04",
    change: "-38.62",
    percentChange: "-0.10%",
    isPositive: false,
  },
  {
    name: "Bitcoin",
    value: "$67,824.15",
    change: "+$1,245.32",
    percentChange: "+1.87%",
    isPositive: true,
  },
];

const MarketOverview = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Coins className="h-5 w-5 text-trading-accent" />
          <span>Market Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {marketIndexes.map((index) => (
            <div
              key={index.name}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{index.name}</span>
                <span className="text-lg font-bold">{index.value}</span>
              </div>
              
              <div
                className={`flex items-center ${
                  index.isPositive ? "text-positive" : "text-negative"
                }`}
              >
                {index.isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{index.change}</span>
                  <span className="text-xs">{index.percentChange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
