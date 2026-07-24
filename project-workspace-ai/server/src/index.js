import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createProject, getProject, updateProject } from "./services/store.js";
import { extractText } from "./services/extractText.js";
import { analyseProjectText, answerFromProject } from "./services/ai.js";

const app = express();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/png",
      "image/jpeg"
    ];
    callback(allowed.includes(file.mimetype) ? null : new Error("Unsupported file type."), allowed.includes(file.mimetype));
  }
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));

function validPin(pin) {
  return /^\d{6}$/.test(pin);
}

function mergeUnique(existing = [], incoming = []) {
  return [...new Set([...existing, ...incoming].filter(Boolean))];
}

function progress(tasks = []) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/projects", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const pin = String(req.body.pin || "").trim();
    if (!name) return res.status(400).json({ error: "Project name is required." });
    if (!validPin(pin)) return res.status(400).json({ error: "PIN must contain exactly six digits." });

    const now = new Date().toISOString();
    const project = await createProject({
      id: randomUUID(), name, pin, purpose: "", goals: [], deadline: null,
      members: [], tasks: [], meetings: [], decisions: [], actionItems: [], documents: [],
      progress: 0, createdAt: now, updatedAt: now
    });
    res.status(201).json(project);
  } catch (error) { next(error); }
});

app.post("/api/projects/join", async (req, res) => {
  const pin = String(req.body.pin || "").trim();
  if (!validPin(pin)) return res.status(400).json({ error: "Enter a valid six-digit PIN." });
  const project = await getProject(pin);
  if (!project) return res.status(404).json({ error: "No project was found for this PIN." });
  res.json(project);
});

app.get("/api/projects/:pin", async (req, res) => {
  const project = await getProject(req.params.pin);
  if (!project) return res.status(404).json({ error: "Project not found." });
  res.json(project);
});

app.post("/api/projects/:pin/documents", upload.single("document"), async (req, res, next) => {
  try {
    const project = await getProject(req.params.pin);
    if (!project) return res.status(404).json({ error: "Project not found." });
    if (!req.file) return res.status(400).json({ error: "Choose a document to upload." });

    const extractedText = await extractText(req.file);
    if (!extractedText.trim()) return res.status(400).json({ error: "No readable text was found in this document." });
    const analysed = await analyseProjectText(extractedText);

    const updated = await updateProject(req.params.pin, (current) => {
      const tasks = [...current.tasks];
      for (const incoming of analysed.tasks) {
        if (!tasks.some((task) => task.title.toLowerCase() === incoming.title.toLowerCase())) {
          tasks.push({ id: randomUUID(), ...incoming });
        }
      }
      const meetings = [...current.meetings, ...analysed.meetings.map((meeting) => ({ id: randomUUID(), ...meeting }))];
      return {
        ...current,
        name: current.name || analysed.projectName || current.name,
        purpose: analysed.purpose || current.purpose,
        deadline: analysed.deadline || current.deadline,
        goals: mergeUnique(current.goals, analysed.goals),
        members: [...current.members, ...analysed.members.filter((member) => !current.members.some((item) => item.name.toLowerCase() === member.name.toLowerCase()))],
        tasks,
        meetings,
        decisions: mergeUnique(current.decisions, analysed.decisions),
        actionItems: mergeUnique(current.actionItems, analysed.actionItems),
        documents: [...current.documents, { id: randomUUID(), name: req.file.originalname, uploadedAt: new Date().toISOString(), extractedText }],
        progress: progress(tasks)
      };
    });
    res.json(updated);
  } catch (error) { next(error); }
  finally {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
  }
});

app.patch("/api/projects/:pin/tasks/:taskId", async (req, res, next) => {
  try {
    const allowed = new Set(["not_started", "in_progress", "done"]);
    if (!allowed.has(req.body.status)) return res.status(400).json({ error: "Invalid task status." });
    const updated = await updateProject(req.params.pin, (current) => {
      const tasks = current.tasks.map((task) => task.id === req.params.taskId ? { ...task, status: req.body.status } : task);
      return { ...current, tasks, progress: progress(tasks) };
    });
    if (!updated) return res.status(404).json({ error: "Project not found." });
    res.json(updated);
  } catch (error) { next(error); }
});

app.post("/api/projects/:pin/meetings", upload.single("document"), async (req, res, next) => {
  try {
    const project = await getProject(req.params.pin);
    if (!project) return res.status(404).json({ error: "Project not found." });
    if (!req.file) return res.status(400).json({ error: "Choose a meeting document." });
    const extractedText = await extractText(req.file);
    const analysed = await analyseProjectText(extractedText);
    const newMeetings = analysed.meetings.length ? analysed.meetings : [{
      date: "Unknown date", purpose: "Meeting", decisions: analysed.decisions,
      description: analysed.purpose || extractedText.slice(0, 700), actionItems: analysed.actionItems
    }];
    const updated = await updateProject(req.params.pin, (current) => ({
      ...current,
      meetings: [...current.meetings, ...newMeetings.map((meeting) => ({ id: randomUUID(), ...meeting }))],
      documents: [...current.documents, { id: randomUUID(), name: req.file.originalname, uploadedAt: new Date().toISOString(), extractedText }]
    }));
    res.json(updated);
  } catch (error) { next(error); }
  finally { if (req.file?.path) await fs.unlink(req.file.path).catch(() => {}); }
});

app.post("/api/projects/:pin/chat", async (req, res, next) => {
  try {
    const project = await getProject(req.params.pin);
    if (!project) return res.status(404).json({ error: "Project not found." });
    const question = String(req.body.question || "").trim();
    if (!question) return res.status(400).json({ error: "Question is required." });
    res.json({ answer: await answerFromProject(project, question) });
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || "Something went wrong." });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API running at http://localhost:${port}`));
