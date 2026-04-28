import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Globe, Settings2, Volume2, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useLang, useT } from "@/lib/LanguageContext";
import {
  FONT_SCALE_LARGE,
  FONT_SCALE_NORMAL,
  fontScaleToPx,
  getUserSettings,
  updateUserSettings,
  upsertUserSettings,
} from "@/api/userSettings";

export default function Profile() {
  const nav = useNavigate();
  const { userId, phone, logout } = useAuth();

  const { lang: currentLang, setLang } = useLang();
  const t = useT();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontScale, setFontScale] = useState(FONT_SCALE_NORMAL);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  const avatarLetter = useMemo(() => {
    const s = (phone || "").trim();
    return s ? s[0] : "?";
  }, [phone]);

  const applyFontScale = (scale) => {
    document.documentElement.style.setProperty("--app-font-size", fontScaleToPx(scale));
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!userId) return;
      setIsLoadingSettings(true);

      try {
        await upsertUserSettings(userId, { sound_enabled: true, font_scale: FONT_SCALE_NORMAL });
        const s = await getUserSettings(userId);
        if (!mounted) return;

        if (typeof s?.sound_enabled === "boolean") setSoundEnabled(s.sound_enabled);
        if (s?.font_scale) {
          setFontScale(s.font_scale);
          applyFontScale(s.font_scale);
        }
      } catch {
        if (!mounted) return;
        setSoundEnabled(true);
        setFontScale(FONT_SCALE_NORMAL);
        applyFontScale(FONT_SCALE_NORMAL);
      } finally {
        if (mounted) setIsLoadingSettings(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const toggleLang = (next) => {
    if (next === currentLang) return;
    setLang(next);
  };

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  const onToggleSound = async () => {
    if (!userId) return;
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      await updateUserSettings(userId, { sound_enabled: next });
    } catch {
      setSoundEnabled(!next);
    }
  };

  const onSetFontMode = async (mode) => {
    if (!userId) return;
    const nextScale = mode === "large" ? FONT_SCALE_LARGE : FONT_SCALE_NORMAL;
    setFontScale(nextScale);
    applyFontScale(nextScale);
    try {
      await updateUserSettings(userId, { font_scale: nextScale });
    } catch {
      const revert = fontScale;
      setFontScale(revert);
      applyFontScale(revert);
    }
  };

  const isLarge = Number(fontScale) >= 140;

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold text-foreground mb-5">{t("profile")}</h1>

      {/* User Info Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-teal-700">{avatarLetter}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-semibold text-foreground truncate">{phone || "—"}</p>
            <p className="text-base text-muted-foreground truncate">{t("phone_number")}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-t">
            <span className="text-lg text-muted-foreground">{t("phone")}</span>
            <span className="text-lg font-medium text-foreground">{phone || "—"}</span>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Settings2 className="w-6 h-6 text-teal-600" />
          <span className="text-lg font-medium">{t("settings")}</span>
        </div>

        <div className="space-y-6">
          {/* Sound alerts toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-teal-600" />
              <span className="text-lg font-medium text-foreground">{t("sound_alerts")}</span>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={cn(
                "px-5 py-2.5 rounded-xl text-base font-medium transition-colors border",
                soundEnabled ? "bg-teal-600 text-white border-teal-600" : "bg-white text-foreground border-border"
              )}
            >
              {soundEnabled ? t("on") : t("off")}
            </button>
          </div>

          {/* Mode/Font size switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-teal-600" />
              <span className="text-lg font-medium text-foreground">{t("text_size")}</span>
            </div>
            <div className="flex bg-muted rounded-xl overflow-hidden p-1">
              <button
                type="button"
                onClick={() => onSetFontMode("normal")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  !isLarge ? "bg-white shadow-sm text-teal-600" : "text-slate-500"
                )}
              >
                {t("normal")}
              </button>
              <button
                type="button"
                onClick={() => onSetFontMode("large")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  isLarge ? "bg-white shadow-sm text-teal-600" : "text-slate-500"
                )}
              >
                {t("large")}
              </button>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-teal-600" />
              <span className="text-lg font-medium">{t("language")}</span>
            </div>
            <div className="flex bg-muted rounded-xl overflow-hidden p-1">
              <button
                type="button"
                onClick={() => toggleLang("en")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  currentLang === "en" ? "bg-white shadow-sm text-teal-600" : "text-slate-500"
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => toggleLang("zh")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  currentLang === "zh" ? "bg-white shadow-sm text-teal-600" : "text-slate-500"
                )}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full h-14 text-lg rounded-xl border-destructive text-destructive hover:bg-destructive/5 mt-4"
      >
        <LogOut className="w-5 h-5 mr-2" />
        {t("logout")}
      </Button>
    </div>
  );
}