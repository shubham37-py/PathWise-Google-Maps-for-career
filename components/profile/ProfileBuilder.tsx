"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Board, LoanAppetite, RiskTolerance } from "@/types";
import {
  GraduationCap,
  Sparkles,
  Wallet,
  Globe2,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Building,
  Briefcase,
} from "lucide-react";

const BOARDS: Board[] = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];
const GOAL_PRESETS = [
  "MBBS (Doctor of Medicine)",
  "B.Tech Computer Science & AI",
  "Pure Science & Research (IISER)",
  "Study Abroad (UK / Canada)",
  "Diploma to Lateral Engineering",
];

const INCOME_BANDS = [
  { label: "Under ₹8 Lakh / yr (Eligible for Govt EBC)", value: 750000 },
  { label: "₹8 Lakh – ₹15 Lakh / yr (Middle Income)", value: 1200000 },
  { label: "₹15 Lakh – ₹30 Lakh / yr (Upper Middle)", value: 2200000 },
  { label: "Above ₹30 Lakh / yr (High Income)", value: 4500000 },
];

export const ProfileBuilder: React.FC = () => {
  const { profile, updateProfile, resetToAaravDemo, pathways, selectPathway, setCurrentTab, currency } = useAppStore();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Top recommended pathway based on current profile
  const sortedPathways = [...pathways].sort((a, b) => b.fitScore - a.fitScore);
  const topPath = sortedPathways[0];

  const handlePercentageChange = (pct: number) => {
    updateProfile({ class10Percentage: Number(pct) });
  };

  const handleBudgetChange = (budget: number) => {
    updateProfile({ totalBudgetINR: Number(budget) });
  };

  const handleSubjectScoreChange = (index: number, score: number) => {
    const updated = [...profile.subjectStrengths];
    updated[index] = { ...updated[index], score: Number(score) };
    updateProfile({ subjectStrengths: updated });
  };

  const handleInterestScoreChange = (index: number, score: number) => {
    const updated = [...profile.interests];
    updated[index] = { ...updated[index], score: Number(score) };
    updateProfile({ interests: updated });
  };

  const handleGoToPathways = () => {
    if (topPath) {
      selectPathway(topPath.id);
    }
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
              Step 1 of Decision Framework
            </div>
            <h1 className="font-serif text-32 text-ink-primary font-semibold">
              Student Profile & Baseline
            </h1>
            <p className="text-14 text-ink-muted mt-1 max-w-prose">
              Provide your Class 10 scores, budget reality, and aspirations. The deterministic engine calculates true multi-year education costs, loan exposure, and admission probabilities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToAaravDemo}
              className="flex items-center gap-1.5 px-3 py-2 text-12 font-medium rounded-sm border border-border bg-surface-base hover:bg-surface-subtle text-ink-secondary hover:text-ink-primary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Load Aarav's Demo Profile (Pune, 89%, ₹10L)
            </button>
          </div>
        </div>

        {/* 4-Step Wizard Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { step: 1, title: "1. Academics", subtitle: "Board, score & strengths" },
            { step: 2, title: "2. Goal & Interests", subtitle: "Career aim & RIASEC" },
            { step: 3, title: "3. Budget & Loans", subtitle: "Capital & borrowing limit" },
            { step: 4, title: "4. Preferences", subtitle: "Mobility & risk appetite" },
          ].map((item) => {
            const isCurrent = activeStep === item.step;
            const isCompleted = activeStep > item.step;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(item.step as 1 | 2 | 3 | 4)}
                className={`p-3.5 text-left rounded-md border transition-all ${
                  isCurrent
                    ? "bg-surface-base border-accent ring-1 ring-accent/20 shadow-sm"
                    : isCompleted
                    ? "bg-surface-subtle border-border text-ink-secondary hover:border-border-strong"
                    : "bg-surface-subtle/50 border-border-subtle text-ink-muted"
                }`}
              >
                <div className="flex items-center justify-between text-12 font-semibold">
                  <span className={isCurrent ? "text-accent" : "text-ink-primary"}>
                    {item.title}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-semantic-green-solid" />
                  )}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5 truncate">
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Wizard Form Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 Columns) */}
          <div className="lg:col-span-8 rounded-md border border-border bg-surface-base p-6 sm:p-8 space-y-6 shadow-sm">
            {/* STEP 1: ACADEMICS */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-20 font-semibold text-ink-primary">
                    Academic Qualifications & Scores
                  </h3>
                  <p className="text-12 text-ink-muted mt-0.5">
                    Your secondary school board and core STEM subject competencies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div className="space-y-1.5">
                    <label className="text-12 font-medium text-ink-secondary">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      className="w-full px-3 py-2 text-14 rounded-sm border border-border bg-surface-subtle focus:bg-surface-base focus:border-accent focus:outline-none"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-12 font-medium text-ink-secondary">
                      Current Location (City, State)
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => updateProfile({ location: e.target.value })}
                      className="w-full px-3 py-2 text-14 rounded-sm border border-border bg-surface-subtle focus:bg-surface-base focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Board Selection */}
                <div className="space-y-2">
                  <label className="text-12 font-medium text-ink-secondary">
                    Secondary Examination Board
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {BOARDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => updateProfile({ board: b })}
                        className={`px-3 py-2 text-12 font-medium rounded-sm border transition-colors ${
                          profile.board === b
                            ? "bg-accent text-accent-contrast border-accent"
                            : "bg-surface-subtle border-border text-ink-secondary hover:border-border-strong"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class 10 Percentage Slider */}
                <div className="space-y-3 p-4 rounded-md border border-border bg-surface-subtle">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-12 font-medium text-ink-primary">
                        Class 10 Aggregate Score
                      </span>
                      <p className="text-[11px] text-ink-muted">
                        Acts as eligibility filter for junior colleges and direct polytechnic entry.
                      </p>
                    </div>
                    <span className="text-20 font-semibold tabular-nums text-accent">
                      {profile.class10Percentage}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={0.5}
                    value={profile.class10Percentage}
                    onChange={(e) => handlePercentageChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-[10px] text-ink-muted tabular-nums">
                    <span>50% (Pass)</span>
                    <span>75% (First Class)</span>
                    <span>85% (Distinction)</span>
                    <span>100% (Top Merit)</span>
                  </div>
                </div>

                {/* Subject Strengths */}
                <div className="space-y-3">
                  <label className="text-12 font-medium text-ink-secondary">
                    Core Subject Competencies (Scores / Percentile)
                  </label>
                  <div className="space-y-3">
                    {profile.subjectStrengths.map((sub, i) => (
                      <div key={sub.subject} className="space-y-1">
                        <div className="flex justify-between text-12">
                          <span className="text-ink-secondary">{sub.subject}</span>
                          <span className="font-semibold tabular-nums text-ink-primary">
                            {sub.score}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={40}
                          max={100}
                          value={sub.score}
                          onChange={(e) => handleSubjectScoreChange(i, Number(e.target.value))}
                          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: GOALS & INTERESTS */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-20 font-semibold text-ink-primary">
                    Aspirations & RIASEC Interest Alignment
                  </h3>
                  <p className="text-12 text-ink-muted mt-0.5">
                    Define what you want to achieve and align with your intellectual tendencies.
                  </p>
                </div>

                {/* Goal Selector */}
                <div className="space-y-2">
                  <label className="text-12 font-medium text-ink-secondary">
                    Primary Family / Student Career Aspiration
                  </label>
                  <div className="space-y-2">
                    {GOAL_PRESETS.map((goal) => {
                      const isSelected = profile.familyGoal === goal;
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => updateProfile({ familyGoal: goal })}
                          className={`w-full text-left p-3 rounded-sm border transition-colors flex items-center justify-between ${
                            isSelected
                              ? "bg-accent-subtle border-accent text-accent font-semibold"
                              : "bg-surface-subtle border-border text-ink-secondary hover:border-border-strong"
                          }`}
                        >
                          <span className="text-12">{goal}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* One Sentence Summary */}
                <div className="space-y-1.5">
                  <label className="text-12 font-medium text-ink-secondary">
                    Describe yourself in one sentence (Optional)
                  </label>
                  <input
                    type="text"
                    value={profile.oneSentenceSummary || ""}
                    onChange={(e) => updateProfile({ oneSentenceSummary: e.target.value })}
                    placeholder="e.g. Curious student passionate about biology research and computational science."
                    className="w-full px-3 py-2 text-12 rounded-sm border border-border bg-surface-subtle focus:bg-surface-base focus:border-accent focus:outline-none"
                  />
                </div>

                {/* RIASEC Profile Sliders */}
                <div className="space-y-3 pt-2">
                  <label className="text-12 font-medium text-ink-secondary">
                    Holland RIASEC Tendencies (Holland Code)
                  </label>
                  <div className="space-y-3">
                    {profile.interests.map((int, i) => (
                      <div key={int.category} className="space-y-1">
                        <div className="flex justify-between text-12">
                          <span className="text-ink-primary font-medium">
                            {int.category}: <span className="text-ink-muted font-normal">{int.label}</span>
                          </span>
                          <span className="font-semibold tabular-nums text-accent">
                            {int.score}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={20}
                          max={100}
                          value={int.score}
                          onChange={(e) => handleInterestScoreChange(i, Number(e.target.value))}
                          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BUDGET & LOANS */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-20 font-semibold text-ink-primary">
                    Budget & Financing Reality
                  </h3>
                  <p className="text-12 text-ink-muted mt-0.5">
                    Clear capital limits prevent catastrophic student debt and forced career abandonment.
                  </p>
                </div>

                {/* Budget Slider */}
                <div className="space-y-3 p-4 rounded-md border border-border bg-surface-subtle">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-12 font-medium text-ink-primary">
                        Total Dedicated Family Education Budget
                      </span>
                      <p className="text-[11px] text-ink-muted">
                        Available funds from savings, parents, and existing liquid assets.
                      </p>
                    </div>
                    <span className="text-20 font-semibold tabular-nums text-accent">
                      {formatCurrency(profile.totalBudgetINR, currency, false)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={200000}
                    max={15000000}
                    step={100000}
                    value={profile.totalBudgetINR}
                    onChange={(e) => handleBudgetChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-[10px] text-ink-muted tabular-nums">
                    <span>₹2 Lakh</span>
                    <span>₹10 Lakh (Aarav)</span>
                    <span>₹50 Lakh</span>
                    <span>₹1.5 Crore</span>
                  </div>
                </div>

                {/* Loan Appetite */}
                <div className="space-y-2">
                  <label className="text-12 font-medium text-ink-secondary">
                    Family Loan Appetite
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: "none", title: "Zero Debt (No Loans)", desc: "100% self-funded or scholarships only" },
                      { id: "low", title: "Low Appetite", desc: "Subsidized loans only (Under ₹7.5 Lakh without collateral)" },
                      { id: "moderate", title: "Moderate (Aarav)", desc: "Willing to borrow ₹15-30 Lakh if career ROI is high" },
                      { id: "high", title: "High Investment", desc: "Open to large secured educational loans" },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => updateProfile({ loanAppetite: app.id as LoanAppetite })}
                        className={`p-3 text-left rounded-sm border transition-colors ${
                          profile.loanAppetite === app.id
                            ? "bg-accent-subtle border-accent ring-1 ring-accent/10"
                            : "bg-surface-subtle border-border hover:border-border-strong"
                        }`}
                      >
                        <div className="text-12 font-medium text-ink-primary">
                          {app.title}
                        </div>
                        <div className="text-[11px] text-ink-muted mt-0.5">
                          {app.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Annual Income Band */}
                <div className="space-y-2">
                  <label className="text-12 font-medium text-ink-secondary">
                    Household Annual Gross Income (For Scholarship Matching)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INCOME_BANDS.map((band) => (
                      <button
                        key={band.value}
                        type="button"
                        onClick={() => updateProfile({ annualFamilyIncomeINR: band.value })}
                        className={`p-3 text-left rounded-sm border transition-colors text-12 ${
                          profile.annualFamilyIncomeINR === band.value
                            ? "bg-accent text-accent-contrast border-accent"
                            : "bg-surface-subtle border-border text-ink-secondary hover:border-border-strong"
                        }`}
                      >
                        {band.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PREFERENCES & MOBILITY */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-20 font-semibold text-ink-primary">
                    Mobility, Relocation & Risk
                  </h3>
                  <p className="text-12 text-ink-muted mt-0.5">
                    Geographic willingness and tolerance for entrance competition uncertainty.
                  </p>
                </div>

                {/* Study Abroad Toggle */}
                <div className="p-4 rounded-md border border-border bg-surface-subtle flex items-center justify-between">
                  <div>
                    <span className="text-12 font-medium text-ink-primary">
                      Open to Studying Abroad
                    </span>
                    <p className="text-[11px] text-ink-muted">
                      Enables evaluation of Tbilisi (Georgia), UK Russell Group, Canada, and Germany.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateProfile({ openToAbroad: !profile.openToAbroad })}
                    className={`px-4 py-1.5 text-12 font-medium rounded-sm border transition-colors ${
                      profile.openToAbroad
                        ? "bg-accent text-accent-contrast border-accent"
                        : "bg-surface-base border-border text-ink-secondary"
                    }`}
                  >
                    {profile.openToAbroad ? "Yes, Open" : "Domestic Only"}
                  </button>
                </div>

                {/* Risk Tolerance */}
                <div className="space-y-2">
                  <label className="text-12 font-medium text-ink-secondary">
                    Entrance & Financial Risk Tolerance
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "low", title: "Low Risk", desc: "Prioritize guaranteed routes (e.g. Diploma lateral)" },
                      { id: "medium", title: "Medium Risk", desc: "Balanced entrance competition with plan B" },
                      { id: "high", title: "High Risk", desc: "All-in on hyper-competitive exams (NEET/JEE Adv)" },
                    ].map((risk) => (
                      <button
                        key={risk.id}
                        type="button"
                        onClick={() => updateProfile({ riskTolerance: risk.id as RiskTolerance })}
                        className={`p-3 text-left rounded-sm border transition-colors ${
                          profile.riskTolerance === risk.id
                            ? "bg-accent text-accent-contrast border-accent"
                            : "bg-surface-subtle border-border text-ink-secondary hover:border-border-strong"
                        }`}
                      >
                        <div className="text-12 font-medium">{risk.title}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">{risk.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step Pagination Buttons */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
                  className="flex items-center gap-1.5 px-3 py-2 text-12 font-medium rounded-sm border border-border hover:bg-surface-subtle text-ink-secondary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
                  className="flex items-center gap-1.5 px-4 py-2 text-12 font-medium rounded-sm bg-accent hover:bg-accent-hover text-accent-contrast transition-colors"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGoToPathways}
                  className="flex items-center gap-2 px-5 py-2.5 text-12 font-semibold rounded-sm bg-accent hover:bg-accent-hover text-accent-contrast transition-colors shadow-sm"
                >
                  Explore My Tailored Pathways
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Live Profile Summary & Recommendation Card (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Top Match Preview Card */}
            <div className="rounded-md border border-accent bg-accent-subtle/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  Engine Top Recommendation
                </span>
                <span className="px-2 py-0.5 text-12 font-bold tabular-nums rounded-pill bg-accent text-accent-contrast">
                  {topPath?.fitScore}% Fit
                </span>
              </div>

              <div>
                <h4 className="font-serif text-16 font-semibold text-ink-primary">
                  {topPath?.title}
                </h4>
                <p className="text-12 text-ink-secondary mt-1 leading-relaxed">
                  {topPath?.suitabilityNarrative}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-accent-border/60 text-12 tabular-nums">
                <div>
                  <span className="text-[11px] text-ink-muted">Total Cost:</span>
                  <div className="font-semibold text-ink-primary">
                    {formatCurrency(topPath?.totalCostINR || 0, currency)}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-ink-muted">Break-even:</span>
                  <div className="font-semibold text-ink-primary">
                    {topPath?.breakEvenYears} Years
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoToPathways}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-12 font-semibold rounded-sm bg-accent hover:bg-accent-hover text-accent-contrast transition-colors"
              >
                <span>View Route on Pathway Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Snapshot List */}
            <div className="rounded-md border border-border bg-surface-base p-5 space-y-3">
              <h4 className="text-12 font-medium uppercase tracking-wider text-ink-muted">
                Profile Parameters
              </h4>

              <dl className="space-y-2 text-12">
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <dt className="text-ink-muted">Student:</dt>
                  <dd className="font-medium text-ink-primary">{profile.name}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <dt className="text-ink-muted">Board & Score:</dt>
                  <dd className="font-medium tabular-nums text-ink-primary">
                    {profile.board} · {profile.class10Percentage}%
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <dt className="text-ink-muted">Family Budget:</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatCurrency(profile.totalBudgetINR, currency)}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <dt className="text-ink-muted">Loan Appetite:</dt>
                  <dd className="font-medium capitalize text-ink-primary">
                    {profile.loanAppetite}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <dt className="text-ink-muted">Primary Goal:</dt>
                  <dd className="font-medium truncate max-w-[150px] text-ink-primary text-right" title={profile.familyGoal}>
                    {profile.familyGoal}
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-ink-muted">Mobility:</dt>
                  <dd className="font-medium text-ink-primary">
                    {profile.openToAbroad ? "Global / Abroad" : "Domestic"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Engine Trust Guarantee */}
            <div className="p-3.5 rounded-md border border-border bg-surface-subtle text-[11px] text-ink-secondary space-y-1">
              <div className="font-medium text-ink-primary flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Pure Deterministic Rules
              </div>
              <p>
                Fit scores update dynamically through mathematical normalization. No sponsorships, zero placement commissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
