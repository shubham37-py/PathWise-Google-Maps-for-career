import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathWise — Career Path Simulator: From Class 10 to Career",
  description:
    "An education and career decision-support platform for students finishing Class 10 and their parents. Explore routes, understand true costs, test what-if scenarios, and evaluate multi-criteria outcomes.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-app text-ink-primary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
