
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const marketData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "$175.23",
    change: "+2.45%",
    volume: "58.2M",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: "$342.12",
    change: "+1.23%",
    volume: "42.1M",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: "$142.56",
    change: "-0.52%",
    volume: "31.5M",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: "$145.89",
    change: "+3.21%",
    volume: "45.8M",
  },
];

const MarketTable = () => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{t("marketTable.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t("marketTable.symbol")}</th>
                <th className="text-left p-2">{t("marketTable.name")}</th>
                <th className="text-right p-2">{t("marketTable.price")}</th>
                <th className="text-right p-2">{t("marketTable.change")}</th>
                <th className="text-right p-2">{t("marketTable.volume")}</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((stock) => (
                <tr key={stock.symbol} className="border-b">
                  <td className="p-2 font-medium">{stock.symbol}</td>
                  <td className="p-2 text-muted-foreground">{stock.name}</td>
                  <td className="p-2 text-right">{stock.price}</td>
                  <td
                    className={`p-2 text-right ${
                      stock.change.startsWith("+")
                        ? "text-positive"
                        : "text-negative"
                    }`}
                  >
                    <span className="flex items-center justify-end">
                      {stock.change.startsWith("+") ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stock.change}
                    </span>
                  </td>
                  <td className="p-2 text-right">{stock.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketTable;
