import React, { useState } from "react";
import { Activity, Droplet, TrendingDown, Users, Plus, Info } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Diabetes() {
  const t = useT();
  const [lastSugar, setLastSugar] = useState("6.2");

  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">{t('tab_diabetes')}</h1>

      {/* Next Medication Card */}
      <Card className="border-teal-100 bg-teal-50/30">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-teal-600 uppercase tracking-wider">
                {t('next_medication')}
              </p>
              <h3 className="text-xl font-bold text-slate-900">Metformin</h3>
              <p className="text-lg text-slate-600">18:30 (In 2 hours)</p>
            </div>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              {t('confirm')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blood Sugar Record (Interactive Mockup) */}
      <Card>
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-500" />
            {t('blood_sugar')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="bg-slate-50 rounded-2xl p-6 text-center mb-4 border border-dashed border-slate-200">
            <div className="text-4xl font-black text-slate-900 mb-1">
              {lastSugar} <span className="text-lg font-normal text-slate-500">mmol/L</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              Normal Range
            </div>
            <p className="text-xs text-slate-400 mt-3">2 hours after meal • 15 min ago</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 border-slate-200 rounded-xl gap-2">
              <Plus className="w-4 h-4" /> {t('record_data')}
            </Button>
            <Button variant="outline" className="h-12 border-slate-200 rounded-xl gap-2">
              <Info className="w-4 h-4" /> {t('insulin')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hypoglycemia Risk Alert */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <TrendingDown className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-lg">Low Sugar Risk Period</h4>
          <p className="text-amber-700 text-base leading-tight mt-1">
            3:00 PM - 5:00 PM. Suggest carrying some candy or crackers.
          </p>
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