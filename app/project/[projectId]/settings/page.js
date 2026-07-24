"use client";

import { useEffect, useState } from "react";
import ProjectShell from "@/components/layout/ProjectShell";
import { canManageProjectPin, getProjectPin, getProjectPinKey, getSelectedMember } from "@/lib/projectAccess";
import { project } from "@/data/mockData";

const publicSections = ["General", "Appearance", "Knowledge Base", "AI Settings", "Notifications", "Future Integrations"];

export default function SettingsPage() {
  const [member, setMember] = useState(null);
  const [active, setActive] = useState("General");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const selected = getSelectedMember();
    setMember(selected);
    setCurrentPin(getProjectPin(project.id));
  }, []);

  const canManagePin = canManageProjectPin(member);
  const sections = canManagePin ? [...publicSections.slice(0, 4), "Project Access", ...publicSections.slice(4)] : publicSections;

  function regeneratePin() {
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem(getProjectPinKey(project.id), generated);
    setCurrentPin(generated);
    setNewPin("");
    setConfirmPin("");
    setError("");
    setMessage("Project PIN regenerated successfully.");
    window.setTimeout(() => setMessage(""), 3000);
  }

  function requestUpdate() {
    if (!/^\d{6}$/.test(newPin)) {
      setError("The new PIN must contain exactly six digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setError("The new PIN and confirmation do not match.");
      return;
    }
    setConfirming(true);
  }

  function savePin() {
    localStorage.setItem(getProjectPinKey(project.id), newPin);
    setCurrentPin(newPin);
    setNewPin("");
    setConfirmPin("");
    setConfirming(false);
    setMessage("Project PIN updated successfully.");
    window.setTimeout(() => setMessage(""), 3000);
  }

  return (
    <ProjectShell>
      <main className="mx-auto max-w-5xl p-5 md:p-8">
        <h1 className="text-2xl font-bold">Project Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage project behavior, knowledge, access, and notifications.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-[190px_1fr]">
          <nav className="flex gap-2 overflow-auto md:flex-col">{sections.map(section=><button key={section} onClick={()=>{setActive(section);setError("")}} className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs ${active===section?"bg-blue-50 font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300":"text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"}`}>{section}</button>)}</nav>
          <section>
            <span className="text-xs font-bold tracking-widest text-blue-600">{active.toUpperCase()}</span>
            <h2 className="mt-2 text-xl font-semibold">{active}</h2>
            {active === "Project Access" && canManagePin ? <>
              <p className="mt-1 text-sm text-slate-500">Manage the single shared six-digit PIN for this project.</p>
              {message && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">✓ {message}</div>}
              <article className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-zinc-900">
                <header className="flex items-center gap-3 border-b border-slate-100 p-5 dark:border-white/10"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">⌑</span><div className="flex-1"><b className="block text-sm">Shared Project PIN</b><span className="text-xs text-slate-500">Available to the Leader and Vice Leader only.</span></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">● Active</span></header>
                <div className="space-y-5 p-5">
                  <label className="block text-xs font-semibold">Project PIN<div className="mt-2 flex max-w-md"><input readOnly type={showPin?"text":"password"} value={currentPin} className="min-w-0 flex-1 rounded-l-lg border border-slate-200 bg-slate-50 p-3 font-bold tracking-[.3em] dark:border-white/10 dark:bg-zinc-950" /><button onClick={()=>setShowPin(!showPin)} className="border-y border-slate-200 px-3 text-xs dark:border-white/10">{showPin?"Hide":"Show"}</button><button onClick={()=>navigator.clipboard?.writeText(currentPin)} className="rounded-r-lg border border-slate-200 px-3 text-xs dark:border-white/10">Copy PIN</button></div></label>
                  <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold">New Project PIN<input type={showPin?"text":"password"} inputMode="numeric" maxLength="6" value={newPin} onChange={event=>{setNewPin(event.target.value.replace(/\D/g,""));setError("")}} className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 tracking-[.25em] outline-none focus:border-blue-500 dark:border-white/10" /></label><label className="text-xs font-semibold">Confirm New PIN<input type={showPin?"text":"password"} inputMode="numeric" maxLength="6" value={confirmPin} onChange={event=>{setConfirmPin(event.target.value.replace(/\D/g,""));setError("")}} className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 tracking-[.25em] outline-none focus:border-blue-500 dark:border-white/10" /></label></div>
                  {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
                </div>
                <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-100 p-4 dark:border-white/10"><button onClick={regeneratePin} className="rounded-lg border border-slate-200 px-4 py-2 text-xs dark:border-white/10">Regenerate PIN</button><button disabled={!newPin||!confirmPin} onClick={requestUpdate} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">Save Updated PIN</button></footer>
              </article>
            </> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/10 dark:bg-zinc-900"><b className="text-sm">{active} settings</b><p className="mt-1 text-xs text-slate-500">{canManagePin ? "This prototype keeps the setting local until a backend is connected." : "Your member permissions do not include access to the shared Project PIN."}</p></div>}
          </section>
        </div>
      </main>
      {confirming && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"><span className="grid size-11 place-items-center rounded-xl bg-amber-50 text-xl dark:bg-amber-500/10">!</span><h2 className="mt-4 text-xl font-semibold">Update Project PIN?</h2><p className="mt-2 text-sm leading-6 text-slate-500">All team members will need to use the new PIN the next time they enter this project.</p><div className="mt-6 flex justify-end gap-2"><button onClick={()=>setConfirming(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-white/10">Cancel</button><button onClick={savePin} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Update PIN</button></div></section></div>}
    </ProjectShell>
  );
}
