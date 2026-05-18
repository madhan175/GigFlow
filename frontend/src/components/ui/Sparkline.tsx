import React from 'react';

interface SparklineProps {
  data: number[];
  trend?: 'up' | 'down';
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, trend = 'up', className = '' }) => {
  const w = 120;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const stroke = trend === 'up' ? '#a78bfa' : '#f472b6';

  return (
    <svg width={w} height={h} className={className} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};
