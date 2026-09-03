import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEnquiries, getBookings, getProjects } from '../../services/resources';
import { LoadingState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function Overview() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    Promise.all([getEnquiries(), getBookings(), getProjects()]).then(([e, b, p]) => {
      setData({ enquiries: e.data.enquiries, bookings: b.data.bookings, projects: p.data.projects });
    });
  }, []);

  if (!data) return <LoadingState />;

  const activeProjects = data.projects.filter((p: any) => !['COMPLETED', 'CANCELLED'].includes(p.status));
  const pendingEnquiries = data.enquiries.filter((e: any) => !['COMPLETED', 'CANCELLED'].includes(e.status));
  const completed = data.projects.filter((p: any) => p.status === 'COMPLETED');

  const cards = [
    ['Active Projects', activeProjects.length, '/dashboard/projects'],
    ['Pending Enquiries', pendingEnquiries.length, '/dashboard/enquiries'],
    ['Bookings', data.bookings.length, '/dashboard/bookings'],
    ['Completed Projects', completed.length, '/dashboard/projects'],
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, count, link]) => (
          <Link key={label} to={link} className="card">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-lavender-700">{count}</p>
          </Link>
        ))}
      </div>

      <div className="card">
        <h3 className="mb-4 font-display text-lg font-semibold text-slate-800">Recent Enquiries</h3>
        {data.enquiries.slice(0, 5).length === 0 ? (
          <p className="text-sm text-slate-400">No enquiries yet. <Link to="/start-a-project" className="text-lavender-700">Start a project →</Link></p>
        ) : (
          <div className="space-y-3">
            {data.enquiries.slice(0, 5).map((e: any) => (
              <div key={e.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{e.service_title || 'General Enquiry'}</p>
                  <p className="text-xs text-slate-400">{new Date(e.created_at).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
