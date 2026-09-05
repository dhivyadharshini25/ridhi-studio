import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/image/logo.jpeg"
          alt="RiDhi Studio Logo"
          className="h-10 w-auto object-contain"
        />

        <span className="font-display text-xl font-bold text-lavender-700">
          RiDhi Studio
        </span>
      </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-lavender-700 ${isActive ? 'text-lavender-700' : 'text-slate-600'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-sm font-medium text-slate-600 hover:text-lavender-700">
                {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm font-medium text-slate-400 hover:text-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-lavender-700">Login</Link>
              <Link to="/start-a-project" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-slate-700 transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-slate-700 transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-slate-700 transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      <div className={`md:hidden ${open ? 'max-h-96' : 'max-h-0'} overflow-hidden border-t border-slate-100 transition-all duration-300`}>
        <div className="container-page flex flex-col gap-4 py-4">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-600">
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="text-sm font-medium text-lavender-700">
                {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="text-left text-sm font-medium text-rose-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-600">Login</Link>
              <Link to="/start-a-project" onClick={() => setOpen(false)} className="btn-primary w-fit">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
