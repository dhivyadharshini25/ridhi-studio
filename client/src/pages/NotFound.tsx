import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-bold text-lavender-300">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-800">Page not found</h1>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}
