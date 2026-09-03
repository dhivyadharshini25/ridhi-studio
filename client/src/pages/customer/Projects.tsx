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
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">My Projects</h1>
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" subtitle="Approved enquiries will appear here as projects." />
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <Link key={p.id} to={`/dashboard/projects/${p.id}`} className="card flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">{p.title}</p>
                <p className="mt-1 text-sm text-slate-500">{p.service_title}</p>
                {p.deadline && <p className="mt-1 text-xs text-slate-400">Deadline: {p.deadline}</p>}
              </div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
