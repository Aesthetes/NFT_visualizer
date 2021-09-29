import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationIT from "./locales/it.json";

const resources = {
  it: {
    translation: translationIT,
  },
  en: {
    translation: translationEN,
  },
};

const language = localStorage.getItem("lng");
const backUpLanguage = localStorage.getItem("lng") === "it" ? "en" : "it";

i18n.use(initReactI18next).init(
  {
    resources,
    lng: language || "it",
    fallbackLng: backUpLanguage || "en",
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  },
  (err, t) => {
    if (err) console.error("i18n Error", err);
  }
);

export default i18n;

// import i18n from this file
// i18n.t("tradKey")
// tradKeys in import/locales/it or en
