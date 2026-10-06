import React, { useEffect, useState } from 'react';

/**
 * AnimatedCircularMeter - Elegant, high-fidelity SVG circular progress ring
 * Supports animated progress 0 -> percentage, status glow, and custom label
 */
export default function AnimatedCircularMeter({
  percentage = 82.4,
  size = 180,
  strokeWidth = 14,
  label = 'Overall Attendance',
  sublabel = null,
  showGlow = true
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Smooth ease-out animation on mount or when percentage changes
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(ease * percentage);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  // Determine status color and glow
  let strokeColor = '#059669'; // Safe
  let glowColor = 'rgba(5, 150, 105, 0.25)';
  let statusText = 'You are currently safe';
  let statusBadge = 'SAFE';

  if (percentage < 70) {
    strokeColor = '#DC2626'; // Critical
    glowColor = 'rgba(220, 38, 38, 0.28)';
    statusText = 'Critical: Immediate action required';
    statusBadge = 'CRITICAL';
  } else if (percentage < 75) {
    strokeColor = '#D97706'; // At Risk
    glowColor = 'rgba(217, 119, 6, 0.25)';
    statusText = 'At Risk: Below 75% exam line';
    statusBadge = 'AT RISK';
  } else if (percentage < 80) {
    strokeColor = '#0D9488'; // Watch
    glowColor = 'rgba(13, 148, 136, 0.2)';
    statusText = 'Watch: Near eligibility boundary';
    statusBadge = 'WATCH';
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          filter: showGlow ? `drop-shadow(0 6px 16px ${glowColor})` : 'none'
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />

          {/* Animated Value Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>

        {/* Center Content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '12px'
          }}
        >
          <span
            style={{
              fontSize: size > 160 ? '34px' : '22px',
              fontWeight: 800,
              color: '#102A43',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              fontFamily: 'Outfit, Inter, sans-serif'
            }}
          >
            {animatedValue.toFixed(1)}%
          </span>

          <span
            style={{
              fontSize: size > 160 ? '11.5px' : '9.5px',
              fontWeight: 700,
              color: '#627D98',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginTop: '4px'
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {sublabel && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 600, color: strokeColor }}>
            {sublabel}
          </div>
        </div>
      )}
    </div>
  );
}
