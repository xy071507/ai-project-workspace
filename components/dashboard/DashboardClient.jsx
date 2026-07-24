"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { activities, meeting, project, tasks as initialTasks } from "@/data/mockData";
import { joinClasses, priorityClasses } from "@/lib/helpers";
import { getProjectPermissions, getSelectedMember } from "@/lib/projectAccess";

const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900";
const smallButton = "rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5";

export default function DashboardClient() {
  const [member, setMember] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => setMember(getSelectedMember()), []);

  const permissions = getProjectPermissions(member?.role);
  const yourTasks = tasks.filter((task) => task.assignee === member?.name);
  const toGoogleCalendarDate = (value) =>
    new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(meeting.title) +
    "&dates=" + toGoogleCalendarDate(meeting.start) + "/" + toGoogleCalendarDate(meeting.end) +
    "&details=" + encodeURIComponent(`${meeting.summary}\n\nJoin meeting: ${meeting.link}`) +
    "&location=" + encodeURIComponent(meeting.location);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function addTask(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setTasks([...tasks, { title: form.get("title"), description: form.get("description"), assignee: member?.name || "Unassigned", initials: member?.initials || "—", priority: form.get("priority"), status: "Not Started", due: "31 Jul", progress: 0 }]);
    setTaskOpen(false);
    notify("Task created.");
  }

  function completeTask(index) {
    const task = tasks[index];
    if (!permissions.updateAnyTask && task.assignee !== member?.name) return;
    setTasks(tasks.map((item, taskIndex) => taskIndex === index ? { ...item, status: "Completed", progress: 100 } : item));
    notify("Task updated.");
  }

  function askCopilot(prompt = question) {
    if (!prompt.trim() || !permissions.askAI) return;
    setQuestion("");
    setAnswer("Finalize the interview questions, confirm SDG alignment, and assign owners to the remaining report sections.");
  }

  function downloadMeeting() {
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "DTSTART:" + toGoogleCalendarDate(meeting.start), "DTEND:" + toGoogleCalendarDate(meeting.end), "SUMMARY:" + meeting.title, "DESCRIPTION:" + meeting.summary, "LOCATION:" + meeting.link, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "team-research-review.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-[1400px] p-4 md:p-6">
      <section><span className="text-[10px] font-bold tracking-widest text-blue-600">WELCOME BACK, {member?.name?.toUpperCase() || "TEAM MEMBER"}</span><h1 className="mt-1 text-2xl font-bold tracking-tight">{project.name}</h1><p className="mt-1 text-xs text-slate-500">{member?.role} dashboard · Knowledge updated 18 minutes ago</p></section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
        <article className={card}>
          <div className="flex items-start justify-between gap-4"><div><span className="text-[10px] font-bold tracking-widest text-blue-600">PROJECT PROGRESS</span><h2 className="mt-1 font-semibold">Overall Progress</h2></div><b className="text-3xl text-blue-600">78%</b></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><i className="block h-full w-[78%] rounded-full bg-blue-600" /></div>
          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500"><span>12 / 15 tasks completed</span><span>Next milestone: Prototype direction · 27 Jul</span></div>
          <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-3 dark:border-white/10">{[["OBJECTIVE","Evaluate a responsible GenAI solution"],["CURRENT FOCUS","Research questions and SDG alignment"],["LATEST PROGRESS","Project scope and ownership clarified"]].map(([label,value])=><div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-zinc-950"><span className="text-[9px] font-semibold text-slate-400">{label}</span><b className="mt-1 block text-xs leading-5">{value}</b></div>)}</div>
        </article>

        <article id="meetings" className={card}>
          <span className="text-[10px] font-bold tracking-widest text-blue-600">NEXT MEETING</span><h2 className="mt-1 font-semibold">{meeting.title}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-slate-400">Date</dt><dd className="mt-1 font-semibold">{meeting.date}</dd></div><div><dt className="text-slate-400">Time</dt><dd className="mt-1 font-semibold">{meeting.time}</dd></div><div className="col-span-2"><dt className="text-slate-400">Participants</dt><dd className="mt-1 text-slate-600 dark:text-zinc-300">{meeting.participants}</dd></div></dl>
          {permissions.joinMeeting && meeting.link && <a href={meeting.link} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">Join Meeting</a>}
          <details className="mt-4 border-t border-slate-100 pt-3 text-xs dark:border-white/10"><summary className="cursor-pointer font-semibold text-slate-500">Meeting details</summary><p className="mt-3 leading-5 text-slate-500">{meeting.summary}</p><ul className="mt-3 space-y-1 text-slate-500">{meeting.actionItems.map(item=><li key={item}>✓ {item}</li>)}</ul><div className="mt-3 flex flex-wrap gap-2"><a href={calendarUrl} target="_blank" rel="noreferrer" className={smallButton}>Add to Google Calendar</a><button onClick={downloadMeeting} className={smallButton}>Download Event</button><button onClick={()=>{navigator.clipboard?.writeText(meeting.link);notify("Meeting link copied.")}} className={smallButton}>Copy Link</button></div></details>
        </article>
      </section>

      <section className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,70fr)_minmax(300px,30fr)]">
        <div className="space-y-4">
          <article id="knowledge" className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-[10px] font-bold tracking-widest text-blue-600">KNOWLEDGE BASE</span><h2 className="mt-1 font-semibold">Project documents</h2><p className="text-xs text-slate-500">The sources Copilot uses for project answers.</p></div>{permissions.uploadDocuments&&<button onClick={()=>setUploadOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">↑ Upload Document</button>}</div>
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center dark:border-white/10"><span className="grid size-11 place-items-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700 dark:bg-blue-500/10">W</span><div className="min-w-0 flex-1"><b className="block text-sm">Project Discussion.docx</b><span className="block text-[10px] text-slate-500">2.4 MB · Updated today · AI analysis complete</span></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">● Analyzed</span></div>
          </article>

          <article id="tasks" className={card}>
            <div className="flex flex-wrap items-center justify-between gap-3"><div><span className="text-[10px] font-bold tracking-widest text-blue-600">ASSIGNED TASKS</span><h2 className="mt-1 font-semibold">Assigned to You</h2></div>{permissions.createTask&&<button onClick={()=>setTaskOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">+ Create Task</button>}</div>
            {yourTasks.length ? <div className="mt-4 divide-y divide-slate-100 dark:divide-white/10">{yourTasks.map(task=>{const index=tasks.indexOf(task);return <div key={task.title} className="grid gap-3 py-4 sm:grid-cols-[1.4fr_.55fr_.8fr_.45fr] sm:items-center"><div className="flex gap-3"><button aria-label={"Mark " + task.title + " complete"} onClick={()=>completeTask(index)} className={joinClasses("mt-0.5 size-5 shrink-0 rounded-md border text-[10px]",task.status==="Completed"?"border-blue-600 bg-blue-600 text-white":"border-slate-300 text-transparent")}>✓</button><b className={joinClasses("text-sm",task.status==="Completed"&&"line-through text-slate-400")}>{task.title}</b></div><span className="text-xs text-slate-500">{task.due}</span><div><div className="flex justify-between text-[10px] text-slate-500"><span>Progress</span><span>{task.progress}%</span></div><div className="mt-2 h-1 rounded-full bg-slate-100 dark:bg-white/10"><i style={{width: task.progress + "%"}} className="block h-full rounded-full bg-blue-600" /></div></div><span className={joinClasses("w-fit rounded-full px-2 py-1 text-[9px]",priorityClasses(task.priority))}>{task.priority}</span></div>})}</div> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-zinc-950">No tasks are currently assigned to you.</p>}
          </article>

          <article className={card}><span className="text-[10px] font-bold tracking-widest text-violet-600">✦ AI SUGGESTIONS</span><h2 className="mt-1 font-semibold">Recommended next steps</h2><ul className="mt-4 grid gap-2 sm:grid-cols-3">{["Add references for two research claims","Assign owners to three open actions","Review the prototype milestone risk"].map(item=><li key={item} className="rounded-xl bg-violet-50 p-3 text-xs leading-5 text-slate-600 dark:bg-violet-500/10 dark:text-zinc-300">✦ {item}</li>)}</ul></article>
          <details className={card}><summary className="cursor-pointer text-sm font-semibold">Recent Activity</summary><div className="mt-4 grid gap-3 sm:grid-cols-3">{activities.map(([title,meta])=><div key={title}><b className="block text-xs">{title}</b><span className="text-[10px] text-slate-500">{meta}</span></div>)}</div></details>
        </div>

        <aside id="copilot" className="sticky top-20 overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-lg dark:border-violet-500/20 dark:bg-zinc-900"><header className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-blue-50 p-4 dark:border-white/10 dark:from-violet-500/10 dark:to-blue-500/10"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white">✦</span><div><b className="block text-sm">Project Copilot</b><span className="text-[10px] text-slate-500">Grounded in project knowledge</span></div></header><div className="p-4"><p className="text-xs leading-5 text-slate-500">Ask for priorities, risks, summaries, or the next best action.</p><div className="mt-4 space-y-2">{["Summarize today’s progress","What should we do next?","What risks need attention?"].map(prompt=><button key={prompt} onClick={()=>askCopilot(prompt)} className="flex w-full justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-xs dark:border-white/10 dark:bg-zinc-950">{prompt}<span>→</span></button>)}</div>{answer&&<div className="mt-4 rounded-xl bg-violet-50 p-3 text-xs leading-5 text-slate-600 dark:bg-violet-500/10 dark:text-zinc-300">✦ {answer}</div>}<div className="mt-4 flex rounded-xl border border-slate-200 p-2 dark:border-white/10"><textarea value={question} onChange={event=>setQuestion(event.target.value)} rows="2" placeholder="Ask about this project..." className="min-w-0 flex-1 resize-none bg-transparent p-1 text-xs outline-none" /><button onClick={()=>askCopilot()} className="size-8 rounded-lg bg-blue-600 text-white">↑</button></div></div></aside>
      </section>

      {toast&&<div role="status" className="fixed right-5 top-20 z-50 rounded-xl bg-slate-950 px-4 py-3 text-xs text-white shadow-xl">✓ {toast}</div>}
      {uploadOpen&&<Modal title="Upload a project document" description="Copilot will analyze it and update project knowledge." onClose={()=>setUploadOpen(false)}><button onClick={()=>{setUploadOpen(false);notify("Document uploaded successfully.")}} className="m-6 flex h-52 w-[calc(100%-3rem)] flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/50 dark:border-blue-500/30 dark:bg-blue-500/5"><span className="grid size-12 place-items-center rounded-xl bg-white text-xl text-blue-600 dark:bg-zinc-950">↑</span><b className="mt-3 text-sm">Choose a project document</b><span className="mt-1 text-xs text-slate-500">DOCX, PDF, PPTX, XLSX or TXT · Up to 50 MB</span></button></Modal>}
      {taskOpen&&<Modal title="Create a task" description="Add actionable work to the project." onClose={()=>setTaskOpen(false)}><form onSubmit={addTask} className="space-y-4 p-6"><label className="block text-sm font-medium">Title<input name="title" required className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 dark:border-white/10" /></label><label className="block text-sm font-medium">Description<textarea name="description" rows="3" className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-transparent p-3 dark:border-white/10" /></label><label className="block text-sm font-medium">Priority<select name="priority" className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 dark:border-white/10"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label><div className="flex justify-end gap-2"><button type="button" onClick={()=>setTaskOpen(false)} className={smallButton}>Cancel</button><button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">Create Task</button></div></form></Modal>}
    </main>
  );
}
