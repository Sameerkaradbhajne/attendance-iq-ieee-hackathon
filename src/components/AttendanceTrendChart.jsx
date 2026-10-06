import React, { useState } from 'react';

export default function AttendanceTrendChart({
  data = [],
  projectedPct = 72.8,
  thresholdPct = 75.0
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>No historical data available</div>;
  }

  // Chart Dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Y Scale: 50% to 100%
  const minY = 55;
  const maxY = 100;

  const getY = (val) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return padding.top + chartH - ((clamped - minY) / (maxY - minY)) * chartH;
  };

  const getX = (index, total) => {
    return padding.left + (index / (total - 1)) * chartW;
  };

  // Generate historical points
  const points = data.map((d, i) => ({
    x: getX(i, data.length + 2), // leave room for projection
    y: getY(d.pct),
    week: d.week,
    pct: d.pct
  }));

  // Append projected point
  const lastHistorical = points[points.length - 1];
  const projectedPoint = {
    x: getX(data.length + 1, data.length + 2),
    y: getY(projectedPct),
    week: 'Projected (W12)',
    pct: projectedPct,
    isProjected: true
  };

  // Historical path
  const historicalPath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Projected dashed path
  const projectionPath = `M ${lastHistorical.x} ${lastHistorical.y} L ${projectedPoint.x} ${projectedPoint.y}`;

  // Threshold Line
  const thresholdY = getY(thresholdPct);

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#121316', borderRadius: '2px' }}></span>
            Historical Attendance
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '2px', borderTop: '2px dashed #ea580c' }}></span>
            Projected Trend
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '1px', background: '#dc2626' }}></span>
            {thresholdPct}% Mandatory Threshold
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        {/* Subtle Horizontal Grid lines */}
        {[60, 70, 80, 90, 100].map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#f0f0ed"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10.5"
                fill="#9ca3af"
                fontFamily="var(--font-mono)"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* 75% Threshold Line */}
        <line
          x1={padding.left}
          y1={thresholdY}
          x2={width - padding.right}
          y2={thresholdY}
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text
          x={width - padding.right + 4}
          y={thresholdY + 3}
          fontSize="10"
          fill="#dc2626"
          fontWeight="600"
          fontFamily="var(--font-mono)"
        >
          {thresholdPct}%
        </text>

        {/* Shaded zone under threshold */}
        <rect
          x={padding.left}
          y={thresholdY}
          width={chartW}
          height={getY(minY) - thresholdY}
          fill="rgba(239, 68, 68, 0.03)"
        />

        {/* Historical Attendance Line */}
        <path
          d={historicalPath}
          fill="none"
          stroke="#121316"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Projected Extension Line */}
        <path
          d={projectionPath}
          fill="none"
          stroke="#ea580c"
          strokeWidth="2"
          strokeDasharray="5 4"
        />

        {/* Historical Data Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredPoint === p ? 5.5 : 4}
            fill="#ffffff"
            stroke="#121316"
            strokeWidth="2"
            style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
            onMouseEnter={() => setHoveredPoint(p)}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}

        {/* Projected Dot */}
        <circle
          cx={projectedPoint.x}
          cy={projectedPoint.y}
          r={hoveredPoint === projectedPoint ? 6 : 4.5}
          fill="#ffffff"
          stroke="#ea580c"
          strokeWidth="2.5"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredPoint(projectedPoint)}
          onMouseLeave={() => setHoveredPoint(null)}
        />

        {/* X Axis Week Labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i, data.length + 2)}
            y={height - 10}
            textAnchor="middle"
            fontSize="10.5"
            fill="#8b919d"
            fontFamily="var(--font-mono)"
          >
            {d.week}
          </text>
        ))}
        <text
          x={projectedPoint.x}
          y={height - 10}
          textAnchor="middle"
          fontSize="10.5"
          fill="#ea580c"
          fontWeight="600"
          fontFamily="var(--font-mono)"
        >
          W12*
        </text>
      </svg>

      {/* Hover Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)',
            background: '#121316',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
          }}
        >
          {hoveredPoint.week}: {hoveredPoint.pct}%
          {hoveredPoint.isProjected && ' (Forecast)'}
        </div>
      )}
    </div>
  );
}
