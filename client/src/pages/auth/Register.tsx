import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiErrorMessage } from '../../services/api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(apiErrorMessage(err));
      setStatus('error');
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-3xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Join RiDhi Studio to start a project.</p>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-4">
          {status === 'error' && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          <div>
            <label className="label">Full name</label>
            <input required className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input required type="password" minLength={8} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input required type="password" className="input" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-lavender-700">Log in</Link>
        </p>
      </div>
    </div>
  );
}
