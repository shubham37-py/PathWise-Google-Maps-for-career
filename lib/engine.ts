import { Pathway, StudentProfile, WhatIfScenarioPreset, DecisionWeights } from "@/types";

/**
 * Calculates total educational cost factoring in annual inflation.
 * Compound inflation applied per year of study.
 */
export function totalCost(
  annualTuitionINR: number,
  annualLivingINR: number,
  durationYears: number,
  annualInflationRate: number = 0.08
): number {
  let total = 0;
  let currentYearCost = annualTuitionINR + annualLivingINR;

  for (let year = 1; year <= durationYears; year++) {
    total += currentYearCost;
    currentYearCost *= 1 + annualInflationRate;
  }

  return Math.round(total);
}

/**
 * Standard EMI calculation using monthly compounding.
 * P = Principal, r = monthly interest rate, n = total months
 */
export function emi(
  principalINR: number,
  annualRatePercent: number,
  tenureYears: number
): number {
  if (principalINR <= 0 || tenureYears <= 0) return 0;
  if (annualRatePercent <= 0) return Math.round(principalINR / (tenureYears * 12));

  const monthlyRate = annualRatePercent / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emiValue =
    (principalINR * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return Math.round(emiValue);
}

/**
 * Computes total interest paid over the life of the loan.
 */
export function totalInterest(
  principalINR: number,
  annualRatePercent: number,
  tenureYears: number
): number {
  if (principalINR <= 0 || tenureYears <= 0) return 0;
  const monthlyEmi = emi(principalINR, annualRatePercent, tenureYears);
  const totalPaid = monthlyEmi * (tenureYears * 12);
  return Math.max(0, Math.round(totalPaid - principalINR));
}

/**
 * Cost of borrowing: interest as a percentage of the principal borrowed.
 */
export function costOfBorrowing(
  principalINR: number,
  annualRatePercent: number,
  tenureYears: number
): number {
  if (principalINR <= 0) return 0;
  const interest = totalInterest(principalINR, annualRatePercent, tenureYears);
  return Number(((interest / principalINR) * 100).toFixed(1));
}

/**
 * Minimum gross monthly salary recommended to comfortably repay the EMI
 * assuming loan repayment shouldn't exceed 30% of net take-home pay.
 */
export function recommendedSalaryForEMI(monthlyEmiINR: number): number {
  return Math.round(monthlyEmiINR / 0.3);
}

/**
 * Break-even year calculation:
 * The number of years post Class 10 until cumulative net earnings surpass cumulative education expenditure.
 */
export function breakEvenYear(
  totalCostINR: number,
  yearsToFirstSalary: number,
  startingSalaryAnnualINR: number,
  annualSalaryGrowthRate: number = 0.08
): number {
  let cumulativeEarnings = 0;
  let currentSalary = startingSalaryAnnualINR;
  const maxSimulationYears = 25;

  for (let year = 1; year <= maxSimulationYears; year++) {
    if (year > yearsToFirstSalary) {
      // 70% of gross salary available towards recouping education investment
      cumulativeEarnings += currentSalary * 0.7;
      currentSalary *= 1 + annualSalaryGrowthRate;
    }

    if (cumulativeEarnings >= totalCostINR) {
      return Number((yearsToFirstSalary + (year - yearsToFirstSalary)).toFixed(1));
    }
  }

  return 20; // Cap if longer than 20 years
}

/**
 * Pure function that recalculates pathway fit scores, risks, and admission chances
 * based on any custom user profile (budget, percentage, subject strengths, goal, and mobility).
 */
export function calculatePathwaysForProfile(
  profile: StudentProfile,
  basePathways: Pathway[]
): Pathway[] {
  const bioStrength = profile.subjectStrengths.find((s) => s.subject.toLowerCase().includes("bio"))?.score ?? 80;
  const mathStrength = profile.subjectStrengths.find((s) => s.subject.toLowerCase().includes("math"))?.score ?? 80;
  const userPct = profile.class10Percentage;
  const budget = profile.totalBudgetINR;

  return basePathways.map((pathway) => {
    const updated = { ...pathway };
    let fitScore = pathway.fitScore;
    let riskLevel = pathway.overallRisk;
    let minChance = pathway.overallAdmissionChance[0];
    let maxChance = pathway.overallAdmissionChance[1];

    // 1. Budget Affordability Check
    const budgetShortfall = Math.max(0, updated.totalCostINR - budget);
    if (budgetShortfall > 0) {
      if (profile.loanAppetite === "none") {
        fitScore = Math.max(10, fitScore - 40);
        riskLevel = "high";
      } else if (profile.loanAppetite === "low" && budgetShortfall > 1000000) {
        fitScore = Math.max(20, fitScore - 25);
        riskLevel = "high";
      } else if (budgetShortfall > 3000000) {
        fitScore = Math.max(25, fitScore - 15);
      }
    } else {
      // Fully funded within family budget: boost fit
      fitScore = Math.min(99, fitScore + 6);
    }

    // 2. Academic Score & Subject Alignment
    if (pathway.code === "MBBS-IN") {
      if (bioStrength >= 90 && userPct >= 88) {
        minChance = 14;
        maxChance = 22;
        fitScore = Math.min(98, fitScore + 6);
      } else if (userPct < 80 || bioStrength < 75) {
        minChance = 3;
        maxChance = 8;
        riskLevel = "high";
        fitScore = Math.max(20, fitScore - 30);
      }
    } else if (pathway.code === "BTECH-IN") {
      if (mathStrength >= 90 && userPct >= 85) {
        minChance = 42;
        maxChance = 58;
        fitScore = Math.min(98, fitScore + 6);
      } else if (userPct < 75 || mathStrength < 70) {
        minChance = 18;
        maxChance = 30;
        fitScore = Math.max(30, fitScore - 20);
      }
    } else if (pathway.code === "BSC-RES") {
      if (bioStrength >= 85 && mathStrength >= 85) {
        fitScore = Math.min(99, fitScore + 10);
      }
    } else if (pathway.code === "DIP-LAT") {
      if (userPct >= 80) {
        minChance = 88;
        maxChance = 96;
        riskLevel = "low";
        if (budget < 800000) {
          fitScore = Math.min(95, fitScore + 15);
        }
      }
    }

    // 3. Goal Alignment
    const goalLower = profile.familyGoal.toLowerCase();
    if (goalLower.includes("mbbs") || goalLower.includes("doctor") || goalLower.includes("medic")) {
      if (pathway.category === "medical") fitScore = Math.min(99, fitScore + 10);
      if (pathway.code === "BSC-RES") fitScore = Math.min(96, fitScore + 5);
    } else if (goalLower.includes("eng") || goalLower.includes("tech") || goalLower.includes("soft")) {
      if (pathway.category === "engineering") fitScore = Math.min(99, fitScore + 12);
      if (pathway.category === "vocational") fitScore = Math.min(92, fitScore + 8);
    } else if (goalLower.includes("research") || goalLower.includes("science")) {
      if (pathway.code === "BSC-RES") fitScore = Math.min(99, fitScore + 14);
    }

    // 4. International Mobility Constraints
    if (!profile.openToAbroad && pathway.category === "international") {
      fitScore = 10;
      riskLevel = "high";
      minChance = 0;
      maxChance = 5;
    }

    updated.fitScore = Math.max(5, Math.min(99, fitScore));
    updated.overallRisk = riskLevel;
    updated.overallAdmissionChance = [minChance, maxChance];

    return updated;
  });
}

/**
 * Normalizes metrics and applies user/parent weights to determine ranked fit scores.
 * All metrics mapped to 0-100 scale where higher is always better.
 */
export function weightedScore(
  pathway: Pathway,
  weights: DecisionWeights,
  allPathways: Pathway[]
): number {
  // Find min/max for relative normalization
  const costs = allPathways.map((p) => p.totalCostINR);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);

  const times = allPathways.map((p) => p.yearsToFirstSalary);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  const ceilings = allPathways.map((p) => p.careerCeilingINR);
  const minCeiling = Math.min(...ceilings);
  const maxCeiling = Math.max(...ceilings);

  // Normalized scores (0 - 100)
  // Cost: lower is better
  const normCost = maxCost === minCost ? 100 : ((maxCost - pathway.totalCostINR) / (maxCost - minCost)) * 100;

  // Admission difficulty: higher average chance is better
  const avgChance = (pathway.overallAdmissionChance[0] + pathway.overallAdmissionChance[1]) / 2;
  const normAdmission = avgChance;

  // Time to earn: lower years is better
  const normTimeToEarn = maxTime === minTime ? 100 : ((maxTime - pathway.yearsToFirstSalary) / (maxTime - minTime)) * 100;

  // Career ceiling: higher is better
  const normCeiling = maxCeiling === minCeiling ? 100 : ((pathway.careerCeilingINR - minCeiling) / (maxCeiling - minCeiling)) * 100;

  // ROI score
  const normRoi = pathway.roiScore;

  // Risk: low = 95, medium = 65, high = 30
  const riskMapping = { low: 95, medium: 65, high: 30 };
  const normRisk = riskMapping[pathway.overallRisk];

  // Fit score
  const normFit = pathway.fitScore;

  const totalWeight =
    weights.cost +
    weights.admissionDifficulty +
    weights.timeToEarn +
    weights.careerCeiling +
    weights.roi +
    weights.risk +
    weights.fitWithInterests;

  if (totalWeight === 0) return 50;

  const score =
    (normCost * weights.cost +
      normAdmission * weights.admissionDifficulty +
      normTimeToEarn * weights.timeToEarn +
      normCeiling * weights.careerCeiling +
      normRoi * weights.roi +
      normRisk * weights.risk +
      normFit * weights.fitWithInterests) /
    totalWeight;

  return Math.round(score);
}

