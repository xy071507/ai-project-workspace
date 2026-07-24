import OpenAI from "openai";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string(),
  assignee: z.string().default("Unassigned"),
  status: z.enum(["not_started", "in_progress", "done"]).default("not_started"),
  dueDate: z.string().nullable().default(null)
});

const MeetingSchema = z.object({
  date: z.string().default("Unknown date"),
  purpose: z.string().default("Not specified"),
  decisions: z.array(z.string()).default([]),
  description: z.string().default(""),
  actionItems: z.array(z.string()).default([])
});

const ProjectExtractionSchema = z.object({
  projectName: z.string().nullable().default(null),
  goals: z.array(z.string()).default([]),
  deadline: z.string().nullable().default(null),
  purpose: z.string().default(""),
  members: z.array(z.object({ name: z.string(), role: z.string().default("Member") })).default([]),
  tasks: z.array(TaskSchema).default([]),
  meetings: z.array(MeetingSchema).default([]),
  decisions: z.array(z.string()).default([]),
  actionItems: z.array(z.string()).default([])
});

function parseJson(text) {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}

function fallbackExtraction(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const deadlineLine = lines.find((line) => /deadline|due date|due:/i.test(line));
  const taskLines = lines.filter((line) => /^(task|action item|todo|to-do)\b/i.test(line));
  return ProjectExtractionSchema.parse({
    purpose: lines.slice(0, 3).join(" ").slice(0, 500),
    deadline: deadlineLine ?? null,
    tasks: taskLines.slice(0, 20).map((line) => ({ title: line.replace(/^.*?:\s*/, "") || line }))
  });
}

export async function analyseProjectText(text) {
  if (!process.env.OPENAI_API_KEY) return fallbackExtraction(text);

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: "Extract project information from the supplied document. Return only valid JSON matching the requested fields. Do not invent facts. Use null or empty arrays when information is absent. Task status must be not_started, in_progress, or done."
      },
      {
        role: "user",
        content: `Return JSON with projectName, goals, deadline, purpose, members[{name,role}], tasks[{title,assignee,status,dueDate}], meetings[{date,purpose,decisions,description,actionItems}], decisions, actionItems.\n\nDOCUMENT:\n${text.slice(0, 120000)}`
      }
    ]
  });

  return ProjectExtractionSchema.parse(parseJson(response.output_text));
}

export async function answerFromProject(project, question) {
  const projectContext = JSON.stringify({
    name: project.name,
    purpose: project.purpose,
    goals: project.goals,
    deadline: project.deadline,
    members: project.members,
    tasks: project.tasks,
    meetings: project.meetings,
    decisions: project.decisions,
    actionItems: project.actionItems,
    documents: project.documents?.map((document) => ({ name: document.name, extractedText: document.extractedText }))
  });

  if (!process.env.OPENAI_API_KEY) {
    const q = question.toLowerCase();
    if (q.includes("deadline")) return project.deadline || "I could not find this information in the project documents.";
    const member = project.members?.find((item) => q.includes(item.name.toLowerCase()));
    if (member) {
      const tasks = project.tasks.filter((task) => task.assignee.toLowerCase() === member.name.toLowerCase());
      return tasks.length ? tasks.map((task) => task.title).join("; ") : "I could not find this information in the project documents.";
    }
    return "I could not find this information in the project documents.";
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: "You are a project assistant. Answer only from PROJECT_DATA. Never use outside knowledge or web information. If the answer is not present, reply exactly: I could not find this information in the project documents."
      },
      { role: "user", content: `PROJECT_DATA:\n${projectContext}\n\nQUESTION:\n${question}` }
    ]
  });
  return response.output_text.trim();
}
