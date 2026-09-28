"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import institutionsData from "@/data/institutions.json";
import { Institution } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  ExternalLink,
  ShieldCheck,
  Check,
  Filter,
  Calendar,
  Sparkles,
  Search,
} from "lucide-react";

export const InstitutionComparison: React.FC = () => {
  const { currency, setCurrentTab, selectPathway } = useAppStore();
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const institutions = institutionsData as Institution[];

  const filtered = institutions.filter((inst) => {
    const matchesFilter =
      filterType === "All" ||
      (filterType === "India Govt" && inst.country === "India" && inst.type === "Government") ||
      (filterType === "India Private" && inst.country === "India" && inst.type === "Private") ||
      (filterType === "International" && inst.country !== "India");

    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.examAccepted.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 bg-bg-app py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-content space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-12 font-medium text-accent uppercase tracking-wider mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Verified College Benchmarks
            </div>
            <h1 className="font-serif text-32 text-ink-primary font-semibold">
              Institution Comparison Matrix
            </h1>
            <p className="text-14 text-ink-secondary mt-1 max-w-prose">
              Detailed breakdown of tuition, real living expenses, admission entrance filters, and formal regulatory recognitions across India and global destinations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-12 text-ink-muted tabular-nums">
              Showing {filtered.length} of {institutions.length} Institutions
            </span>
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {["All", "India Govt", "India Private", "International"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1.5 text-12 font-medium rounded-pill border transition-colors whitespace-nowrap ${
                  filterType === filter
                    ? "bg-accent text-accent-contrast border-accent"
                    : "bg-surface-base border-border text-ink-secondary hover:border-border-strong hover:bg-surface-subtle"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by college or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-12 rounded-sm border border-border bg-surface-base focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Sticky Header Comparison Table */}
        <div className="rounded-md border border-border bg-surface-base overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[640px]">
            <table className="w-full text-left text-12 border-collapse">
              <thead className="sticky top-0 z-10 bg-surface-subtle border-b border-border text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
                <tr>
                  <th className="py-3.5 px-4 min-w-[200px]">Institution & Location</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Type</th>
                  <th className="py-3.5 px-4 min-w-[140px] text-right">Tuition / Year</th>
                  <th className="py-3.5 px-4 min-w-[150px] text-right">Total Program Cost</th>
                  <th className="py-3.5 px-4 min-w-[100px]">Duration</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Admission Filter & Cutoff</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Accreditation / Recognition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((inst) => {
                  const isUltraLowCost = inst.totalProgramCostINR < 1000000;
                  const isHighCost = inst.totalProgramCostINR > 10000000;

                  return (
                    <tr
                      key={inst.id}
                      className="hover:bg-surface-subtle/60 transition-colors"
                    >
                      {/* Name & City */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-14 text-ink-primary">
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-ink-muted mt-0.5">
                          {inst.city}, {inst.country}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-pill border ${
                            inst.type === "Government"
                              ? "bg-semantic-green-surface text-semantic-green-text border-semantic-green-border"
                              : inst.type === "Private"
                              ? "bg-surface-subtle text-ink-secondary border-border"
                              : "bg-accent-subtle text-accent border-accent-border"
                          }`}
                        >
                          {inst.type}
                        </span>
                      </td>

                      {/* Tuition per Year */}
                      <td className="py-3 px-4 text-right tabular-nums font-medium text-ink-primary">
                        {formatCurrency(inst.tuitionPerYearINR, currency)}
                        <span className="text-[10px] text-ink-muted block font-normal">
                          +{formatCurrency(inst.livingCostPerYearINR, currency)} living
                        </span>
                      </td>

                      {/* Total Program Cost */}
                      <td className="py-3 px-4 text-right tabular-nums">
                        <span
                          className={`font-bold text-14 ${
                            isUltraLowCost
                              ? "text-semantic-green-text"
                              : isHighCost
                              ? "text-semantic-amber-text"
                              : "text-ink-primary"
                          }`}
                        >
                          {formatCurrency(inst.totalProgramCostINR, currency)}
                        </span>
                        <span className="text-[10px] text-ink-muted block">
                          all-inclusive
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-4 tabular-nums text-ink-secondary">
                        {inst.durationYears} Years
                      </td>

                      {/* Admission Requirements & Cutoff */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-ink-primary text-12">
                          {inst.examAccepted}
                        </div>
                        <div className="text-[11px] text-accent mt-0.5">
                          {inst.neetCutoffOrPercentile}
                        </div>
                        <div className="text-[11px] text-ink-muted truncate max-w-[200px]" title={inst.admissionRequirements}>
                          {inst.admissionRequirements}
                        </div>
                      </td>

                      {/* Recognitions */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {inst.recognition.map((rec, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 text-[10px] rounded-sm bg-surface-subtle border border-border text-ink-secondary"
                            >
                              {rec}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-ink-muted mt-1.5 flex items-center justify-between">
                          <span>{inst.confidence} Confidence</span>
                          <span>Verified {inst.lastVerified}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
