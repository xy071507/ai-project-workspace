import { NextResponse } from "next/server";
import { project } from "@/data/mockData";
import { sendGmail } from "@/lib/googleGmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function singaporeDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function daysBetween(dateA, dateB) {
  const start = new Date(`${dateA}T00:00:00+08:00`);
  const end = new Date(`${dateB}T00:00:00+08:00`);
  return Math.ceil((end - start) / 86_400_000);
}

function isAuthorised(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const today = singaporeDateParts();
  const daysLeft = daysBetween(today, project.deadline);

  if (daysLeft < 1 || daysLeft > 3) {
    return NextResponse.json({
      sent: 0,
      skipped: true,
      today,
      deadline: project.deadline,
      daysLeft,
      message: "Reminder is only sent 3, 2, and 1 day before the deadline.",
    });
  }

  const recipients = project.members.filter((member) => member.email);
  const results = [];

  for (const member of recipients) {
    try {
      const result = await sendGmail({
        to: member.email,
        subject: `[Project reminder] ${daysLeft} day${daysLeft === 1 ? "" : "s"} left — ${project.name}`,
        text: [
          `Hi ${member.name},`,
          "",
          `The deadline for ${project.name} is ${project.deadlineDisplay}.`,
          `There ${daysLeft === 1 ? "is" : "are"} ${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining.`,
          "",
          `Current milestone: ${project.nextMilestone}`,
          `Project dashboard: ${process.env.NEXT_PUBLIC_APP_URL || "https://ai-project-copilot-ten.vercel.app"}/project/${project.id}/dashboard`,
          "",
          "Please check your assigned tasks and update your progress.",
          "",
          "— AI Project Copilot",
        ].join("\n"),
      });
      results.push({ email: member.email, ok: true, messageId: result.id });
    } catch (error) {
      results.push({ email: member.email, ok: false, error: error.message });
    }
  }

  const sent = results.filter((item) => item.ok).length;
  return NextResponse.json({ sent, daysLeft, deadline: project.deadline, results });
}
