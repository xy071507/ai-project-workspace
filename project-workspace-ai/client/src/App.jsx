import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateProject from "./pages/CreateProject";
import ProjectDashboard from "./pages/ProjectDashboard";
import Meetings from "./pages/Meetings";

export default function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/create" element={<CreateProject />} />
    <Route path="/project/:pin" element={<ProjectDashboard />} />
    <Route path="/project/:pin/meetings" element={<Meetings />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
