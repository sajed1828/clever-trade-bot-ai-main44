
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

const portfolioData = [
  { name: "Technology", value: 42 },
  { name: "Healthcare", value: 18 },
  { name: "Financials", value: 15 },
  { name: "Consumer", value: 13 },
  { name: "Energy", value: 7 },
  { name: "Others", value: 5 },
];

const COLORS = ["#8B5CF6", "#7C3AED", "#6D28D9", "#5B21B6", "#4C1D95", "#6366F1"];

const PortfolioSummary = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Wallet className="h-5 w-5 text-trading-accent" />
          <span>Portfolio Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">$148,532.41</div>
              <div className="ml-2 text-sm text-positive flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.64%
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Total portfolio value
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Annual return</span>
                  <span className="font-medium text-positive">+12.34%</span>
                </div>
                <div className="h-1.5 bg-muted/50 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-positive rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Risk Level</span>
                  <span className="font-medium">Moderate</span>
                </div>
                <div className="h-1.5 bg-muted/50 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>
              
              <div className="p-3 border rounded-md flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">AI Recommendation</div>
                  <div className="text-muted-foreground">Rebalance portfolio</div>
                </div>
                <button className="text-xs bg-trading-accent text-white px-3 py-1 rounded-full">
                  View Details
                </button>
              </div>
            </div>
          </div>
          
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
