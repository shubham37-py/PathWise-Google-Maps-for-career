"use client";

import React, { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { weightedScore } from "@/lib/engine";
import { Pathway } from "@/types";
import {
  SlidersHorizontal,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

export const DecisionMatrix: React.FC = () => {
  const {
    pathways,
    weights,
    updateWeights,
    weightPreset,
    setWeightPreset,
    selectPathway,
    setCurrentTab,
    currency,
  } = useAppStore();

  // Compute live scores and ranking
  const rankedPathways = useMemo(() => {
    return pathways
      .map((pathway) => {
        const score = weightedScore(pathway, weights, pathways);
        return {
          ...pathway,
          calculatedScore: score,
        };
      })
      .sort((a, b) => b.calculatedScore - a.calculatedScore);
  }, [pathways, weights]);

  // Identify Best Fit and Safest Path
  const bestFit = rankedPathways[0];
  const safestPath = [...pathways].sort((a, b) => {
    const riskScore = { low: 3, medium: 2, high: 1 };
    return riskScore[b.overallRisk] - riskScore[a.overallRisk];
  })[0];

  // Cumulative Cashflow simulation for top 3 pathways over 15 years
  const top3 = rankedPathways.slice(0, 3);
  const cumulativeCashflowData = useMemo(() => {
    const data: Record<string, any>[] = [];
    for (let year = 1; year <= 14; year++) {
      const row: Record<string, any> = { year: `Yr ${year}` };

      top3.forEach((p) => {
        const isStudying = year <= p.totalDurationYears;
        const annualEducationCost = isStudying ? p.totalCostINR / p.totalDurationYears : 0;

        let annualNetSalary = 0;
        if (!isStudying) {
          const yearsWorking = year - p.totalDurationYears;
          const salary = p.startingSalaryINR * Math.pow(1.085, yearsWorking - 1);
          annualNetSalary = salary * 0.7; // After living taxes/deductions
        }

        // Cumulative sum computation
        const prevCumulative = data[year - 2]?.[p.code] || 0;
        const netFlowThisYear = annualNetSalary - annualEducationCost;
        row[p.code] = Math.round(prevCumulative + netFlowThisYear);
      });

      data.push(row);
    }
    return data;
  }, [top3]);

  const handleSelectPathway = (id: string) => {
    selectPathway(id);
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
              Multi-Attribute Decision Theory
            </div>
            <h1 className="font-serif text-32 text-ink-primary font-semibold">
              Weighted Decision Matrix
            </h1>
            <p className="text-14 text-ink-secondary mt-1 max-w-prose">
              Never accept a single automated verdict. Weigh what matters to you and your parents—whether it is early break-even, low debt risk, or 10-year earning ceiling.
            </p>
          </div>

          {/* Perspective Preset Toggle */}
          <div className="flex items-center rounded-sm border border-border bg-surface-subtle p-1">
            <button
              onClick={() => setWeightPreset("student")}
              className={`px-3 py-1.5 text-12 font-medium rounded-sm transition-colors ${
                weightPreset === "student"
                  ? "bg-accent text-accent-contrast shadow-sm"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
            >
              Student View (Ceiling & Passion)
            </button>
            <button
              onClick={() => setWeightPreset("parent")}
              className={`px-3 py-1.5 text-12 font-medium rounded-sm transition-colors ${
                weightPreset === "parent"
                  ? "bg-accent text-accent-contrast shadow-sm"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
            >
              Parent View (Cost & Safety)
            </button>
          </div>
        </div>

        {/* Dual Recommendation Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Fit Banner */}
          <div className="p-4 rounded-md border-2 border-accent bg-accent-subtle/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-accent text-11 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Rank #1: Best Weighted Fit
              </div>
              <h4 className="font-serif text-16 font-semibold text-ink-primary mt-0.5">
                {bestFit.title}
              </h4>
              <p className="text-12 text-ink-secondary mt-0.5">
                Calculated Fit Score: <strong className="text-accent tabular-nums">{bestFit.calculatedScore}/100</strong>
              </p>
            </div>
            <button
              onClick={() => handleSelectPathway(bestFit.id)}
              className="px-3.5 py-1.5 text-12 font-semibold rounded-sm bg-accent text-accent-contrast hover:bg-accent-hover transition-colors"
            >
              View Route
            </button>
          </div>

          {/* Safest Path Banner */}
          <div className="p-4 rounded-md border border-semantic-green-border bg-semantic-green-surface flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-semantic-green-text text-11 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-semantic-green-solid" />
                Safest Contingency Route (Plan B)
              </div>
              <h4 className="font-serif text-16 font-semibold text-ink-primary mt-0.5">
                {safestPath.title}
              </h4>
              <p className="text-12 text-ink-secondary mt-0.5">
                Lowest entrance competition & budget footprint
              </p>
            </div>
            <button
              onClick={() => handleSelectPathway(safestPath.id)}
              className="px-3.5 py-1.5 text-12 font-medium rounded-sm border border-semantic-green-border bg-surface-base hover:bg-semantic-green-surface text-semantic-green-text transition-colors"
            >
              View Route
            </button>
          </div>
        </div>

        {/* 1. Muted Heat-Cell Matrix Table */}
        <div className="rounded-md border border-border bg-surface-base overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-12 border-collapse">
              <thead className="bg-surface-subtle border-b border-border text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
                <tr>
                  <th className="py-3.5 px-4 min-w-[200px]">Pathway Route</th>
                  <th className="py-3.5 px-3 min-w-[110px] text-right">Total Cost</th>
                  <th className="py-3.5 px-3 min-w-[120px] text-center">Admission Ease</th>
                  <th className="py-3.5 px-3 min-w-[100px] text-right">Time to Earn</th>
                  <th className="py-3.5 px-3 min-w-[120px] text-right">Career Ceiling</th>
                  <th className="py-3.5 px-3 min-w-[90px] text-center">ROI Score</th>
                  <th className="py-3.5 px-3 min-w-[90px] text-center">Risk Level</th>
                  <th className="py-3.5 px-3 min-w-[110px] text-center">Interest Fit</th>
                  <th className="py-3.5 px-4 min-w-[110px] text-center bg-accent-subtle/50 text-accent font-bold">
                    Weighted Rank
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {rankedPathways.map((p, rankIndex) => {
                  const isTopRank = rankIndex === 0;
                  const avgAdmissionChance = (p.overallAdmissionChance[0] + p.overallAdmissionChance[1]) / 2;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleSelectPathway(p.id)}
                      className={`cursor-pointer transition-colors ${
                        isTopRank ? "bg-accent-subtle/20 font-medium" : "hover:bg-surface-subtle/50"
                      }`}
                    >
                      {/* Pathway Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-14 text-ink-primary flex items-center gap-2">
                          <span>#{rankIndex + 1}</span>
                          <span>{p.title}</span>
                        </div>
                        <div className="text-[11px] text-ink-muted truncate max-w-[240px]">
                          {p.shortDesc}
                        </div>
                      </td>

                      {/* Total Cost */}
                      <td className="py-3.5 px-3 text-right tabular-nums">
                        <span className={p.totalCostINR <= 1000000 ? "text-semantic-green-text font-semibold" : "text-ink-primary"}>
                          {formatCurrency(p.totalCostINR, currency)}
                        </span>
                      </td>

                      {/* Admission Ease */}
                      <td className="py-3.5 px-3 text-center tabular-nums">
                        <span className="px-2 py-0.5 rounded-sm bg-surface-subtle border border-border-subtle">
                          {p.overallAdmissionChance[0]}–{p.overallAdmissionChance[1]}%
                        </span>
                      </td>

                      {/* Time to Earn */}
                      <td className="py-3.5 px-3 text-right tabular-nums text-ink-secondary">
                        {p.yearsToFirstSalary} Years
                      </td>

                      {/* Career Ceiling (10-Yr) */}
                      <td className="py-3.5 px-3 text-right tabular-nums font-medium text-ink-primary">
                        {formatCurrency(p.careerCeilingINR, currency)}
                      </td>

                      {/* ROI Score */}
                      <td className="py-3.5 px-3 text-center tabular-nums">
                        <span className="font-semibold text-accent">{p.roiScore}</span>/100
                      </td>

                      {/* Risk */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-pill border ${
                            p.overallRisk === "low"
                              ? "bg-semantic-green-surface text-semantic-green-text border-semantic-green-border"
                              : p.overallRisk === "medium"
                              ? "bg-semantic-amber-surface text-semantic-amber-text border-semantic-amber-border"
                              : "bg-semantic-red-surface text-semantic-red-text border-semantic-red-border"
                          }`}
                        >
                          {p.overallRisk.toUpperCase()}
                        </span>
                      </td>

                      {/* Fit with Interests */}
                      <td className="py-3.5 px-3 text-center tabular-nums">
                        <span className="font-medium text-ink-primary">{p.fitScore}%</span>
                      </td>

                      {/* Overall Score */}
                      <td className="py-3.5 px-4 text-center bg-accent-subtle/30 tabular-nums">
                        <span className="text-16 font-bold text-accent">
                          {p.calculatedScore}
                        </span>
                        <span className="text-[10px] text-ink-muted block">points</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Weight Tuning Sliders */}
        <div className="rounded-md border border-border bg-surface-base p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-serif text-18 font-semibold text-ink-primary">
                Fine-Tune Priority Weights
              </h3>
              <p className="text-12 text-ink-muted">
                Adjust how much each dimension influences the final ranking.
              </p>
            </div>
            <span className="text-12 text-accent font-medium">
              Current Mode: {weightPreset.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              { key: "cost", label: "Low Cost Priority", val: weights.cost },
              { key: "admissionDifficulty", label: "Admission Certainty", val: weights.admissionDifficulty },
              { key: "timeToEarn", label: "Early First Salary", val: weights.timeToEarn },
              { key: "careerCeiling", label: "10-Year Career Ceiling", val: weights.careerCeiling },
              { key: "roi", label: "Return on Investment", val: weights.roi },
              { key: "risk", label: "Risk Mitigation", val: weights.risk },
              { key: "fitWithInterests", label: "Intellectual Interest Fit", val: weights.fitWithInterests },
            ].map((slider) => (
              <div key={slider.key} className="space-y-1.5 p-3 rounded-sm border border-border bg-surface-subtle">
                <div className="flex justify-between text-12">
                  <span className="text-ink-secondary">{slider.label}</span>
                  <span className="font-semibold tabular-nums text-accent">{slider.val}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={slider.val}
                  onChange={(e) => updateWeights({ [slider.key]: Number(e.target.value) })}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Cumulative Net Cashflow Chart (15-Year Horizon & Break-Even) */}
        <div className="rounded-md border border-border bg-surface-base p-6 space-y-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Financial Payoff Trajectory
            </span>
            <h3 className="font-serif text-20 font-semibold text-ink-primary mt-0.5">
              Cumulative Net Cashflow & Break-Even Comparison
            </h3>
            <p className="text-12 text-ink-muted mt-0.5">
              Net earnings post-tax minus total education cost. The zero-line intersection marks the exact break-even year.
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeCashflowData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <XAxis dataKey="year" stroke="var(--ink-muted)" fontSize={12} />
                <YAxis
                  stroke="var(--ink-muted)"
                  fontSize={11}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val), currency)}
                  contentStyle={{
                    backgroundColor: "var(--surface-base)",
                    borderColor: "var(--border-default)",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <ReferenceLine y={0} stroke="var(--border-strong)" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey={top3[0]?.code}
                  name={`${top3[0]?.title.split("(")[0]} (Break-even: ${top3[0]?.breakEvenYears}y)`}
                  stroke="var(--accent-base)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                {top3[1] && (
                  <Line
                    type="monotone"
                    dataKey={top3[1]?.code}
                    name={`${top3[1]?.title.split("(")[0]} (Break-even: ${top3[1]?.breakEvenYears}y)`}
                    stroke="#D97706"
                    strokeWidth={2}
                    dot={{ r: 2.5 }}
                  />
                )}
                {top3[2] && (
                  <Line
                    type="monotone"
                    dataKey={top3[2]?.code}
                    name={`${top3[2]?.title.split("(")[0]} (Break-even: ${top3[2]?.breakEvenYears}y)`}
                    stroke="#2563EB"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
