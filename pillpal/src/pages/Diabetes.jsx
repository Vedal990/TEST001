import React, { useState } from "react";
import { Droplet, TrendingDown, Users, Plus, Info } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { useSettings } from "@/lib/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Diabetes() {
  const t = useT();
  const { isLarge } = useSettings();
  const [lastSugar] = useState("6.2");

  if (isLarge) {
    return (
      <div className="px-4 pt-4 pb-24 space-y-8">
        <h1 className="text-4xl font-black text-teal-700">{t('tab_diabetes')}</h1>
        <Card className="border-4 border-teal-500 bg-teal-50 shadow-xl rounded-[40px]">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-2xl font-bold text-teal-600 uppercase">{t('next_medication')}</p>
            <h3 className="text-5xl font-black text-slate-900">二甲双胍</h3>
            <p className="text-3xl font-bold text-teal-700">下午 6:30</p>
            <Button className="w-full h-24 text-3xl font-black bg-teal-600 rounded-3xl mt-4 shadow-lg">{t('confirm')}</Button>
          </CardContent>
        </Card>
        <div className="bg-white rounded-[40px] p-8 border-4 border-border shadow-sm text-center space-y-6">
          <div className="flex justify-center gap-3 items-center"><Droplet className="w-12 h-12 text-red-500" /><span className="text-3xl font-bold">{t('blood_sugar')}</span></div>
          <div className="text-8xl font-black text-slate-900">{lastSugar}</div>
          <div className="inline-block px-10 py-3 rounded-full bg-green-100 text-green-700 text-3xl font-black">正常</div>
          <Button className="w-full h-24 text-4xl font-black bg-teal-600 rounded-3xl shadow-xl flex gap-4"><Plus className="w-10 h-10 stroke-[4]" /> {t('record_data')}</Button>
        </div>
        <div className="bg-amber-50 border-4 border-amber-200 rounded-[40px] p-8 flex flex-col items-center text-center gap-4">
          <TrendingDown className="w-16 h-16 text-amber-600" />
          <div><h4 className="font-black text-amber-900 text-3xl">下午 3 点 - 5 点</h4><p className="text-amber-700 text-2xl font-bold mt-2">低血糖风险：记得随身带糖果</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold">{t('tab_diabetes')}</h1>
      <Card className="border-teal-100 bg-teal-50/30">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1"><p className="text-sm font-medium text-teal-600 uppercase">{t('next_medication')}</p><h3 className="text-xl font-bold">Metformin</h3><p className="text-lg text-slate-600">18:30 (In 2 hours)</p></div>
            <Button size="sm" className="bg-teal-600">{t('confirm')}</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-5 pb-0"><CardTitle className="text-lg font-semibold flex items-center gap-2"><Droplet className="w-5 h-5 text-red-500" />{t('blood_sugar')}</CardTitle></CardHeader>
        <CardContent className="p-5 text-center">
          <div className="bg-slate-50 rounded-2xl p-6 border border-dashed mb-4">
            <div className="text-4xl font-black">{lastSugar} <span className="text-lg font-normal text-slate-500">mmol/L</span></div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Normal Range</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold text-teal-700"><Plus className="w-4 h-4" /> {t('record_data')}</Button>
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold text-teal-700"><Info className="w-4 h-4" /> {t('insulin')}</Button>
          </div>
        </CardContent>
      </Card>
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4 text-sm">
        <TrendingDown className="w-6 h-6 text-amber-600 shrink-0" />
        <div><h4 className="font-bold text-amber-900">{t('today_progress')} 15:00 - 17:00</h4><p className="text-amber-700 mt-1">Suggested carrying candy or crackers due to low sugar risk.</p></div>
      </div>
    </div>
  );
}