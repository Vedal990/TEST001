import React, { useState, useEffect } from "react";
import { Heart, Activity, Users, Plus } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { useSettings } from "@/lib/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function HeartDisease() {
  const t = useT();
  const { isLarge } = useSettings();

  if (isLarge) {
    // ELDERLY MODE UI
    return (
      <div className="px-4 pt-4 pb-24 space-y-8">
        <h1 className="text-4xl font-black text-teal-700">{t('tab_heart')}</h1>
        <Card className="border-4 border-red-500 bg-red-50 shadow-xl rounded-[40px]">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-2xl font-bold text-red-600 uppercase">{t('next_medication')}</p>
            <h3 className="text-5xl font-black text-slate-900">阿司匹林</h3>
            <p className="text-3xl font-bold text-red-700">晚上 9:00 (睡前)</p>
            <Button className="w-full h-24 text-3xl font-black bg-red-600 hover:bg-red-700 text-white rounded-3xl mt-4 shadow-lg">
              {t('confirm')}
            </Button>
          </CardContent>
        </Card>
        <div className="bg-white rounded-[40px] p-8 border-4 border-border shadow-sm text-center space-y-6">
          <div className="flex justify-center gap-3 items-center">
            <Heart className="w-12 h-12 text-red-500" />
            <span className="text-3xl font-bold">{t('blood_pressure')}</span>
          </div>
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-8xl font-black text-slate-900">128</span>
            <span className="text-3xl font-bold text-slate-400">/ 82</span>
          </div>
          <div className="inline-block px-10 py-3 rounded-full bg-green-100 text-green-700 text-3xl font-black">数值正常</div>
          <Button className="w-full h-24 text-4xl font-black bg-teal-600 hover:bg-teal-700 rounded-3xl shadow-xl flex gap-4 mt-2">
            <Plus className="w-10 h-10 stroke-[4]" /> {t('record_data')}
          </Button>
        </div>
        <Card className="rounded-[40px] border-4 border-slate-200 p-8">
          <CardContent className="p-0 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-slate-900 text-3xl">{t('salt_intake')}</h4>
              <span className="text-3xl font-black text-teal-600">4.2克</span>
            </div>
            <Progress value={84} className="h-8 bg-slate-100 rounded-full" />
            <p className="text-2xl font-bold text-slate-500 text-center">今天还能再吃 <span className="text-teal-600 font-black">0.8克</span> 盐</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // STANDARD MODE UI
  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold">{t('tab_heart')}</h1>
      <Card className="border-red-100 bg-red-50/30">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600 uppercase tracking-wider">{t('next_medication')}</p>
              <h3 className="text-xl font-bold text-slate-900">Aspirin & BP Meds</h3>
              <p className="text-lg text-slate-600">21:00 (Bedtime)</p>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">{t('confirm')}</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" /> {t('blood_pressure')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 text-center">
          <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
            <div><div className="text-2xl font-black text-slate-900">128</div><div className="text-[10px] text-slate-500 uppercase font-bold">Systolic</div></div>
            <div className="border-x border-slate-200"><div className="text-2xl font-black text-slate-900">82</div><div className="text-[10px] text-slate-500 uppercase font-bold">Diastolic</div></div>
            <div><div className="text-2xl font-black text-teal-600">78</div><div className="text-[10px] text-slate-500 uppercase font-bold">BPM</div></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-12 border-slate-200 rounded-xl gap-2 font-bold text-teal-700"><Plus className="w-4 h-4" /> {t('record_data')}</Button>
            <Button variant="outline" className="flex-1 h-12 border-slate-200 rounded-xl gap-2 font-bold text-teal-700"><Activity className="w-4 h-4" /> {t('symptoms')}</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between items-end"><h4 className="font-bold text-slate-900 text-lg">{t('salt_intake')}</h4><span className="text-sm font-medium text-slate-500">4.2g / 5.0g</span></div>
          <Progress value={84} className="h-3 bg-slate-100" />
        </CardContent>
      </Card>
    </div>
  );
}