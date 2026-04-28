import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, assertNoSupabaseError } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Check, Droplets, Footprints, Users } from "lucide-react";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import ReminderCard from "@/components/ReminderCard";
import ReminderModal from "@/components/ReminderModal";
import SkeletonCard from "@/components/SkeletonCard";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const toTimeHHMMSS = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
  if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
  const hhmm = s.slice(0, 5);
  if (/^\d{2}:\d{2}$/.test(hhmm)) return `${hhmm}:00`;
  return null;
};

export default function Reminders() {
  const { userId } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const alertedIds = useRef(new Set());

  const fetchReminders = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await supabase
        .from("medication_reminders")
        .select("id,user_id,remind_time,memo,is_active,created_at")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("remind_time", { ascending: true });

      assertNoSupabaseError(res);
      setReminders(res.data || []);
    } catch (e) {
      toast.error(e?.message || "Failed to load reminders");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hh}:${mm}`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!currentTime) return;
    reminders.forEach((r) => {
      const rTime = (r.remind_time || "").slice(0, 5);
      if (rTime === currentTime && !alertedIds.current.has(r.id)) {
        alertedIds.current.add(r.id);
        toast.warning(`${rTime} — ${r.memo || t("reminder_due")}`);
      }
    });
  }, [currentTime, reminders]);

  const handleSave = async (data) => {
    if (!userId) return;
    setSaving(true);
    try {
      const remind_time = toTimeHHMMSS(data?.remind_time);
      if (!remind_time) throw new Error("Invalid time format");
      const memo = (data?.memo || "").trim();

      if (editingReminder) {
        const res = await supabase
          .from("medication_reminders")
          .update({ remind_time, memo })
          .eq("id", editingReminder.id)
          .eq("user_id", userId)
          .select("id")
          .limit(1);
        assertNoSupabaseError(res);
        toast.success(t("reminder_updated"));
      } else {
        const res = await supabase
          .from("medication_reminders")
          .insert({ user_id: userId, remind_time, memo, is_active: true })
          .select("id")
          .limit(1);
        assertNoSupabaseError(res);
        toast.success(t("reminder_added"));
      }
      setModalOpen(false);
      setEditingReminder(null);
      fetchReminders();
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async (reminder) => {
    if (!userId) return;
    try {
      const rTime = (reminder.remind_time || "").slice(0, 5);
      const evRes = await supabase
        .from("pill_event")
        .insert({
          user_id: userId,
          event_time: new Date().toISOString(),
          event_type: "confirmed_by_app",
          memo: `confirmed reminder ${reminder.id}: ${rTime} ${reminder.memo || ""}`.trim(),
        })
        .select("id")
        .limit(1);
      assertNoSupabaseError(evRes);

      const updRes = await supabase
        .from("medication_reminders")
        .update({ is_active: false })
        .eq("id", reminder.id)
        .eq("user_id", userId);
      assertNoSupabaseError(updRes);

      toast.success(t("reminder_confirmed"));
      fetchReminders();
    } catch (e) {
      toast.error(e?.message || "Confirm failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !userId) return;
    try {
      const delRes = await supabase
        .from("medication_reminders")
        .delete()
        .eq("id", deleteTarget.id)
        .eq("user_id", userId);
      assertNoSupabaseError(delRes);
      toast.success(t("reminder_deleted"));
      setDeleteTarget(null);
      fetchReminders();
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  const nextReminder = reminders[0];

  return (
    <div className="px-4 pt-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("reminders")}</h1>
        <Button onClick={() => { setEditingReminder(null); setModalOpen(true); }} className="h-12 px-5 text-lg bg-teal-600 hover:bg-teal-700 rounded-xl">
          <Plus className="w-5 h-5 mr-1" /> {t("add_reminder")}
        </Button>
      </div>

      {/* Hero: Next Medication Section */}
      {nextReminder && (
        <Card className="border-teal-200 bg-teal-50 shadow-md shadow-teal-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <p className="text-sm font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  {t("next_medication")}
                </p>
                <h2 className="text-2xl font-black text-slate-900">{nextReminder.memo || "Medication"}</h2>
                <p className="text-xl font-medium text-teal-700">{(nextReminder.remind_time || "").slice(0, 5)}</p>
              </div>
              <Button onClick={() => handleConfirm(nextReminder)} className="h-14 w-14 rounded-2xl bg-teal-600 hover:bg-teal-700 shadow-lg">
                <Check className="w-8 h-8" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Section */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between items-end">
            <h4 className="font-bold text-slate-900">{t("today_progress")}</h4>
            <span className="text-sm font-bold text-teal-600">2 / 3</span>
          </div>
          <Progress value={66} className="h-3 bg-slate-100" />
        </CardContent>
      </Card>

      {/* Reminders List */}
      <div className="space-y-3">
        {loading ? (
          <SkeletonCard count={2} />
        ) : reminders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed">
            <p className="text-muted-foreground">{t("no_reminders")}</p>
          </div>
        ) : (
          reminders.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              isDue={(r.remind_time || "").slice(0, 5) === currentTime}
              onEdit={(rem) => { setEditingReminder(rem); setModalOpen(true); }}
              onConfirm={handleConfirm}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </div>

      {/* Lifestyle Widgets */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <Droplets className="w-6 h-6 text-blue-500" />
            <p className="text-xs font-bold text-blue-600 uppercase">{t("water_reminder")}</p>
            <p className="text-xl font-black text-slate-900">4 / 8 <span className="text-xs font-normal">cups</span></p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50/50 border-orange-100">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <Footprints className="w-6 h-6 text-orange-500" />
            <p className="text-xs font-bold text-orange-600 uppercase">{t("steps_count")}</p>
            <p className="text-xl font-black text-slate-900">3,248</p>
          </CardContent>
        </Card>
      </div>

      {/* Relatives Footer */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">D</div>
              <div className="h-8 w-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">S</div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{t("my_relatives")}</p>
              <p className="text-[10px] text-slate-500">3 Bound</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-teal-600 text-xs font-bold">
            {t("manage_relatives")} →
          </Button>
        </CardContent>
      </Card>

      <ReminderModal open={modalOpen} onOpenChange={setModalOpen} reminder={editingReminder} onSave={handleSave} saving={saving} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t("delete_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">{t("delete_confirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-lg">{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="h-12 text-lg bg-destructive hover:bg-destructive/90">
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}