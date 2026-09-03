import { Link } from 'react-router-dom';
import { Service } from '../../types';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card group flex flex-col">
      <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-lavender-100 to-skyblue-100">
        {service.image_url ? (
          <img src={service.image_url} alt={service.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl text-lavender-400">
            {service.title.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold text-slate-800">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-500">{service.short_description || service.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-lavender-700">
          {service.starting_price ? `From ₹${service.starting_price}` : 'Get a Quote'}
        </span>
        {service.delivery_estimate && <span className="text-slate-400">{service.delivery_estimate}</span>}
      </div>
      <div className="mt-5 flex gap-3">
        <Link to={`/services/${service.slug}`} className="btn-secondary flex-1 !py-2 text-xs">Learn More</Link>
        <Link to={`/start-a-project?service=${service.slug}`} className="btn-primary flex-1 !py-2 text-xs">Enquire</Link>
      </div>
    </div>
  );
}
