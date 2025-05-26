
import React from "react";
import Layout from "@/components/layout/Layout";
import StockChart from "@/components/dashboard/StockChart";
import MarketOverview from "@/components/dashboard/MarketOverview";
import AIInsights from "@/components/dashboard/AIInsights";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import MultiAlgoTrading from "@/components/dashboard/MultiAlgoTrading";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.welcome")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PortfolioSummary />
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <StockChart />
        </div>
        <div className="space-y-6">
          <MultiAlgoTrading />
          <AIInsights />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
