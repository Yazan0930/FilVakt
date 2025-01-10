import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import svTranslation from "./locales/sv/translation.json";
import Cookies from "js-cookie";

const resources = {
  en: {
    translation: enTranslation,
  },
  sv: {
    translation: svTranslation, // Fixed incorrect key capitalization
  },
};

const savedLanguage = Cookies.get("lang") || "sv";
console.log(`Detected language: ${savedLanguage}`); // Improved log clarity

i18n
  .use(initReactI18next) // Ensure the i18n instance is properly initialized for React
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en", // Added fallback language
    debug: true, // Enable debug mode for development purposes
    interpolation: {
      escapeValue: false, // React already escapes values by default
    },
  });

export default i18n;
