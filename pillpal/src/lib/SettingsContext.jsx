import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserSettings, fontScaleToPx, FONT_SCALE_NORMAL } from "@/api/userSettings";
import { useAuth } from "./AuthContext";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { userId } = useAuth();
  const [fontScale, setFontScale] = useState(FONT_SCALE_NORMAL);

  const applyScale = (scale) => {
    document.documentElement.style.setProperty("--app-font-size", fontScaleToPx(scale));
  };

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    async function load() {
      try {
        const s = await getUserSettings(userId);
        if (mounted && s?.font_scale) {
          setFontScale(s.font_scale);
          applyScale(s.font_scale);
        }
      } catch (e) {
        console.error("Failed to load settings in context", e);
      }
    }
    load();
    return () => { mounted = false; };
  }, [userId]);

  const updateFontScale = (newScale) => {
    setFontScale(newScale);
    applyScale(newScale);
  };

  const value = {
    fontScale,
    updateFontScale,
    isLarge: Number(fontScale) >= 140
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}