import { useEffect, useState } from 'react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';

export default function Testimonials() {
  const [items, setItems] = useState<any[] | null>(null);
  const [form, setForm] = useState({ customerName: '', message: '', rating: '5' });
  const [showForm, setShowForm] = useState(false);

  function load() {
    getTestimonials(true).then((res) => setItems(res.data.testimonials));
  }
  useEffect(load, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createTestimonial({ ...form, rating: Number(form.rating) });
    setForm({ customerName: '', message: '', rating: '5' });
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Testimonials</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 text-sm">{showForm ? 'Cancel' : 'Add Testimonial'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
          <div>
            <label className="label">Customer name</label>
            <input required className="input" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required rows={3} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <div>
            <label className="label">Rating</label>
            <select className="input max-w-[100px]" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button className="btn-primary">Add</button>
        </form>
      )}

      {!items ? <LoadingState /> : items.length === 0 ? <EmptyState title="No testimonials yet" /> : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{t.customer_name} <span className="text-amber-400">{'★'.repeat(t.rating || 0)}</span></p>
                <p className="text-sm text-slate-500">{t.message}</p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={async () => { await updateTestimonial(t.id, { isApproved: !t.is_approved }); load(); }} className="font-medium text-lavender-700">
                  {t.is_approved ? 'Unapprove' : 'Approve'}
                </button>
                <button onClick={async () => { await updateTestimonial(t.id, { isPublished: !t.is_published }); load(); }} className="font-medium text-slate-500">
                  {t.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={async () => { await deleteTestimonial(t.id); load(); }} className="font-medium text-rose-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
