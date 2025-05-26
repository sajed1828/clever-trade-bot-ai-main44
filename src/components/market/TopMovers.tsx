
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const topMovers = [
  { symbol: "AAPL", change: "+5.67%", price: "$175.23" },
  { symbol: "TSLA", change: "-3.45%", price: "$242.12" },
  { symbol: "NVDA", change: "+4.21%", price: "$456.78" },
  { symbol: "AMD", change: "+2.89%", price: "$123.45" },
];

const TopMovers = () => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{t("marketAnalysis.topMovers")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topMovers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.price}</div>
              </div>
              <div
                className={`flex items-center ${
                  stock.change.startsWith("+") ? "text-positive" : "text-negative"
                }`}
              >
                {stock.change.startsWith("+") ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {stock.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopMovers;
