import { PortfolioProject } from '../../types';

export default function PortfolioCard({ project, onClick }: { project: PortfolioProject; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="card group block w-full overflow-hidden p-0 text-left">
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-lavender-100 to-skyblue-100">
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl text-lavender-400">{project.title.charAt(0)}</div>
        )}
      </div>
      <div className="p-5">
        {project.category_name && <p className="text-xs font-semibold uppercase tracking-wide text-lavender-500">{project.category_name}</p>}
        <h3 className="mt-1 font-display text-base font-semibold text-slate-800">{project.title}</h3>
        {project.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.description}</p>}
      </div>
    </button>
  );
}
