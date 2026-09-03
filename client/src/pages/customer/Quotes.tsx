import { useEffect, useState } from 'react';
import { getQuotes, respondToQuote } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function Quotes() {
  const [quotes, setQuotes] = useState<any[] | null>(null);

  function load() {
    getQuotes().then((res) => setQuotes(res.data.quotes));
  }
  useEffect(load, []);

  async function respond(id: string, action: 'accept' | 'reject') {
    await respondToQuote(id, action);
    load();
  }

  if (!quotes) return <LoadingState />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">My Quotes</h1>
      {quotes.length === 0 ? (
        <EmptyState title="No quotes yet" />
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{q.quote_number}</p>
                  <p className="mt-1 text-lg font-bold text-lavender-700">₹{q.total}</p>
                  {q.valid_until && <p className="text-xs text-slate-400">Valid until {q.valid_until}</p>}
                </div>
                <StatusBadge status={q.status} />
              </div>
              {q.notes && <p className="mt-2 text-sm text-slate-500">{q.notes}</p>}
              {q.status === 'SENT' && (
                <div className="mt-4 flex gap-3">
                  <button onClick={() => respond(q.id, 'accept')} className="btn-primary !py-2 text-sm">Accept</button>
                  <button onClick={() => respond(q.id, 'reject')} className="btn-secondary !py-2 text-sm">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
