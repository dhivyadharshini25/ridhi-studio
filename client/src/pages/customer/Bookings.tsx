import { useEffect, useState } from 'react';
import { getBookings, createBooking, getServices } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { apiErrorMessage } from '../../services/api';

export default function Bookings() {
  const [bookings, setBookings] = useState<any[] | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    serviceId: '', appointmentDate: '', appointmentTime: '', notes: '',
    eventDate: '', sareeCount: '', sareeType: '', pickupDeliveryOption: 'Pickup',
  });
  const [selectedService, setSelectedService] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  function load() {
    getBookings().then((res) => setBookings(res.data.bookings));
  }
  useEffect(() => { load(); getServices().then((res) => setServices(res.data.services)); }, []);

  const isSaree = selectedService?.slug === 'saree-pre-pleating';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await createBooking({
        ...form,
        sareeCount: form.sareeCount ? Number(form.sareeCount) : null,
      });
      setShowForm(false);
      setForm({ serviceId: '', appointmentDate: '', appointmentTime: '', notes: '', eventDate: '', sareeCount: '', sareeType: '', pickupDeliveryOption: 'Pickup' });
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
      setStatus('error');
      return;
    }
    setStatus('idle');
  }

  if (!bookings) return <LoadingState />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">My Bookings</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 text-sm">
          {showForm ? 'Cancel' : 'New Booking'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
          {status === 'error' && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          <div>
            <label className="label">Service</label>
            <select required className="input" value={form.serviceId} onChange={(e) => {
              const svc = services.find((s) => s.id === e.target.value);
              setSelectedService(svc);
              setForm({ ...form, serviceId: e.target.value });
            }}>
              <option value="">Select a service</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Appointment date</label>
              <input required type="date" className="input" value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Appointment time</label>
              <input required type="time" className="input" value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} />
            </div>
          </div>

          {isSaree && (
            <div className="space-y-4 rounded-xl bg-lavender-50 p-4">
              <p className="text-sm font-semibold text-lavender-700">Saree Pre-Pleating Details</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Event date</label>
                  <input type="date" className="input" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                </div>
                <div>
                  <label className="label">Number of sarees</label>
                  <input type="number" min="1" className="input" value={form.sareeCount} onChange={(e) => setForm({ ...form, sareeCount: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Saree type</label>
                <input className="input" value={form.sareeType} onChange={(e) => setForm({ ...form, sareeType: e.target.value })} />
              </div>
              <div>
                <label className="label">Pickup/Delivery</label>
                <select className="input" value={form.pickupDeliveryOption} onChange={(e) => setForm({ ...form, pickupDeliveryOption: e.target.value })}>
                  <option>Pickup</option>
                  <option>Delivery</option>
                  <option>Drop-off at studio</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Booking…' : 'Confirm Booking'}
          </button>
        </form>
      )}

      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="card flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">{b.service_title || 'Booking'}</p>
                <p className="mt-1 text-sm text-slate-500">{b.appointment_date} at {b.appointment_time}</p>
                {b.notes && <p className="mt-1 text-sm text-slate-400">{b.notes}</p>}
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
