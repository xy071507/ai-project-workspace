import Link from "next/link";
import Brand from "@/components/ui/Brand";
import ThemeButton from "@/components/ui/ThemeButton";

const features = [
  ["✦", "AI that understands context", "Ask questions and receive answers grounded in the documents your team trusts."],
  ["▤", "Knowledge, automatically organized", "Goals, requirements, decisions, and deadlines are structured without manual filing."],
  ["◎", "Built around your whole team", "Give every member a shared source of truth from onboarding to final delivery."],
  ["✓", "Progress you can act on", "See project health, open questions, and recommended next steps in one calm view."],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-zinc-950 dark:text-white">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-[max(2rem,calc((100%-1280px)/2))] dark:border-white/10 dark:bg-zinc-950/90">
        <Brand /><nav className="mx-auto hidden gap-8 text-xs text-slate-500 md:flex"><a href="#features">Features</a><a href="#workflow">How it works</a></nav><div className="ml-auto flex gap-2"><ThemeButton /><Link href="/workspace" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">Open Workspace →</Link></div>
      </header>
      <main>
        <section className="relative overflow-hidden px-5 py-24 text-center md:py-32"><div className="absolute inset-x-0 top-0 -z-0 mx-auto h-96 max-w-4xl rounded-full bg-blue-500/10 blur-3xl" /><div className="relative mx-auto max-w-5xl"><span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">✦ AI-powered project intelligence</span><h1 className="mt-7 text-4xl font-bold tracking-[-0.05em] sm:text-6xl md:text-7xl">Turn project documents into <span className="text-blue-600">actionable team knowledge.</span></h1><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">AI Project Copilot understands your documents, organizes what matters, and keeps every teammate moving in the same direction.</p><div className="mt-8 flex justify-center gap-3"><Link href="/workspace" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">Open Workspace →</Link><a href="#features" className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold dark:border-white/10">Learn More</a></div></div></section>
        <section id="features" className="bg-slate-50 px-5 py-24 dark:bg-zinc-900/60"><div className="mx-auto max-w-6xl"><div className="mx-auto max-w-2xl text-center"><span className="text-xs font-bold tracking-widest text-blue-600">ONE WORKSPACE, SHARED CLARITY</span><h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">A project everyone understands.</h2></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(([icon,title,text])=><article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">{icon}</span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>)}</div></div></section>
        <section id="workflow" className="mx-auto max-w-6xl px-5 py-24"><h2 className="text-center text-3xl font-bold">Clarity in three simple steps.</h2><div className="mt-12 grid gap-8 md:grid-cols-3">{[["01","Bring your project"],["02","Let Copilot connect the dots"],["03","Move forward together"]].map(([number,title])=><div key={number} className="border-t border-slate-200 pt-5 dark:border-white/10"><span className="text-xs font-bold text-blue-600">{number}</span><h3 className="mt-4 font-semibold">{title}</h3></div>)}</div></section>
        <section className="bg-blue-600 px-5 py-20 text-center text-white"><h2 className="text-3xl font-bold">Your project already has the answers.</h2><p className="mt-3 text-blue-100">Let Copilot bring them together.</p><Link href="/workspace" className="mt-7 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700">Open Workspace →</Link></section>
      </main>
      <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-8 text-xs text-slate-500 sm:flex-row dark:border-white/10"><Brand compact /><span>AI Project Copilot · Shared clarity for every team.</span><Link href="/workspace" className="font-semibold text-blue-600">Open Workspace</Link></footer>
    </div>
  );
}
