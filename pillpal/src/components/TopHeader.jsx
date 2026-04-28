import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useT } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  FONT_SCALE_LARGE, 
  FONT_SCALE_NORMAL, 
  fontScaleToPx, 
  getUserSettings, 
  updateUserSettings 
} from '@/api/userSettings';

export default function TopHeader() {
  const navigate = useNavigate();
  const t = useT();
  const { userId } = useAuth();
  
  const [fontScale, setFontScale] = useState(FONT_SCALE_NORMAL);

  const applyFontScale = (scale) => {
    document.documentElement.style.setProperty("--app-font-size", fontScaleToPx(scale));
  };

  useEffect(() => {
    async function loadSettings() {
      if (!userId) return;
      try {
        const s = await getUserSettings(userId);
        if (s?.font_scale) {
          setFontScale(s.font_scale);
          applyFontScale(s.font_scale);
        }
      } catch (e) {
        console.error("Failed to load font settings", e);
      }
    }
    loadSettings();
  }, [userId]);

  const handleModeChange = async (mode) => {
    const nextScale = mode === "elderly" ? FONT_SCALE_LARGE : FONT_SCALE_NORMAL;
    setFontScale(nextScale);
    applyFontScale(nextScale);

    if (userId) {
      try {
        await updateUserSettings(userId, { font_scale: nextScale });
      } catch (e) {
        console.error("Failed to save font settings", e);
      }
    }
  };

  const isElderlyMode = Number(fontScale) >= 140;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 max-w-lg mx-auto px-4">
        {/* Mode Toggle Group */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => handleModeChange("elderly")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
              isElderlyMode ? "bg-white shadow-sm text-teal-600" : "text-muted-foreground"
            )}
          >
            {t('large')}
          </button>
          <button
            onClick={() => handleModeChange("standard")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
              !isElderlyMode ? "bg-white shadow-sm text-teal-600" : "text-muted-foreground"
            )}
          >
            {t('normal')}
          </button>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 relative"
            onClick={() => navigate('/history')}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600"
            onClick={() => navigate('/profile')}
          >
            <User className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}