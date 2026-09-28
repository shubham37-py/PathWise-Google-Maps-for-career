"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import assumptionsData from "@/data/assumptions.json";
import { AssumptionItem } from "@/types";
import { X, Download, ShieldCheck, ExternalLink, Calendar } from "lucide-react";

export const AssumptionsDrawer: React.FC = () => {
  const { isAssumptionsOpen, setIsAssumptionsOpen } = useAppStore();

  if (!isAssumptionsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink-primary/30 backdrop-blur-none animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-base border-l border-border shadow-overlay flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle">
            <div>
              <h2 className="font-serif text-20 text-ink-primary font-semibold">
                Platform Assumptions
              </h2>
              <p className="text-12 text-ink-muted mt-0.5">
                Transparent math: data sources, confidence & rates
              </p>
            </div>
            <button
              onClick={() => setIsAssumptionsOpen(false)}
              className="p-1 rounded-sm border border-border hover:bg-surface-base text-ink-muted hover:text-ink-primary transition-colors"
              aria-label="Close assumptions drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            <div className="rounded-md border border-border bg-surface-subtle p-3.5 text-12 text-ink-secondary">
              <span className="font-medium text-ink-primary">Principle: </span>
              "AI explains, the engine calculates." Every projection carries explicit assumptions and confidence ratings. No round fake estimates.
            </div>

            <div className="space-y-4">
              <h3 className="text-12 font-medium uppercase tracking-wider text-ink-muted">
                Core Macro Variables
              </h3>

              {(assumptionsData as AssumptionItem[]).map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border bg-surface-base p-4 space-y-2.5 hover:border-border-strong transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-14 font-medium text-ink-primary">
                      {item.metric}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-12 font-medium rounded-pill border ${
                        item.confidence === "High"
                          ? "bg-semantic-green-surface text-semantic-green-text border-semantic-green-border"
                          : item.confidence === "Medium"
                          ? "bg-semantic-amber-surface text-semantic-amber-text border-semantic-amber-border"
                          : "bg-semantic-red-surface text-semantic-red-text border-semantic-red-border"
                      }`}
                    >
                      {item.confidence} Confidence
                    </span>
                  </div>

                  <div className="text-16 font-semibold tabular-nums text-accent">
                    {item.value}
                  </div>

                  <p className="text-12 text-ink-secondary leading-relaxed">
                    {item.rationale}
                  </p>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-ink-muted">
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 text-ink-muted" />
                      {item.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-ink-muted" />
                      {item.lastVerified}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 border-t border-border bg-surface-subtle flex items-center justify-between gap-3">
            <span className="text-12 text-ink-muted">Indicative data model v1.4</span>
            <button
              onClick={() => alert("Report generation simulated. Full PDF pathway dossier will be compiled.")}
              className="flex items-center gap-2 px-3.5 py-2 text-12 font-medium rounded-sm bg-accent hover:bg-accent-hover text-accent-contrast transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download pathway report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
