import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';

export default function Customers() {
  const [customers, setCustomers] = useState<any[] | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { getCustomers(search).then((res) => setCustomers(res.data.customers)); }, [search]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Customers</h1>
        <input className="input max-w-xs" placeholder="Search customers…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {!customers ? <LoadingState /> : customers.length === 0 ? <EmptyState title="No customers found" /> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-slate-50 hover:bg-lavender-50/40">
                  <td className="px-4 py-3">
                    <Link to={`/admin/customers/${c.id}`} className="font-medium text-lavender-700">{c.full_name}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.email}</td>
                  <td className="px-4 py-3 text-slate-500">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {c.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
