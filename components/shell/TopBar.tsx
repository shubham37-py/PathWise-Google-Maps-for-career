"use client";

import React from "react";
import { useAppStore, AppTab } from "@/lib/store";
import { Currency } from "@/lib/utils";
import {
  Compass,
  FileText,
  SlidersHorizontal,
  Scale,
  Building2,
  Info,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  UserCheck,
} from "lucide-react";

const NAV_STEPS: { id: AppTab; label: string; stepNumber?: number }[] = [
  { id: "landing", label: "Overview" },
  { id: "profile", label: "1. Profile" },
  { id: "pathways", label: "2. Pathways" },
  { id: "comparison", label: "Institutions" },
  { id: "funding", label: "3. Funding & Loans" },
  { id: "whatif", label: "4. What-If" },
  { id: "decide", label: "5. Decision Matrix" },
];

const CURRENCIES: Currency[] = ["INR", "USD", "GBP", "EUR"];

export const TopBar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    theme,
    toggleTheme,
    currency,
    setCurrency,
    setIsAssumptionsOpen,
    resetToAaravDemo,
    profile,
  } = useAppStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface-base/95 backdrop-blur-none transition-colors">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo with Route Node Motif */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentTab("landing")}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="PathWise Home"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-sm border border-border bg-surface-subtle group-hover:border-accent transition-colors">
              {/* Route line with node dots motif */}
              <div className="absolute w-4 h-[1.5px] bg-border-strong group-hover:bg-accent transition-colors" />
              <div className="absolute w-2 h-2 rounded-full bg-surface-base border-[1.5px] border-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-16 font-semibold tracking-tight text-ink-primary">
                PathWise
              </span>
              <span className="text-[10px] uppercase tracking-wider text-ink-muted hidden sm:inline">
                Career Route Engine
              </span>
            </div>
          </button>

          {/* Persona quick indicator */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-border text-12 text-ink-secondary">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-semantic-green-solid" />
            <span>Persona:</span>
            <span className="font-medium text-ink-primary">{profile.name} (15, Pune)</span>
            <button
              onClick={resetToAaravDemo}
              className="text-12 text-ink-muted hover:text-accent underline flex items-center gap-1 ml-1"
              title="Reset Aarav demo data"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Step Indicator Navigation */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Workflow Steps">
          {NAV_STEPS.map((step) => {
            const isActive = currentTab === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentTab(step.id)}
                className={`px-3 py-1.5 text-12 font-medium rounded-sm transition-colors ${
                  isActive
                    ? "bg-accent text-accent-contrast"
                    : "text-ink-secondary hover:text-ink-primary hover:bg-surface-subtle"
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </nav>

        {/* Controls: Assumptions, Currency, Theme */}
        <div className="flex items-center gap-2">
          {/* Currency Toggle */}
          <div className="flex items-center rounded-sm border border-border bg-surface-subtle p-0.5">
            {CURRENCIES.map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-0.5 text-12 font-medium rounded-sm transition-colors tabular-nums ${
                  currency === curr
                    ? "bg-surface-base text-ink-primary border border-border-subtle"
                    : "text-ink-muted hover:text-ink-primary"
                }`}
              >
                {curr === "INR" ? "₹" : curr === "USD" ? "$" : curr === "GBP" ? "£" : "€"}
              </button>
            ))}
          </div>

          {/* Assumptions Slide-Over Trigger */}
          <button
            onClick={() => setIsAssumptionsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-12 font-medium rounded-sm border border-border hover:bg-surface-subtle text-ink-secondary hover:text-ink-primary transition-colors"
            title="Inspect platform calculation assumptions"
          >
            <Info className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Assumptions</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-sm border border-border hover:bg-surface-subtle text-ink-secondary hover:text-ink-primary transition-colors"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            aria-label="Toggle color theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="flex md:hidden overflow-x-auto border-t border-border px-3 py-1.5 gap-1 scrollbar-none bg-surface-subtle">
        {NAV_STEPS.map((step) => {
          const isActive = currentTab === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentTab(step.id)}
              className={`shrink-0 px-2.5 py-1 text-12 font-medium rounded-sm transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-accent text-accent-contrast"
                  : "text-ink-muted hover:text-ink-primary"
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
