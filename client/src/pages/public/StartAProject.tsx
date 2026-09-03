import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getServices, createEnquiry, uploadFile } from '../../services/resources';
import { Service } from '../../types';
import { apiErrorMessage } from '../../services/api';

export default function StartAProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    serviceId: '',
    details: '',
    budget: '',
    preferredDeadline: '',
    preferredContactMethod: 'Email',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    getServices().then((res) => {
      setServices(res.data.services);
      const preselect = params.get('service');
      if (preselect) {
        const match = res.data.services.find((s: Service) => s.slug === preselect);
        if (match) setForm((f) => ({ ...f, serviceId: match.id }));
      }
    });
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/start-a-project' } } });
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const { data } = await createEnquiry({
        serviceId: form.serviceId || null,
        details: form.details,
        budget: form.budget ? Number(form.budget) : null,
        preferredDeadline: form.preferredDeadline || null,
        preferredContactMethod: form.preferredContactMethod,
      });
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('enquiryId', data.enquiry.id);
        await uploadFile(fd);
      }
      setStatus('success');
    } catch (err) {
      setError(apiErrorMessage(err));
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-slate-900">Enquiry submitted!</h1>
        <p className="mt-3 text-slate-500">We'll review it and get back to you shortly.</p>
        <Link to="/dashboard" className="btn-primary mt-8">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-slate-900">Start a Project</h1>
        <p className="mt-3 text-slate-500">Tell us what you have in mind and we'll take it from there.</p>

        {!user && (
          <p className="mt-6 rounded-xl bg-lavender-50 p-4 text-sm text-lavender-700">
            You'll need to <Link to="/login" className="font-semibold underline">log in</Link> or{' '}
            <Link to="/register" className="font-semibold underline">create an account</Link> to submit — don't worry, your details will be saved.
          </p>
        )}

        <form onSubmit={handleSubmit} className="card mt-8 space-y-5">
          {status === 'error' && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

          <div>
            <label className="label">Service</label>
            <select className="input" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
              <option value="">Not sure yet</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Project details</label>
            <textarea required rows={5} className="input" placeholder="Tell us about your project..." value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Budget (₹)</label>
              <input type="number" min="0" className="input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div>
              <label className="label">Preferred deadline</label>
              <input type="date" className="input" value={form.preferredDeadline} onChange={(e) => setForm({ ...form, preferredDeadline: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Preferred contact method</label>
            <select className="input" value={form.preferredContactMethod} onChange={(e) => setForm({ ...form, preferredContactMethod: e.target.value })}>
              <option>Email</option>
              <option>Phone</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div>
            <label className="label">Reference file (optional)</label>
            <input type="file" accept="image/*,.pdf" className="input" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Submitting…' : 'Submit Enquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
