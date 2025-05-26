import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, LineChart, Bot, Zap, Train } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AutomatedTrading from "@/components/ai-advisor/AutomatedTrading";
import { start } from "repl";

  
  
const AIAdvisor = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("comparison");
  
  const handleDQLStart = async () => {
      try {
        const res = await fetch("http://localhost:8080/settings/start-training", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ episodes: 300 }),
        });
        const data = await res.json();
        alert(data.message);
      } catch (err) {
        console.error("Error:", err);
        alert("فشل الاتصال بالخادم أو أن الخدمة غير مفعّلة.");
      }
    };
  
    return (
      <Layout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("aiAdvisor.title")}</h1>
          <p className="text-muted-foreground">{t("aiAdvisor.subtitle")}</p>
        </div>
  
        <Tabs defaultValue="comparison" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="comparison">Algorithm Comparison</TabsTrigger>
            <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
            <TabsTrigger value="automated">Automated Trading</TabsTrigger>
            <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
          </TabsList>
  
          <TabsContent value="comparison">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AlgorithmCard 
                title="Deep Q-Learning (DQL)"
                icon={<Bot className="h-5 w-5" />}
                description="Reinforcement learning approach that learns optimal actions through experience."
                strengths={["Good for discrete action spaces", "Works with minimal historical data", "Adapts to changing market conditions"]}
                weaknesses={["Limited memory capacity", "Often needs extensive training", "May struggle with complex patterns"]}
                score={80}
              />
  
              <AlgorithmCard 
                title="LSTM"
                icon={<LineChart className="h-5 w-5" />}
                description="Long Short-Term Memory neural networks designed for sequential data."
                strengths={["Excellent at capturing time dependencies", "Remembers long-term patterns", "Handles variable length sequences"]}
                weaknesses={["Requires substantial training data", "Computationally intensive", "Sensitive to hyperparameters"]}
                score={85}
              />
  
              <AlgorithmCard 
                title="xLSTM"
                icon={<Zap className="h-5 w-5" />}
                description="Extended LSTM with attention mechanisms for improved pattern recognition."
                strengths={["Superior pattern recognition", "Handles multiple data features", "Self-adjusting attention to important periods"]}
                weaknesses={["Most complex to train", "Needs more data than standard LSTM", "Computationally demanding"]}
                score={90}
              />
            </div>
          </TabsContent>
  
          <TabsContent value="advisor">
            <div className="border rounded-xl p-6 flex flex-col items-center justify-center h-64 bg-card">
              <Brain className="h-12 w-12 text-trading-accent mb-4" />
              <h3 className="text-xl font-medium mb-2">AI Trading Advisor</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Get personalized trading advice based on market conditions using our advanced AI models.
              </p>
              <Button>
                <Bot className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          </TabsContent>
  
          <TabsContent value="automated">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AutomatedTrading />
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80 flex flex-col justify-center items-center">
                    <div className="text-center p-6">
                      <Bot className="h-16 w-16 text-trading-accent mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select and activate an algorithm</h3>
                      <p className="text-muted-foreground mb-4">
                        Performance metrics and trading history will appear here once automated trading begins.
                      </p>
                      <Button onClick={handleDQLStart} className="mb-4">
                        <Bot className="h-4 w-4 mr-2" />
                        ابدأ التداول بـ DQL
                      </Button>
                      <Button variant="outline">View documentation</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
  
          <TabsContent value="settings">
            <div className="border rounded-xl p-6 flex flex-col items-center justify-center h-64 bg-card">
              <h3 className="text-xl font-medium mb-2">Advanced Algorithm Settings</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Fine-tune algorithm parameters and customize your trading strategies.
              </p>
              <Button>Coming Soon</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Layout>
    );
  };
  
  interface AlgorithmCardProps {
    title: string;
    icon: React.ReactNode;
    description: string;
    strengths: string[];
    weaknesses: string[];
    score: number;
  }
  
  const AlgorithmCard = ({ title, icon, description, strengths, weaknesses, score }: AlgorithmCardProps) => {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{description}</p>
  
          <div>
            <h4 className="text-sm font-medium mb-1">Strengths:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
              {strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
  
          <div>
            <h4 className="text-sm font-medium mb-1">Weaknesses:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
              {weaknesses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
  
          <div>
            <h4 className="text-sm font-medium mb-1">Effectiveness Score:</h4>
            <div className="bg-muted h-2 rounded-full overflow-hidden">
              <div className="bg-trading-accent h-full" style={{ width: `${score}%` }} />
            </div>
            <p className="text-xs text-right mt-1">{score}/100</p>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default AIAdvisor;
  
