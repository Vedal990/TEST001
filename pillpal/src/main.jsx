import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { LanguageProvider } from "@/lib/LanguageContext.jsx";
import { getUserSettings, fontScaleToPx } from "@/api/userSettings.js";

async function bootstrap() {
  // Default: Large (140%)
  document.documentElement.style.setProperty("--app-font-size", "22px");

  // If user already logged in, apply saved font_scale
  try {
    const userId = localStorage.getItem("pillpal_user_id");
    if (userId) {
      const s = await getUserSettings(userId);
      if (s?.font_scale) {
        document.documentElement.style.setProperty("--app-font-size", fontScaleToPx(s.font_scale));
      }
    }
  } catch {
    // ignore
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}

bootstrap();