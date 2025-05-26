
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine 
} from "recharts";
import { Bot, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useDQLTrading } from '@/utils/dqlAgent';
import { toast } from "sonner";

const Settings = () => {
  // DQL trading state and configuration
  const [initialCapital, setInitialCapital] = useState(10000);
  const [learningRate, setLearningRate] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [explorationRate, setExplorationRate] = useState(0.2);
  const [priceHistory, setPriceHistory] = useState<{price: number, action: string}[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [episodeCount, setEpisodeCount] = useState(0);
  
  // Use the DQL trading hook
  const { state, predict, portfolio, reset, setHyperparameters } = useDQLTrading(initialCapital);
  
  // Simulate market data
  const [currentPrice, setCurrentPrice] = useState(100);
  
  useEffect(() => {
    // Apply hyperparameters when they change
    setHyperparameters({
      learningRate,
      discountFactor,
      explorationRate
    });
  }, [learningRate, discountFactor, explorationRate, setHyperparameters]);
  
  // Simulate trading with random price movement
  useEffect(() => {
    if (!isTraining) return;
    
    const interval = setInterval(() => {
      // Generate random price movement (more realistic than pure random)
      setCurrentPrice(prev => {
        const volatility = 0.8;
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = Math.max(1, prev * (1 + change));
        
        // Predict action based on new price
        const action = predict(newPrice);
        
        // Record price and action
        setPriceHistory(history => [
          ...history.slice(-49), // Keep last 49 points
          { price: newPrice, action }
        ]);
        
        return newPrice;
      });
      setEpisodeCount(prev => prev + 1);
    }, 500); // Update every 0.5 seconds for faster simulation
    
    return () => clearInterval(interval);
  }, [isTraining, predict]);

  // Reset simulation
  const handleReset = () => {
    reset();
    setPriceHistory([]);
    setCurrentPrice(100);
    setEpisodeCount(0);
    toast.success("Simulation reset successfully");
  };

  // Toggle training
  const toggleTraining = () => {
    if (!isTraining) {
      toast.success("Simulation started");
    } else {
      toast.info("Simulation paused");
    }
    setIsTraining(!isTraining);
  };

  // Apply new initial capital
  const applySettings = () => {
    reset(initialCapital);
    toast.success("Settings applied successfully");
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">DQL Trading Simulator</h1>
        <p className="text-muted-foreground">
          Configure and train your AI trading agent using Deep Q-Learning.
        </p>
      </div>
      
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Bot className="h-5 w-5 text-trading-accent" />
              <span>Agent Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="initialCapital">
                Initial Capital (USD)
              </label>
              <div className="flex space-x-2">
                <Input
                  id="initialCapital"
                  type="number"
                  min="1000"
                  max="1000000"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                />
                <Button onClick={applySettings}>Apply</Button>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Learning Rate</label>
                  <span className="text-sm">{learningRate}</span>
                </div>
                <Slider 
                  value={[learningRate]} 
                  min={0.01} 
                  max={0.5} 
                  step={0.01}
                  onValueChange={(values) => setLearningRate(values[0])} 
                />
                <p className="text-xs text-muted-foreground">
                  Determines how quickly the agent adapts to new information.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Discount Factor</label>
                  <span className="text-sm">{discountFactor}</span>
                </div>
                <Slider 
                  value={[discountFactor]} 
                  min={0.1} 
                  max={0.99} 
                  step={0.01}
                  onValueChange={(values) => setDiscountFactor(values[0])} 
                />
                <p className="text-xs text-muted-foreground">
                  Controls importance of future rewards vs. immediate rewards.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Exploration Rate</label>
                  <span className="text-sm">{explorationRate}</span>
                </div>
                <Slider 
                  value={[explorationRate]} 
                  min={0.01} 
                  max={0.5} 
                  step={0.01} 
                  onValueChange={(values) => setExplorationRate(values[0])} 
                />
                <p className="text-xs text-muted-foreground">
                  Controls how often the agent explores new actions vs. exploiting known actions.
                </p>
              </div>
              
              <div className="pt-4 grid grid-cols-2 gap-2">
                <Button 
                  variant={isTraining ? "destructive" : "default"} 
                  onClick={toggleTraining} 
                  className="w-full"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isTraining ? "animate-spin" : ""}`} />
                  {isTraining ? "Stop" : "Start"} Training
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset} 
                  className="w-full"
                >
                  Reset Simulation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Simulation Results */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-trading-accent" />
                <span>Trading Simulation</span>
              </div>
              <Badge variant="secondary" className="bg-trading-accent/10 text-trading-accent">
                {isTraining ? "Running" : "Paused"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-lg bg-card border">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold">${currentPrice.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">${portfolio.toFixed(2)}</p>
                <p className={`text-xs ${portfolio > initialCapital ? "text-positive" : portfolio < initialCapital ? "text-negative" : ""}`}>
                  {portfolio > initialCapital ? "+" : ""}{((portfolio - initialCapital) / initialCapital * 100).toFixed(2)}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <p className="text-sm text-muted-foreground">Episodes</p>
                <p className="text-2xl font-bold">{episodeCount}</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Last Action</span>
                <Badge 
                  variant="outline" 
                  className={
                    state.previousAction === 'buy' 
                      ? 'text-positive border-positive' 
                      : state.previousAction === 'sell'
                      ? 'text-negative border-negative'
                      : ''
                  }
                >
                  {state.previousAction.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Position</span>
                    <span className="font-medium">{state.position} shares</span>
                  </div>
                  <Progress 
                    className="h-2 mt-1" 
                    value={state.position / 10} // Simple representation
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cash</span>
                    <span className="font-medium">${state.cash.toFixed(2)}</span>
                  </div>
                  <Progress 
                    className="h-2 mt-1" 
                    value={state.cash / initialCapital * 100} 
                  />
                </div>
              </div>
            </div>
            
            {/* Price and action chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="price"
                    tick={false}
                    label={{ value: 'Time', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`} 
                    domain={['dataMin - 5', 'dataMax + 5']} 
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      typeof value === 'number' ? `$${value.toFixed(2)}` : value,
                      name === 'price' ? 'Price' : 'Action'
                    ]}
                    labelFormatter={() => 'Time'}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#8B5CF6" 
                    strokeWidth={2} 
                    dot={false}
                    name="Price"
                  />
                  {priceHistory.map((entry, index) => {
                    if (entry.action === 'buy') {
                      return (
                        <ReferenceLine 
                          key={`buy-${index}`} 
                          x={index} 
                          stroke="green" 
                          strokeDasharray="3 3" 
                          isFront={true} 
                        />
                      );
                    } else if (entry.action === 'sell') {
                      return (
                        <ReferenceLine 
                          key={`sell-${index}`} 
                          x={index} 
                          stroke="red" 
                          strokeDasharray="3 3" 
                          isFront={true} 
                        />
                      );
                    }
                    return null;
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Buy</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span>Sell</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Metrics */}
      <Card className="shadow-sm mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="border rounded-md p-3">
              <p className="text-sm text-muted-foreground">Return on Investment</p>
              <p className={`text-xl font-bold ${portfolio > initialCapital ? "text-positive" : "text-negative"}`}>
                {((portfolio - initialCapital) / initialCapital * 100).toFixed(2)}%
              </p>
            </div>
            <div className="border rounded-md p-3">
              <p className="text-sm text-muted-foreground">Total Trades</p>
              <p className="text-xl font-bold">{state.tradeCount}</p>
            </div>
            <div className="border rounded-md p-3">
              <p className="text-sm text-muted-foreground">Avg. Position Size</p>
              <p className="text-xl font-bold">${(initialCapital * 0.1).toFixed(2)}</p>
            </div>
            <div className="border rounded-md p-3">
              <p className="text-sm text-muted-foreground">Learning Progress</p>
              <Progress 
                className="h-2 mt-2" 
                value={Math.min(episodeCount / 100, 100)} 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.min(episodeCount / 100 * 100, 100).toFixed(0)}% complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Settings;
