import { useState, useEffect, useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';
import ReminderCard from '@/components/ReminderCard';
import ReminderModal from '@/components/ReminderModal';
import SkeletonCard from '@/components/SkeletonCard';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const alertedIds = useRef(new Set());

  useEffect(() => {
    base44.auth.me().then((u) => setUserId(u.id));
  }, []);

  const fetchReminders = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const data = await base44.entities.MedicationReminder.filter(
      { user_id: userId, is_active: true },
      'remind_time'
    );
    setReminders(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Due highlight: update current time every 10 seconds
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hh}:${mm}`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  // Toast for due reminders
  useEffect(() => {
    if (!currentTime) return;
    reminders.forEach((r) => {
      const rTime = (r.remind_time || '').slice(0, 5);
      if (rTime === currentTime && !alertedIds.current.has(r.id)) {
        alertedIds.current.add(r.id);
        toast.warning(`⏰ ${rTime} — ${r.memo || t('reminder_due')}`);
      }
    });
  }, [currentTime, reminders]);

  const handleSave = async (data) => {
    setSaving(true);
    if (editingReminder) {
      await base44.entities.MedicationReminder.update(editingReminder.id, {
        remind_time: data.remind_time,
        memo: data.memo,
      });
      toast.success(t('reminder_updated'));
    } else {
      await base44.entities.MedicationReminder.create({
        user_id: userId,
        remind_time: data.remind_time,
        memo: data.memo,
        is_active: true,
      });
      toast.success(t('reminder_added'));
    }
    setSaving(false);
    setModalOpen(false);
    setEditingReminder(null);
    fetchReminders();
  };

  const handleConfirm = async (reminder) => {
    const rTime = (reminder.remind_time || '').slice(0, 5);
    // 1. Insert pill event
    await base44.entities.PillEvent.create({
      user_id: userId,
      event_time: new Date().toISOString(),
      event_type: 'confirmed_by_app',
      memo: `confirmed reminder ${reminder.id}: ${rTime} ${reminder.memo || ''}`,
    });
    // 2. Deactivate reminder
    await base44.entities.MedicationReminder.update(reminder.id, { is_active: false });
    toast.success(t('reminder_confirmed'));
    fetchReminders();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await base44.entities.MedicationReminder.delete(deleteTarget.id);
    toast.success(t('reminder_deleted'));
    setDeleteTarget(null);
    fetchReminders();
  };

  const openEdit = (reminder) => {
    setEditingReminder(reminder);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingReminder(null);
    setModalOpen(true);
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-foreground">{t('reminders')}</h1>
        <Button
          onClick={openAdd}
          className="h-12 px-5 text-lg bg-teal-600 hover:bg-teal-700 rounded-xl"
        >
          <Plus className="w-5 h-5 mr-1" />
          {t('add_reminder')}
        </Button>
      </div>

      {loading ? (
        <SkeletonCard count={3} />
      ) : reminders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">{t('no_reminders')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => {
            const rTime = (r.remind_time || '').slice(0, 5);
            const isDue = rTime === currentTime;
            return (
              <ReminderCard
                key={r.id}
                reminder={r}
                isDue={isDue}
                onEdit={openEdit}
                onConfirm={handleConfirm}
                onDelete={setDeleteTarget}
              />
            );
          })}
        </div>
      )}

      <ReminderModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        reminder={editingReminder}
        onSave={handleSave}
        saving={saving}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              {t('delete_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-lg">{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-12 text-lg bg-destructive hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}