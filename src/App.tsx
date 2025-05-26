
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import AIAdvisor from "./pages/AIAdvisor";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import MarketAnalysis from "./pages/MarketAnalysis";

// Import i18n configuration
import "./i18n";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/ai-advisor" element={<AIAdvisor />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
