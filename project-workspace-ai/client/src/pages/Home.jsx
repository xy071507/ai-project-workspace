import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, KeyRound, Sparkles } from "lucide-react";
import { api } from "../api";

export default function Home() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);

  async function join(event) {
    event.preventDefault(); setError("");
    try { const project = await api.joinProject(pin); navigate(`/project/${project.pin}`); }
    catch (error) { setError(error.message); }
  }

  return <main className="landing">
    <nav className="brand"><Sparkles size={22}/> ProjectFlow AI</nav>
    <section className="hero">
      <span className="eyebrow">DOCUMENTS → ACTIONABLE WORKSPACE</span>
      <h1>Turn project files into a workspace your team can use.</h1>
      <p>Upload proposals, minutes, PDFs, Word documents, text, or images. ProjectFlow extracts goals, deadlines, members, tasks, and decisions.</p>
      <div className="home-actions">
        <button className="primary large" onClick={() => navigate("/create")}><FolderPlus/> Create a project</button>
        <button className="secondary large" onClick={() => setShowPin((value) => !value)}><KeyRound/> Join with PIN</button>
      </div>
      {showPin && <form className="pin-card" onSubmit={join}>
        <label>Enter the project's six-digit PIN</label>
        <div className="pin-row"><input maxLength="6" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="123456"/><button className="primary">Enter project</button></div>
        {error && <p className="error">{error}</p>}
      </form>}
    </section>
  </main>;
}
