import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, apiErrorMessage } from '../../services/api';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', address: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.put('/auth/me', form);
      await refreshUser();
      setStatus('success');
    } catch (err) {
      setError(apiErrorMessage(err));
      setStatus('error');
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Profile</h1>
      <form onSubmit={handleSubmit} className="card max-w-lg space-y-4">
        {status === 'success' && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Profile updated!</p>}
        {status === 'error' && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
        <div>
          <label className="label">Email</label>
          <input disabled className="input bg-slate-50 text-slate-400" value={user?.email} />
        </div>
        <div>
          <label className="label">Full name</label>
          <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="label">Address</label>
          <textarea className="input" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <p className="text-xs text-slate-400">Account created {user && new Date(user.createdAt).toLocaleDateString()}</p>
        <button disabled={status === 'loading'} className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
