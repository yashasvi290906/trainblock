import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAILBLOCK | Integrated Railway Maintenance Planning",
  description:
    "Integrated Multi-Departmental Railway Maintenance Block Planning System for Indian Railways - SIH 2026",
};

import { PlanningRunProvider } from "@/context/PlanningRunContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white min-h-screen transition-colors duration-200`}
      >
        <ThemeProvider>
          <PlanningRunProvider>
            {children}
          </PlanningRunProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
