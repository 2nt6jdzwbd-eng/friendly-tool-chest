import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

const LANGS: [string, string][] = [
  ["ar", "العربية"], ["en", "English"], ["fr", "Français"], ["es", "Español"], ["de", "Deutsch"],
  ["it", "Italiano"], ["pt", "Português"], ["ru", "Русский"], ["tr", "Türkçe"], ["fa", "فارسی"],
  ["ur", "اردو"], ["hi", "हिन्दी"], ["bn", "বাংলা"], ["zh-CN", "中文"], ["ja", "日本語"],
  ["ko", "한국어"], ["id", "Indonesia"], ["ms", "Melayu"], ["th", "ไทย"], ["vi", "Tiếng Việt"],
  ["nl", "Nederlands"], ["pl", "Polski"], ["uk", "Українська"], ["ro", "Română"], ["el", "Ελληνικά"],
  ["sv", "Svenska"], ["no", "Norsk"], ["da", "Dansk"], ["fi", "Suomi"], ["cs", "Čeština"],
  ["hu", "Magyar"], ["he", "עברית"], ["sw", "Kiswahili"], ["am", "አማርኛ"], ["ha", "Hausa"],
  ["yo", "Yorùbá"], ["so", "Soomaali"], ["az", "Azərbaycan"], ["kk", "Қазақ"], ["uz", "Oʻzbek"],
  ["ps", "پښتو"], ["ku", "Kurdî"], ["tl", "Filipino"], ["ta", "தமிழ்"], ["te", "తెలుగు"],
  ["pa", "ਪੰਜਾਬੀ"], ["ne", "नेपाली"], ["si", "සිංහල"], ["my", "မြန်မာ"], ["km", "ខ្មែរ"],
  ["sq", "Shqip"], ["sr", "Српски"], ["hr", "Hrvatski"], ["bg", "Български"], ["ka", "ქართული"],
  ["hy", "Հայերեն"],
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

function currentLang() {
  const m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/);
  return m?.[1] ? decodeURIComponent(m[1]) : "ar";
}

function setCookie(code: string) {
  const host = location.hostname;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=; ${expire}; path=/`;
  document.cookie = `googtrans=; ${expire}; path=/; domain=.${host}`;
  if (code !== "ar") {
    document.cookie = `googtrans=/ar/${code}; path=/`;
    document.cookie = `googtrans=/ar/${code}; path=/; domain=.${host}`;
  }
}

// Drive Google's hidden combo box so the page translates instantly, no reload.
function applyTranslation(code: string, attempt = 0) {
  const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
  if (!combo) {
    if (attempt < 40) setTimeout(() => applyTranslation(code, attempt + 1), 250);
    return;
  }
  combo.value = code;
  combo.dispatchEvent(new Event("change"));
}

export function LanguageSwitcher() {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    const initial = currentLang();
    setLang(initial);
    if (document.getElementById("gt-script")) {
      if (initial !== "ar") applyTranslation(initial);
      return;
    }
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "ar", autoDisplay: false },
        "gt-element",
      );
      if (initial !== "ar") applyTranslation(initial);
    };
    const s = document.createElement("script");
    s.id = "gt-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }, []);

  const change = (code: string) => {
    setLang(code);
    setCookie(code);
    applyTranslation(code);
  };

  return (
    <label className="notranslate flex items-center gap-1 rounded-sm border border-border bg-card px-2 py-1 text-xs text-foreground">
      <Globe className="h-3.5 w-3.5 text-primary" />
      <select
        aria-label="Language"
        value={lang}
        onChange={(e) => change(e.target.value)}
        className="max-w-[90px] bg-transparent text-xs outline-none"
      >
        {LANGS.map(([c, n]) => (
          <option key={c} value={c} className="bg-card">
            {n}
          </option>
        ))}
      </select>
      <div id="gt-element" className="hidden" />
    </label>
  );
}
