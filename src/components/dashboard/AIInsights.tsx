
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const insights = [
  {
    id: 1,
    type: "buy",
    symbol: "TSLA",
    reason: "Strong technical indicators showing an upward trend, supported by recent positive quarterly earnings.",
    confidence: 85,
    isPositive: true,
  },
  {
    id: 2,
    type: "sell",
    symbol: "META",
    reason: "Recent negative sentiment combined with increased competition in the AR space may impact upcoming growth.",
    confidence: 72,
    isPositive: false,
  },
  {
    id: 3,
    type: "watch",
    symbol: "NVDA",
    reason: "Approaching key resistance level. Monitor for breakout or pullback before making a decision.",
    confidence: 68,
    isPositive: null,
  },
];

const AIInsights = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bot className="h-5 w-5 text-trading-accent" />
            <span>AI Trading Insights</span>
          </CardTitle>
          <Badge variant="secondary" className="bg-trading-accent/10 text-trading-accent hover:bg-trading-accent/20">
            3 New Recommendations
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="relative border p-4 rounded-lg bg-card"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      insight.type === "buy"
                        ? "bg-positive text-white"
                        : insight.type === "sell"
                        ? "bg-negative text-white"
                        : "bg-amber-400 text-amber-900"
                    }
                  >
                    {insight.type === "buy"
                      ? "BUY"
                      : insight.type === "sell"
                      ? "SELL"
                      : "WATCH"}
                  </Badge>
                  <span className="font-bold text-lg">{insight.symbol}</span>
                </div>
                <div className="flex items-center">
                  {insight.isPositive === true && (
                    <TrendingUp className="h-4 w-4 text-positive mr-1" />
                  )}
                  {insight.isPositive === false && (
                    <TrendingDown className="h-4 w-4 text-negative mr-1" />
                  )}
                  {insight.isPositive === null && (
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      insight.confidence > 80
                        ? "text-positive"
                        : insight.confidence > 60
                        ? "text-amber-500"
                        : "text-negative"
                    }`}
                  >
                    {insight.confidence}% confidence
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{insight.reason}</p>
              
              <div className="flex gap-2 mt-3">
                <button className="text-xs bg-trading-accent text-white px-3 py-1 rounded-full hover:bg-trading-accent/90 transition-colors">
                  View Analysis
                </button>
                <button className="text-xs border border-trading-accent text-trading-accent px-3 py-1 rounded-full hover:bg-trading-accent/10 transition-colors">
                  {insight.type === "buy"
                    ? "Buy Now"
                    : insight.type === "sell"
                    ? "Sell Now"
                    : "Add to Watchlist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
