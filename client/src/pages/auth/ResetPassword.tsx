import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api, apiErrorMessage } from '../../services/api';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await api.post('/auth/reset-password', { token: params.get('token'), password });
      setStatus('success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(apiErrorMessage(err));
      setStatus('error');
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-3xl font-bold text-slate-900">Reset password</h1>
        <form onSubmit={handleSubmit} className="card mt-8 space-y-4">
          {status === 'error' && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          {status === 'success' && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Password updated! Redirecting to login…</p>}
          <div>
            <label className="label">New password</label>
            <input required type="password" minLength={8} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input required type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Updating…' : 'Reset Password'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-lavender-700">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
