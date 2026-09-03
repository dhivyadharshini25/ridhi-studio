import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomer, setCustomerActive } from '../../services/resources';
import { LoadingState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function CustomerDetails() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  function load() {
    if (!id) return;
    getCustomer(id).then((res) => setData(res.data));
  }
  useEffect(load, [id]);

  if (!data) return <LoadingState />;
  const { customer, enquiries, bookings, projects } = data;

  async function toggleActive() {
    if (!id) return;
    await setCustomerActive(id, !customer.is_active);
    load();
  }

  return (
    <div className="space-y-8">
      <div className="card flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">{customer.full_name}</h1>
          <p className="text-sm text-slate-500">{customer.email} · {customer.phone}</p>
        </div>
        <button onClick={toggleActive} className={customer.is_active ? 'btn-secondary' : 'btn-primary'}>
          {customer.is_active ? 'Disable Account' : 'Enable Account'}
        </button>
      </div>

      {[['Enquiries', enquiries], ['Bookings', bookings], ['Projects', projects]].map(([label, list]: any) => (
        <div key={label} className="card">
          <h3 className="mb-4 font-semibold text-slate-800">{label}</h3>
          {list.length === 0 ? <p className="text-sm text-slate-400">None yet.</p> : (
            <div className="space-y-2">
              {list.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between border-b border-slate-50 py-2 text-sm last:border-0">
                  <span className="text-slate-600">{item.title || item.details || `${item.appointment_date} ${item.appointment_time}`}</span>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
