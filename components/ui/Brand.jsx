import Link from "next/link";

export default function Brand({ compact = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="grid size-7 grid-cols-2 gap-0.5 rounded-md bg-blue-600 p-1 shadow-sm">
        <i className="rounded-sm bg-white" /><i className="rounded-sm bg-blue-200" />
        <i className="rounded-sm bg-blue-100" /><i className="rounded-sm bg-white" />
      </span>
      {!compact && <span>AI Project <b>Copilot</b></span>}
    </Link>
  );
}
