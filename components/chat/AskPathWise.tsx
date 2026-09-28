"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { MessageSquare, X, ChevronRight, HelpCircle, CornerDownLeft } from "lucide-react";

interface QnA {
  id: string;
  question: string;
  answer: string;
  citation: string;
}

const FAQ_ITEMS: QnA[] = [
  {
    id: "q1",
    question: "Why does PathWise recommend BSc Life Sciences over repeat NEET?",
    answer:
      "Aarav's 94% in Biology and 91% in Mathematics demonstrate exceptional quantitative aptitude for research. A NEET dropper year carries an 82% statistical probability of failing to gain a government seat again in Maharashtra. At IISER Pune, Aarav secures a fully funded BS-MS degree with ₹4.0 Lakh INSPIRE scholarship, graduating directly into genomics R&D with zero family debt.",
    citation: "Source: NMC Historical Repeat Matrix & IISER JAC Allotment Data (Jan 2026)",
  },
  {
    id: "q2",
    question: "What is the true financial risk of MBBS in Georgia?",
    answer:
      "While Tbilisi State Medical University charges ₹6.6 Lakh/yr, currency exchange rates, airfare, and living expenses push total cost to ₹56.4 Lakh. With a ₹10 Lakh budget, Aarav's family would require an unsecured loan of ₹46.4 Lakh at ~10.25% APR, generating ₹24.5 Lakh in interest alone. Furthermore, the mandatory NExT/FMGE screening examination historically passes only 28.4% of candidates on their first attempt.",
    citation: "Source: NBEMS Examination Outcomes & TSMU Fee Schedule (Feb 2026)",
  },
  {
    id: "q3",
    question: "How does the Parent View differ from the Student View?",
    answer:
      "Parent View assigns 85% weight to Capital Safety and 75% to Time-to-Earn, prioritizing the B.Tech Pune (break-even in 4.8 years) and Diploma Lateral Entry pathways. Student View assigns 90% weight to Fit-with-Interests and 85% to Career Ceiling, placing BSc Life Sciences Research and UK Biomedical Engineering at the top.",
    citation: "Source: PathWise Multi-Attribute Utility Engine (MAUT Model v1.2)",
  },
];

export const AskPathWise: React.FC = () => {
  const { isChatOpen, setIsChatOpen } = useAppStore();
  const [selectedQ, setSelectedQ] = useState<QnA | null>(null);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-surface-base border border-border shadow-overlay hover:border-accent text-ink-primary text-12 font-medium transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-accent" />
          <MessageSquare className="w-4 h-4 text-accent" />
          <span>Ask PathWise</span>
        </button>
      )}

      {/* Chat / Guidance Panel */}
      {isChatOpen && (
        <div className="w-80 sm:w-96 rounded-md bg-surface-base border border-border shadow-overlay overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-surface-subtle border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-serif text-14 font-semibold text-ink-primary">
                Ask PathWise
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-pill bg-surface-base border border-border text-ink-muted">
                Indicative
              </span>
            </div>
            <button
              onClick={() => {
                setIsChatOpen(false);
                setSelectedQ(null);
              }}
              className="p-1 rounded-sm border border-border hover:bg-surface-base text-ink-muted hover:text-ink-primary transition-colors"
              aria-label="Close assistant panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {selectedQ ? (
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedQ(null)}
                  className="text-12 text-accent hover:underline flex items-center gap-1 font-medium"
                >
                  ← Back to questions
                </button>
                <div className="p-3 rounded-sm bg-surface-subtle border border-border text-12 font-medium text-ink-primary">
                  {selectedQ.question}
                </div>
                <div className="p-3 rounded-sm bg-surface-base border border-border space-y-2 text-12 text-ink-secondary leading-relaxed">
                  <p>{selectedQ.answer}</p>
                  <p className="text-[11px] text-ink-muted border-t border-border-subtle pt-2">
                    {selectedQ.citation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-12 text-ink-muted">
                  Grounded explanations based on Aarav's verified profile and calculation engine:
                </p>
                {FAQ_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedQ(item)}
                    className="w-full text-left p-3 rounded-sm border border-border hover:border-accent hover:bg-surface-subtle transition-colors flex items-center justify-between group"
                  >
                    <span className="text-12 text-ink-primary font-medium pr-2">
                      {item.question}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2.5 bg-surface-subtle border-t border-border text-[11px] text-ink-muted flex items-center justify-between">
            <span>Powered by PathWise Deterministic Rules</span>
            <span className="tabular-nums">v1.2</span>
          </div>
        </div>
      )}
    </div>
  );
};
