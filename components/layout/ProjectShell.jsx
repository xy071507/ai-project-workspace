"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "./AppHeader";
import Brand from "@/components/ui/Brand";
import { project } from "@/data/mockData";
import AccessGuard from "./AccessGuard";
import { canManageProjectPin, getSelectedMember } from "@/lib/projectAccess";

const links = [
  ["Overview", `/project/${project.id}/dashboard`, "▦"],
  ["Ask Copilot", `/project/${project.id}/dashboard#copilot`, "✦"],
  ["Knowledge Base", `/project/${project.id}/dashboard#knowledge`, "▤"],
  ["Tasks", `/project/${project.id}/dashboard#tasks`, "✓"],
  ["Meetings", `/project/${project.id}/dashboard#meetings`, "◷"],
  ["Team", `/project/${project.id}/overview`, "◎"],
  ["Insights", `/project/${project.id}/dashboard#insights`, "⌁"],
];

export default function ProjectShell({ children }) {
  const [member, setMember] = useState(null);
  useEffect(() => setMember(getSelectedMember()), []);
  const canManagePin = canManageProjectPin(member);

  return (
    <AccessGuard><div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="grid min-h-screen md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white p-4 md:flex md:flex-col dark:border-white/10 dark:bg-zinc-900">
          <Brand compact />
          <div className="mt-7 rounded-xl border border-slate-200 p-3 dark:border-white/10"><b className="block truncate text-xs">CSIT205 Assignment 2</b><span className="text-[10px] text-slate-500">GenAI Group 6</span></div>
          <nav className="mt-6 space-y-1">{links.map(([label, href, icon]) => <Link key={label} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"><span>{icon}</span>{label}</Link>)}</nav>
          {canManagePin ? <Link href={`/project/${project.id}/settings`} className="mt-auto rounded-lg px-3 py-2.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/5">⚙ Project Settings</Link> : <span className="mt-auto px-3 py-2 text-[10px] text-slate-400">Signed in as {member?.name || "member"}</span>}
        </aside>
        <div className="min-w-0"><AppHeader projectName={project.name} />{children}</div>
      </div>
    </div></AccessGuard>
  );
}
