import { useEffect, useState } from 'react';
import { getServices, createService, updateService, deleteService, getServiceCategories } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';

const emptyForm = { title: '', shortDescription: '', description: '', categoryId: '', imageUrl: '', startingPrice: '', deliveryEstimate: '' };

export default function Services() {
  const [services, setServices] = useState<any[] | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function load() {
    getServices(true).then((res) => setServices(res.data.services));
  }
  useEffect(() => { load(); getServiceCategories().then((res) => setCategories(res.data.categories)); }, []);

  function edit(s: any) {
    setEditingId(s.id);
    setForm({
      title: s.title, shortDescription: s.short_description || '', description: s.description || '',
      categoryId: s.category_id || '', imageUrl: s.image_url || '', startingPrice: s.starting_price || '', deliveryEstimate: s.delivery_estimate || '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, startingPrice: form.startingPrice ? Number(form.startingPrice) : null };
    if (editingId) await updateService(editingId, payload);
    else await createService(payload);
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    load();
  }

  async function toggleActive(s: any) {
    await updateService(s.id, { isActive: !s.is_active });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Services</h1>
        <button onClick={() => { setShowForm((s) => !s); setEditingId(null); setForm(emptyForm); }} className="btn-primary !py-2 text-sm">
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <div>
            <label className="label">Starting price (₹)</label>
            <input type="number" className="input" value={form.startingPrice} onChange={(e) => setForm({ ...form, startingPrice: e.target.value })} />
          </div>
          <div>
            <label className="label">Delivery estimate</label>
            <input className="input" value={form.deliveryEstimate} onChange={(e) => setForm({ ...form, deliveryEstimate: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Short description (for cards)</label>
            <input className="input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Full description</label>
            <textarea rows={4} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button className="btn-primary sm:col-span-2">{editingId ? 'Update Service' : 'Create Service'}</button>
        </form>
      )}

      {!services ? <LoadingState /> : services.length === 0 ? <EmptyState title="No services yet" /> : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{s.title}</p>
                <p className="text-sm text-slate-400">{s.category_name} · {s.is_active ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => edit(s)} className="text-sm font-medium text-lavender-700">Edit</button>
                <button onClick={() => toggleActive(s)} className="text-sm font-medium text-slate-400">
                  {s.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={async () => { await deleteService(s.id); load(); }} className="text-sm font-medium text-rose-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
