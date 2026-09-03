import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-100 bg-lavender-50/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-lavender-700">RiDhi Studio</p>
          <p className="mt-3 text-sm text-slate-500">Creative Ideas. Beautifully Built.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">Explore</p>
          <div className="flex flex-col gap-2 text-sm text-slate-500">
            <Link to="/services" className="hover:text-lavender-700">Services</Link>
            <Link to="/portfolio" className="hover:text-lavender-700">Portfolio</Link>
            <Link to="/about" className="hover:text-lavender-700">About</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">Get in touch</p>
          <div className="flex flex-col gap-2 text-sm text-slate-500">
            <Link to="/contact" className="hover:text-lavender-700">Contact Us</Link>
            <Link to="/start-a-project" className="hover:text-lavender-700">Start a Project</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">Follow</p>
          <div className="flex flex-col gap-2 text-sm text-slate-500">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-lavender-700">Instagram</a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="hover:text-lavender-700">WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} RiDhi Studio. All rights reserved.
      </div>
    </footer>
  );
}
