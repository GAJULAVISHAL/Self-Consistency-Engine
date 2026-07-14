import React, { useEffect, useRef, useState } from "react";

interface ConnectorLinesProps {
  modelRefs: React.RefObject<HTMLDivElement | null>[];
  judgementRef: React.RefObject<HTMLDivElement | null>;
}

interface CardPoint {
  x: number;
  y: number;
}

// Stagger delays for each vertical stub so color phase looks like a wave
const STUB_DELAYS = ["0s", "0.4s", "0.8s"];

export function ConnectorLines({ modelRefs, judgementRef }: ConnectorLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cardPoints, setCardPoints] = useState<CardPoint[]>([]);
  const [judgeCenter, setJudgeCenter] = useState(0);
  const [judgeTop, setJudgeTop] = useState(0);
  const [midY, setMidY] = useState(0);

  useEffect(() => {
    function computeLines() {
      const svg = svgRef.current;
      const judgeEl = judgementRef.current;
      if (!svg || !judgeEl) return;

      const svgRect = svg.getBoundingClientRect();
      const judgeRect = judgeEl.getBoundingClientRect();

      const points = modelRefs
        .map((ref) => {
          const el = ref.current;
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - svgRect.left,
            y: r.bottom - svgRect.top,
          };
        })
        .filter(Boolean) as CardPoint[];

      if (points.length === 0) return;

      const jTop = judgeRect.top - svgRect.top;
      const jCenter = judgeRect.left + judgeRect.width / 2 - svgRect.left;
      const avgBottom = points.reduce((s, p) => s + p.y, 0) / points.length;

      setCardPoints(points);
      setJudgeTop(jTop);
      setJudgeCenter(jCenter);
      setMidY(avgBottom + (jTop - avgBottom) * 0.4);
    }

    const id = requestAnimationFrame(() => computeLines());
    window.addEventListener("resize", computeLines);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", computeLines);
    };
  }, [modelRefs, judgementRef]);

  const hasLines = cardPoints.length > 0;
  const leftX = hasLines ? Math.min(...cardPoints.map((p) => p.x)) : 0;
  const rightX = hasLines ? Math.max(...cardPoints.map((p) => p.x)) : 0;

  const sw = 1.5;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {hasLines && (
        <>
          {/* Vertical stubs: each card bottom → midY (staggered color phase) */}
          {cardPoints.map((p, i) => (
            <line
              key={`stub-${i}`}
              x1={p.x} y1={p.y}
              x2={p.x} y2={midY}
              className="connector-line"
              strokeWidth={sw}
              style={{ animationDelay: STUB_DELAYS[i] ?? "0s" }}
            />
          ))}

          {/* Horizontal bracket bar */}
          <line
            x1={leftX} y1={midY}
            x2={rightX} y2={midY}
            className="connector-line"
            strokeWidth={sw}
            style={{ animationDelay: "0.2s" }}
          />

          {/* Center drop → judgement top */}
          <line
            x1={judgeCenter} y1={midY}
            x2={judgeCenter} y2={judgeTop}
            className="connector-line"
            strokeWidth={sw}
            style={{ animationDelay: "0.5s" }}
          />

          {/* Junction dot — pulses in sync with the color cycle */}
          <circle
            cx={judgeCenter}
            cy={midY}
            r={3}
            style={{
              animation: "dot-color 4s ease-in-out infinite 0.5s",
            }}
          />
        </>
      )}
    </svg>
  );
}
