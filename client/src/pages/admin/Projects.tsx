import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function Projects() {
  const [projects, setProjects] = useState<any[] | null>(null);
  useEffect(() => { getProjects().then((res) => setProjects(res.data.projects)); }, []);

  if (!projects) return <LoadingState />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Projects</h1>
      {projects.length === 0 ? <EmptyState title="No projects yet" /> : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Link key={p.id} to={`/admin/projects/${p.id}`} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{p.title}</p>
                <p className="text-sm text-slate-400">{p.customer_name} · {p.service_title}</p>
              </div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
