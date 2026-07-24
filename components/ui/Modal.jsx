"use client";

export default function Modal({ title, description, children, onClose }) {
  return (
    <div onMouseDown={onClose} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900">
        <header className="flex items-start border-b border-slate-200 p-6 dark:border-white/10">
          <div className="flex-1"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>
          <button onClick={onClose} className="text-2xl text-slate-400" aria-label="Close">×</button>
        </header>
        {children}
      </section>
    </div>
  );
}
