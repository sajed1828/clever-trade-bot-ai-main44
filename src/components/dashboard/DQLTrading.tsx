
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDQLTrading } from '@/utils/dqlAgent';

const DQLTrading = () => {
  const [currentPrice, setCurrentPrice] = useState(100); // Demo price
  const { state, predict, portfolio } = useDQLTrading(10000);
  
  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 2; // Random price movement
        return Math.max(1, prev + change);
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Predict action based on new price
  useEffect(() => {
    predict(currentPrice);
  }, [currentPrice, predict]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bot className="h-5 w-5 text-trading-accent" />
            <span>DQL Trading Bot</span>
          </CardTitle>
          <Badge variant="secondary" className="bg-trading-accent/10 text-trading-accent">
            Auto-Trading
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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

export default DQLTrading;
