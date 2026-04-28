import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Globe, Settings2, Volume2, Type, ChevronRight, User, Cpu, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useLang, useT } from "@/lib/LanguageContext";
import { useSettings } from "@/lib/SettingsContext";
import {
  FONT_SCALE_LARGE,
  FONT_SCALE_NORMAL,
  getUserSettings,
  updateUserSettings,
} from "@/api/userSettings";

export default function Profile() {
  const nav = useNavigate();
  const { userId, phone, logout } = useAuth();
  const { lang: currentLang, setLang } = useLang();
  const { isLarge, updateFontScale } = useSettings();
  const t = useT();

  const [soundEnabled, setSoundEnabled] = useState(true);

  const avatarLetter = useMemo(() => {
    const s = (phone || "").trim();
    return s ? s[0] : "?";
  }, [phone]);

  // Load initial sound setting from DB
  useEffect(() => {
    async function load() {
      if (!userId) return;
      try {
        const s = await getUserSettings(userId);
        if (s && typeof s.sound_enabled === "boolean") {
          setSoundEnabled(s.sound_enabled);
        }
      } catch (e) {
        console.error("Failed to load sound settings", e);
      }
    }
    load();
  }, [userId]);

  const onToggleSound = async () => {
    if (!userId) return;
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      await updateUserSettings(userId, { sound_enabled: next });
    } catch (e) {
      setSoundEnabled(!next); // Revert on failure
    }
  };

  const onSetFontMode = async (mode) => {
    if (!userId) return;
    const nextScale = mode === "large" ? FONT_SCALE_LARGE : FONT_SCALE_NORMAL;
    updateFontScale(nextScale);
    try {
      await updateUserSettings(userId, { font_scale: nextScale });
    } catch (e) {
      console.error("Failed to save font settings", e);
    }
  };

  const relatives = [
    { name: "女儿", phone: "138****1234", perm: "完全访问" },
    { name: "儿子", phone: "139****5678", perm: "仅用药提醒" }
  ];

  if (isLarge) {
    // ELDERLY MODE UI
    return (
      <div className="px-4 pt-4 pb-24 space-y-6">
        <h1 className="text-3xl font-black text-foreground flex items-center gap-2">
          <User className="w-8 h-8" /> {t("profile")}
        </h1>

        {/* Big User Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-border text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center border-4 border-white shadow-inner">
              <span className="text-5xl font-bold text-teal-700">{avatarLetter}</span>
            </div>
            <p className="text-4xl font-black text-foreground">{phone || "用户"}</p>
          </div>
          <Button onClick={() => nav("/device")} className="w-full h-24 text-3xl font-black bg-orange-500 hover:bg-orange-600 rounded-2xl shadow-lg flex gap-3">
            <Cpu className="w-10 h-10" /> {t("bind_device")}
          </Button>
        </div>

        {/* Big Settings Card - Including Sound Toggle */}
        <div className="bg-white rounded-3xl p-6 border-2 border-border space-y-6">
          {/* Big Sound Switch */}
          <div className="space-y-4">
            <span className="text-2xl font-bold block text-center">{t("sound_alerts")}</span>
            <button
              onClick={onToggleSound}
              className={cn(
                "w-full h-20 rounded-2xl text-2xl font-black flex items-center justify-center gap-4 transition-all border-4",
                soundEnabled 
                  ? "bg-teal-50 border-teal-500 text-teal-700" 
                  : "bg-slate-50 border-slate-300 text-slate-500"
              )}
            >
              {soundEnabled ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
              {soundEnabled ? "语音播报：开" : "语音播报：关"}
            </button>
          </div>

          {/* Big Font Switch */}
          <div className="space-y-4 border-t pt-6">
            <span className="text-2xl font-bold block text-center">{t("text_size")}</span>
            <div className="flex bg-muted p-2 rounded-2xl h-20">
              <button onClick={() => onSetFontMode("normal")} className={cn("flex-1 rounded-xl text-xl font-black", !isLarge ? "bg-white shadow text-teal-600" : "text-muted-foreground")}>{t("normal")}</button>
              <button onClick={() => onSetFontMode("large")} className={cn("flex-1 rounded-xl text-xl font-black", isLarge ? "bg-white shadow text-teal-600" : "text-muted-foreground")}>{t("large")}</button>
            </div>
          </div>
        </div>

        <Button onClick={() => { logout(); nav("/login"); }} variant="outline" className="w-full h-24 text-3xl font-black rounded-2xl border-destructive text-destructive border-4">
          <LogOut className="w-10 h-10 mr-4" /> {t("logout")}
        </Button>
      </div>
    );
  }

  // STANDARD MODE UI
  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold text-foreground mb-5">{t("profile")}</h1>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 text-xl">{avatarLetter}</div>
          <div><p className="text-xl font-semibold">{phone || "用户"}</p><p className="text-sm text-muted-foreground">{t("phone_number")}</p></div>
        </div>
        <Button variant="outline" size="sm" onClick={() => nav("/device")} className="gap-2 border-teal-200 text-teal-700"><Cpu className="w-4 h-4" /> {t("device")}</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border mb-6 space-y-6 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Settings2 className="w-5 h-5 text-teal-600" />
          <span className="font-bold">{t("settings")}</span>
        </div>
        
        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-slate-500" />
            <span className="font-medium">{t("sound_alerts")}</span>
          </div>
          <button 
            onClick={onToggleSound}
            className={cn("px-4 py-1.5 rounded-lg border text-sm font-semibold transition-all", soundEnabled ? "bg-teal-600 text-white" : "bg-white text-slate-500")}
          >
            {soundEnabled ? t("on") : t("off")}
          </button>
        </div>

        {/* Font size switch */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-slate-500" />
            <span className="font-medium">{t("text_size")}</span>
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            <button onClick={() => onSetFontMode("normal")} className={cn("px-4 py-1 text-xs font-semibold rounded-md transition-all", !isLarge ? "bg-white shadow-sm text-teal-600" : "text-muted-foreground")}>{t("normal")}</button>
            <button onClick={() => onSetFontMode("large")} className={cn("px-4 py-1 text-xs font-semibold rounded-md transition-all", isLarge ? "bg-white shadow-sm text-teal-600" : "text-muted-foreground")}>{t("large")}</button>
          </div>
        </div>

        {/* Language switch */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-500" />
            <span className="font-medium">{t("language")}</span>
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            <button onClick={() => setLang("en")} className={cn("px-4 py-1 text-xs font-semibold rounded-md transition-all", currentLang === "en" ? "bg-white shadow-sm text-teal-600" : "text-muted-foreground")}>EN</button>
            <button onClick={() => setLang("zh")} className={cn("px-4 py-1 text-xs font-semibold rounded-md transition-all", currentLang === "zh" ? "bg-white shadow-sm text-teal-600" : "text-muted-foreground")}>中文</button>
          </div>
        </div>
      </div>

      <Button onClick={() => { logout(); nav("/login"); }} variant="outline" className="w-full h-12 rounded-xl border-destructive text-destructive">{t("logout")}</Button>
    </div>
  );
}