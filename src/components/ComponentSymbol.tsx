"use client";

import { CELL_SIZE } from "@/lib/constants";
import type { PipeComponent } from "@/lib/types";

const PORT_DOT_CLASS = "text-amber-900 dark:text-amber-200";

interface ComponentSymbolProps {
  component: PipeComponent;
  rotation?: 0 | 90 | 180 | 270;
  selected?: boolean;
  size?: number;
  text?: string;
}

export function ComponentSymbol({ component, rotation = 0, selected, size = CELL_SIZE, text }: ComponentSymbolProps) {
  const S = size;
  const HALF = S / 2;
  const transform = `rotate(${rotation} ${HALF} ${HALF})`;
  const stroke = selected ? "rgb(245 158 11)" : "rgb(180 83 9)";
  const strokeWidth = selected ? 2.5 : 1.5;
  const margin = 0;
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
      const end = S - margin;
      return (
        <g transform={transform}>
          <path
            d={`M ${end} ${HALF} L ${HALF} ${HALF} L ${HALF} ${end}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={end} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={HALF} cy={end} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
        </g>
      );
    }
    case "elbow_90_sw": {
      const end = S - margin;
      return (
        <g transform={transform}>
          <path
            d={`M ${HALF} ${end} L ${HALF} ${HALF} L ${margin} ${HALF}`}
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
      const end = S - margin;
      return (
        <g transform={transform}>
          <path
            d={`M ${margin} ${HALF} L ${HALF} ${HALF} L ${HALF} ${margin}`}
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
      const end = S - margin;
      return (
        <g transform={transform}>
          <path
            d={`M ${HALF} ${margin} L ${HALF} ${HALF} L ${end} ${HALF}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={HALF} cy={margin} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
          <circle cx={end} cy={HALF} r={rSmall} fill="currentColor" className={PORT_DOT_CLASS} />
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
    case "drip_emitter_2lph":
    case "drip_emitter_4lph":
    case "drip_emitter_8lph": {
      const textSize = Math.max(6, (9 / 50) * S);
      const textY = margin + textSize / 2 + (2 / 50) * S;
      const gap = (3 / 50) * S;
      const circleR = (5 / 50) * S;
      const circleY = textY + textSize / 2 + gap + circleR;
      const lineBottom = S - margin;
      const lineStartY = circleY + circleR;
      const dripLabel =
        component.id === "drip_emitter_2lph" ? "2 L/h" : component.id === "drip_emitter_4lph" ? "4 L/h" : "8 L/h";
      return (
        <g transform={transform}>
          <line
            x1={HALF}
            y1={lineStartY}
            x2={HALF}
            y2={lineBottom}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle
            cx={HALF}
            cy={circleY}
            r={circleR}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <circle cx={HALF} cy={lineBottom} r={rSmall} fill="currentColor" className="text-emerald-800 dark:text-emerald-200" />
          <text
            x={HALF}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={textSize}
            fill="currentColor"
            className="text-emerald-800 dark:text-emerald-200 font-medium"
          >
            {dripLabel}
          </text>
        </g>
      );
    }
    case "tap": {
      const spoutW = (4 / 50) * S;
      const spoutH = (14 / 50) * S;
      const wheelR = (6 / 50) * S;
      const baseY = HALF;
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
    case "label": {
      const fontSize = Math.max(8, (S * 12) / 50);
      return (
        <g transform={transform}>
          <text
            x={HALF}
            y={HALF}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fontSize}
            fill="currentColor"
            className="text-stone-700 dark:text-stone-300 font-medium"
          >
            {text ?? "Text"}
          </text>
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
