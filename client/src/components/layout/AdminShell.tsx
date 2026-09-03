import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/portfolio', label: 'Portfolio' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/quotes', label: 'Quotes' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/messages', label: 'Messages' },
];

export default function AdminShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <p className="mb-6 font-display text-lg font-bold text-lavender-700">RiDhi Admin</p>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-lavender-600 text-white' : 'text-slate-600 hover:bg-white'
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
    </div>
  );
}
