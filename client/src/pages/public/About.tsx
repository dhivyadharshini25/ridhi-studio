export default function About() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">About RiDhi Studio</h1>
        <p className="mt-6 text-lg text-slate-600">
          RiDhi Studio is a multi-service creative studio built for people who want more than a single
          specialist — we bring website development, graphic and poster design, social media content,
          saree pre-pleating, and bespoke creative projects together under one roof.
        </p>
        <p className="mt-4 text-slate-500">
          Every project, big or small, gets the same premium attention to detail — because good design
          and reliable craftsmanship shouldn't be hard to find.
        </p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          ['Our Mission', 'To make premium creative and lifestyle services accessible, dependable, and beautifully executed.'],
          ['Our Approach', 'Listen first, design with intention, deliver on time — every single project.'],
          ['Our Promise', 'Transparent pricing, clear communication, and work you will be proud to share.'],
        ].map(([title, desc]) => (
          <div key={title} className="card text-center">
            <h3 className="font-display text-lg font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
