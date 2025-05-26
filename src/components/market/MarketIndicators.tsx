
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ChartLine } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const data = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 120 },
  { name: "Mar", value: 110 },
  { name: "Apr", value: 140 },
  { name: "May", value: 130 },
  { name: "Jun", value: 150 },
];

const MarketIndicators = () => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <ChartLine className="h-5 w-5 text-trading-accent" />
          {t("marketAnalysis.marketIndicators")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketIndicators;
