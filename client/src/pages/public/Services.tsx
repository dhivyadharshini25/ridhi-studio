import { useEffect, useState } from 'react';
import { getServices } from '../../services/resources';
import { Service } from '../../types';
import ServiceCard from '../../components/public/ServiceCard';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data.services))
      .catch(() => setError('Could not load services right now.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">Our Services</h1>
        <p className="mt-3 text-slate-500">Everything RiDhi Studio offers, in one place.</p>
      </div>
      {loading ? <LoadingState /> : error ? <ErrorState message={error} /> : services.length === 0 ? (
        <EmptyState title="No services available yet" subtitle="Check back soon." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      )}
    </div>
  );
}
