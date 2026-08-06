import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import uk from "./uk.json";

export const LANGUAGE_STORAGE_KEY = "lang";
export const DEFAULT_LANGUAGE = "en";

const getStoredLanguage = (): string => {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch {}
});

export default i18n;
