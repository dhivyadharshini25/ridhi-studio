const COLORS: Record<string, string> = {
  NEW: 'bg-sky-100 text-sky-700',
  REVIEWING: 'bg-amber-100 text-amber-700',
  QUOTED: 'bg-lavender-100 text-lavender-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  PLANNING: 'bg-amber-100 text-amber-700',
  REVIEW: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  RESCHEDULED: 'bg-sky-100 text-sky-700',
  DRAFT: 'bg-slate-100 text-slate-600',
  SENT: 'bg-sky-100 text-sky-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
  EXPIRED: 'bg-slate-100 text-slate-500',
  PAID: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-rose-100 text-rose-700',
  CREATED: 'bg-slate-100 text-slate-600',
  REFUNDED: 'bg-slate-100 text-slate-600',
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${COLORS[status] || 'bg-slate-100 text-slate-600'}`}>{status.replace('_', ' ')}</span>;
}
