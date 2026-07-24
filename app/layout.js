import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata() {
  const host = (await headers()).get("host") || "localhost:3000";
  const origin = `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
  const title = "AI Project Copilot";
  const description = "Transform project documents into actionable team knowledge.";
  return {
    title,
    description,
    icons: { icon: "/favicon.svg" },
    openGraph: { title, description, images: [`${origin}/og.png`] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
