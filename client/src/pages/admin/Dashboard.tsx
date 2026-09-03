import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/resources';
import { LoadingState } from '../../components/ui/States';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { getDashboardStats().then((res) => setStats(res.data.stats)); }, []);

  if (!stats) return <LoadingState />;

  const cards = [
    ['Total Customers', stats.totalCustomers],
    ['New Enquiries', stats.newEnquiries],
    ['Active Projects', stats.activeProjects],
    ['Completed Projects', stats.completedProjects],
    ['Pending Bookings', stats.pendingBookings],
    ['Revenue', `₹${stats.revenue}`],
  ] as const;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="card bg-white">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-lavender-700">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
