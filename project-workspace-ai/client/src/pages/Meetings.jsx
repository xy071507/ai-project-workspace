import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, UploadCloud } from "lucide-react";
import { api } from "../api";

export default function Meetings() {
  const { pin } = useParams(); const fileRef = useRef();
  const [project, setProject] = useState(null); const [error, setError] = useState(""); const [uploading, setUploading] = useState(false);
  useEffect(() => { api.getProject(pin).then(setProject).catch((e) => setError(e.message)); }, [pin]);
  async function upload(file) {
    if (!file) return; setUploading(true); setError("");
    try { setProject(await api.uploadMeeting(pin, file)); } catch (error) { setError(error.message); }
    finally { setUploading(false); fileRef.current.value = ""; }
  }
  if (!project) return <main className="center-page">{error || "Loading meetings..."}</main>;
  return <main className="meetings-page">
    <Link to={`/project/${pin}`} className="back"><ArrowLeft size={18}/> Project dashboard</Link>
    <header><span className="eyebrow">MEETING KNOWLEDGE BASE</span><h1>{project.name} meetings</h1><p>New meeting summaries are appended, so earlier meetings remain available.</p></header>
    <section className="card meeting-upload"><input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" onChange={(e) => upload(e.target.files[0])}/><button className="primary" onClick={() => fileRef.current.click()} disabled={uploading}><UploadCloud size={18}/>{uploading ? "Analysing meeting..." : "Add meeting document"}</button>{error && <p className="error">{error}</p>}</section>
    <section className="timeline">{project.meetings.length ? project.meetings.map((meeting, index) => <article className="meeting-card" key={meeting.id}>
      <div className="meeting-number"><CalendarDays/><span>Meeting {index + 1}</span></div>
      <h2>{meeting.purpose}</h2><time>{meeting.date}</time><p>{meeting.description}</p>
      <h3>Decisions</h3>{meeting.decisions.length ? <ul>{meeting.decisions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No decisions found.</p>}
      <h3>Action items</h3>{meeting.actionItems.length ? <ul>{meeting.actionItems.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No action items found.</p>}
    </article>) : <div className="empty-card"><CalendarDays size={36}/><h2>No meetings added yet</h2><p>Upload meeting minutes to create the first summary.</p></div>}</section>
  </main>;
}
