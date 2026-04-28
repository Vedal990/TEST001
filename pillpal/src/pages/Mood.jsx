import React, { useState } from "react";
import { Smile, Meh, Frown, Wind, BookOpen, AlertCircle, Users, Play } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Mood() {
  const t = useT();
  const [selectedMood, setSelectedMood] = useState(null);

  const moodOptions = [
    { icon: Smile, label: "Good", color: "text-green-500", bg: "bg-green-50" },
    { icon: Meh, label: "Normal", color: "text-amber-500", bg: "bg-amber-50" },
    { icon: Frown, label: "Bad", color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">{t('tab_mood')}</h1>

      {/* Next Medication Card */}
      <Card className="border-purple-100 bg-purple-50/30">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                {t('next_medication')}
              </p>
              <h3 className="text-xl font-bold text-slate-900">Sertraline & Melatonin</h3>
              <p className="text-lg text-slate-600">22:00 (Before Sleep)</p>
            </div>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              {t('confirm')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Mood Selection */}
      <Card>
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-lg font-semibold">{t('mood_check')}</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.label;
              return (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all",
                    isSelected 
                      ? "border-teal-500 bg-teal-50 shadow-sm" 
                      : "border-slate-100 bg-slate-50 grayscale opacity-60"
                  )}
                >
                  <Icon className={cn("w-10 h-10 mb-2", isSelected ? mood.color : "text-slate-400")} />
                  <span className={cn("text-sm font-bold", isSelected ? "text-teal-700" : "text-slate-500")}>
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mindfulness Practice */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Wind className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{t('mindfulness')}</h4>
                <p className="text-xs text-slate-500">Last practiced: Yesterday</p>
              </div>
            </div>
            <Button className="rounded-full gap-2 bg-teal-600">
              <Play className="w-4 h-4 fill-current" /> Start
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h4 className="font-bold text-red-900 text-lg">{t('emergency_contact')}</h4>
        </div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-between h-12 border-red-200 text-red-700 bg-white">
            <span>Contact Daughter</span>
            <span className="font-mono">138****1234</span>
          </Button>
        </div>
      </div>

      {/* Relatives Section */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-teal-600" />
            <div>
              <p className="font-semibold text-slate-900">{t('my_relatives')}</p>
              <p className="text-sm text-slate-500 italic">Daughter, Son, Wife</p>
            </div>
          </div>
          <Button variant="ghost" className="text-teal-600 font-bold">
            {t('manage_relatives')} →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}