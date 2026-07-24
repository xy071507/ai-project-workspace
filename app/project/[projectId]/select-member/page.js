"use client";

import { useRouter } from "next/navigation";
import Brand from "@/components/ui/Brand";
import ThemeButton from "@/components/ui/ThemeButton";
import PinVerifiedGuard from "@/components/layout/PinVerifiedGuard";
import { project } from "@/data/mockData";
import { selectProjectMember } from "@/lib/projectAccess";

export default function SelectMemberPage() {
  const router = useRouter();

  function chooseMember(member) {
    selectProjectMember(member);
    router.replace(`/project/${project.id}/dashboard`);
  }

  return <PinVerifiedGuard><div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-white">
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-white/10 dark:bg-zinc-900"><Brand /><ThemeButton /></header>
    <main className="mx-auto max-w-3xl px-5 py-12"><button onClick={()=>router.back()} className="text-sm text-slate-500">← Back to Project Overview</button><section className="mx-auto mt-9 max-w-2xl"><div className="text-center"><span className="text-[10px] font-bold tracking-widest text-blue-600">SELECT IDENTITY</span><h1 className="mt-2 text-3xl font-bold">Who are you entering as?</h1><p className="mt-2 text-sm text-slate-500">Choose your member profile to personalize the dashboard for this browser session.</p></div><div className="mt-8 grid gap-3 sm:grid-cols-2">{project.members.map(member=>{const { initials, name, role, color }=member;return <button key={member.id} onClick={()=>chooseMember(member)} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"><span className={`grid size-11 place-items-center rounded-full text-xs font-bold text-white ${color}`}>{initials}</span><span className="flex-1"><b className="block text-sm">{name}</b><small className="text-xs text-slate-500">{role}</small></span><span className="text-xs font-semibold text-blue-600">Continue →</span></button>})}</div></section></main>
  </div></PinVerifiedGuard>;
}
