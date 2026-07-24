import fs from "node:fs/promises";
import path from "node:path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { createWorker } from "tesseract.js";

const imageTypes = new Set(["image/png", "image/jpeg"]);

export async function extractText(file) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === "text/plain" || extension === ".txt") {
    return fs.readFile(file.path, "utf8");
  }

  if (file.mimetype === "application/pdf" || extension === ".pdf") {
    const buffer = await fs.readFile(file.path);
    const parsed = await pdfParse(buffer);
    return parsed.text;
  }

  if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".docx"
  ) {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value;
  }

  if (imageTypes.has(file.mimetype) || [".png", ".jpg", ".jpeg"].includes(extension)) {
    const worker = await createWorker("eng");
    try {
      const result = await worker.recognize(file.path);
      return result.data.text;
    } finally {
      await worker.terminate();
    }
  }

  throw Object.assign(new Error("Unsupported file type."), { status: 400 });
}
