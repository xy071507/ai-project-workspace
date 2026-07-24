import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UploadCloud, FileText, ListChecks, CalendarDays, Target, Clock3, Users } from "lucide-react";
import { api } from "../api";
import Assistant from "../components/Assistant";

export default function ProjectDashboard() {
  const { pin } = useParams(); const fileRef = useRef();
  const [project, setProject] = useState(null); const [error, setError] = useState(""); const [uploading, setUploading] = useState(false);
  useEffect(() => { api.getProject(pin).then(setProject).catch((e) => setError(e.message)); }, [pin]);

  async function upload(file) {
    if (!file) return; setUploading(true); setError("");
    try { setProject(await api.uploadDocument(pin, file)); }
    catch (error) { setError(error.message); } finally { setUploading(false); fileRef.current.value = ""; }
  }
  async function changeStatus(task, status) {
    try { setProject(await api.updateTask(pin, task.id, status)); } catch (error) { setError(error.message); }
  }
  if (error && !project) return <main className="center-page"><p className="error">{error}</p><Link to="/">Return home</Link></main>;
  if (!project) return <main className="center-page">Loading project...</main>;

  return <div className="app-shell">
    <header className="topbar"><div><span className="eyebrow">PROJECT WORKSPACE</span><h1>{project.name}</h1></div><div className="pin-badge">PIN {project.pin}</div></header>
    <div className="workspace">
      <main className="dashboard-grid">
        <section className="card upload-card">
          <div className="card-heading"><UploadCloud/><div><h2>Upload project document</h2><p>PDF, DOCX, TXT, PNG, JPG — maximum 15 MB</p></div></div>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" onChange={(e) => upload(e.target.files[0])}/>
          <button className="secondary full" onClick={() => fileRef.current.click()} disabled={uploading}>{uploading ? "Extracting and analysing..." : "Choose a document"}</button>
          {error && <p className="error">{error}</p>}
          <div className="file-list">{project.documents.map((file) => <span key={file.id}><FileText size={15}/>{file.name}</span>)}</div>
        </section>

        <section className="card summary-card">
          <div className="card-heading"><Target/><div><h2>Project summary</h2><p>Automatically generated from uploaded files</p></div></div>
          <div className="progress-line"><strong>{project.progress}% complete</strong><span>{project.tasks.filter((t) => t.status === "done").length}/{project.tasks.length} tasks done</span></div>
          <div className="progress"><div style={{ width: `${project.progress}%` }}/></div>
          <div className="summary-stats"><div><Clock3/><span>Deadline<strong>{project.deadline || "Not found yet"}</strong></span></div><div><Users/><span>Members<strong>{project.members.length}</strong></span></div></div>
          <h3>Purpose</h3><p>{project.purpose || "Upload a project document to generate the project purpose."}</p>
          <h3>Goals</h3>{project.goals.length ? <ul>{project.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul> : <p>No goals found yet.</p>}
        </section>

        <section className="card tasks-card">
          <div className="card-heading"><ListChecks/><div><h2>Team to-do list</h2><p>Update each task as the work progresses</p></div></div>
          {project.tasks.length ? project.tasks.map((task) => <div className="task" key={task.id}>
            <input type="checkbox" checked={task.status === "done"} onChange={(e) => changeStatus(task, e.target.checked ? "done" : "not_started")}/>
            <div><strong className={task.status === "done" ? "done" : ""}>{task.title}</strong><span>{task.assignee || "Unassigned"}{task.dueDate ? ` • ${task.dueDate}` : ""}</span></div>
            <select value={task.status} onChange={(e) => changeStatus(task, e.target.value)}><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="done">Done</option></select>
          </div>) : <p>No tasks found yet. Upload a proposal or meeting document.</p>}
        </section>

        <Link className="card meeting-link" to={`/project/${pin}/meetings`}>
          <div className="card-heading"><CalendarDays/><div><h2>Meeting summaries</h2><p>View and add every project meeting</p></div></div>
          <strong>{project.meetings.length} meetings saved →</strong>
        </Link>
      </main>
      <Assistant pin={pin}/>
    </div>
  </div>;
}
