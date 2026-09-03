import { useEffect, useState } from 'react';
import { getEnquiries, updateEnquiry, convertEnquiry } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

const STATUSES = ['NEW', 'REVIEWING', 'QUOTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<any[] | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  function load() {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (statusFilter) q.set('status', statusFilter);
    getEnquiries(`?${q.toString()}`).then((res) => setEnquiries(res.data.enquiries));
  }
  useEffect(load, [search, statusFilter]);

  async function changeStatus(id: string, status: string) {
    await updateEnquiry(id, { status });
    load();
  }

  async function convert(id: string) {
    const title = prompt('Project title:');
    if (!title) return;
    await convertEnquiry(id, { title });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-slate-900">Enquiries</h1>
        <div className="flex gap-2">
          <input className="input max-w-xs" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input max-w-[160px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {!enquiries ? <LoadingState /> : enquiries.length === 0 ? <EmptyState title="No enquiries found" /> : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div key={e.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{e.customer_name} <span className="font-normal text-slate-400">· {e.customer_email}</span></p>
                  <p className="mt-1 text-sm text-slate-500">{e.service_title || 'General'} — {e.details}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(e.created_at).toLocaleString()}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <select className="input max-w-[180px] !py-1.5 text-xs" value={e.status} onChange={(ev) => changeStatus(e.id, ev.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {e.status === 'APPROVED' && (
                  <button onClick={() => convert(e.id)} className="text-xs font-semibold text-lavender-700">Convert to Project</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
