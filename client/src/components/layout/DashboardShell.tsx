import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/enquiries', label: 'My Enquiries' },
  { to: '/dashboard/bookings', label: 'My Bookings' },
  { to: '/dashboard/projects', label: 'My Projects' },
  { to: '/dashboard/quotes', label: 'My Quotes' },
  { to: '/dashboard/notifications', label: 'Notifications' },
  { to: '/dashboard/profile', label: 'Profile' },
];

export default function DashboardShell() {
  const { user } = useAuth();
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <p className="mb-4 text-sm text-slate-400">Welcome back,</p>
        <p className="mb-6 font-display text-lg font-semibold text-slate-800">{user?.fullName}</p>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-lavender-600 text-white' : 'text-slate-600 hover:bg-lavender-50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
