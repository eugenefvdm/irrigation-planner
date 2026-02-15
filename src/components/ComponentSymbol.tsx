"use client";

import { CELL_SIZE } from "@/lib/constants";
import type { PipeComponent } from "@/lib/types";

const PORT_DOT_CLASS = "text-amber-900 dark:text-amber-200";

interface ComponentSymbolProps {
  component: PipeComponent;
  rotation?: 0 | 90 | 180 | 270;
  selected?: boolean;
  size?: number;
}

export function ComponentSymbol({ component, rotation = 0, selected, size = CELL_SIZE }: ComponentSymbolProps) {
  const S = size;
  const HALF = S / 2;
  const transform = `rotate(${rotation} ${HALF} ${HALF})`;
  const stroke = selected ? "rgb(245 158 11)" : "rgb(180 83 9)";
  const strokeWidth = selected ? 2.5 : 1.5;
  const margin = (4 / 50) * S;
  const rSmall = (3 / 50) * S;

  switch (component.id) {
    case "pipe_straight": {
      return (
        <g transform={transform}>
          <line
            x1={margin}
            y1={HALF}
            x2={S - margin}
            y2={HALF}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={S - margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "pipe_straight_v": {
      return (
        <g transform={transform}>
          <line
            x1={HALF}
            y1={margin}
            x2={HALF}
            y2={S - margin}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={HALF} cy={margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={HALF} cy={S - margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "elbow_90": {
      const r = (12 / 50) * S;
      const end = S - margin;
      return (
        <g transform={transform}>
          <path
            d={`M ${HALF + r} ${HALF} L ${end} ${HALF} L ${end} ${end} L ${HALF} ${end}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={HALF + r} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={HALF} cy={end} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "elbow_90_sw": {
      const r = (12 / 50) * S;
      const end = S - margin;
      return (
        <g transform={transform}>
          <path
            d={`M ${HALF} ${end} L ${HALF} ${margin} L ${margin} ${margin} L ${margin} ${HALF}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={HALF} cy={end} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "elbow_90_wn": {
      const r = (12 / 50) * S;
      const end = S - margin;
      return (
        <g transform={transform}>
          <path
            d={`M ${margin} ${HALF} L ${end - r} ${HALF} L ${end - r} ${margin} L ${HALF} ${margin}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={HALF} cy={margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "elbow_90_ne": {
      const r = (12 / 50) * S;
      const end = S - margin;
      return (
        <g transform={transform}>
          <path
            d={`M ${HALF} ${margin} L ${HALF} ${end} L ${end} ${end} L ${end} ${HALF + r}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={HALF} cy={margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={end} cy={HALF + r} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "tee": {
      return (
        <g transform={transform}>
          <path
            d={`M ${margin} ${HALF} H ${S - margin} M ${HALF} ${HALF} V ${S - margin}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={S - margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={HALF} cy={S - margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "tee_n": {
      return (
        <g transform={transform}>
          <path
            d={`M ${margin} ${HALF} H ${S - margin} M ${HALF} ${margin} V ${HALF}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={S - margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={HALF} cy={margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "tee_e": {
      return (
        <g transform={transform}>
          <path
            d={`M ${HALF} ${margin} V ${S - margin} M ${HALF} ${HALF} H ${S - margin}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={HALF} cy={margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={HALF} cy={S - margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={S - margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "tee_w": {
      return (
        <g transform={transform}>
          <path
            d={`M ${HALF} ${margin} V ${S - margin} M ${margin} ${HALF} H ${HALF}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={HALF} cy={margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={HALF} cy={S - margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={margin} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "male_adapter": {
      const bodyW = (6 / 50) * S;
      const bodyH = (18 / 50) * S;
      const top = margin + 2;
      const left = HALF - bodyW / 2;
      const threadY0 = top + 4;
      const threadY1 = top + bodyH - 4;
      const threadStep = (threadY1 - threadY0) / 5;
      const baseY = top + bodyH;
      return (
        <g transform={transform}>
          <rect
            x={left}
            y={top}
            width={bodyW}
            height={bodyH}
            rx={bodyW / 2}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={left - 1}
              y1={threadY0 + i * threadStep}
              x2={left + bodyW + 1}
              y2={threadY0 + i * threadStep}
              stroke={stroke}
              strokeWidth={strokeWidth * 0.6}
            />
          ))}
          <line
            x1={HALF}
            y1={baseY}
            x2={S - margin}
            y2={baseY}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={S - margin} cy={baseY} r={rSmall} fill="currentColor" className="text-amber-800 dark:text-amber-200" />
        </g>
      );
    }
    case "drip_emitter_2lph": {
      const lineTop = (10 / 50) * S;
      const lineBottom = S - margin;
      const circleR = (5 / 50) * S;
      const textSize = Math.max(6, (9 / 50) * S);
      return (
        <g transform={transform}>
          <line
            x1={HALF}
            y1={lineTop}
            x2={HALF}
            y2={lineBottom}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle
            cx={HALF}
            cy={lineTop}
            r={circleR}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <text
            x={HALF}
            y={lineTop + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={textSize}
            fill="currentColor"
            className="text-emerald-800 dark:text-emerald-200 font-medium"
          >
            2 L/h
          </text>
          <circle cx={HALF} cy={lineBottom} r={rSmall} fill="currentColor" className="text-emerald-800 dark:text-emerald-200" />
        </g>
      );
    }
    case "tap": {
      const spoutW = (4 / 50) * S;
      const spoutH = (14 / 50) * S;
      const wheelR = (6 / 50) * S;
      const baseY = HALF + 2;
      const spoutX = HALF - spoutW / 2;
      const spoutTop = baseY - spoutH;
      return (
        <g transform={transform}>
          <path
            d={`M ${spoutX} ${baseY} v ${-spoutH} h ${spoutW} v ${spoutH} Z`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={HALF}
            cy={spoutTop - wheelR - 2}
            r={wheelR}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <line
            x1={HALF}
            y1={baseY}
            x2={S - margin}
            y2={baseY}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={S - margin} cy={baseY} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    default: {
      const pad = (4 / 50) * S;
      return (
        <g transform={transform}>
          <rect
            x={pad}
            y={pad}
            width={S - pad * 2}
            height={S - pad * 2}
            rx={pad}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </g>
      );
    }
  }
}
