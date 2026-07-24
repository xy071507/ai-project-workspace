import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { api } from "../api";

export default function CreateProject() {
  const navigate = useNavigate();
  const [name, setName] = useState(""); const [pin, setPin] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(""); setLoading(true);
    try { const project = await api.createProject({ name, pin }); navigate(`/project/${project.pin}`); }
    catch (error) { setError(error.message); } finally { setLoading(false); }
  }
  return <main className="center-page">
    <section className="form-card">
      <Link to="/" className="back"><ArrowLeft size={18}/> Back</Link>
      <div className="icon-box"><FolderPlus/></div><h1>Create a new project</h1><p>Choose a name and a unique six-digit PIN for your group.</p>
      <form onSubmit={submit}>
        <label>Project name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: Sustainability Campaign" required/></label>
        <label>Six-digit project PIN<input value={pin} maxLength="6" inputMode="numeric" onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="Example: 482913" required/></label>
        {error && <p className="error">{error}</p>}
        <button className="primary full" disabled={loading}>{loading ? "Creating..." : "Create project workspace"}</button>
      </form>
    </section>
  </main>;
}
