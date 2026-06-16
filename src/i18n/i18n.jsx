import React, { createContext, useContext, useMemo, useState } from "react";
import { translations } from "./translations";

const LANG_KEY = "cafe_online_lang";
const LanguageContext = createContext(null);

export const LANG_ORDER = ["pt", "en", "es"];

export const LANG_OPTIONS = [
  { code: "pt", labelKey: "portuguese" },
  { code: "en", labelKey: "english" },
  { code: "es", labelKey: "spanish" },
];

export const LANG_LABELS = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

function normalizeLang(value) {
  return LANG_ORDER.includes(value) ? value : "pt";
}

export function getNextLang(current) {
  const index = LANG_ORDER.indexOf(normalizeLang(current));
  return LANG_ORDER[(index + 1) % LANG_ORDER.length];
}

function getNested(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function interpolate(template, params) {
  if (!params || typeof template !== "string") return template;
  return Object.entries(params).reduce(
    (str, [key, value]) => str.replaceAll(`{{${key}}}`, String(value)),
    template
  );
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => normalizeLang(localStorage.getItem(LANG_KEY)));

  function setLang(nextLang) {
    const value = normalizeLang(nextLang);
    localStorage.setItem(LANG_KEY, value);
    setLangState(value);
  }

  const value = useMemo(() => {
    const t = (key, params) => {
      const fromNested = getNested(translations[lang], key);
      const flat = translations[lang]?.[key];
      const text = fromNested ?? flat ?? key;
      return interpolate(text, params);
    };
    return { lang, setLang, t };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <LanguageProvider>");
  }
  return ctx;
}
