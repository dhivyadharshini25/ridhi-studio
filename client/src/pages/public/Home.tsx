import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getPortfolio, getTestimonials } from '../../services/resources';
import { Service, PortfolioProject } from '../../types';
import ServiceCard from '../../components/public/ServiceCard';
import PortfolioCard from '../../components/public/PortfolioCard';
import TestimonialCard from '../../components/public/TestimonialCard';
import { LoadingState } from '../../components/ui/States';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getServices(), getPortfolio('all'), getTestimonials()])
      .then(([s, p, t]) => {
        setServices(s.data.services.slice(0, 5));
        setPortfolio(p.data.projects.slice(0, 6));
        setTestimonials(t.data.testimonials.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-lavender-50 via-white to-white py-24">
        <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-skyblue-100 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-0 h-96 w-96 rounded-full bg-lavender-100 blur-3xl" />
        <div className="container-page relative text-center">
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-slate-900 sm:text-6xl">
            Creative Ideas.<br /> Beautifully Built.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-500">
            Digital, creative and lifestyle services designed to bring your ideas to life.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/start-a-project" className="btn-secondary">Start a Project</Link>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* SERVICES */}
          <section className="container-page py-20">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-lavender-500">What we do</p>
                <h2 className="mt-1 font-display text-3xl font-bold text-slate-900">Our Services</h2>
              </div>
              <Link to="/services" className="hidden text-sm font-semibold text-lavender-700 sm:block">View all →</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          </section>

          {/* WHY CHOOSE US */}
          <section className="bg-lavender-50/50 py-20">
            <div className="container-page">
              <h2 className="mb-10 text-center font-display text-3xl font-bold text-slate-900">Why Choose RiDhi Studio</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  ['Premium Craft', 'Every piece of work is designed with care, precision and an eye for detail.'],
                  ['Fast Turnaround', 'Clear timelines and quick delivery without compromising quality.'],
                  ['One Studio, Many Services', 'From websites to sarees — a single trusted partner for your creative needs.'],
                ].map(([title, desc]) => (
                  <div key={title} className="card text-center">
                    <h3 className="font-display text-lg font-semibold text-slate-800">{title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PORTFOLIO */}
          {portfolio.length > 0 && (
            <section className="container-page py-20">
              <h2 className="mb-10 font-display text-3xl font-bold text-slate-900">Recent Work</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.map((p) => <PortfolioCard key={p.id} project={p} />)}
              </div>
            </section>
          )}

          {/* HOW IT WORKS */}
          <section className="bg-skyblue-50/50 py-20">
            <div className="container-page">
              <h2 className="mb-10 text-center font-display text-3xl font-bold text-slate-900">How It Works</h2>
              <div className="grid gap-8 sm:grid-cols-4">
                {['Tell us your idea', 'We send a quote', 'We create & update you', 'You receive the final work'].map((step, i) => (
                  <div key={step} className="text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-lavender-600 font-semibold text-white">{i + 1}</div>
                    <p className="text-sm text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ABOUT PREVIEW */}
          <section className="container-page py-20 text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900">A Studio for Every Creative Need</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              RiDhi Studio brings together design, development and lifestyle craftsmanship under one roof —
              so you never have to look elsewhere for your next creative project.
            </p>
            <Link to="/about" className="mt-6 inline-block text-sm font-semibold text-lavender-700">Learn more about us →</Link>
          </section>

          {/* TESTIMONIALS */}
          {testimonials.length > 0 && (
            <section className="bg-lavender-50/50 py-20">
              <div className="container-page">
                <h2 className="mb-10 text-center font-display text-3xl font-bold text-slate-900">What Clients Say</h2>
                <div className="grid gap-6 sm:grid-cols-3">
                  {testimonials.map((t) => <TestimonialCard key={t.id} name={t.customer_name} message={t.message} rating={t.rating} />)}
                </div>
              </div>
            </section>
          )}

          {/* FINAL CTA */}
          <section className="container-page py-20 text-center">
            <div className="rounded-3xl bg-gradient-to-br from-lavender-600 to-skyblue-500 px-8 py-16 text-white">
              <h2 className="font-display text-3xl font-bold">Ready to bring your idea to life?</h2>
              <p className="mt-3 text-lavender-100">Let's start your project today.</p>
              <Link to="/start-a-project" className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-lavender-700">
                Start a Project
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
