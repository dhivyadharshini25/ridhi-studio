import { useEffect, useState } from 'react';
import { getContactMessages, updateContactMessage, deleteContactMessage } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';

export default function Messages() {
  const [messages, setMessages] = useState<any[] | null>(null);

  function load() {
    getContactMessages().then((res) => setMessages(res.data.messages));
  }
  useEffect(load, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Contact Messages</h1>
      {!messages ? <LoadingState /> : messages.length === 0 ? <EmptyState title="No messages yet" /> : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`card ${!m.is_read ? 'border-lavender-200 bg-lavender-50/40' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{m.name} <span className="font-normal text-slate-400">· {m.email}</span></p>
                  {m.phone && <p className="text-xs text-slate-400">{m.phone}</p>}
                  <p className="mt-2 text-sm text-slate-600">{m.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-xs">
                  <span className="text-slate-400">{new Date(m.created_at).toLocaleDateString()}</span>
                  <button onClick={async () => { await updateContactMessage(m.id, { isRead: !m.is_read }); load(); }} className="font-medium text-lavender-700">
                    {m.is_read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button onClick={async () => { await deleteContactMessage(m.id); load(); }} className="font-medium text-rose-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
