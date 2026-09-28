import { Currency } from "@/lib/utils";

export type Board = "CBSE" | "ICSE" | "State Board" | "IB" | "Cambridge";
export type LoanAppetite = "none" | "low" | "moderate" | "high";
export type RiskTolerance = "low" | "medium" | "high";
export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface StudentProfile {
  name: string;
  age: number;
  location: string;
  board: Board;
  class10Percentage: number;
  subjectStrengths: {
    subject: string;
    score: number; // 0-100
  }[];
  interests: {
    category: "Realistic" | "Investigative" | "Artistic" | "Social" | "Enterprising" | "Conventional";
    score: number; // 0-100
    label: string;
  }[];
  familyGoal: string;
  totalBudgetINR: number;
  openToAbroad: boolean;
  loanAppetite: LoanAppetite;
  riskTolerance: RiskTolerance;
  annualFamilyIncomeINR: number;
  targetCountries: string[];
  maxRelocationKm: number;
  oneSentenceSummary?: string;
}

export interface PathwayNode {
  id: string;
  stage: "class10" | "stream" | "entrance" | "degree" | "firstJob" | "career";
  stageLabel: string;
  title: string;
  institution?: string;
  durationYears: number;
  estimatedCostINR: number;
  admissionChanceRange: [number, number]; // [min%, max%]
  riskLevel: "low" | "medium" | "high";
  riskDescription: string;
  keyNumbers: {
    label: string;
    value: string;
    unit?: string;
    source: string;
    date: string;
  }[];
  whyItFits: string[];
  whatCouldGoWrong: string[];
  confidence: ConfidenceLevel;
  confidenceReason: string;
  source: string;
  lastVerified: string;
}

export interface Pathway {
  id: string;
  code: string;
  title: string;
  shortDesc: string;
  category: "medical" | "engineering" | "research" | "international" | "vocational";
  totalDurationYears: number;
  totalCostINR: number;
  yearsToFirstSalary: number;
  startingSalaryINR: number;
  careerCeilingINR: number; // 10-year projected
  overallAdmissionChance: [number, number];
  overallRisk: "low" | "medium" | "high";
  fitScore: number; // 0-100 calculated from student profile
  roiScore: number; // 0-100 calculated
  breakEvenYears: number;
  nodes: PathwayNode[];
  edges: { id: string; source: string; target: string }[];
  suitabilityNarrative: string;
  downsideScenario: string;
  planBAlternativeId: string;
}

export interface Institution {
  id: string;
  name: string;
  country: string;
  city: string;
  type: "Government" | "Private" | "International Public" | "International Private";
  tuitionPerYearINR: number;
  livingCostPerYearINR: number;
  totalProgramCostINR: number;
  durationYears: number;
  admissionRequirements: string;
  examAccepted: string;
  neetCutoffOrPercentile: string;
  recognition: string[];
  source: string;
  lastVerified: string;
  confidence: ConfidenceLevel;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amountINR: number;
  conditions: string;
  incomeLimitINR?: number;
  minClass10Score?: number;
  targetGender?: "all" | "female";
  deadline: string;
  status: "Potentially eligible" | "Eligible" | "Ineligible";
  eligibilityChecklist: {
    criterion: string;
    met: boolean;
  }[];
  source: string;
  lastVerified: string;
}

export interface Lender {
  id: string;
  name: string;
  type: "Public Sector Bank" | "Private NBFC" | "Specialized Edtech Lender";
  interestRateAnnual: number; // e.g. 8.5 for 8.5%
  processingFeePercent: number; // e.g. 0.5%
  processingFeeMaxINR?: number;
  collateralRequirement: "None" | "Required above ₹7.5L" | "Required above ₹4L" | "Mandatory";
  moratoriumPeriodMonths: number; // course duration + 6-12 months
  maxTenureYears: number;
  source: string;
  lastVerified: string;
  features: string[];
}

export interface Career {
  id: string;
  title: string;
  field: string;
  startingSalaryINR: number;
  midCareerSalaryINR: number;
  peakSalaryINR: number;
  timeToFirstSalaryYears: number;
  jobGrowthRatePercent: number;
  automationRisk: "Low" | "Moderate" | "High";
  typicalEmployers: string[];
  source: string;
  lastVerified: string;
}

export interface AssumptionItem {
  id: string;
  metric: string;
  value: string;
  rationale: string;
  confidence: ConfidenceLevel;
  source: string;
  lastVerified: string;
}

export interface WhatIfScenarioPreset {
  id: string;
  name: string;
  description: string;
  changes: {
    neetMbbsEliminated?: boolean;
    budgetMultiplier?: number; // e.g. 0.6 for 40% drop
    canRelocateAbroad?: boolean;
    canRelocateDomestic?: boolean;
    class10ScoreDelta?: number; // e.g. -15
  };
}

export interface DecisionWeights {
  cost: number;            // 0 - 100
  admissionDifficulty: number;
  timeToEarn: number;
  careerCeiling: number;
  roi: number;
  risk: number;
  fitWithInterests: number;
}
