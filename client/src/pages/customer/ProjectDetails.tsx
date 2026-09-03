import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject, addProjectUpdate } from '../../services/resources';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { apiErrorMessage } from '../../services/api';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  function load() {
    if (!id) return;
    getProject(id).then((res) => {
      setProject(res.data.project);
      setUpdates(res.data.updates);
    }).catch(() => setError('Could not load this project.'));
  }
  useEffect(load, [id]);

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !message.trim()) return;
    setPosting(true);
    try {
      await addProjectUpdate(id, { message });
      setMessage('');
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setPosting(false);
    }
  }

  if (error) return <ErrorState message={error} />;
  if (!project) return <LoadingState />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">{project.title}</h1>
          <p className="text-sm text-slate-500">{project.service_title}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="card">
        <h3 className="mb-4 font-semibold text-slate-800">Project Updates</h3>
        <div className="space-y-4">
          {updates.length === 0 ? (
            <p className="text-sm text-slate-400">No updates yet.</p>
          ) : updates.map((u) => (
            <div key={u.id} className={`rounded-xl p-3 text-sm ${u.is_deliverable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
              {u.is_deliverable && <p className="mb-1 text-xs font-semibold uppercase">Deliverable</p>}
              <p>{u.message}</p>
              {u.file_url && <a href={u.file_url} className="mt-1 block text-xs underline">View file</a>}
              <p className="mt-1 text-xs text-slate-400">{new Date(u.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <form onSubmit={postUpdate} className="mt-4 flex gap-2">
          <input className="input" placeholder="Add a message or question…" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button disabled={posting} className="btn-primary !py-2 text-sm">Send</button>
        </form>
      </div>
    </div>
  );
}
