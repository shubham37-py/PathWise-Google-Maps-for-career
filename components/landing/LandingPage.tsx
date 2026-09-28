"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { ArrowRight, UserCheck, Check, X, Shield, Clock, Sliders } from "lucide-react";
import { PathwayMap } from "@/components/pathway/PathwayMap";

export const LandingPage: React.FC = () => {
  const { setCurrentTab, resetToAaravDemo } = useAppStore();

  const handleOpenAaravDemo = () => {
    resetToAaravDemo();
    setCurrentTab("pathways");
  };

  const handleBuildProfile = () => {
    setCurrentTab("profile");
  };

  return (
    <div className="flex-1 bg-bg-app">
      {/* 1. Asymmetric Left-Aligned Split Hero */}
      <section className="border-b border-border py-12 md:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-content grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Serif Headline & Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-pill bg-surface-base border border-border text-12 text-ink-secondary">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Career Path Simulator: From Class 10 to Career</span>
            </div>

            <h1 className="font-serif text-32 sm:text-48 text-ink-primary font-semibold tracking-tight leading-[1.12]">
              A career is a route with branches, costs and probabilities, not a destination.
            </h1>

            <p className="text-16 text-ink-secondary leading-relaxed max-w-prose">
              PathWise models multi-year pathways from Class 10 to careers across India and abroad, projects true compound costs including loan interest, and lets you stress-test outcomes with what-if scenarios before you commit.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={handleOpenAaravDemo}
                className="flex items-center justify-center gap-2 px-5 py-3 text-14 font-semibold rounded-sm bg-accent hover:bg-accent-hover text-accent-contrast transition-colors shadow-sm"
              >
                <span>Open Aarav's demo (15, Pune)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleBuildProfile}
                className="flex items-center justify-center gap-2 px-5 py-3 text-14 font-medium rounded-sm border border-border bg-surface-base hover:bg-surface-subtle text-ink-primary transition-colors"
              >
                <span>Build my profile</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-4 text-12 text-ink-muted">
              <span>✓ Pre-loaded with CBSE 89.2% student</span>
              <span>·</span>
              <span>✓ Verified fees & cutoffs</span>
              <span>·</span>
              <span>✓ Zero sponsored ads</span>
            </div>
          </div>

          {/* Right Column: Real, Cropped, Working Preview of the Pathway Map */}
          <div className="lg:col-span-6 rounded-md border border-border bg-surface-base overflow-hidden shadow-sm h-[440px] flex flex-col relative group">
            <div className="px-3.5 py-2.5 bg-surface-subtle border-b border-border flex items-center justify-between text-12">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-medium text-ink-primary">Live Pathway Engine</span>
              </div>
              <span className="text-[11px] text-ink-muted">Interactive graph preview</span>
            </div>
            <div className="flex-1 w-full h-full relative">
              <PathwayMap compact={true} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. "How It Works" Horizontal Timeline (Not Icon Cards) */}
      <section className="py-16 px-4 sm:px-6 border-b border-border bg-surface-base">
        <div className="mx-auto max-w-content space-y-8">
          <div>
            <span className="text-12 uppercase tracking-wider text-accent font-semibold">
              The Decision Framework
            </span>
            <h2 className="font-serif text-24 sm:text-32 text-ink-primary font-semibold mt-1">
              How PathWise guides your journey
            </h2>
          </div>

          {/* 3 Numbered Steps as a Horizontal Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-3 pl-4 border-l-2 border-accent relative">
              <span className="text-12 font-mono text-accent font-bold">01 / BASELINE</span>
              <h3 className="text-16 font-semibold text-ink-primary">
                Profile & Budget Reality
              </h3>
              <p className="text-14 text-ink-secondary leading-relaxed">
                Enter your Class 10 board marks, STEM strengths, family budget ceiling, and relocation willingness without sales pressure.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 pl-4 border-l-2 border-border relative">
              <span className="text-12 font-mono text-ink-muted font-bold">02 / SIMULATION</span>
              <h3 className="text-16 font-semibold text-ink-primary">
                Multi-Stage Pathway Graph
              </h3>
              <p className="text-14 text-ink-secondary leading-relaxed">
                Explore 6 branching routes from Class 10 to a career. See actual degree fees, loan interest loads, and realistic admission acceptance ranges.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 pl-4 border-l-2 border-border relative">
              <span className="text-12 font-mono text-ink-muted font-bold">03 / STRESS TEST</span>
              <h3 className="text-16 font-semibold text-ink-primary">
                What-If Scenarios & Matrix
              </h3>
              <p className="text-14 text-ink-secondary leading-relaxed">
                Test sudden surprises: "What if I miss NEET?", "Budget drops 40%". Finish with a weighted matrix balancing student and parent perspectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "What We Do Differently" Comparison Table */}
      <section className="py-16 px-4 sm:px-6 border-b border-border">
        <div className="mx-auto max-w-content space-y-8">
          <div>
            <span className="text-12 uppercase tracking-wider text-ink-muted font-medium">
              Institutional Standard
            </span>
            <h2 className="font-serif text-24 sm:text-32 text-ink-primary font-semibold mt-1">
              What we do differently
            </h2>
            <p className="text-14 text-ink-muted mt-1 max-w-prose">
              Most college portals sell student leads to private universities. PathWise operates on transparent mathematical verification.
            </p>
          </div>

          <div className="rounded-md border border-border bg-surface-base overflow-x-auto">
            <table className="w-full text-left text-12">
              <thead className="bg-surface-subtle border-b border-border text-[11px] uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="py-3 px-4 font-semibold">Evaluation Dimension</th>
                  <th className="py-3 px-4 font-semibold text-ink-muted">Typical College Finder</th>
                  <th className="py-3 px-4 font-semibold text-accent">PathWise Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                <tr>
                  <td className="py-3 px-4 font-medium text-ink-primary">Business Model</td>
                  <td className="py-3 px-4 text-ink-secondary">Commissions on enrollments and sponsored ranks</td>
                  <td className="py-3 px-4 font-medium text-accent">Independent decision support; zero commissions</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-ink-primary">Cost Projection</td>
                  <td className="py-3 px-4 text-ink-secondary">Year-1 sticker tuition only; ignores living & inflation</td>
                  <td className="py-3 px-4 font-medium text-accent">Total multi-year cost + 8% annual inflation + loan interest</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-ink-primary">Risk Disclosure</td>
                  <td className="py-3 px-4 text-ink-secondary">Unrealistic 100% placement guarantees</td>
                  <td className="py-3 px-4 font-medium text-accent">Explicit downside risks, FMGE pass rates, and bonds</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-ink-primary">Downside Testing</td>
                  <td className="py-3 px-4 text-ink-secondary">Static list of institutions; no contingency plans</td>
                  <td className="py-3 px-4 font-medium text-accent">Live "What-If" simulator for budget cuts & missed cutoffs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-ink-primary">Family Alignment</td>
                  <td className="py-3 px-4 text-ink-secondary">One-size-fits-all single verdict</td>
                  <td className="py-3 px-4 font-medium text-accent">Dual Student View vs Parent View weighted decision matrix</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Plain Footer */}
      <footer className="py-10 px-4 sm:px-6 bg-surface-subtle text-ink-secondary border-t border-border">
        <div className="mx-auto max-w-content flex flex-col sm:flex-row items-center justify-between gap-4 text-12">
          <div>
            <span className="font-semibold text-ink-primary">PathWise</span> · Career Path Simulator: From Class 10 to Career
          </div>
          <div className="text-ink-muted">
            No commissions. No sponsored rankings. Grounded in deterministic rules.
          </div>
        </div>
      </footer>
    </div>
  );
};
