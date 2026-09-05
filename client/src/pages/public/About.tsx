export default function About() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">About RiDhi Studio</h1>
        <p className="mt-6 text-lg text-slate-600">
          RiDhi Studio is a creative studio where technology, design, and creativity come together to turn ideas into meaningful digital experiences.
          We create modern websites, professional portfolios and resumes, college project solutions, graphic and poster designs, and custom creative services — all with a focus on quality, simplicity, and attention to detail.
          Whether you're a student building your first project, a professional creating your personal brand, or a business looking for a strong digital presence, we're here to bring your ideas to life.
        </p>
        <p className="mt-4 text-slate-500">
          Great work starts with understanding your idea. We take the time to listen, plan thoughtfully, and create solutions that are both beautiful and practical.
        </p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          ['Our Mission', 'To make creative and digital services simple, accessible, reliable, and beautifully delivered.'],
          ['Our Approach', 'Understand the idea → Plan with purpose → Design with creativity → Build with care → Deliver with confidence.'],
          ['Our Promise', 'Clear communication, transparent pricing, attention to detail, and quality work that you will be proud to share.'],
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
