import { useEffect, useState } from 'react';
import { submitContact, getPublicSettings } from '../../services/resources';
import { apiErrorMessage } from '../../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    // getPublicSettings().then((res) => setContact(res.data.settings?.contact)).catch(() => {});
    getPublicSettings()
    .then((res) => {
      console.log('SETTINGS:', res.data);
      setContact(res.data.settings?.contact);
    })
    .catch((err) => console.error('SETTINGS ERROR:', err));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(apiErrorMessage(err));
      setStatus('error');
    }
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900">Get in Touch</h1>
          <p className="mt-3 text-slate-500">We'd love to hear about your project.</p>

          <div className="mt-8 space-y-4 text-sm">
            {contact?.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="block font-medium text-emerald-600">
                WhatsApp: {contact.whatsapp}
              </a>
            )}
          
            {contact?.instagram && (
              <a
                href={
                  contact.instagram.startsWith('http')
                    ? contact.instagram
                    : `https://${contact.instagram}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="block font-medium text-lavender-700"
              >
                Instagram
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="block font-medium text-skyblue-700">Email: {contact.email}</a>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {status === 'success' && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Thanks — we'll be in touch soon!</p>}
          {status === 'error' && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          <div>
            <label className="label">Name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required rows={4} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