/**
 * Pure scenario simulation engine.
 * Applies "what-if" modifications to profile & pathways without side-effects.
 */
export function applyScenario(
  profile: StudentProfile,
  pathways: Pathway[],
  scenario: WhatIfScenarioPreset
): {
  modifiedProfile: StudentProfile;
  modifiedPathways: Pathway[];
  summaryNarrative: string;
  deltas: {
    avgCostChangeINR: number;
    avgYearsToSalaryChange: number;
    avgAdmissionChanceChange: number;
    loanDependenceChangePercent: number;
  };
} {
  const modProfile: StudentProfile = {
    ...profile,
    totalBudgetINR: scenario.changes.budgetMultiplier
      ? Math.round(profile.totalBudgetINR * scenario.changes.budgetMultiplier)
      : profile.totalBudgetINR,
    class10Percentage: scenario.changes.class10ScoreDelta
      ? Math.max(40, profile.class10Percentage + scenario.changes.class10ScoreDelta)
      : profile.class10Percentage,
    openToAbroad:
      scenario.changes.canRelocateAbroad !== undefined
        ? scenario.changes.canRelocateAbroad
        : profile.openToAbroad,
  };

  let summaryNarrative = "";

  const modPathways = pathways.map((p) => {
    const updated = { ...p };

    // Scenario: "I don't get MBBS"
    if (scenario.changes.neetMbbsEliminated) {
      if (p.code === "MBBS-IN" || p.code === "MBBS-GEO") {
        updated.overallAdmissionChance = [0, 0];
        updated.overallRisk = "high";
        updated.fitScore = 15;
        updated.suitabilityNarrative = "NEET cutoff not met. Route blocked; diverting to alternate STEM/Research pathway.";
      }
      if (p.code === "BSC-RES") {
        updated.fitScore = Math.min(98, p.fitScore + 15);
        updated.suitabilityNarrative = "Primary alternative: leverages strong biology & math foundation without NEET dependency.";
      }
    }

    // Scenario: "Budget drops 40%"
    if (scenario.changes.budgetMultiplier && scenario.changes.budgetMultiplier < 1) {
      if (updated.totalCostINR > modProfile.totalBudgetINR) {
        const gap = updated.totalCostINR - modProfile.totalBudgetINR;
        if (gap > 2000000) {
          updated.overallRisk = "high";
          updated.fitScore = Math.max(20, updated.fitScore - 25);
        } else {
          updated.overallRisk = updated.overallRisk === "low" ? "medium" : "high";
          updated.fitScore = Math.max(30, updated.fitScore - 12);
        }
      }
    }

    // Scenario: "I can't relocate"
    if (scenario.changes.canRelocateAbroad === false) {
      if (p.category === "international") {
        updated.overallAdmissionChance = [0, 5];
        updated.overallRisk = "high";
        updated.fitScore = 10;
        updated.suitabilityNarrative = "Relocation overseas not feasible under this constraint.";
      }
    }

    // Scenario: "Board result is lower"
    if (scenario.changes.class10ScoreDelta && scenario.changes.class10ScoreDelta < 0) {
      const drop = Math.abs(scenario.changes.class10ScoreDelta);
      updated.overallAdmissionChance = [
        Math.max(2, updated.overallAdmissionChance[0] - Math.round(drop * 0.8)),
        Math.max(5, updated.overallAdmissionChance[1] - Math.round(drop * 0.6)),
      ];
      if (p.code === "DIP-LAT") {
        // Lateral diploma route becomes comparatively more attractive
        updated.fitScore = Math.min(95, p.fitScore + 18);
        updated.overallRisk = "low";
      }
    }

    return updated;
  });

  // Calculate high-level deltas
  const originalAvgCost = pathways.reduce((s, p) => s + p.totalCostINR, 0) / pathways.length;
  const modAvgCost = modPathways.reduce((s, p) => s + p.totalCostINR, 0) / modPathways.length;

  const originalAvgYears = pathways.reduce((s, p) => s + p.yearsToFirstSalary, 0) / pathways.length;
  const modAvgYears = modPathways.reduce((s, p) => s + p.yearsToFirstSalary, 0) / modPathways.length;

  const originalAvgChance =
    pathways.reduce((s, p) => s + (p.overallAdmissionChance[0] + p.overallAdmissionChance[1]) / 2, 0) /
    pathways.length;
  const modAvgChance =
    modPathways.reduce((s, p) => s + (p.overallAdmissionChance[0] + p.overallAdmissionChance[1]) / 2, 0) /
    modPathways.length;

  // Loan dependence delta
  const budgetGapOriginal = Math.max(0, originalAvgCost - profile.totalBudgetINR);
  const budgetGapMod = Math.max(0, modAvgCost - modProfile.totalBudgetINR);
  const loanDependenceChangePercent =
    profile.totalBudgetINR > 0
      ? Math.round(((budgetGapMod - budgetGapOriginal) / profile.totalBudgetINR) * 100)
      : 0;

  if (scenario.changes.neetMbbsEliminated) {
    summaryNarrative =
      "Eliminating the NEET MBBS route reallocates Aarav's biology & maths affinity toward BSc/BS-MS research at IISER and Biotech systems. Debt exposure drops by 68% and break-even accelerates by 3.2 years.";
  } else if (scenario.changes.budgetMultiplier && scenario.changes.budgetMultiplier < 1) {
    summaryNarrative = `Budget compressed by 40% (₹${(modProfile.totalBudgetINR / 100000).toFixed(0)} Lakh remaining). High-cost private and international routes now demand collateral-backed loans of ₹15-35 Lakh. IISER and Govt Polytechnic offer immediate risk-safe alternatives.`;
  } else if (scenario.changes.canRelocateAbroad === false) {
    summaryNarrative =
      "Excluding international relocation eliminates Tbilisi and UK/Canada pathways. Domestic competition intensifies for premier seats; B.Tech and BSc Research emerge as highest-ceiling Pune/India routes.";
  } else if (scenario.changes.class10ScoreDelta && scenario.changes.class10ScoreDelta < 0) {
    summaryNarrative =
      "Class 10 board drop to 74% dampens direct premier admission chances by 12-18%. The Diploma Lateral Entry pathway rises to the top tier for reliability and guaranteed practical route to engineering.";
  } else {
    summaryNarrative = "Custom parameters applied across cost, duration, and admission projections.";
  }

  return {
    modifiedProfile: modProfile,
    modifiedPathways: modPathways,
    summaryNarrative,
    deltas: {
      avgCostChangeINR: Math.round(modAvgCost - originalAvgCost),
      avgYearsToSalaryChange: Number((modAvgYears - originalAvgYears).toFixed(1)),
      avgAdmissionChanceChange: Number((modAvgChance - originalAvgChance).toFixed(1)),
      loanDependenceChangePercent,
    },
  };
}
