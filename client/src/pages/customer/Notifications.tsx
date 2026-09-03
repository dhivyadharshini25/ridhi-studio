import { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';

export default function Notifications() {
  const [items, setItems] = useState<any[] | null>(null);

  function load() {
    getNotifications().then((res) => setItems(res.data.notifications));
  }
  useEffect(load, []);

  if (!items) return <LoadingState />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Notifications</h1>
        {items.some((i) => !i.is_read) && (
          <button onClick={async () => { await markAllNotificationsRead(); load(); }} className="text-sm font-medium text-lavender-700">
            Mark all as read
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState title="You're all caught up" />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={async () => { if (!n.is_read) { await markNotificationRead(n.id); load(); } }}
              className={`card block w-full text-left ${!n.is_read ? 'border-lavender-200 bg-lavender-50/50' : ''}`}
            >
              <p className="font-medium text-slate-800">{n.title}</p>
              {n.message && <p className="mt-1 text-sm text-slate-500">{n.message}</p>}
              <p className="mt-2 text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
