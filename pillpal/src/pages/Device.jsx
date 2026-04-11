import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import moment from 'moment';

export default function Device() {
  const [deviceId, setDeviceId] = useState('demo_device_01');
  const [userId, setUserId] = useState(null);
  const [binding, setBinding] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [binding_loading, setBindingLoading] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => setUserId(u.id));
  }, []);

  const fetchStatus = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Get binding
    const bindings = await base44.entities.DeviceBinding.filter({ device_id: deviceId });
    setBinding(bindings.length > 0 ? bindings[0] : null);

    // Get last event
    const events = await base44.entities.PillEvent.filter(
      { user_id: userId },
      '-event_time',
      1
    );
    setLastEvent(events.length > 0 ? events[0] : null);

    setLoading(false);
  }, [userId, deviceId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleBind = async () => {
    setBindingLoading(true);
    // Check if binding exists
    const existing = await base44.entities.DeviceBinding.filter({ device_id: deviceId });
    if (existing.length > 0) {
      // Update existing binding
      await base44.entities.DeviceBinding.update(existing[0].id, {
        user_id: userId,
        bound_at: new Date().toISOString(),
      });
    } else {
      // Create new binding
      await base44.entities.DeviceBinding.create({
        device_id: deviceId,
        user_id: userId,
        bound_at: new Date().toISOString(),
      });
    }
    toast.success(t('device_bound'));
    setBindingLoading(false);
    fetchStatus();
  };

  const getBindingStatus = () => {
    if (!binding) return { label: t('not_bound'), icon: XCircle, color: 'text-muted-foreground' };
    if (binding.user_id === userId) return { label: t('bound_to_you'), icon: CheckCircle, color: 'text-teal-600' };
    return { label: t('bound_to_another'), icon: AlertTriangle, color: 'text-amber-600' };
  };

  const status = getBindingStatus();
  const StatusIcon = status.icon;

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold text-foreground mb-5">{t('device')}</h1>

      {/* Device ID */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border mb-4">
        <Label className="text-lg font-medium mb-2 block">{t('device_id')}</Label>
        <Input
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="h-14 text-lg mb-4"
        />
        <Button
          onClick={handleBind}
          disabled={binding_loading || !deviceId}
          className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700 rounded-xl"
        >
          {binding_loading ? t('loading') : t('bind_device')}
        </Button>
      </div>

      {/* Binding Status */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border mb-4">
        <h2 className="text-xl font-semibold mb-3">{t('binding_status')}</h2>
        {loading ? (
          <div className="h-8 bg-muted animate-pulse rounded-lg" />
        ) : (
          <div className="flex items-center gap-3">
            <StatusIcon className={cn("w-7 h-7", status.color)} />
            <span className={cn("text-lg font-medium", status.color)}>{status.label}</span>
          </div>
        )}
      </div>

      {/* Last Activity */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border mb-4">
        <h2 className="text-xl font-semibold mb-3">{t('last_activity')}</h2>
        {loading ? (
          <div className="space-y-2">
            <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-5 bg-muted animate-pulse rounded w-1/2" />
          </div>
        ) : lastEvent ? (
          <div className="space-y-1">
            <p className="text-lg">
              <span className="text-muted-foreground">{t('event_type')}: </span>
              <span className="font-medium">{t(lastEvent.event_type) || lastEvent.event_type}</span>
            </p>
            <p className="text-lg">
              <span className="text-muted-foreground">{t('event_time')}: </span>
              <span className="font-medium">{moment(lastEvent.event_time).format('YYYY-MM-DD HH:mm')}</span>
            </p>
            {lastEvent.voltage != null && (
              <p className="text-lg">
                <span className="text-muted-foreground">{t('voltage')}: </span>
                <span className="font-medium">{lastEvent.voltage}V</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-lg text-muted-foreground">{t('no_events')}</p>
        )}
      </div>

      {/* Explanation */}
      <div className="bg-teal-50 rounded-2xl p-5 border border-teal-200">
        <div className="flex gap-3">
          <Cpu className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
          <p className="text-base text-teal-800 leading-relaxed">
            {t('device_explanation')}
          </p>
        </div>
      </div>
    </div>
  );
}