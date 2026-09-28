"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export const PathwayDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    selectedPathwayId,
    selectedNode,
    pathways,
    currency,
    setCurrentTab,
  } = useAppStore();

  if (!isDrawerOpen) return null;

  const currentPathway = pathways.find((p) => p.id === selectedPathwayId);
  const activeNode = selectedNode || currentPathway?.nodes[0];

  if (!currentPathway || !activeNode) return null;

  return (
    <aside className="fixed sm:absolute inset-y-0 right-0 z-30 w-full sm:w-96 bg-surface-base border-l border-border shadow-overlay flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-subtle">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
              {activeNode.stageLabel}
            </span>
            <span
              className={`px-2 py-0.5 text-[11px] font-medium rounded-pill border ${
                activeNode.riskLevel === "low"
                  ? "bg-semantic-green-surface text-semantic-green-text border-semantic-green-border"
                  : activeNode.riskLevel === "medium"
                  ? "bg-semantic-amber-surface text-semantic-amber-text border-semantic-amber-border"
                  : "bg-semantic-red-surface text-semantic-red-text border-semantic-red-border"
              }`}
            >
              {activeNode.riskLevel.toUpperCase()} RISK
            </span>
          </div>
          <h3 className="font-serif text-16 font-semibold text-ink-primary truncate mt-0.5">
            {activeNode.title}
          </h3>
        </div>
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="p-1 rounded-sm border border-border hover:bg-surface-base text-ink-muted hover:text-ink-primary transition-colors shrink-0"
          aria-label="Close drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-12">
        {/* Pathway Context Banner */}
        <div className="p-3 rounded-md bg-accent-subtle border border-accent-border">
          <div className="text-[11px] font-medium text-accent uppercase tracking-wider">
            Active Pathway
          </div>
          <div className="text-14 font-semibold text-ink-primary mt-0.5">
            {currentPathway.title}
          </div>
          <div className="text-12 text-ink-secondary mt-1 flex items-center gap-3 tabular-nums">
            <span>Total: <strong>{formatCurrency(currentPathway.totalCostINR, currency)}</strong></span>
            <span>·</span>
            <span>Duration: <strong>{currentPathway.totalDurationYears} Yrs</strong></span>
            <span>·</span>
            <span>Break-even: <strong>{currentPathway.breakEvenYears} Yrs</strong></span>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center justify-between p-3 rounded-md border border-border bg-surface-subtle">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-ink-muted font-medium">
              How sure are we?
            </div>
            <div className="text-12 text-ink-secondary mt-0.5">
              {activeNode.confidenceReason}
            </div>
          </div>
          <span
            className={`px-2.5 py-1 text-12 font-medium rounded-pill border shrink-0 ml-2 ${
              activeNode.confidence === "High"
                ? "bg-semantic-green-surface text-semantic-green-text border-semantic-green-border"
                : activeNode.confidence === "Medium"
                ? "bg-semantic-amber-surface text-semantic-amber-text border-semantic-amber-border"
                : "bg-semantic-red-surface text-semantic-red-text border-semantic-red-border"
            }`}
          >
            {activeNode.confidence} Confidence
          </span>
        </div>

        {/* Key Numbers Grid */}
        <div className="space-y-2">
          <h4 className="text-12 font-medium uppercase tracking-wider text-ink-muted">
            Key Verified Figures
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {activeNode.keyNumbers.map((num, i) => (
              <div
                key={i}
                className="p-2.5 rounded-sm border border-border bg-surface-base"
              >
                <div className="text-[11px] text-ink-muted truncate">
                  {num.label}
                </div>
                <div className="text-16 font-semibold tabular-nums text-ink-primary mt-0.5">
                  {num.value}
                </div>
                <div className="text-[10px] text-ink-muted mt-1 truncate">
                  {num.source} ({num.date})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why it fits Aarav */}
        <div className="space-y-2">
          <h4 className="text-12 font-medium uppercase tracking-wider text-semantic-green-text flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-semantic-green-solid" />
            Why it fits Aarav
          </h4>
          <ul className="space-y-1.5">
            {activeNode.whyItFits.map((point, i) => (
              <li
                key={i}
                className="text-12 text-ink-secondary leading-relaxed pl-2 border-l-2 border-semantic-green-border"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* What could go wrong */}
        <div className="space-y-2">
          <h4 className="text-12 font-medium uppercase tracking-wider text-semantic-red-text flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-semantic-red-solid" />
            What could go wrong (Risks)
          </h4>
          <ul className="space-y-1.5">
            {activeNode.whatCouldGoWrong.map((point, i) => (
              <li
                key={i}
                className="text-12 text-ink-secondary leading-relaxed pl-2 border-l-2 border-semantic-red-border"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Verification Source */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-ink-muted">
          <span>Source: {activeNode.source}</span>
          <span>Verified: {activeNode.lastVerified}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-surface-subtle space-y-2">
        <button
          onClick={() => setCurrentTab("whatif")}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-12 font-medium rounded-sm bg-accent hover:bg-accent-hover text-accent-contrast transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          Test what-if scenario on this route
        </button>
        <button
          onClick={() => setCurrentTab("comparison")}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-12 font-medium rounded-sm border border-border hover:bg-surface-base text-ink-secondary hover:text-ink-primary transition-colors"
        >
          Compare institutions in this pathway
        </button>
      </div>
    </aside>
  );
};
