import { useEffect, useState } from 'react';
import { getPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem, getPortfolioCategories } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';

const emptyForm = { title: '', description: '', categoryId: '', coverImageUrl: '', isPublished: false };

export default function Portfolio() {
  const [projects, setProjects] = useState<any[] | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function load() {
    getPortfolio('all', true).then((res) => setProjects(res.data.projects));
  }
  useEffect(() => { load(); getPortfolioCategories().then((res) => setCategories(res.data.categories)); }, []);

  function edit(p: any) {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description || '', categoryId: p.category_id || '', coverImageUrl: p.cover_image_url || '', isPublished: p.is_published });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) await updatePortfolioItem(editingId, form);
    else await createPortfolioItem(form);
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Portfolio</h1>
        <button onClick={() => { setShowForm((s) => !s); setEditingId(null); setForm(emptyForm); }} className="btn-primary !py-2 text-sm">
          {showForm ? 'Cancel' : 'Add Project'}
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
            <label className="label">Cover image URL</label>
            <input className="input" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Publish immediately
          </label>
          <button className="btn-primary sm:col-span-2">{editingId ? 'Update Project' : 'Create Project'}</button>
        </form>
      )}

      {!projects ? <LoadingState /> : projects.length === 0 ? <EmptyState title="No portfolio projects yet" /> : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{p.title}</p>
                <p className="text-sm text-slate-400">{p.category_name} · {p.is_published ? 'Published' : 'Draft'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => edit(p)} className="text-sm font-medium text-lavender-700">Edit</button>
                <button onClick={async () => { await updatePortfolioItem(p.id, { isPublished: !p.is_published }); load(); }} className="text-sm font-medium text-slate-400">
                  {p.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={async () => { await deletePortfolioItem(p.id); load(); }} className="text-sm font-medium text-rose-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
