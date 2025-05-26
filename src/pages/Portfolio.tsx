
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Bot, Brain, Cpu, LineChart, Zap, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Portfolio = () => {
  const { t } = useTranslation();
  const [selectedAlgo, setSelectedAlgo] = useState("xlstm");
  const [riskLevel, setRiskLevel] = useState("medium");
  
  // Portfolio allocation data
  const allocationData = [
    { name: 'Stocks', value: 45 },
    { name: 'Crypto', value: 25 },
    { name: 'Bonds', value: 20 },
    { name: 'Cash', value: 10 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#A3A3A3'];
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("portfolio.title")}</h1>
        <p className="text-muted-foreground">
          {t("portfolio.subtitle")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Portfolio Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your current asset allocation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-lg font-medium mb-2">Total Value</h3>
                <p className="text-3xl font-bold">$124,350.00</p>
                <p className="text-positive flex items-center mt-1">
                  <span>↑ 2.4%</span>
                  <span className="text-sm text-muted-foreground ml-1">past month</span>
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Return this year</span>
                  <span className="text-positive">+12.6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average volatility</span>
                  <span>Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risk level</span>
                  <Badge variant="secondary">{riskLevel.toUpperCase()}</Badge>
                </div>
              </div>
              
              <Button>View detailed report</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Algorithm Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span>Trading Strategy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="algo-select">Trading Algorithm</Label>
              <Select 
                value={selectedAlgo} 
                onValueChange={setSelectedAlgo}
              >
                <SelectTrigger id="algo-select">
                  <SelectValue placeholder="Select Algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dql">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <span>Deep Q-Learning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="lstm">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      <span>LSTM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="xlstm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>xLSTM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ensemble">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>Ensemble (All)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Risk Tolerance</Label>
              <RadioGroup 
                value={riskLevel} 
                onValueChange={setRiskLevel} 
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="r1" />
                  <Label htmlFor="r1">Conservative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="r2" />
                  <Label htmlFor="r2">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="r3" />
                  <Label htmlFor="r3">Aggressive</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button className="w-full">Apply Strategy</Button>
              <Button variant="outline" className="w-full">
                <Cpu className="h-4 w-4 mr-2" />
                Backtest Strategy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Strategy Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Performance Analysis</CardTitle>
          <CardDescription>Historical performance comparison of available algorithms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AlgoPerformanceCard
              name="Deep Q-Learning"
              icon={<Bot className="h-5 w-5" />}
              returnRate={14.2}
              trades={178}
              successRate={68}
              bestFor="Volatile Markets"
            />
            
            <AlgoPerformanceCard
              name="LSTM"
              icon={<LineChart className="h-5 w-5" />}
              returnRate={16.5}
              trades={134}
              successRate={72}
              bestFor="Trend Following"
            />
            
            <AlgoPerformanceCard
              name="xLSTM"
              icon={<Zap className="h-5 w-5" />}
              returnRate={18.7}
              trades={156}
              successRate={76}
              bestFor="Complex Patterns"
            />
            
            <AlgoPerformanceCard
              name="Ensemble"
              icon={<Brain className="h-5 w-5" />}
              returnRate={17.9}
              trades={142}
              successRate={79}
              bestFor="Balanced Approach"
            />
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Recommendation</h3>
            <p className="text-muted-foreground">
              Based on your risk profile and market conditions, the <strong>{
                riskLevel === "low" ? "LSTM" : 
                riskLevel === "high" ? "Deep Q-Learning" : "xLSTM"
              }</strong> algorithm is currently recommended. 
              This selection offers the best balance of risk and return for your portfolio.
            </p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

interface AlgoPerformanceCardProps {
  name: string;
  icon: React.ReactNode;
  returnRate: number;
  trades: number;
  successRate: number;
  bestFor: string;
}

const AlgoPerformanceCard = ({ name, icon, returnRate, trades, successRate, bestFor }: AlgoPerformanceCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 rounded-md bg-primary/10">
          {icon}
        </div>
        <h3 className="font-medium">{name}</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Annual Return</span>
        <span className="text-positive font-medium">{returnRate}%</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total Trades</span>
        <span>{trades}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Success Rate</span>
        <span>{successRate}%</span>
      </div>
      
      <div className="pt-2">
        <Badge className="bg-primary/10 hover:bg-primary/20 text-primary">
          {bestFor}
        </Badge>
      </div>
    </div>
  );
};

export default Portfolio;
