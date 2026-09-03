import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceBySlug } from '../../services/resources';
import { Service } from '../../types';
import { LoadingState, ErrorState } from '../../components/ui/States';

export default function ServiceDetails() {
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getServiceBySlug(slug)
      .then((res) => setService(res.data.service))
      .catch(() => setError('This service could not be found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState />;
  if (error || !service) return <div className="container-page py-16"><ErrorState message={error || 'Not found'} /></div>;

  return (
    <div className="container-page py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-lavender-100 to-skyblue-100">
          {service.image_url && <img src={service.image_url} alt={service.title} className="h-full w-full object-cover" />}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-lavender-500">{service.category_name}</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900">{service.title}</h1>
          <p className="mt-4 text-slate-600">{service.description}</p>
          <div className="mt-6 flex gap-8 text-sm">
            <div>
              <p className="text-slate-400">Starting at</p>
              <p className="font-semibold text-lavender-700">{service.starting_price ? `₹${service.starting_price}` : 'Get a Quote'}</p>
            </div>
            <div>
              <p className="text-slate-400">Delivery</p>
              <p className="font-semibold text-slate-700">{service.delivery_estimate || 'Varies'}</p>
            </div>
          </div>
          <Link to={`/start-a-project?service=${service.slug}`} className="btn-primary mt-8 inline-flex">Book / Enquire</Link>
        </div>
      </div>
    </div>
  );
}
