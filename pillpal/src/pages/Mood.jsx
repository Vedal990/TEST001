import React, { useState } from "react";
import { Smile, Meh, Frown, Wind, AlertCircle, Users, Play, Phone } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { useSettings } from "@/lib/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Mood() {
  const t = useT();
  const { isLarge } = useSettings();
  const [selectedMood, setSelectedMood] = useState(null);

  const moodOptions = [
    { icon: Smile, label: "Good", cnLabel: "心情好", color: "text-green-500", bg: "bg-green-50" },
    { icon: Meh, label: "Normal", cnLabel: "一般", color: "text-amber-500", bg: "bg-amber-50" },
    { icon: Frown, label: "Bad", cnLabel: "不开心", color: "text-red-500", bg: "bg-red-50" },
  ];

  if (isLarge) {
    return (
      <div className="px-4 pt-4 pb-24 space-y-8">
        <h1 className="text-4xl font-black text-teal-700">{t('tab_mood')}</h1>
        <div className="bg-red-600 border-4 border-red-800 rounded-[40px] p-8 shadow-2xl active:scale-95 transition-transform">
          <div className="flex flex-col items-center text-center gap-4 text-white">
            <AlertCircle className="w-20 h-20" />
            <h4 className="font-black text-4xl">{t('emergency_contact')}</h4>
            <p className="text-2xl font-bold opacity-90">一键联系女儿</p>
            <Button className="w-full h-24 bg-white text-red-600 rounded-3xl text-3xl font-black mt-2 shadow-inner">
              <Phone className="w-10 h-10 mr-4 fill-current" /> 立即拨打
            </Button>
          </div>
        </div>
        <Card className="rounded-[40px] border-4 border-border p-6">
          <CardHeader className="text-center pb-4"><CardTitle className="text-3xl font-black">{t('mood_check')}</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 gap-4">
              {moodOptions.map((mood) => {
                const Icon = mood.icon;
                const isSelected = selectedMood === mood.label;
                return (
                  <button key={mood.label} onClick={() => setSelectedMood(mood.label)} className={cn("flex items-center justify-between p-6 rounded-3xl border-4 transition-all", isSelected ? "border-teal-500 bg-teal-50" : "border-slate-100 bg-slate-50")}>
                    <div className="flex items-center gap-6"><Icon className={cn("w-16 h-16", isSelected ? mood.color : "text-slate-400")} /><span className={cn("text-3xl font-black", isSelected ? "text-teal-700" : "text-slate-500")}>{mood.cnLabel}</span></div>
                    {isSelected && <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <div className="bg-teal-50 border-4 border-teal-200 rounded-[40px] p-8 text-center space-y-6">
          <div className="flex flex-col items-center gap-4"><Wind className="w-16 h-16 text-teal-600" /><h4 className="font-black text-teal-900 text-3xl">跟我深呼吸</h4></div>
          <Button className="w-full h-24 text-3xl font-black bg-teal-600 rounded-3xl shadow-lg"><Play className="w-10 h-10 mr-4 fill-current" /> 开始练习</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold">{t('tab_mood')}</h1>
      <Card className="border-purple-100 bg-purple-50/30">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1"><p className="text-sm font-medium text-purple-600 uppercase tracking-wider">{t('next_medication')}</p><h3 className="text-xl font-bold">Sertraline & Melatonin</h3><p className="text-lg text-slate-600">22:00 (Before Sleep)</p></div>
            <Button size="sm" className="bg-purple-600">{t('confirm')}</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-5 pb-0"><CardTitle className="text-lg font-semibold">{t('mood_check')}</CardTitle></CardHeader>
        <CardContent className="p-5"><div className="grid grid-cols-3 gap-3">{moodOptions.map((mood) => { const Icon = mood.icon; const isSelected = selectedMood === mood.label; return (<button key={mood.label} onClick={() => setSelectedMood(mood.label)} className={cn("flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all", isSelected ? "border-teal-500 bg-teal-50 shadow-sm" : "border-slate-100 bg-slate-50 grayscale opacity-60")}><Icon className={cn("w-10 h-10 mb-2", isSelected ? mood.color : "text-slate-400")} /><span className={cn("text-sm font-bold", isSelected ? "text-teal-700" : "text-slate-500")}>{mood.label}</span></button>);})}</div></CardContent>
      </Card>
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3"><AlertCircle className="w-6 h-6 text-red-600" /><h4 className="font-bold text-red-900">{t('emergency_contact')}</h4></div>
        <Button variant="outline" className="w-full justify-between border-red-200 text-red-700 bg-white"><span>Contact Daughter</span><span className="font-mono">138****1234</span></Button>
      </div>
    </div>
  );
}