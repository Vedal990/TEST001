import React from "react";
import { Heart, Activity, Thermometer, Users, Plus, Info } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function HeartDisease() {
  const t = useT();

  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">{t('tab_heart')}</h1>

      {/* Next Medication Card */}
      <Card className="border-red-100 bg-red-50/30">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600 uppercase tracking-wider">
                {t('next_medication')}
              </p>
              <h3 className="text-xl font-bold text-slate-900">Aspirin & BP Meds</h3>
              <p className="text-lg text-slate-600">21:00 (Bedtime)</p>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              {t('confirm')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blood Pressure & Heart Rate Card */}
      <Card>
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            {t('blood_pressure')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 text-center">
          <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
            <div>
              <div className="text-2xl font-black text-slate-900">128</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Systolic</div>
            </div>
            <div className="border-x border-slate-200">
              <div className="text-2xl font-black text-slate-900">82</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Diastolic</div>
            </div>
            <div>
              <div className="text-2xl font-black text-teal-600">78</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">BPM</div>
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            Normal Range • Measured at 07:30AM
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-12 border-slate-200 rounded-xl gap-2">
              <Plus className="w-4 h-4" /> {t('record_data')}
            </Button>
            <Button variant="outline" className="flex-1 h-12 border-slate-200 rounded-xl gap-2">
              <Activity className="w-4 h-4" /> {t('symptoms')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Salt Intake Reminder */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between items-end">
            <h4 className="font-bold text-slate-900 text-lg">{t('salt_intake')}</h4>
            <span className="text-sm font-medium text-slate-500">4.2g / 5.0g</span>
          </div>
          <Progress value={84} className="h-3 bg-slate-100" />
          <p className="text-sm text-slate-500 leading-tight">
            Remaining allowance for today: <span className="font-bold text-teal-600">0.8g</span>.
          </p>
        </CardContent>
      </Card>

      {/* Relatives Section */}
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