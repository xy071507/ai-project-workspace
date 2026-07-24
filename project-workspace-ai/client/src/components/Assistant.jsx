import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { api } from "../api";

export default function Assistant({ pin }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Ask me about this project's deadline, goals, tasks, or meetings." }]);
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!question.trim() || loading) return;
    const current = question.trim();
    setQuestion("");
    setMessages((items) => [...items, { role: "user", text: current }]);
    setLoading(true);
    try {
      const { answer } = await api.chat(pin, current);
      setMessages((items) => [...items, { role: "assistant", text: answer }]);
    } catch (error) {
      setMessages((items) => [...items, { role: "assistant", text: error.message }]);
    } finally { setLoading(false); }
  }

  return <aside className="assistant-panel">
    <div className="assistant-title"><Bot size={20}/> AI Project Assistant</div>
    <div className="chat-log">{messages.map((message, index) => <div key={index} className={`bubble ${message.role}`}>{message.text}</div>)}</div>
    <form className="chat-form" onSubmit={submit}>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about this project..." />
      <button aria-label="Send" disabled={loading}><Send size={18}/></button>
    </form>
    <small>Answers only from uploaded project data.</small>
  </aside>;
}
