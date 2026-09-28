"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { WhatIfScenarioPreset } from "@/types";
import {
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
} from "lucide-react";

const SCENARIO_PRESETS: WhatIfScenarioPreset[] = [
  {
    id: "preset-no-mbbs",
    name: "I don't get MBBS (Missed Cutoff)",
    description: "NEET UG score falls short of government merit seat (< 645 marks in Maharashtra).",
    changes: {
      neetMbbsEliminated: true,
    },
  },
  {
    id: "preset-budget-cut",
    name: "Family Budget Drops 40%",
    description: "Liquid education savings drop from ₹10 Lakh to ₹6 Lakh due to unforeseen expenses.",
    changes: {
      budgetMultiplier: 0.6,
    },
  },
  {
    id: "preset-no-relocate",
    name: "Cannot Relocate Abroad",
    description: "Visa restrictions or family preferences restrict studies strictly to Pune and India.",
    changes: {
      canRelocateAbroad: false,
    },
  },
  {
    id: "preset-lower-board",
    name: "Class 10 Result is Lower (74%)",
    description: "Board score lands at 74% instead of 89%, reducing direct entrance eligibility margins.",
    changes: {
      class10ScoreDelta: -15,
    },
  },
];

export const WhatIfSimulator: React.FC = () => {
  const {
    profile,
    pathways,
    activeScenarioId,
    scenarioDeltas,
    scenarioNarrative,
    runScenario,
    resetScenario,
    selectPathway,
    setCurrentTab,
    currency,
  } = useAppStore();

  const [customBudgetMultiplier, setCustomBudgetMultiplier] = useState(1);
  const [customScoreDelta, setCustomScoreDelta] = useState(0);

  const activePreset = SCENARIO_PRESETS.find((p) => p.id === activeScenarioId);

  // Top recommended pathway under current scenario
  const topReRoutedPathway = [...pathways].sort((a, b) => b.fitScore - a.fitScore)[0];
  // Baseline original top pathway
  const originalTopPathway = pathways.find((p) => p.code === "MBBS-IN") || pathways[0];

  const handleApplyPreset = (preset: WhatIfScenarioPreset) => {
    runScenario(preset);
  };

  const handleCustomRun = () => {
    runScenario({
      id: "custom-scenario",
      name: "Custom Stress Test",
      description: "Custom user-defined budget and score simulation",
      changes: {
        budgetMultiplier: customBudgetMultiplier,
        class10ScoreDelta: customScoreDelta,
      },
    });
  };

  const handleViewOnMap = (pathwayId: string) => {
    selectPathway(pathwayId);
    setCurrentTab("pathways");
  };

  return (
    <div className="flex-1 bg-bg-app py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-content space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-12 font-medium text-accent uppercase tracking-wider mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Dynamic Stress-Test Engine
            </div>
            <h1 className="font-serif text-32 text-ink-primary font-semibold">
              What-If Career Simulator
            </h1>
            <p className="text-14 text-ink-secondary mt-1 max-w-prose">
              Never commit to a single career route blind. Simulate realistic surprises, see how admission probabilities shift, and verify your Plan B before taking entrance coaching.
            </p>
          </div>

          {activeScenarioId && (
            <button
              onClick={resetScenario}
              className="flex items-center gap-1.5 px-3 py-2 text-12 font-medium rounded-sm border border-border bg-surface-base hover:bg-surface-subtle text-ink-secondary hover:text-ink-primary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Original Baseline
            </button>
          )}
        </div>

        {/* 1. Preset Scenario Selector Cards */}
        <div className="space-y-3">
          <div className="text-12 font-medium uppercase tracking-wider text-ink-muted">
            Select a Realistic Stress Scenario:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCENARIO_PRESETS.map((preset) => {
              const isSelected = activeScenarioId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-4 text-left rounded-md border transition-all relative ${
                    isSelected
                      ? "bg-surface-base border-accent ring-1 ring-accent/20 shadow-sm"
                      : "bg-surface-base border-border hover:border-border-strong hover:bg-surface-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-14 text-ink-primary">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <p className="text-12 text-ink-secondary mt-1.5 leading-relaxed">
                    {preset.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-12 font-medium text-accent">
                    <span>{isSelected ? "Active Scenario" : "Run Scenario"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Real-Time Delta Strip (Live Counting Numbers & Semantic Arrows) */}
        {scenarioDeltas && (
          <div className="rounded-md border border-border bg-surface-base p-6 space-y-4 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Simulation Outcome
                </span>
                <h3 className="font-serif text-18 font-semibold text-ink-primary mt-0.5">
                  Live Impact on Career Viability
                </h3>
              </div>
              <span className="px-2.5 py-1 text-12 font-medium rounded-pill bg-accent-subtle text-accent border border-accent-border">
                {activePreset?.name || "Custom Scenario"}
              </span>
            </div>

            {/* Delta Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Avg Cost Change */}
              <div className="p-3.5 rounded-sm border border-border bg-surface-subtle">
                <span className="text-12 text-ink-muted">Avg Education Cost</span>
                <div className="text-20 font-semibold tabular-nums mt-1 flex items-center gap-1.5">
                  {scenarioDeltas.avgCostChangeINR < 0 ? (
                    <TrendingDown className="w-4 h-4 text-semantic-green-solid" />
                  ) : scenarioDeltas.avgCostChangeINR > 0 ? (
                    <TrendingUp className="w-4 h-4 text-semantic-red-solid" />
                  ) : null}
                  <span
                    className={
                      scenarioDeltas.avgCostChangeINR < 0
                        ? "text-semantic-green-text"
                        : scenarioDeltas.avgCostChangeINR > 0
                        ? "text-semantic-red-text"
                        : "text-ink-primary"
                    }
                  >
                    {scenarioDeltas.avgCostChangeINR !== 0
                      ? formatCurrency(Math.abs(scenarioDeltas.avgCostChangeINR), currency)
                      : "No Change"}
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted mt-0.5 block">
                  {scenarioDeltas.avgCostChangeINR < 0 ? "Cost reduction across options" : "Cost pressure"}
                </span>
              </div>

              {/* Years to Salary Change */}
              <div className="p-3.5 rounded-sm border border-border bg-surface-subtle">
                <span className="text-12 text-ink-muted">Years to First Salary</span>
                <div className="text-20 font-semibold tabular-nums mt-1 flex items-center gap-1.5">
                  {scenarioDeltas.avgYearsToSalaryChange < 0 ? (
                    <TrendingDown className="w-4 h-4 text-semantic-green-solid" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-semantic-amber-solid" />
                  )}
                  <span
                    className={
                      scenarioDeltas.avgYearsToSalaryChange < 0
                        ? "text-semantic-green-text"
                        : "text-ink-primary"
                    }
                  >
                    {scenarioDeltas.avgYearsToSalaryChange > 0 ? "+" : ""}
                    {scenarioDeltas.avgYearsToSalaryChange} Yrs
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted mt-0.5 block">
                  {scenarioDeltas.avgYearsToSalaryChange < 0 ? "Faster financial independence" : "Extended study duration"}
                </span>
              </div>

              {/* Admission Chance Delta */}
              <div className="p-3.5 rounded-sm border border-border bg-surface-subtle">
                <span className="text-12 text-ink-muted">Avg Admission Probability</span>
                <div className="text-20 font-semibold tabular-nums mt-1 flex items-center gap-1.5">
                  {scenarioDeltas.avgAdmissionChanceChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-semantic-green-solid" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-semantic-red-solid" />
                  )}
                  <span
                    className={
                      scenarioDeltas.avgAdmissionChanceChange > 0
                        ? "text-semantic-green-text"
                        : "text-semantic-red-text"
                    }
                  >
                    {scenarioDeltas.avgAdmissionChanceChange > 0 ? "+" : ""}
                    {scenarioDeltas.avgAdmissionChanceChange}%
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted mt-0.5 block">
                  Based on adjusted entrance cutoffs
                </span>
              </div>

              {/* Loan Dependence Change */}
              <div className="p-3.5 rounded-sm border border-border bg-surface-subtle">
                <span className="text-12 text-ink-muted">Loan Borrowing Exposure</span>
                <div className="text-20 font-semibold tabular-nums mt-1 flex items-center gap-1.5">
                  <span
                    className={
                      scenarioDeltas.loanDependenceChangePercent > 0
                        ? "text-semantic-red-text"
                        : "text-semantic-green-text"
                    }
                  >
                    {scenarioDeltas.loanDependenceChangePercent > 0 ? "+" : ""}
                    {scenarioDeltas.loanDependenceChangePercent}%
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted mt-0.5 block">
                  {scenarioDeltas.loanDependenceChangePercent > 0
                    ? "Demands collateral-backed loans"
                    : "Reduced debt reliance"}
                </span>
              </div>
            </div>

            {/* Plain English Summary Narrative Card */}
            {scenarioNarrative && (
              <div className="p-4 rounded-sm border border-border bg-surface-subtle text-14 text-ink-secondary leading-relaxed flex items-start gap-3">
                <div className="p-1 rounded-sm bg-accent text-accent-contrast shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-ink-primary">Engine Analysis: </span>
                  {scenarioNarrative}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Before vs After Split Comparison */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-20 font-semibold text-ink-primary">
              Before & After Pathway Re-Routing
            </h3>
            <span className="text-12 text-ink-muted">
              AI explains, the engine calculates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before (Original Baseline Path) */}
            <div className="rounded-md border border-border bg-surface-base p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-12 font-medium uppercase tracking-wider text-ink-muted">
                  Baseline Path (Original Plan)
                </span>
                <span className="px-2 py-0.5 text-12 font-medium rounded-pill border bg-surface-subtle border-border text-ink-secondary">
                  Original
                </span>
              </div>

              <div>
                <h4 className="font-serif text-18 font-semibold text-ink-primary">
                  MBBS in India (Govt / State Merit)
                </h4>
                <p className="text-12 text-ink-secondary mt-1">
                  BJMC Pune via NEET UG. High social prestige but hyper-competitive.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle text-12 tabular-nums">
                <div>
                  <span className="text-ink-muted">Total Cost:</span>
                  <div className="font-semibold text-ink-primary text-16">₹10.5 Lakh</div>
                </div>
                <div>
                  <span className="text-ink-muted">Time to Earn:</span>
                  <div className="font-semibold text-ink-primary text-16">8.5 Years</div>
                </div>
                <div>
                  <span className="text-ink-muted">Admission Chance:</span>
                  <div className="font-semibold text-semantic-amber-text text-16">12–18%</div>
                </div>
                <div>
                  <span className="text-ink-muted">Break-even:</span>
                  <div className="font-semibold text-ink-primary text-16">7.2 Years</div>
                </div>
              </div>

              <div className="p-3 rounded-sm bg-surface-subtle border border-border text-12 text-ink-secondary">
                <span className="font-medium text-ink-primary">Vulnerability: </span>
                Failing NEET cutoff rank (under rank 3,200 in Maharashtra) forces ₹70L+ private medical college debt or multiple gap years.
              </div>

              <button
                onClick={() => handleViewOnMap("pathway-mbbs-india")}
                className="w-full py-2 text-12 font-medium rounded-sm border border-border hover:bg-surface-subtle text-ink-primary transition-colors"
              >
                Inspect original route on Map
              </button>
            </div>

            {/* After (Optimized Re-Routed Path) */}
            <div className="rounded-md border-2 border-accent bg-surface-base p-6 space-y-4 shadow-sm relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-accent text-12 font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Recommended Re-Route (Plan B)
                </div>
                <span className="px-2 py-0.5 text-12 font-bold tabular-nums rounded-pill bg-accent text-accent-contrast">
                  {topReRoutedPathway?.fitScore}% Fit
                </span>
              </div>

              <div>
                <h4 className="font-serif text-18 font-semibold text-ink-primary">
                  {topReRoutedPathway?.title}
                </h4>
                <p className="text-12 text-ink-secondary mt-1">
                  {topReRoutedPathway?.shortDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle text-12 tabular-nums">
                <div>
                  <span className="text-ink-muted">Total Cost:</span>
                  <div className="font-semibold text-accent text-16">
                    {formatCurrency(topReRoutedPathway?.totalCostINR || 0, currency)}
                  </div>
                </div>
                <div>
                  <span className="text-ink-muted">Time to Earn:</span>
                  <div className="font-semibold text-accent text-16">
                    {topReRoutedPathway?.yearsToFirstSalary} Years
                  </div>
                </div>
                <div>
                  <span className="text-ink-muted">Admission Chance:</span>
                  <div className="font-semibold text-semantic-green-text text-16">
                    {topReRoutedPathway?.overallAdmissionChance[0]}–{topReRoutedPathway?.overallAdmissionChance[1]}%
                  </div>
                </div>
                <div>
                  <span className="text-ink-muted">Break-even:</span>
                  <div className="font-semibold text-accent text-16">
                    {topReRoutedPathway?.breakEvenYears} Years
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-sm bg-accent-subtle border border-accent-border text-12 text-ink-secondary">
                <span className="font-medium text-accent">Why this wins: </span>
                {topReRoutedPathway?.suitabilityNarrative}
              </div>

              <button
                onClick={() => handleViewOnMap(topReRoutedPathway?.id || "pathway-bsc-research")}
                className="w-full py-2 text-12 font-semibold rounded-sm bg-accent hover:bg-accent-hover text-accent-contrast transition-colors flex items-center justify-center gap-2"
              >
                <span>Open re-routed route on Pathway Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Custom Parameter Sliders */}
        <div className="rounded-md border border-border bg-surface-base p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-18 font-semibold text-ink-primary">
                Fine-Tune Custom Simulation Sliders
              </h3>
              <p className="text-12 text-ink-muted">
                Adjust parameters to see instant sensitivity responses across all 6 pathways.
              </p>
            </div>
            <button
              onClick={handleCustomRun}
              className="px-3.5 py-1.5 text-12 font-medium rounded-sm bg-accent text-accent-contrast hover:bg-accent-hover transition-colors"
            >
              Apply Custom Sliders
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Budget Multiplier */}
            <div className="space-y-2">
              <div className="flex justify-between text-12">
                <span className="font-medium text-ink-secondary">Family Budget Scaling:</span>
                <span className="font-semibold tabular-nums text-accent">
                  {(customBudgetMultiplier * 100).toFixed(0)}% ({formatCurrency(profile.totalBudgetINR * customBudgetMultiplier, currency)})
                </span>
              </div>
              <input
                type="range"
                min={0.3}
                max={1.5}
                step={0.05}
                value={customBudgetMultiplier}
                onChange={(e) => setCustomBudgetMultiplier(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] text-ink-muted tabular-nums">
                <span>30% (-70% drop)</span>
                <span>100% (Baseline)</span>
                <span>150% (+50% expansion)</span>
              </div>
            </div>

            {/* Score Delta */}
            <div className="space-y-2">
              <div className="flex justify-between text-12">
                <span className="font-medium text-ink-secondary">Class 10 Score Shift:</span>
                <span className="font-semibold tabular-nums text-accent">
                  {customScoreDelta > 0 ? `+${customScoreDelta}` : customScoreDelta}% ({(profile.class10Percentage + customScoreDelta).toFixed(1)}%)
                </span>
              </div>
              <input
                type="range"
                min={-20}
                max={10}
                step={1}
                value={customScoreDelta}
                onChange={(e) => setCustomScoreDelta(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] text-ink-muted tabular-nums">
                <span>-20% drop</span>
                <span>0% (No change)</span>
                <span>+10% boost</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
