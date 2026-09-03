import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiErrorMessage } from '../../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await login(form.email, form.password);
      const dest = location.state?.from?.pathname || '/dashboard';
      navigate(dest);
    } catch (err) {
      setError(apiErrorMessage(err));
      setStatus('error');
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Log in to your RiDhi Studio account.</p>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-4">
          {status === 'error' && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input required type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-medium text-lavender-600">Forgot password?</Link>
          </div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Logging in…' : 'Log In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-semibold text-lavender-700">Register</Link>
        </p>
      </div>
    </div>
  );
}
