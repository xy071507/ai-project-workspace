export const project = {
  id: "csit205-genai-assignment-2",
  name: "CSIT205 Generative AI Assignment 2",
  workspace: "GenAI Group 6",
  course: "CSIT205 Generative AI",
  university: "University of Wollongong",
  status: "On Track",
  pin: "205205",
  deadline: "2026-07-27",
  deadlineDisplay: "27 July 2026",
  nextMilestone: "Prototype direction",
  summary:
    "Develop and evaluate a responsible generative AI solution aligned with the UN Sustainable Development Goals. The team is refining research questions, validating its proposed solution, and preparing evidence for the final recommendation.",
};

const projectMembers = [
  { id: "ccr", initials: "CC", name: "CCR", role: "Leader", email: "leader@example.com", color: "bg-blue-600" },
  { id: "darren-tin", initials: "DT", name: "Darren Tin", role: "Vice Leader", email: "darren.tin@example.com", color: "bg-violet-600" },
  { id: "darren-liem", initials: "DL", name: "Darren Liem", role: "Member", email: "darren.liem@example.com", color: "bg-amber-600" },
  { id: "cynthia", initials: "CY", name: "Cynthia", role: "Member", email: "cynthia@example.com", color: "bg-pink-600" },
  { id: "checo", initials: "CH", name: "Checo", role: "Member", email: "checo@example.com", color: "bg-emerald-600" },
  { id: "su", initials: "SU", name: "Su", role: "Member", email: "su@example.com", color: "bg-cyan-600" },
];

project.members = projectMembers;

export const projects = [project];

export function getProjectById(projectId) {
  return projects.find((item) => item.id === projectId) || null;
}

export function hasProjectLeader(members = []) {
  return members.some((member) => member.role === "Leader");
}

export function createProjectRecord(projectInput) {
  const members = Array.isArray(projectInput.members) ? projectInput.members : [];
  if (!hasProjectLeader(members)) {
    throw new Error("A project must have at least one Leader.");
  }

  return { ...projectInput, members: members.map((member) => ({ ...member })) };
}

export const tasks = [
  { title: "Research SDG Alignment", description: "Map the proposed solution to relevant UN goals.", assignee: "Cynthia", initials: "CY", priority: "High", status: "In Progress", due: "24 Jul", progress: 65 },
  { title: "Finalize Interview Questions", description: "Resolve unfinished questions found in the discussion.", assignee: "Darren Tin", initials: "DT", priority: "Critical", status: "Not Started", due: "25 Jul", progress: 0 },
  { title: "Review Prototype Direction", description: "Confirm that the use case meets assignment criteria.", assignee: "CCR", initials: "CC", priority: "Medium", status: "In Progress", due: "27 Jul", progress: 40 },
  { title: "Assign Report Sections", description: "Distribute clear ownership across all six members.", assignee: "Darren Liem", initials: "DL", priority: "Low", status: "Not Started", due: "29 Jul", progress: 0 },
];

export const activities = [
  ["Document uploaded", "Project Discussion.docx · 18 minutes ago"],
  ["AI summary updated", "Project Copilot · 16 minutes ago"],
  ["Research objectives reviewed", "Cynthia · 1 hour ago"],
];

export const insights = [
  { category: "Research quality", text: "The discussion document contains unfinished interview questions.", action: "Review questions" },
  { category: "Ownership", text: "Three action items do not have a clearly named owner.", action: "Assign owners" },
];

export const meeting = {
  title: "Team Research Review",
  date: "24 July 2026",
  time: "10:00 AM – 11:00 AM",
  start: "2026-07-24T10:00:00+08:00",
  end: "2026-07-24T11:00:00+08:00",
  participants: "CCR, Darren Tin, Darren Liem, Cynthia, Checo, Su",
  location: "Online · Google Meet",
  link: "https://meet.google.com/abc-defg-hij",
  summary: "Review SDG research, finalize interview questions, and confirm ownership for the next prototype milestone.",
  actionItems: [
    "Cynthia to present the SDG alignment findings.",
    "Darren Tin to finalize the interview questions.",
    "CCR to confirm the prototype direction.",
  ],
};
