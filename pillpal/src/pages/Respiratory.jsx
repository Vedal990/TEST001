import React, { useState } from "react";
import { Wind, Users, Plus, ShieldCheck, AlertTriangle, Pill } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { useSettings } from "@/lib/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Respiratory() {
  const t = useT();
  const { isLarge } = useSettings();
  const [subTab, setSubTab] = useState("asthma");

  if (isLarge) {
    return (
      <div className="px-4 pt-4 pb-24 space-y-8">
        <h1 className="text-4xl font-black text-teal-700">{t('tab_respiratory')}</h1>
        <div className="flex bg-slate-100 p-2 rounded-[30px] h-20">
          <button onClick={() => setSubTab("asthma")} className={cn("flex-1 rounded-[25px] text-2xl font-black transition-all", subTab === "asthma" ? "bg-white shadow-md text-teal-600" : "text-slate-500")}>{t('asthma')}</button>
          <button onClick={() => setSubTab("allergy")} className={cn("flex-1 rounded-[25px] text-2xl font-black transition-all", subTab === "allergy" ? "bg-white shadow-md text-teal-600" : "text-slate-500")}>{t('allergy')}</button>
        </div>
        {subTab === "asthma" ? (
          <div className="space-y-6">
            <Card className="border-4 border-blue-500 bg-blue-50 shadow-xl rounded-[40px]">
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <Pill className="w-16 h-16 text-blue-600" />
                <div><p className="text-2xl font-bold text-blue-700">吸入剂剩余</p><h3 className="text-6xl font-black text-slate-900 mt-2">142 喷</h3></div>
                <div className="w-full bg-blue-200 h-6 rounded-full mt-2"><div className="bg-blue-600 h-6 rounded-full" style={{ width: '71%' }}></div></div>
              </CardContent>
            </Card>
            <div className="bg-white rounded-[40px] p-8 border-4 border-border shadow-sm text-center space-y-4">
              <div className="flex justify-center gap-3 items-center"><Wind className="w-12 h-12 text-blue-500" /><span className="text-3xl font-bold">呼吸情况</span></div>
              <div className="text-8xl font-black text-slate-900">450</div>
              <p className="text-3xl font-black text-green-600">非常好</p>
              <Button className="w-full h-24 text-3xl font-black bg-teal-600 rounded-3xl shadow-lg mt-4">{t('record_data')}</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 border-4 border-border shadow-sm space-y-8">
              <div className="flex justify-between items-center bg-orange-50 p-6 rounded-3xl border-2 border-orange-100"><span className="text-3xl font-bold text-orange-800">花粉浓度</span><span className="text-4xl font-black text-orange-600">高</span></div>
              <div className="flex justify-between items-center bg-green-50 p-6 rounded-3xl border-2 border-green-100"><span className="text-3xl font-bold text-green-800">空气质量</span><span className="text-4xl font-black text-green-600">优</span></div>
              <div className="bg-amber-100 p-8 rounded-3xl flex flex-col items-center text-center gap-4"><AlertTriangle className="w-16 h-16 text-amber-600" /><p className="text-2xl font-bold text-amber-900">今天花粉很多，出门请戴口罩</p></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold">{t('tab_respiratory')}</h1>
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button onClick={() => setSubTab("asthma")} className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", subTab === "asthma" ? "bg-white shadow-sm text-teal-600" : "text-slate-500")}>{t('asthma')}</button>
        <button onClick={() => setSubTab("allergy")} className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", subTab === "allergy" ? "bg-white shadow-sm text-teal-600" : "text-slate-500")}>{t('allergy')}</button>
      </div>
      {subTab === "asthma" ? (
        <Card><CardContent className="p-5 text-center"><div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-4"><div className="text-4xl font-black">450 <span className="text-lg font-normal text-slate-500">L/min</span></div></div><Button variant="outline" className="w-full h-12 rounded-xl font-bold text-teal-700"><Plus className="w-4 h-4" /> {t('record_data')}</Button></CardContent></Card>
      ) : (
        <Card><CardContent className="p-5 space-y-4"><div className="grid grid-cols-2 gap-3"><div className="bg-orange-50 p-4 rounded-2xl text-center"><p className="text-xs text-orange-600 font-bold uppercase">Pollen</p><p className="text-xl font-bold text-orange-900">High</p></div><div className="bg-green-50 p-4 rounded-2xl text-center"><p className="text-xs text-green-600 font-bold uppercase">AQI</p><p className="text-xl font-bold text-green-900">32</p></div></div></CardContent></Card>
      )}
    </div>
  );
}