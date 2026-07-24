"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/ui/Brand";
import ThemeButton from "@/components/ui/ThemeButton";
import Modal from "@/components/ui/Modal";
import PinVerifiedGuard from "@/components/layout/PinVerifiedGuard";
import { activities, meeting, project, tasks } from "@/data/mockData";
import { clearProjectAccess, getProjectPin } from "@/lib/projectAccess";

const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900";

export default function ProjectOverviewPage() {
  const router = useRouter();
  const [accessOpen, setAccessOpen] = useState(false);
  const [accessPin, setAccessPin] = useState("");

  function exitProject() {
    clearProjectAccess();
    router.replace("/workspace");
  }

  return <PinVerifiedGuard><div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-white">
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-white/10 dark:bg-zinc-900"><Brand /><div className="flex items-center gap-2"><ThemeButton /><button onClick={exitProject} className="rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-white/10">Exit Project</button></div></header>
    <main className="mx-auto max-w-6xl px-5 py-10">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><span className="text-xs font-bold tracking-widest text-blue-600">PROJECT OVERVIEW</span><h1 className="mt-2 text-3xl font-bold tracking-tight">{project.name}</h1><p className="mt-2 text-sm text-slate-500">{project.workspace} · {project.course} · {project.university}</p></div><button onClick={()=>{setAccessPin(getProjectPin(project.id));setAccessOpen(true)}} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">🔒 Project Access</button></section>
      <div className="mt-7 grid gap-4 lg:grid-cols-[1.4fr_.8fr]"><article className={card}><div className="flex items-center justify-between"><span className="text-xs font-bold text-violet-600">✦ AI PROJECT SUMMARY</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">● {project.status}</span></div><p className="mt-4 text-sm leading-6 text-slate-500">{project.summary}</p></article><article className={card}><span className="text-xs font-bold tracking-widest text-blue-600">TEAM</span><div className="mt-4 flex -space-x-2">{project.members.map(member=><span title={member.name} key={member.id} className={`grid size-10 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white dark:border-zinc-900 ${member.color}`}>{member.initials}</span>)}</div><p className="mt-3 text-xs text-slate-500">{project.members.length} members · Shared project workspace</p></article></div>
      <div className="mt-4 grid gap-4 md:grid-cols-3"><article className={card}><span className="text-xs font-bold tracking-widest text-blue-600">KNOWLEDGE BASE</span><h2 className="mt-3 font-semibold">Project Discussion.docx</h2><p className="mt-1 text-xs text-slate-500">1 source · 8 topics · AI analysis complete</p></article><article className={card}><span className="text-xs font-bold tracking-widest text-blue-600">UPCOMING MEETING</span><h2 className="mt-3 font-semibold">{meeting.title}</h2><p className="mt-1 text-xs text-slate-500">{meeting.date} · {meeting.time}</p></article><article className={card}><span className="text-xs font-bold tracking-widest text-blue-600">NEXT DEADLINES</span>{tasks.slice(0,2).map(task=><div key={task.title} className="mt-3 flex justify-between gap-3 text-xs"><b>{task.title}</b><span className="shrink-0 text-slate-500">{task.due}</span></div>)}</article></div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2"><article className={card}><h2 className="font-semibold">Recent activity</h2><div className="mt-4 space-y-4">{activities.map(([title,meta])=><div key={title} className="flex gap-3"><span className="grid size-8 place-items-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10">✦</span><div><b className="block text-xs">{title}</b><span className="text-[10px] text-slate-500">{meta}</span></div></div>)}</div></article><article className={card}><h2 className="font-semibold">Timeline preview</h2><div className="mt-4 space-y-4">{[["20 Jul","Assignment brief reviewed"],["Today","Project knowledge analyzed"],["Tomorrow","Team research review"],["27 Jul","Prototype direction confirmed"]].map(([date,title])=><div key={title} className="flex gap-4 text-xs"><span className="w-16 font-semibold text-blue-600">{date}</span><span>{title}</span></div>)}</div></article></div>
      <div className="mt-7 text-center"><button onClick={()=>router.push(`/project/${project.id}/select-member`)} className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white">Open Dashboard →</button><p className="mt-2 text-xs text-slate-500">You’ll select your team identity next.</p></div>
    </main>
    {accessOpen && <Modal title="Project Access" description="Shared access details for this project." onClose={()=>setAccessOpen(false)}><div className="p-6"><span className="text-xs font-semibold text-slate-500">Current Project PIN</span><div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl font-bold tracking-[.35em] dark:border-white/10 dark:bg-zinc-950">{accessPin}</div><div className="mt-5 space-y-3 text-sm leading-6 text-slate-500"><p>This project is protected by a shared six-digit PIN.</p><p>The Project Leader shares the PIN with team members when the project is created.</p><p>Only the Project Leader and Vice Leader can update the Project PIN.</p></div><div className="mt-6 flex justify-end"><button onClick={()=>setAccessOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">Close</button></div></div></Modal>}
  </div></PinVerifiedGuard>;
}
