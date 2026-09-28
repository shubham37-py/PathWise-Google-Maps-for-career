import { create } from "zustand";
import { StudentProfile, Pathway, WhatIfScenarioPreset, DecisionWeights, PathwayNode } from "@/types";
import { Currency } from "@/lib/utils";
import initialPathways from "@/data/pathways.json";
import { applyScenario } from "@/lib/engine";

export const DEFAULT_AARAV_PROFILE: StudentProfile = {
  name: "Aarav Kulkarni",
  age: 15,
  location: "Pune, Maharashtra",
  board: "CBSE",
  class10Percentage: 89.2,
  subjectStrengths: [
    { subject: "Biology & Life Sciences", score: 94 },
    { subject: "Mathematics", score: 91 },
    { subject: "Physics & Chemistry", score: 88 },
    { subject: "English & Communication", score: 86 },
    { subject: "Social Sciences", score: 87 },
  ],
  interests: [
    { category: "Investigative", score: 92, label: "Scientific Research & Diagnosis" },
    { category: "Realistic", score: 80, label: "Hands-on Engineering & Systems" },
    { category: "Conventional", score: 74, label: "Structured Methodologies" },
    { category: "Social", score: 68, label: "Patient Care & Mentorship" },
    { category: "Enterprising", score: 55, label: "Initiative & Leadership" },
    { category: "Artistic", score: 45, label: "Creative Expression" },
  ],
  familyGoal: "MBBS (Doctor of Medicine)",
  totalBudgetINR: 1000000, // ₹10 Lakh
  openToAbroad: true,
  loanAppetite: "moderate",
  riskTolerance: "medium",
  annualFamilyIncomeINR: 950000,
  targetCountries: ["India", "Georgia", "United Kingdom", "Canada", "Germany"],
  maxRelocationKm: 8000,
  oneSentenceSummary: "Curious 15-year-old with top biology and quantitative aptitude, balancing family MBBS dreams with technological research ambitions.",
};

export const DEFAULT_STUDENT_WEIGHTS: DecisionWeights = {
  cost: 20,
  admissionDifficulty: 40,
  timeToEarn: 30,
  careerCeiling: 85,
  roi: 70,
  risk: 35,
  fitWithInterests: 90,
};

export const DEFAULT_PARENT_WEIGHTS: DecisionWeights = {
  cost: 85,
  admissionDifficulty: 65,
  timeToEarn: 75,
  careerCeiling: 60,
  roi: 80,
  risk: 85,
  fitWithInterests: 50,
};

export type AppTab = "landing" | "profile" | "pathways" | "comparison" | "funding" | "whatif" | "decide";

interface AppState {
  theme: "light" | "dark";
  currency: Currency;
  currentTab: AppTab;
  profile: StudentProfile;
  pathways: Pathway[];
  selectedPathwayId: string;
  selectedNode: PathwayNode | null;
  isDrawerOpen: boolean;
  isAssumptionsOpen: boolean;
  isChatOpen: boolean;
  activeScenarioId: string | null;
  weights: DecisionWeights;
  weightPreset: "student" | "parent" | "custom";
  scenarioDeltas: {
    avgCostChangeINR: number;
    avgYearsToSalaryChange: number;
    avgAdmissionChanceChange: number;
    loanDependenceChangePercent: number;
  } | null;
  scenarioNarrative: string | null;

  // Actions
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setCurrency: (curr: Currency) => void;
  setCurrentTab: (tab: AppTab) => void;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  resetToAaravDemo: () => void;
  selectPathway: (id: string) => void;
  selectNode: (node: PathwayNode | null) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setIsAssumptionsOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setWeightPreset: (preset: "student" | "parent" | "custom") => void;
  updateWeights: (weights: Partial<DecisionWeights>) => void;
  runScenario: (preset: WhatIfScenarioPreset | null) => void;
  resetScenario: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: "light",
  currency: "INR",
  currentTab: "pathways",
  profile: DEFAULT_AARAV_PROFILE,
  pathways: initialPathways as Pathway[],
  selectedPathwayId: "pathway-mbbs-india",
  selectedNode: null,
  isDrawerOpen: false,
  isAssumptionsOpen: false,
  isChatOpen: false,
  activeScenarioId: null,
  weights: DEFAULT_STUDENT_WEIGHTS,
  weightPreset: "student",
  scenarioDeltas: null,
  scenarioNarrative: null,

  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
      }
      return { theme: nextTheme };
    }),

  setCurrency: (currency) => set({ currency }),
  setCurrentTab: (currentTab) => set({ currentTab }),

  updateProfile: (updatedFields) =>
    set((state) => ({
      profile: { ...state.profile, ...updatedFields },
    })),

  resetToAaravDemo: () =>
    set({
      profile: DEFAULT_AARAV_PROFILE,
      pathways: initialPathways as Pathway[],
      selectedPathwayId: "pathway-mbbs-india",
      selectedNode: null,
      isDrawerOpen: false,
      activeScenarioId: null,
      scenarioDeltas: null,
      scenarioNarrative: null,
      weights: DEFAULT_STUDENT_WEIGHTS,
      weightPreset: "student",
    }),

  selectPathway: (id) =>
    set((state) => {
      const p = state.pathways.find((item) => item.id === id);
      return {
        selectedPathwayId: id,
        selectedNode: p?.nodes[0] || null,
        isDrawerOpen: true,
      };
    }),

  selectNode: (node) =>
    set({
      selectedNode: node,
      isDrawerOpen: !!node,
    }),

  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  setIsAssumptionsOpen: (isAssumptionsOpen) => set({ isAssumptionsOpen }),
  setIsChatOpen: (isChatOpen) => set({ isChatOpen }),

  setWeightPreset: (preset) =>
    set({
      weightPreset: preset,
      weights:
        preset === "student"
          ? DEFAULT_STUDENT_WEIGHTS
          : preset === "parent"
          ? DEFAULT_PARENT_WEIGHTS
          : get().weights,
    }),

  updateWeights: (newWeights) =>
    set((state) => ({
      weights: { ...state.weights, ...newWeights },
      weightPreset: "custom",
    })),

  runScenario: (preset) => {
    if (!preset) {
      get().resetScenario();
      return;
    }
    const currentBase = initialPathways as Pathway[];
    const result = applyScenario(DEFAULT_AARAV_PROFILE, currentBase, preset);

    set({
      activeScenarioId: preset.id,
      pathways: result.modifiedPathways,
      scenarioDeltas: result.deltas,
      scenarioNarrative: result.summaryNarrative,
    });
  },

  resetScenario: () =>
    set({
      activeScenarioId: null,
      pathways: initialPathways as Pathway[],
      scenarioDeltas: null,
      scenarioNarrative: null,
    }),
}));
