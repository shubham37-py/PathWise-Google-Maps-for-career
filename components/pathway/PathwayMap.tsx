"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useAppStore } from "@/lib/store";
import { Pathway, PathwayNode } from "@/types";
import { CustomPathwayNode } from "./CustomNode";
import { PathwayDrawer } from "./PathwayDrawer";
import { formatCurrency } from "@/lib/utils";
import { Layers, Sparkles, Filter, Check, Info, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const nodeTypes = {
  pathwayNode: CustomPathwayNode,
};

// Stage X positions for consistent visual columns
const STAGE_X_COORDS: Record<string, number> = {
  class10: 40,
  stream: 380,
  entrance: 720,
  degree: 1060,
  firstJob: 1400,
  career: 1740,
};

const PATHWAY_Y_COORDS: Record<string, number> = {
  "pathway-mbbs-india": 40,
  "pathway-btech-india": 220,
  "pathway-mbbs-georgia": 400,
  "pathway-bsc-research": 580,
  "pathway-uk-canada-undergrad": 760,
  "pathway-diploma-lateral": 940,
};

export const PathwayMap: React.FC = () => {
  const {
    pathways,
    selectedPathwayId,
    selectPathway,
    selectedNode,
    selectNode,
    currency,
    isDrawerOpen,
    setIsDrawerOpen,
    theme,
  } = useAppStore();

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectNode = useCallback(
    (node: PathwayNode) => {
      // Find which pathway contains this node
      const parentPathway = pathways.find((p) => p.nodes.some((n) => n.id === node.id));
      if (parentPathway && parentPathway.id !== selectedPathwayId) {
        selectPathway(parentPathway.id);
      }
      selectNode(node);
    },
    [pathways, selectedPathwayId, selectPathway, selectNode]
  );

  // Generate nodes across all 6 pathways
  const flowNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];

    pathways.forEach((pathway) => {
      const isSelectedPathway = pathway.id === selectedPathwayId;
      const isDimmed = !isSelectedPathway;
      const baseY = PATHWAY_Y_COORDS[pathway.id] ?? 200;

      pathway.nodes.forEach((node) => {
        const x = STAGE_X_COORDS[node.stage] ?? 40;
        // Centralized single Class 10 origin branching into 6 routes
        const y = node.stage === "class10" ? 490 : baseY;

        // Prevent duplicate Class 10 node rendering by only registering once or prefixing
        const uniqueNodeId = node.stage === "class10" ? "shared-class10-baseline" : node.id;
        
        // Don't add shared node multiple times
        if (node.stage === "class10" && nodes.some((n) => n.id === "shared-class10-baseline")) {
          return;
        }

        const isActiveNode = selectedNode?.id === node.id;

        nodes.push({
          id: uniqueNodeId,
          type: "pathwayNode",
          position: { x, y },
          data: {
            node,
            isSelectedPathway: node.stage === "class10" ? true : isSelectedPathway,
            isActiveNode,
            isDimmed: node.stage === "class10" ? false : isDimmed,
            currency,
            onSelectNode: handleSelectNode,
          },
        });
      });
    });

    return nodes;
  }, [pathways, selectedPathwayId, selectedNode, currency, handleSelectNode]);

  // Generate edges connecting nodes
  const flowEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    pathways.forEach((pathway) => {
      const isSelected = pathway.id === selectedPathwayId;

      for (let i = 0; i < pathway.nodes.length - 1; i++) {
        const sourceNode = pathway.nodes[i];
        const targetNode = pathway.nodes[i + 1];

        const sourceId = sourceNode.stage === "class10" ? "shared-class10-baseline" : sourceNode.id;
        const targetId = targetNode.id;

        edges.push({
          id: `edge-${pathway.code}-${i}`,
          source: sourceId,
          target: targetId,
          animated: isSelected && !hasAnimated,
          style: {
            stroke: isSelected
              ? "var(--accent-base)"
              : "var(--border-default)",
            strokeWidth: isSelected ? 2.5 : 1.5,
            opacity: isSelected ? 1 : 0.25,
            transition: "all 200ms ease-out",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: isSelected ? "var(--accent-base)" : "var(--border-default)",
          },
        });
      }
    });

    return edges;
  }, [pathways, selectedPathwayId, hasAnimated]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Sync state updates
  useEffect(() => {
    setNodes(flowNodes);
  }, [flowNodes, setNodes]);

  useEffect(() => {
    setEdges(flowEdges);
  }, [flowEdges, setEdges]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative bg-bg-app overflow-hidden">
      {/* Top Pathway Bar */}
      <div className="shrink-0 border-b border-border bg-surface-base px-4 py-3 z-20">
        <div className="mx-auto max-w-content flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-20 text-ink-primary font-semibold">
              Career Pathway Map
            </h1>
            <p className="text-12 text-ink-muted">
              Select any pathway or milestone node to inspect true costs, risks, and assumptions.
            </p>
          </div>

          {/* Pathway Selector Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {pathways.map((p) => {
              const isSelected = p.id === selectedPathwayId;
              return (
                <button
                  key={p.id}
                  onClick={() => selectPathway(p.id)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-pill text-12 font-medium transition-all ${
                    isSelected
                      ? "bg-accent text-accent-contrast shadow-sm"
                      : "bg-surface-subtle text-ink-secondary hover:text-ink-primary border border-border"
                  }`}
                >
                  <span>{p.title.split("(")[0]}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-pill text-[10px] tabular-nums font-semibold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-surface-base text-ink-muted border border-border-subtle"
                    }`}
                  >
                    {p.fitScore}% Fit
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestone Column Headers Indicator */}
        <div className="hidden lg:grid grid-cols-6 gap-4 mx-auto max-w-content mt-3 pt-2 border-t border-border-subtle text-[11px] font-medium uppercase tracking-wider text-ink-muted">
          <div>1. Class 10 Baseline</div>
          <div>2. Senior Stream</div>
          <div>3. Entrance Exam</div>
          <div>4. Degree & Institution</div>
          <div>5. First Professional Role</div>
          <div>6. 10-Yr Career Plateau</div>
        </div>
      </div>

      {/* React Flow Graph Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="var(--border-default)" gap={24} size={1} />
          <Controls
            className="!left-4 !bottom-4 !shadow-none !border !border-border !rounded-sm !bg-surface-base"
            showInteractive={false}
          />
          <MiniMap
            className="!hidden sm:!block !right-4 !bottom-4 !border !border-border !rounded-sm !bg-surface-base !shadow-none"
            nodeColor={() => "var(--border-strong)"}
            maskColor={theme === "dark" ? "rgba(14, 17, 22, 0.7)" : "rgba(244, 244, 241, 0.7)"}
            zoomable
            pannable
          />
        </ReactFlow>

        {/* Right Inspection Drawer */}
        <PathwayDrawer />
      </div>
    </div>
  );
};
