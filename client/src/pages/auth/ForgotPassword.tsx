import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { apiErrorMessage } from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setStatus('sent');
      if (data.devResetToken) setDevToken(data.devResetToken);
    } catch (err) {
      setError(apiErrorMessage(err));
      setStatus('error');
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-3xl font-bold text-slate-900">Forgot password</h1>
        <p className="mt-2 text-center text-sm text-slate-500">We'll send you a reset link.</p>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-4">
          {status === 'error' && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          {status === 'sent' && (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              If that email exists, a reset link has been sent.
              {devToken && (
                <p className="mt-2">
                  Dev mode — <Link className="font-semibold underline" to={`/reset-password?token=${devToken}`}>reset your password here</Link>.
                </p>
              )}
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
