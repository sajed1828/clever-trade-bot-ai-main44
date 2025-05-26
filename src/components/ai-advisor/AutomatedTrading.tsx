
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bot, LineChart, Zap, RefreshCw, Settings } from "lucide-react";
import { useDQLTrading } from '@/utils/dqlAgent';
import { useLSTMTrading } from '@/utils/lstmAgent';
import { useXLSTMTrading } from '@/utils/xLSTMAgent';
import { toast } from "sonner";

const AutomatedTrading = () => {
  // State for automated trading settings
  const [isActive, setIsActive] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dql");
  const [tradeFrequency, setTradeFrequency] = useState("medium");
  const [riskLevel, setRiskLevel] = useState("medium");
  
  // Initialize trading hooks
  const dql = useDQLTrading();
  const lstm = useLSTMTrading();
  const xlstm = useXLSTMTrading();
  
  // Get current algorithm instance
  const getCurrentAlgo = () => {
    switch (selectedAlgorithm) {
      case "lstm": return lstm;
      case "xlstm": return xlstm;
      case "dql":
      default: return dql;
    }
  };
  
  // Trade frequency options (in seconds)
  const getTradeIntervalMs = () => {
    switch (tradeFrequency) {
      case "low": return 60000; // 60 seconds
      case "high": return 5000; // 5 seconds
      case "medium":
      default: return 15000; // 15 seconds
    }
  };
  
  // Handle algorithm activation
  const handleActivation = () => {
    const newState = !isActive;
    setIsActive(newState);
    
    if (newState) {
      toast.success(`${getAlgorithmDisplayName()} automated trading activated`);
    } else {
      toast.info(`${getAlgorithmDisplayName()} automated trading deactivated`);
    }
  };
  
  // Reset the algorithm
  const handleReset = () => {
    const algo = getCurrentAlgo();
    algo.reset();
    toast.success(`${getAlgorithmDisplayName()} has been reset`);
  };
  
  // Get algorithm display name
  const getAlgorithmDisplayName = () => {
    switch (selectedAlgorithm) {
      case "lstm": return "LSTM";
      case "xlstm": return "xLSTM";
      case "dql": return "Deep Q-Learning";
      default: return "AI Trading";
    }
  };
  
  // Get algorithm icon
  const getAlgorithmIcon = () => {
    switch (selectedAlgorithm) {
      case "lstm": return <LineChart className="h-5 w-5" />;
      case "xlstm": return <Zap className="h-5 w-5" />;
      case "dql":
      default: return <Bot className="h-5 w-5" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getAlgorithmIcon()}
            <span>Automated Trading</span>
          </div>
          <Switch 
            checked={isActive} 
            onCheckedChange={handleActivation} 
            className="data-[state=checked]:bg-trading-accent"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="algorithm" className="mb-2 block">Trading Algorithm</Label>
            <Select
              value={selectedAlgorithm}
              onValueChange={setSelectedAlgorithm}
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

          <div>
            <Label className="mb-2 block">Trading Frequency</Label>
            <RadioGroup 
              value={tradeFrequency} 
              onValueChange={setTradeFrequency}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="freq-low" />
                <Label htmlFor="freq-low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="freq-med" />
                <Label htmlFor="freq-med">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="freq-high" />
                <Label htmlFor="freq-high">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Risk Level</Label>
            <RadioGroup 
              value={riskLevel} 
              onValueChange={setRiskLevel}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="risk-low" />
                <Label htmlFor="risk-low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="risk-med" />
                <Label htmlFor="risk-med">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="risk-high" />
                <Label htmlFor="risk-high">High</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
          >
            <Settings className="mr-2 h-4 w-4" />
            Advanced Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomatedTrading;
