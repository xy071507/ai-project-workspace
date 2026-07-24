"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Brand from "@/components/ui/Brand";
import ThemeButton from "@/components/ui/ThemeButton";
import { canManageProjectPin, clearProjectAccess, getSelectedMember } from "@/lib/projectAccess";

export default function AppHeader({ projectName }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [member, setMember] = useState(null);
  useEffect(() => {
    setMember(projectName ? getSelectedMember() : null);
  }, [projectName]);
  const canManagePin = canManageProjectPin(member);

  function exitProject() {
    clearProjectAccess();
    setMember(null);
    setProfileOpen(false);
    window.location.assign("/workspace");
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-5 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-7 dark:border-white/10 dark:bg-zinc-950/95">
      <Brand />
      {projectName && <div className="hidden h-5 w-px bg-slate-200 md:block dark:bg-white/10" />}
      {projectName && <div className="hidden min-w-0 flex-1 md:block"><strong className="block truncate text-xs">{projectName}</strong><span className="text-[10px] text-slate-500">GenAI Group 6 / Dashboard</span></div>}
      {!projectName && <div className="flex-1" />}
      <button className="hidden max-w-sm flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-500 lg:flex dark:border-white/10 dark:bg-zinc-900"><span>⌕</span><span className="flex-1">Search project knowledge...</span><kbd>⌘ K</kbd></button>
      <ThemeButton />
      <button aria-label="Notifications" className="relative grid size-9 place-items-center rounded-lg border border-slate-200 dark:border-white/10">♢<i className="absolute right-2 top-2 size-1.5 rounded-full bg-red-500" /></button>
      <div className="relative">
        <button onClick={() => setProfileOpen(!profileOpen)} className="grid size-9 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">{member?.initials || "○"}</button>
        {profileOpen && <div className="absolute right-0 top-11 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-zinc-900"><div className="border-b border-slate-100 p-2 dark:border-white/10"><b className="block text-sm">{member?.name || "Workspace"}</b><span className="text-xs text-slate-500">{projectName ? member?.role || "Project member" : "No active project"}</span></div>{projectName&&canManagePin&&<Link href="/project/csit205-genai-assignment-2/settings" className="block rounded-lg p-2 text-xs hover:bg-slate-50 dark:hover:bg-white/5">Project Settings</Link>}<button className="w-full rounded-lg p-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-white/5">Help & About</button>{projectName&&<button onClick={exitProject} className="w-full border-t border-slate-100 p-2 text-left text-xs text-red-600 dark:border-white/10">Exit Project</button>}</div>}
      </div>
    </header>
  );
}
