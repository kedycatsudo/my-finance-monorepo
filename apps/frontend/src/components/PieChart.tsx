import React from 'react';

export const CATEGORY_COLORS: Record<string, string> = {
  Outcomes: '#FF6B6B', // red
  Incomes: '#3DD598', // green
  // Add more categories as needed!
};

export const DEFAULT_CHART_COLORS = [
  '#4FD1C5',
  '#FF6B6B',
  '#F7B801',
  '#3DD598',
  '#6A82FB',
  '#FB7DA6',
  '#7D5FFF',
  '#FEB72B',
];

type PieData = {
  name: string;
  amount: number;
  color?: string; // color assigned by parent--no longer picked here!
};

type PieChartProps = {
  data: PieData[];
  size?: number;
  className?: string;
  ringWidth?: number;
};

export default function PieChart({ data, size = 300, className, ringWidth = 100 }: PieChartProps) {
  const effectiveRingWidth = typeof ringWidth === 'number' ? ringWidth : Math.max(16, size / 8);
  const radius = size / 2 - effectiveRingWidth;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + Math.max(0, d.amount), 0) || 1;
  let prevPercent = 0;
  const slices = data.map((item, idx) => {
    const percent = Math.max(0, item.amount) / total;
    const dash = circ * percent;
    const slice = {
      color: item.color ?? DEFAULT_CHART_COLORS[idx % DEFAULT_CHART_COLORS.length], // fall back only if missing
      dash,
      offset: -circ * prevPercent,
    };
    prevPercent += percent;
    return slice;
  });
  return (
    <div className={'flex flex-col items-center' + (className ? ` ${className}` : '')}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        {slices.map((s, idx) => (
          <circle
            key={idx}
            r={radius}
            cx={cx}
            cy={cy}
            fill="none"
            stroke={s.color}
            strokeWidth={effectiveRingWidth}
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={s.offset}
            style={{
              transition: 'stroke-dasharray 0.3s, stroke-dashoffset 0.3s',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
