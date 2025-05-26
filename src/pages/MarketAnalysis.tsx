
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine, TrendingUp, Search } from "lucide-react";
import MarketTable from "@/components/market/MarketTable";
import TopMovers from "@/components/market/TopMovers";
import MarketIndicators from "@/components/market/MarketIndicators";
import { useTranslation } from "react-i18next";

const MarketAnalysis = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("marketAnalysis.title")}</h1>
        <p className="text-muted-foreground">
          {t("marketAnalysis.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <TopMovers />
        <div className="lg:col-span-2">
          <MarketIndicators />
        </div>
      </div>

      <MarketTable />
    </Layout>
  );
};

export default MarketAnalysis;
