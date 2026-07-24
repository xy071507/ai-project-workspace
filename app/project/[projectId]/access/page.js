"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Brand from "@/components/ui/Brand";
import ThemeButton from "@/components/ui/ThemeButton";
import { project } from "@/data/mockData";
import { getProjectPin, getSelectedMember, isProjectPinVerified, verifyProjectAccess } from "@/lib/projectAccess";

export default function ProjectAccessPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isProjectPinVerified()) {
      router.replace(getSelectedMember() ? `/project/${project.id}/dashboard` : `/project/${project.id}/overview`);
    }
  }, [router]);

  function verifyPin(event) {
    event.preventDefault();
    if (pin !== getProjectPin(project.id)) {
      setError("That PIN does not match. Check the shared project PIN and try again.");
      return;
    }
    verifyProjectAccess(project.id);
    router.replace(`/project/${project.id}/overview`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-white">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-white/10 dark:bg-zinc-900"><Brand /><ThemeButton /></header>
      <main className="mx-auto max-w-3xl px-5 py-10"><Link href="/workspace" className="text-sm text-slate-500">← Back to Workspace</Link>
        <form onSubmit={verifyPin} className="mx-auto mt-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-zinc-900"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600 dark:bg-blue-500/10">⌑</span><span className="mt-5 block text-[10px] font-bold tracking-widest text-blue-600">SECURE PROJECT ACCESS</span><h1 className="mt-2 text-2xl font-bold">Enter Project PIN</h1><p className="mt-2 text-sm leading-6 text-slate-500">Enter your six-digit Project PIN.</p><input aria-label="Six-digit Project PIN" autoFocus inputMode="numeric" maxLength="6" value={pin} onChange={event=>{setPin(event.target.value.replace(/\D/g,""));setError("")}} className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-2xl font-bold tracking-[.5em] outline-none focus:border-blue-500 dark:border-white/10 dark:bg-zinc-950" /><p className="mt-1 text-xs font-normal leading-5 text-slate-400">Need access?<br />Contact your Project Leader.</p>{error && <p role="alert" className="mt-3 text-xs text-red-600">{error}</p>}<button disabled={pin.length!==6} className="mt-5 w-full rounded-xl bg-blue-600 p-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Verify Project PIN →</button><p className="mt-4 text-[10px] text-slate-400">One shared PIN protects this project. No external account is required.</p></form>
      </main>
    </div>
  );
}
