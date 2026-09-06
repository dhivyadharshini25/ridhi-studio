import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="border-b border-slate-100 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <p className="font-display text-lg font-bold text-lavender-700">
            RiDhi Admin
          </p>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl bg-slate-100 px-3 py-2 text-xl text-slate-700"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-slate-100 px-4 py-3">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-lavender-600 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block lg:sticky lg:top-8 lg:h-fit">
          <p className="mb-6 font-display text-lg font-bold text-lavender-700">
            RiDhi Admin
          </p>

          <nav className="flex flex-col gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-lavender-600 text-white'
                      : 'text-slate-600 hover:bg-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Page Content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}