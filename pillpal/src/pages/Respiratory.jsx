import React, { useState } from "react";
import { Wind, Thermometer, Droplet, Users, Plus, ShieldCheck, AlertTriangle } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function Respiratory() {
  const t = useT();
  const [subTab, setSubTab] = useState("asthma"); // "asthma" or "allergy"

  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">{t('tab_respiratory')}</h1>

      {/* Sub-tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setSubTab("asthma")}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            subTab === "asthma" ? "bg-white shadow-sm text-teal-600" : "text-slate-500"
          )}
        >
          {t('asthma')}
        </button>
        <button
          onClick={() => setSubTab("allergy")}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            subTab === "allergy" ? "bg-white shadow-sm text-teal-600" : "text-slate-500"
          )}
        >
          {t('allergy')}
        </button>
      </div>

      {subTab === "asthma" ? (
        <>
          {/* Asthma Content */}
          <Card className="border-blue-100 bg-blue-50/30">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                    Inhaler Dosage
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">Salbutamol</h3>
                  <p className="text-lg text-slate-600">Remaining: 142 Puffs</p>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 flex items-center justify-center text-xs font-bold">
                  71%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Wind className="w-5 h-5 text-blue-500" />
                Peak Flow (PEF)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-center">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-4">
                <div className="text-4xl font-black text-slate-900">450 <span className="text-lg font-normal text-slate-500">L/min</span></div>
                <p className="text-sm text-green-600 font-medium mt-1">Excellent Condition</p>
              </div>
              <Button variant="outline" className="w-full h-12 border-slate-200 rounded-xl gap-2">
                <Plus className="w-4 h-4" /> {t('record_data')}
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Allergy Content */}
          <Card>
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                {t('air_quality')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                  <p className="text-xs text-orange-600 font-bold uppercase">Pollen</p>
                  <p className="text-xl font-bold text-orange-900">High</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
                  <p className="text-xs text-green-600 font-bold uppercase">AQI</p>
                  <p className="text-xl font-bold text-green-900">32 (Good)</p>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800">
                  High pollen level detected. Suggest wearing a mask outdoors.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Shared Relatives Section */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-teal-600" />
            <div>
              <p className="font-semibold text-slate-900">{t('my_relatives')}</p>
              <p className="text-sm text-slate-500 italic">Daughter, Son</p>
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