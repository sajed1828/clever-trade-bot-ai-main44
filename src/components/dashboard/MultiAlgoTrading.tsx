
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, TrendingUp, TrendingDown, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDQLTrading } from '@/utils/dqlAgent';
import { useLSTMTrading } from '@/utils/lstmAgent';
import { useXLSTMTrading } from '@/utils/xLSTMAgent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MultiAlgoTrading = () => {
  const [currentPrice, setCurrentPrice] = useState(100); // Demo price
  const [selectedAlgo, setSelectedAlgo] = useState("dql"); // Default algorithm
  const [volume, setVolume] = useState(1000); // For xLSTM

  // Initialize all algorithms
  const dql = useDQLTrading(10000);
  const lstm = useLSTMTrading(10000);
  const xlstm = useXLSTMTrading(10000);
  
  // Get the currently selected algorithm
  const getSelectedAgent = () => {
    switch (selectedAlgo) {
      case "lstm": return lstm;
      case "xlstm": return xlstm;
      case "dql":
      default: return dql;
    }
  };

  // Get agent state
  const { state, portfolio } = getSelectedAgent();
  
  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 2; // Random price movement
        return Math.max(1, prev + change);
      });
      
      // Also update volume for xLSTM
      setVolume(prev => {
        const change = Math.random() * 200 - 100;
        return Math.max(100, prev + change);
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Predict action based on new price
  useEffect(() => {
    switch (selectedAlgo) {
      case "lstm":
        lstm.predict(currentPrice);
        break;
      case "xlstm":
        xlstm.predict(currentPrice, volume);
        break;
      case "dql":
      default:
        dql.predict(currentPrice);
        break;
    }
  }, [currentPrice, volume, selectedAlgo, dql, lstm, xlstm]);

  // Get algorithm display name
  const getAlgoDisplayName = () => {
    switch (selectedAlgo) {
      case "lstm": return "LSTM";
      case "xlstm": return "xLSTM";
      case "dql": return "Deep Q-Learning";
      default: return "AI Trading";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Brain className="h-5 w-5 text-trading-accent" />
            <span>{getAlgoDisplayName()}</span>
          </CardTitle>
          <Badge variant="secondary" className="bg-trading-accent/10 text-trading-accent">
            Auto-Trading
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full mb-2">
            <Select
              value={selectedAlgo}
              onValueChange={setSelectedAlgo}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dql">Deep Q-Learning</SelectItem>
                <SelectItem value="lstm">LSTM</SelectItem>
                <SelectItem value="xlstm">xLSTM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card border">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold">${currentPrice.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold">${portfolio.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Position</span>
              <span className="font-medium">{state.position} shares</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cash</span>
              <span className="font-medium">${state.cash.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiAlgoTrading;
