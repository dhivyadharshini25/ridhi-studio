import { useEffect, useState } from 'react';
import { getBookings, updateBooking } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

const STATUSES = ['PENDING', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED'];

export default function Bookings() {
  const [bookings, setBookings] = useState<any[] | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  function load() {
    getBookings(statusFilter ? `?status=${statusFilter}` : '').then((res) => setBookings(res.data.bookings));
  }
  useEffect(load, [statusFilter]);

  async function changeStatus(id: string, status: string) {
    await updateBooking(id, { status });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Bookings</h1>
        <select className="input max-w-[180px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!bookings ? <LoadingState /> : bookings.length === 0 ? <EmptyState title="No bookings found" /> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-slate-50">
                  <td className="px-4 py-3">{b.customer_name}</td>
                  <td className="px-4 py-3 text-slate-500">{b.service_title}</td>
                  <td className="px-4 py-3 text-slate-500">{b.appointment_date} {b.appointment_time}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <select className="input !py-1 text-xs" value={b.status} onChange={(e) => changeStatus(b.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
