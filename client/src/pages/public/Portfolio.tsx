import { useEffect, useState } from 'react';
import { getPortfolio, getPortfolioCategories } from '../../services/resources';
import { PortfolioProject } from '../../types';
import PortfolioCard from '../../components/public/PortfolioCard';
import { LoadingState, EmptyState } from '../../components/ui/States';

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [active, setActive] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    getPortfolioCategories().then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    getPortfolio(active)
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <div className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">Portfolio</h1>
        <p className="mt-3 text-slate-500">A glimpse into work we're proud of.</p>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {[{ slug: 'all', name: 'All' }, ...categories].map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active === c.slug ? 'bg-lavender-600 text-white' : 'bg-lavender-50 text-lavender-700 hover:bg-lavender-100'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? <LoadingState /> : projects.length === 0 ? (
        <EmptyState title="No projects in this category yet" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <PortfolioCard key={p.id} project={p} onClick={() => setSelected(p)} />)}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            {selected.cover_image_url && <img src={selected.cover_image_url} alt={selected.title} className="mb-4 w-full rounded-xl" />}
            <h3 className="font-display text-2xl font-bold text-slate-900">{selected.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{selected.description}</p>
            <button onClick={() => setSelected(null)} className="btn-secondary mt-6">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
