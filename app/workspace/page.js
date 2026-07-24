"use client";

import { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import Modal from "@/components/ui/Modal";
import { createProjectRecord, project } from "@/data/mockData";

export default function WorkspacePage() {
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState("");

  function createProject(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const leaderName = form.get("leaderName")?.trim();
    if (!leaderName) {
      setPinError("Add a Project Leader before creating the project.");
      return;
    }
    if (!/^\d{6}$/.test(newPin)) {
      setPinError("Project PIN must contain exactly six digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setPinError("The Project PIN fields do not match.");
      return;
    }
    createProjectRecord({
      id: `project-${Date.now()}`,
      name: form.get("projectName"),
      members: [{ id: `leader-${Date.now()}`, name: leaderName, role: "Leader" }],
    });
    setCreating(false);
    setMessage("Project created with its own member list and shared Project PIN. Connect a backend when you are ready to persist it.");
    setNewPin("");
    setConfirmPin("");
    setPinError("");
  }

  function generatePin() {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    setNewPin(pin);
    setConfirmPin(pin);
    setPinError("");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 dark:text-white"><AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-12"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-xs text-slate-500">AI Project Copilot / Workspace</span><h1 className="mt-2 text-3xl font-bold tracking-tight">Workspace</h1><p className="mt-1 text-sm text-slate-500">One active project · Updated today</p></div><input aria-label="Search projects" placeholder="Search projects..." className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-zinc-900" /></div>
        {message && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">{message}</div>}
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_.7fr]"><article role="button" tabIndex="0" onClick={()=>window.location.assign(`/project/${project.id}/access`)} onKeyDown={event=>{if(event.key==="Enter")window.location.assign(`/project/${project.id}/access`)}} className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"><div className="relative h-40 bg-gradient-to-br from-blue-950 via-blue-700 to-blue-400 p-5 text-white"><span className="rounded-full bg-white/15 px-3 py-1 text-xs">● On Track</span><span className="absolute bottom-5 left-6 grid size-14 place-items-center rounded-2xl border border-white/20 bg-white/15 text-2xl backdrop-blur">✦</span></div><div className="p-6"><span className="text-xs font-bold tracking-wider text-blue-600">CSIT205 · GENERATIVE AI</span><h2 className="mt-2 text-xl font-semibold">{project.name}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Develop and evaluate a generative AI solution through research, prototyping, and a collaborative final report.</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-white/10"><div className="flex -space-x-2">{project.members.slice(0,4).map(member=><span key={member.id} className={`grid size-8 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white dark:border-zinc-900 ${member.color}`}>{member.initials}</span>)}</div><Link onClick={event=>event.stopPropagation()} href={`/project/${project.id}/access`} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white">Open Project →</Link></div></div></article>
          <button onClick={()=>setCreating(true)} className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-300 bg-blue-50/40 p-8 text-center hover:border-blue-500 dark:border-blue-500/30 dark:bg-blue-500/5"><span className="grid size-14 place-items-center rounded-2xl border border-blue-200 bg-white text-3xl text-blue-600 dark:border-blue-500/20 dark:bg-zinc-900">+</span><h2 className="mt-5 text-lg font-semibold">Create New Project</h2><p className="mt-1 text-sm text-slate-500">Create another collaborative AI workspace.</p></button></div>
      </main>
      {creating && <Modal title="Create a project" description="Give your team a focused place to work with Copilot." onClose={()=>setCreating(false)}><form onSubmit={createProject} className="max-h-[75vh] space-y-4 overflow-auto p-6"><label className="block text-sm font-medium">Project Name<input name="projectName" required placeholder="e.g. Research Methods Project" className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 outline-none focus:border-blue-500 dark:border-white/10" /></label><label className="block text-sm font-medium">Description<textarea rows="3" className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-transparent p-3 outline-none dark:border-white/10" /></label><label className="block text-sm font-medium">Project Leader<input name="leaderName" required placeholder="Enter the initial Leader’s name" className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 outline-none focus:border-blue-500 dark:border-white/10" /></label><fieldset className="rounded-xl border border-slate-200 p-4 dark:border-white/10"><legend className="px-2 text-sm font-semibold">Project Access</legend><p className="mb-4 text-xs text-slate-500">Create one shared six-digit PIN for every authorized team member.</p><label className="block text-xs font-medium">Project PIN<div className="mt-2 flex"><input aria-label="New Project PIN" type={showPin?"text":"password"} inputMode="numeric" maxLength="6" value={newPin} onChange={event=>{setNewPin(event.target.value.replace(/\D/g,""));setPinError("")}} className="min-w-0 flex-1 rounded-l-lg border border-slate-200 bg-transparent p-3 tracking-[.25em] outline-none dark:border-white/10" /><button type="button" onClick={()=>setShowPin(!showPin)} className="border-y border-slate-200 px-3 text-xs dark:border-white/10">{showPin?"Hide":"Show"}</button><button type="button" onClick={()=>navigator.clipboard?.writeText(newPin)} disabled={!newPin} className="rounded-r-lg border border-slate-200 px-3 text-xs disabled:opacity-40 dark:border-white/10">Copy</button></div></label><label className="mt-4 block text-xs font-medium">Confirm Project PIN<input aria-label="Confirm Project PIN" type={showPin?"text":"password"} inputMode="numeric" maxLength="6" value={confirmPin} onChange={event=>{setConfirmPin(event.target.value.replace(/\D/g,""));setPinError("")}} className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 tracking-[.25em] outline-none dark:border-white/10" /></label><button type="button" onClick={generatePin} className="mt-3 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 dark:border-blue-500/30 dark:text-blue-300">Generate PIN</button>{pinError&&<p role="alert" className="mt-3 text-xs text-red-600">{pinError}</p>}</fieldset><div className="flex justify-end gap-2"><button type="button" onClick={()=>setCreating(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-white/10">Cancel</button><button disabled={!/^\d{6}$/.test(newPin)||newPin!==confirmPin} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Create Project</button></div></form></Modal>}
    </div>
  );
}
