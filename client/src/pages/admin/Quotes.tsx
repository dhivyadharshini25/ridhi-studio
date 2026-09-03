import { useEffect, useState } from 'react';
import { getQuotes, createQuote, getCustomers, getEnquiries } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function Quotes() {
  const [quotes, setQuotes] = useState<any[] | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    customerId: '', enquiryId: '', discount: '', additionalCharges: '', validUntil: '', notes: '',
    items: [{ description: '', price: '' }],
  });

  function load() {
    getQuotes().then((res) => setQuotes(res.data.quotes));
  }
  useEffect(() => { load(); getCustomers().then((res) => setCustomers(res.data.customers)); }, []);

  function updateItem(i: number, field: string, value: string) {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    setForm({ ...form, items });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createQuote({
      ...form,
      discount: form.discount ? Number(form.discount) : 0,
      additionalCharges: form.additionalCharges ? Number(form.additionalCharges) : 0,
      items: form.items.map((it: any) => ({ description: it.description, price: Number(it.price) })),
    });
    setForm({ customerId: '', enquiryId: '', discount: '', additionalCharges: '', validUntil: '', notes: '', items: [{ description: '', price: '' }] });
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Quotes</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 text-sm">
          {showForm ? 'Cancel' : 'Create Quote'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
          <div>
            <label className="label">Customer</label>
            <select required className="input" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
              <option value="">Select a customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
            </select>
          </div>

          <div>
            <label className="label">Line items</label>
            <div className="space-y-2">
              {form.items.map((it: any, i: number) => (
                <div key={i} className="flex gap-2">
                  <input className="input" placeholder="Description" value={it.description} onChange={(e) => updateItem(i, 'description', e.target.value)} />
                  <input className="input max-w-[120px]" type="number" placeholder="Price" value={it.price} onChange={(e) => updateItem(i, 'price', e.target.value)} />
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { description: '', price: '' }] })} className="mt-2 text-xs font-semibold text-lavender-700">
              + Add line item
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Discount (₹)</label>
              <input type="number" className="input" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
            </div>
            <div>
              <label className="label">Additional charges (₹)</label>
              <input type="number" className="input" value={form.additionalCharges} onChange={(e) => setForm({ ...form, additionalCharges: e.target.value })} />
            </div>
            <div>
              <label className="label">Valid until</label>
              <input type="date" className="input" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button className="btn-primary">Send Quote</button>
        </form>
      )}

      {!quotes ? <LoadingState /> : quotes.length === 0 ? <EmptyState title="No quotes yet" /> : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <div key={q.id} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{q.quote_number} — {q.customer_name}</p>
                <p className="text-sm text-slate-500">₹{q.total}</p>
              </div>
              <StatusBadge status={q.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
