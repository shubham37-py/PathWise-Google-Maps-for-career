"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import scholarshipsData from "@/data/scholarships.json";
import loansData from "@/data/loans.json";
import { Scholarship, Lender } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { emi, totalInterest, costOfBorrowing, recommendedSalaryForEMI } from "@/lib/engine";
import {
  Banknote,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Building,
  Clock,
  Calendar,
  Percent,
  TrendingUp,
  FileCheck,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export const FundingAndLoans: React.FC = () => {
  const { profile, currency } = useAppStore();

  const [scholarships, setScholarships] = useState<Scholarship[]>(scholarshipsData as Scholarship[]);
  const [selectedLenderId, setSelectedLenderId] = useState<string>("sbi-scholar");
  const [loanPrincipalINR, setLoanPrincipalINR] = useState<number>(1500000); // ₹15 Lakh default
  const [loanTenureYears, setLoanTenureYears] = useState<number>(10);

  const lenders = loansData as Lender[];
  const selectedLender = lenders.find((l) => l.id === selectedLenderId) || lenders[0];

  // Engine calculations
  const monthlyEmi = emi(loanPrincipalINR, selectedLender.interestRateAnnual, loanTenureYears);
  const totalInt = totalInterest(loanPrincipalINR, selectedLender.interestRateAnnual, loanTenureYears);
  const borrowCostPct = costOfBorrowing(loanPrincipalINR, selectedLender.interestRateAnnual, loanTenureYears);
  const totalRepayment = loanPrincipalINR + totalInt;
  const comfortableMonthlySalary = recommendedSalaryForEMI(monthlyEmi);

  // Toggle checklist item
  const handleToggleCriterion = (scholarshipId: string, criterionIndex: number) => {
    setScholarships((prev) =>
      prev.map((s) => {
        if (s.id !== scholarshipId) return s;
        const updatedChecklist = [...s.eligibilityChecklist];
        updatedChecklist[criterionIndex] = {
          ...updatedChecklist[criterionIndex],
          met: !updatedChecklist[criterionIndex].met,
        };
        const allMet = updatedChecklist.every((c) => c.met);
        return {
          ...s,
          eligibilityChecklist: updatedChecklist,
          status: allMet ? "Eligible" : "Potentially eligible",
        };
      })
    );
  };

  // Chart data: Principal vs Interest across all 3 lenders
  const chartData = lenders.map((lender) => {
    const interest = totalInterest(loanPrincipalINR, lender.interestRateAnnual, loanTenureYears);
    return {
      name: lender.name.split("(")[0].trim(),
      Principal: loanPrincipalINR,
      Interest: interest,
      Total: loanPrincipalINR + interest,
    };
  });

  return (
    <div className="flex-1 bg-bg-app py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-content space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 text-12 font-medium text-accent uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Financing & Debt Architecture
          </div>
          <h1 className="font-serif text-32 text-ink-primary font-semibold">
            Scholarships & Loan Reality Check
          </h1>
          <p className="text-14 text-ink-secondary mt-1 max-w-prose">
            Evaluate non-repayable grants alongside true cost-of-borrowing projections. Avoid hidden processing fees, balloon payments, and excessive post-graduation EMI burdens.
          </p>
        </div>

        {/* 2-Column Split: Scholarships (Left) vs Loan Engine (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Scholarships & Grants (6 Columns) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-20 font-semibold text-ink-primary">
                  Scholarships & Merit Grants
                </h3>
                <p className="text-12 text-ink-muted">
                  Interactive checklist matched to Aarav's verified profile.
                </p>
              </div>
              <span className="text-12 text-ink-muted tabular-nums">
                {scholarships.length} Available
              </span>
            </div>

            <div className="space-y-3">
              {scholarships.map((sch) => {
                const isEligible = sch.status === "Eligible";
                const isPotential = sch.status === "Potentially eligible";
                return (
                  <div
                    key={sch.id}
                    className="p-4 rounded-md border border-border bg-surface-base space-y-3 hover:border-border-strong transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-ink-muted">{sch.provider}</span>
                        <h4 className="font-semibold text-14 text-ink-primary mt-0.5">
                          {sch.name}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-16 font-bold tabular-nums text-accent block">
                          {formatCurrency(sch.amountINR, currency)}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-pill border mt-1 ${
                            isEligible
                              ? "bg-semantic-green-surface text-semantic-green-text border-semantic-green-border"
                              : isPotential
                              ? "bg-semantic-amber-surface text-semantic-amber-text border-semantic-amber-border"
                              : "bg-surface-subtle text-ink-muted border-border"
                          }`}
                        >
                          {sch.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-12 text-ink-secondary leading-relaxed">
                      {sch.conditions}
                    </p>

                    {/* Interactive Checklist */}
                    <div className="pt-2 border-t border-border-subtle space-y-1.5">
                      <span className="text-[11px] uppercase tracking-wider text-ink-muted font-medium block">
                        Eligibility Criteria (Click to verify):
                      </span>
                      {sch.eligibilityChecklist.map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleCriterion(sch.id, idx)}
                          className="w-full text-left flex items-center gap-2 text-12 text-ink-secondary hover:text-ink-primary transition-colors py-0.5 group"
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                              c.met
                                ? "bg-accent border-accent text-accent-contrast"
                                : "border-border group-hover:border-accent"
                            }`}
                          >
                            {c.met && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </span>
                          <span className={c.met ? "text-ink-primary" : "text-ink-muted line-through"}>
                            {c.criterion}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-ink-muted">
                      <span>Deadline: {sch.deadline}</span>
                      <span>Verified: {sch.lastVerified}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Lender Comparison & Live Loan Calculator (6 Columns) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h3 className="font-serif text-20 font-semibold text-ink-primary">
                Education Loan Reality Calculator
              </h3>
              <p className="text-12 text-ink-muted">
                Compare actual lenders on interest rate, collateral & moratorium periods.
              </p>
            </div>

            {/* Lender Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {lenders.map((lender) => {
                const isSelected = selectedLenderId === lender.id;
                return (
                  <button
                    key={lender.id}
                    onClick={() => setSelectedLenderId(lender.id)}
                    className={`p-3 text-left rounded-md border transition-all ${
                      isSelected
                        ? "bg-surface-base border-accent ring-1 ring-accent/20 shadow-sm"
                        : "bg-surface-base border-border hover:border-border-strong"
                    }`}
                  >
                    <div className="text-12 font-semibold text-ink-primary truncate">
                      {lender.name.split("(")[0]}
                    </div>
                    <div className="text-16 font-bold tabular-nums text-accent mt-1">
                      {lender.interestRateAnnual.toFixed(2)}% APR
                    </div>
                    <div className="text-[11px] text-ink-muted mt-1">
                      {lender.collateralRequirement}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Sliders Container */}
            <div className="rounded-md border border-border bg-surface-base p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-semibold text-14 text-ink-primary">
                  {selectedLender.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-pill bg-surface-subtle border border-border text-ink-secondary">
                  {selectedLender.type}
                </span>
              </div>

              {/* Loan Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-12">
                  <span className="font-medium text-ink-secondary">Loan Amount Needed:</span>
                  <span className="font-semibold tabular-nums text-accent text-16">
                    {formatCurrency(loanPrincipalINR, currency, false)}
                  </span>
                </div>
                <input
                  type="range"
                  min={200000}
                  max={6000000}
                  step={100000}
                  value={loanPrincipalINR}
                  onChange={(e) => setLoanPrincipalINR(Number(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-ink-muted tabular-nums">
                  <span>₹2 Lakh</span>
                  <span>₹15 Lakh</span>
                  <span>₹30 Lakh</span>
                  <span>₹60 Lakh</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-12">
                  <span className="font-medium text-ink-secondary">Repayment Tenure:</span>
                  <span className="font-semibold tabular-nums text-accent text-16">
                    {loanTenureYears} Years ({loanTenureYears * 12} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={selectedLender.maxTenureYears}
                  step={1}
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-ink-muted tabular-nums">
                  <span>3 Years</span>
                  <span>7 Years</span>
                  <span>10 Years</span>
                  <span>{selectedLender.maxTenureYears} Years (Max)</span>
                </div>
              </div>

              {/* Repayment Breakdown Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-border text-12 tabular-nums">
                <div className="p-3 rounded-sm border border-border bg-surface-subtle">
                  <span className="text-ink-muted block text-[11px]">Monthly EMI:</span>
                  <div className="font-bold text-ink-primary text-18 mt-0.5">
                    {formatCurrency(monthlyEmi, currency)}/mo
                  </div>
                </div>

                <div className="p-3 rounded-sm border border-border bg-surface-subtle">
                  <span className="text-ink-muted block text-[11px]">Total Interest:</span>
                  <div className="font-bold text-semantic-amber-text text-18 mt-0.5">
                    {formatCurrency(totalInt, currency)}
                  </div>
                </div>

                <div className="p-3 rounded-sm border border-border bg-surface-subtle">
                  <span className="text-ink-muted block text-[11px]">Cost of Borrowing:</span>
                  <div className="font-bold text-semantic-red-text text-18 mt-0.5">
                    {borrowCostPct}%
                  </div>
                </div>
              </div>

              {/* Comfortable Salary Indicator */}
              <div className="p-4 rounded-sm border border-border bg-surface-subtle space-y-1.5 text-12">
                <div className="flex items-center gap-1.5 font-medium text-ink-primary">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span>Salary Needed to Repay Comfortably</span>
                </div>
                <p className="text-ink-secondary text-12 leading-relaxed">
                  To keep loan repayments under the recommended safe threshold of <strong>30% of take-home pay</strong>, the graduate should target an initial gross monthly salary of at least:
                </p>
                <div className="text-20 font-bold tabular-nums text-accent pt-1">
                  {formatCurrency(comfortableMonthlySalary, currency)} / month
                </div>
                <span className="text-[11px] text-ink-muted block">
                  (~{formatCurrency(comfortableMonthlySalary * 12, currency)} annual CTC)
                </span>
              </div>

              {/* Lender Features Pill List */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] uppercase tracking-wider text-ink-muted font-medium block">
                  Key Terms & Policy Safeguards:
                </span>
                <ul className="space-y-1 text-12 text-ink-secondary">
                  {selectedLender.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
                    <span>Moratorium Period: {selectedLender.moratoriumPeriodMonths} Months (Course + Buffer)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Principal vs Interest Comparison Chart */}
            <div className="rounded-md border border-border bg-surface-base p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-16 font-semibold text-ink-primary">
                  Lender Comparison: Principal vs Total Interest
                </h4>
                <span className="text-[11px] text-ink-muted">
                  For {formatCurrency(loanPrincipalINR, currency)} over {loanTenureYears} Years
                </span>
              </div>

              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--ink-muted)" fontSize={11} />
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
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="Principal" stackId="a" fill="var(--accent-base)" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Interest" stackId="a" fill="#D97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
