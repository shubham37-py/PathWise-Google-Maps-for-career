"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { PathwayNode } from "@/types";
import { formatCurrency, Currency } from "@/lib/utils";
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, Building } from "lucide-react";

interface CustomNodeProps {
  data: {
    node: PathwayNode;
    isSelectedPathway: boolean;
    isActiveNode: boolean;
    isDimmed: boolean;
    currency: Currency;
    onSelectNode: (node: PathwayNode) => void;
  };
}

export const CustomPathwayNode: React.FC<CustomNodeProps> = ({ data }) => {
  const { node, isSelectedPathway, isActiveNode, isDimmed, currency, onSelectNode } = data;

  const minChance = node.admissionChanceRange[0];
  const maxChance = node.admissionChanceRange[1];

  // Risk color mapping
  const riskBorderColor =
    node.riskLevel === "low"
      ? "bg-semantic-green-solid"
      : node.riskLevel === "medium"
      ? "bg-semantic-amber-solid"
      : "bg-semantic-red-solid";

  return (
    <div
      onClick={() => onSelectNode(node)}
      className={`w-64 cursor-pointer rounded-md bg-surface-base p-3.5 transition-all text-left select-none relative ${
        isActiveNode
          ? "border-2 border-accent ring-1 ring-accent/20 shadow-overlay"
          : isSelectedPathway
          ? "border border-accent"
          : "border border-border hover:border-border-strong"
      } ${isDimmed ? "opacity-35 hover:opacity-80" : "opacity-100"}`}
    >
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className={`!w-2 !h-2 !border-2 !border-surface-base ${
          isSelectedPathway ? "!bg-accent" : "!bg-border-strong"
        }`}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`!w-2 !h-2 !border-2 !border-surface-base ${
          isSelectedPathway ? "!bg-accent" : "!bg-border-strong"
        }`}
      />

      {/* Stage Badge & Risk Dot */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="text-[10px] font-medium tracking-wider uppercase text-ink-muted">
          {node.stageLabel}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${riskBorderColor}`}
            title={`Risk: ${node.riskLevel}`}
          />
          <span className="text-[10px] capitalize text-ink-muted">
            {node.riskLevel}
          </span>
        </div>
      </div>

      {/* Node Title */}
      <div className="font-medium text-14 text-ink-primary leading-snug line-clamp-2">
        {node.title}
      </div>

      {/* Institution / Subtitle */}
      {node.institution && (
        <div className="text-12 text-ink-muted truncate mt-0.5 flex items-center gap-1">
          <Building className="w-3 h-3 text-ink-faint shrink-0" />
          <span className="truncate">{node.institution}</span>
        </div>
      )}

      {/* Metrics Row: Duration and Cost */}
      <div className="mt-2.5 pt-2 border-t border-border-subtle flex items-center justify-between text-12">
        <div className="flex items-center gap-1 text-ink-muted">
          <Clock className="w-3 h-3 text-ink-faint" />
          <span className="tabular-nums">
            {node.durationYears > 0 ? `${node.durationYears} Yrs` : "Baseline"}
          </span>
        </div>
        <div className="font-semibold tabular-nums text-ink-primary">
          {node.estimatedCostINR > 0
            ? formatCurrency(node.estimatedCostINR, currency)
            : "No Fee"}
        </div>
      </div>

      {/* Admission Probability Bar */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1">
          <span>Admission chance</span>
          <span className="font-medium tabular-nums text-ink-secondary">
            {minChance === maxChance ? `${minChance}%` : `${minChance}–${maxChance}%`}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-subtle overflow-hidden border border-border-subtle">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isSelectedPathway ? "bg-accent" : "bg-ink-muted"
            }`}
            style={{ width: `${Math.min(100, Math.max(10, maxChance))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
