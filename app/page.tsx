"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { TopBar } from "@/components/shell/TopBar";
import { AssumptionsDrawer } from "@/components/assumptions/AssumptionsDrawer";
import { AskPathWise } from "@/components/chat/AskPathWise";
import { PathwayMap } from "@/components/pathway/PathwayMap";
import { ProfileBuilder } from "@/components/profile/ProfileBuilder";
import { LandingPage } from "@/components/landing/LandingPage";

export default function HomePage() {
  const { currentTab, theme, setTheme, setCurrentTab } = useAppStore();

  useEffect(() => {
    // Check URL parameters on mount for screenshot automation
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme");
      if (urlTheme === "dark" || urlTheme === "light") {
        setTheme(urlTheme);
      }
      const urlTab = params.get("tab");
      if (urlTab) {
        setCurrentTab(urlTab as any);
      }
    }
  }, [setTheme, setCurrentTab]);

  useEffect(() => {
    // Sync html dark class with store
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-bg-app flex flex-col font-sans text-ink-primary selection:bg-accent-subtle selection:text-accent">
      {/* Platform Navigation Shell */}
      <TopBar />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === "landing" && <LandingPage />}
        {currentTab === "profile" && <ProfileBuilder />}
        {currentTab === "pathways" && <PathwayMap />}

        {/* Placeholders for upcoming screens in the build sequence */}
        {currentTab !== "landing" && currentTab !== "profile" && currentTab !== "pathways" && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full p-6 rounded-md bg-surface-base border border-border text-center space-y-3 shadow-sm">
              <span className="text-12 uppercase tracking-wider text-ink-muted font-medium">
                Workspace Tab
              </span>
              <h2 className="font-serif text-20 text-ink-primary font-semibold capitalize">
                {currentTab.replace("-", " ")} Workspace
              </h2>
              <p className="text-14 text-ink-secondary leading-relaxed">
                This section is currently queued in our step-by-step build sequence.
              </p>
              <button
                onClick={() => useAppStore.getState().setCurrentTab("pathways")}
                className="mt-2 px-4 py-2 text-12 font-medium rounded-sm bg-accent hover:bg-accent-hover text-accent-contrast transition-colors"
              >
                Return to Pathway Map (Hero Screen)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Overlays */}
      <AssumptionsDrawer />
      <AskPathWise />
    </div>
  );
}
