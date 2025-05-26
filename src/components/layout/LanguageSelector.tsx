
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "ru", name: "Русский", dir: "ltr" },
  { code: "zh", name: "中文", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "ja", name: "日本語", dir: "ltr" },
];

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  // Set initial direction on component mount
  useEffect(() => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    if (currentLang) {
      document.documentElement.dir = currentLang.dir;
      document.documentElement.lang = currentLang.code;
    }
  }, [i18n.language]);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    const selectedLang = languages.find(lang => lang.code === code);
    if (selectedLang) {
      document.documentElement.dir = selectedLang.dir;
      document.documentElement.lang = selectedLang.code;
    }
  };

  // Get the current language name
  const currentLanguage = languages.find(
    (lang) => lang.code === i18n.language
  )?.name || "English";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("language.select")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`cursor-pointer ${i18n.language === language.code ? 'font-bold' : ''}`}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
