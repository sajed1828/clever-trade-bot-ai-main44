
import React from "react";
import { Link } from "react-router-dom";
import { 
  ChartLine, 
  Wallet, 
  Settings, 
  Bot, 
  TrendingUp
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation();
  
  return (
    <div className="w-64 bg-sidebar shadow-lg flex flex-col text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-trading-accent" />
          <h1 className="text-xl font-bold text-white">{t("app.title")}</h1>
        </div>
        <p className="text-xs text-sidebar-foreground/70 mt-1">{t("app.subtitle")}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent group transition-all">
              <ChartLine className="h-5 w-5 text-trading-accent group-hover:text-trading-accent" />
              <span>{t("nav.dashboard")}</span>
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent group transition-all">
              <Wallet className="h-5 w-5 text-sidebar-foreground/70 group-hover:text-trading-accent" />
              <span>{t("nav.portfolio")}</span>
            </Link>
          </li>
          <li>
            <Link to="/market-analysis" className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent group transition-all">
              <TrendingUp className="h-5 w-5 text-sidebar-foreground/70 group-hover:text-trading-accent" />
              <span>{t("nav.marketAnalysis")}</span>
            </Link>
          </li>
          <li>
            <Link to="/ai-advisor" className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent group transition-all">
              <Bot className="h-5 w-5 text-sidebar-foreground/70 group-hover:text-trading-accent" />
              <span>{t("nav.aiAdvisor")}</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent group transition-all">
              <Settings className="h-5 w-5 text-sidebar-foreground/70 group-hover:text-trading-accent" />
              <span>{t("nav.settings")}</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-md p-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-trading-accent" />
            <span className="text-sm font-medium">{t("aiAssistant.title")}</span>
          </div>
          <p className="text-xs text-sidebar-foreground/70 mt-1">{t("aiAssistant.description")}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
