
import React from "react";
import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <header className="border-b bg-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3 w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("nav.search")}
            className="w-full pl-10 pr-4 py-2 rounded-full text-sm bg-muted/50 border-0 focus:ring-2 focus:ring-primary/20 focus-visible:outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSelector />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-trading-accent"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">Alex Morgan</p>
            <p className="text-xs text-muted-foreground">Premium Account</p>
          </div>
          
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-trading-accent text-white">AM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
