"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSelectedMember, isProjectPinVerified } from "@/lib/projectAccess";

export default function AccessGuard({ children }) {
  const router = useRouter();
  const { projectId } = useParams();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isProjectPinVerified(projectId)) {
      router.replace(`/project/${projectId}/access`);
      return;
    }
    if (!getSelectedMember()) {
      router.replace(`/project/${projectId}/overview`);
      return;
    }
    setAllowed(true);
  }, [projectId, router]);

  if (!allowed) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-zinc-950">Verifying project access…</div>;
  }

  return children;
}
