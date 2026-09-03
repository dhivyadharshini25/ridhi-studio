export default function TestimonialCard({ name, message, rating }: { name: string; message: string; rating?: number }) {
  return (
    <div className="card">
      {rating && (
        <div className="mb-3 text-amber-400">
          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </div>
      )}
      <p className="text-sm italic text-slate-600">"{message}"</p>
      <p className="mt-4 text-sm font-semibold text-slate-800">— {name}</p>
    </div>
  );
}
