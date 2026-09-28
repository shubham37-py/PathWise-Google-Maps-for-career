"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { TopBar } from "@/components/shell/TopBar";
import { AssumptionsDrawer } from "@/components/assumptions/AssumptionsDrawer";
import { AskPathWise } from "@/components/chat/AskPathWise";
import { PathwayMap } from "@/components/pathway/PathwayMap";
import { ProfileBuilder } from "@/components/profile/ProfileBuilder";
import { LandingPage } from "@/components/landing/LandingPage";
import { WhatIfSimulator } from "@/components/whatif/WhatIfSimulator";
import { FundingAndLoans } from "@/components/funding/FundingAndLoans";
import { InstitutionComparison } from "@/components/comparison/InstitutionComparison";
import { DecisionMatrix } from "@/components/matrix/DecisionMatrix";

export default function HomePage() {
  const { currentTab, theme, setTheme, setCurrentTab } = useAppStore();

  useEffect(() => {
    // Check URL parameters on mount for screenshot automation or direct linking
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
        {currentTab === "comparison" && <InstitutionComparison />}
        {currentTab === "funding" && <FundingAndLoans />}
        {currentTab === "whatif" && <WhatIfSimulator />}
        {currentTab === "decide" && <DecisionMatrix />}
      </main>

      {/* Global Overlays */}
      <AssumptionsDrawer />
      <AskPathWise />
    </div>
  );
}
