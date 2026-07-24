"use client";

import { useEffect, useState } from "react";

export default function ThemeButton() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aipc-theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("aipc-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button onClick={toggleTheme} aria-label="Switch color theme" className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
      {dark ? "☀" : "☾"}
    </button>
  );
}
