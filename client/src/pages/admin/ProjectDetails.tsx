import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject, updateProjectStatus, addProjectUpdate } from '../../services/resources';
import { LoadingState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

const STATUSES = ['NEW', 'PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED'];

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [isDeliverable, setIsDeliverable] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  function load() {
    if (!id) return;
    getProject(id).then((res) => { setProject(res.data.project); setUpdates(res.data.updates); });
  }
  useEffect(load, [id]);

  async function changeStatus(status: string) {
    if (!id) return;
    await updateProjectStatus(id, { status });
    load();
  }

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !message.trim()) return;
    await addProjectUpdate(id, { message, isDeliverable, fileUrl: fileUrl || undefined });
    setMessage(''); setIsDeliverable(false); setFileUrl('');
    load();
  }

  if (!project) return <LoadingState />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">{project.title}</h1>
          <p className="text-sm text-slate-500">{project.customer_name} · {project.service_title}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={project.status} />
          <select className="input !py-1.5 text-xs" value={project.status} onChange={(e) => changeStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 font-semibold text-slate-800">Updates & Deliverables</h3>
        <div className="space-y-3">
          {updates.map((u) => (
            <div key={u.id} className={`rounded-xl p-3 text-sm ${u.is_deliverable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
              {u.is_deliverable && <p className="mb-1 text-xs font-semibold uppercase">Deliverable</p>}
              <p>{u.message}</p>
              {u.file_url && <a href={u.file_url} className="mt-1 block text-xs underline">View file</a>}
            </div>
          ))}
        </div>
        <form onSubmit={postUpdate} className="mt-4 space-y-3">
          <textarea className="input" rows={2} placeholder="Progress note or message to customer…" value={message} onChange={(e) => setMessage(e.target.value)} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" checked={isDeliverable} onChange={(e) => setIsDeliverable(e.target.checked)} />
              Mark as deliverable
            </label>
            <input className="input max-w-xs !py-1.5 text-xs" placeholder="File URL (optional)" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
            <button className="btn-primary !py-2 text-sm">Post Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
