import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.resolve(__dirname, "../../data/projects.json");

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeAll([]);
      return [];
    }
    throw error;
  }
}

async function writeAll(projects) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(projects, null, 2));
}

export async function listProjects() {
  return readAll();
}

export async function getProject(pin) {
  const projects = await readAll();
  return projects.find((project) => project.pin === pin) ?? null;
}

export async function createProject(project) {
  const projects = await readAll();
  if (projects.some((item) => item.pin === project.pin)) {
    const error = new Error("This PIN is already in use.");
    error.status = 409;
    throw error;
  }
  projects.push(project);
  await writeAll(projects);
  return project;
}

export async function updateProject(pin, updater) {
  const projects = await readAll();
  const index = projects.findIndex((project) => project.pin === pin);
  if (index === -1) return null;
  projects[index] = await updater(projects[index]);
  projects[index].updatedAt = new Date().toISOString();
  await writeAll(projects);
  return projects[index];
}
