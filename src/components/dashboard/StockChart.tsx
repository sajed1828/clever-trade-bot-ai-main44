
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartLine, ArrowUp, ArrowDown } from "lucide-react";

// Mock data for chart
const data = [
  { date: "Jan", price: 405.36 },
  { date: "Feb", price: 408.22 },
  { date: "Mar", price: 417.95 },
  { date: "Apr", price: 408.67 },
  { date: "May", price: 429.54 },
  { date: "Jun", price: 438.11 },
  { date: "Jul", price: 450.21 },
  { date: "Aug", price: 456.89 },
  { date: "Sep", price: 443.16 },
  { date: "Oct", price: 460.25 },
  { date: "Nov", price: 478.75 },
  { date: "Dec", price: 465.12 },
];

interface StockChartProps {
  symbol?: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

const StockChart: React.FC<StockChartProps> = ({
  symbol = "AAPL",
  price = 465.12,
  change = -13.63,
  changePercent = -2.85,
}) => {
  const isPositive = change >= 0;
  const changeColor = isPositive ? "text-positive" : "text-negative";
  const changeIcon = isPositive ? (
    <ArrowUp className="h-4 w-4" />
  ) : (
    <ArrowDown className="h-4 w-4" />
  );
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <ChartLine className="h-5 w-5 text-trading-accent" />
            <span>{symbol} Stock Chart</span>
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">${price.toLocaleString()}</div>
          <div className={`flex items-center ${changeColor}`}>
            {changeIcon}
            <span className="ml-1">
              ${Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Price"]}
                labelFormatter={(label) => `${label}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button className="text-xs bg-muted/50 px-3 py-1 rounded-full hover:bg-muted transition-colors">1D</button>
          <button className="text-xs bg-muted/50 px-3 py-1 rounded-full hover:bg-muted transition-colors">1W</button>
          <button className="text-xs bg-muted/50 px-3 py-1 rounded-full hover:bg-muted transition-colors">1M</button>
          <button className="text-xs bg-primary text-white px-3 py-1 rounded-full">1Y</button>
          <button className="text-xs bg-muted/50 px-3 py-1 rounded-full hover:bg-muted transition-colors">5Y</button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
