import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Minus,
  AlertTriangle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Compass
} from 'lucide-react';
import AnimatedCircularMeter from './visual/AnimatedCircularMeter';

export default function AttendanceHealthCard({
  attendance,
  studentName = 'Sameer',
  onViewRecovery,
  onOpenSimulator,
  onOpenFreedom
}) {
  if (!attendance) return null;

  const {
    current_pct,
    projected_pct,
    trend,
    trend_label,
    risk_level,
    remaining,
    conducted,
    attended,
    classes_needed,
    recovery_difficulty,
    recovery_label
  } = attendance;

  const isAtRisk = risk_level === 'AT RISK' || risk_level === 'CRITICAL';
  const isSafe = risk_level === 'SAFE';
  const gapPct = Math.abs(current_pct - 75.0).toFixed(1);
  const riskClass = risk_level.toLowerCase().replace(' ', '-');

  return (
    <div className={`hero-health-card ${riskClass}`}>
      {/* Left Column: Visual Centerpiece & Risk Statistics */}
      <div className="hero-stat-box">
        <div className="hero-stat-header-row">
          <div className="hero-stat-label">
            <span className="hero-label-tag">ATTENDANCE INTELLIGENCE</span>
            <span className="hero-dot-separator">•</span>
            <span>Semester 5 Live Forecast</span>
          </div>
          <div className="hero-session-tally">
            <strong>{attended}</strong> / {conducted} sessions attended
          </div>
        </div>

        {/* Big Animated Circular Freedom Meter & status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', margin: '14px 0 16px', flexWrap: 'wrap' }}>
          <AnimatedCircularMeter
            percentage={current_pct}
            size={160}
            strokeWidth={13}
            label="Overall Score"
            sublabel={isSafe ? '✓ Safe & Eligible' : '⚠ Action Recommended'}
            showGlow={true}
          />

          <div className="hero-pct-wrap" style={{ flex: 1, minWidth: '180px' }}>
            <div className="hero-target-reference" style={{ fontSize: '13.5px', marginBottom: '8px' }}>
              Institutional Minimum: <strong>75.0%</strong>
              {isSafe ? (
                <span className="hero-buffer-tag safe" style={{ marginLeft: '6px' }}>+{gapPct}% safe cushion</span>
              ) : (
                <span className="hero-buffer-tag deficit" style={{ marginLeft: '6px' }}>-{gapPct}% shortage</span>
              )}
            </div>

            <div
              className={`hero-status-pill ${riskClass}`}
              style={{
                background: isSafe ? '#ecfdf5' : isAtRisk ? '#fff7ed' : '#fffbeb',
                color: isSafe ? '#047857' : isAtRisk ? '#c2410c' : '#b45309',
                border: `1px solid ${isSafe ? '#a7f3d0' : isAtRisk ? '#fed7aa' : '#fde68a'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              {isSafe ? <ShieldCheck size={16} /> : isAtRisk ? <AlertTriangle size={16} /> : <Zap size={16} />}
              <span>{risk_level}</span>
            </div>
          </div>
        </div>

        {/* Humanized trajectory description */}
        <div className="hero-stat-summary">
          {isSafe ? (
            <p>
              You are comfortably in the safe zone. Based on current positive attendance momentum, your projected final semester completion is <strong style={{ color: '#047857' }}>{projected_pct}%</strong> (above the 75% institutional requirement).
            </p>
          ) : (
            <p>
              Current attendance has dropped below institutional safety guidelines. Based on recent 4-week participation, your projected finish is <strong style={{ color: '#c2410c' }}>{projected_pct}%</strong> without intervention.
            </p>
          )}
        </div>

        {/* Sub-metric pillars */}
        <div className="hero-stat-grid">
          <div className="substat-item">
            <span className="substat-label">Classes Remaining</span>
            <span className="substat-value">{remaining} lectures</span>
          </div>
          <div className="substat-item">
            <span className="substat-label">Recovery Target</span>
            <span
              className="substat-value"
              style={{ color: isAtRisk ? '#c2410c' : '#047857', fontWeight: 700 }}
            >
              {classes_needed > 0 ? `Attend ${classes_needed} of next ${remaining}` : 'Cushion Maintained ✓'}
            </span>
          </div>
          <div className="substat-item">
            <span className="substat-label">Effort Difficulty</span>
            <span className="substat-value" style={{ fontSize: '15px' }}>
              {recovery_difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Actionable Recommendations & Direct Pathways */}
      <div className="hero-action-box">
        <div>
          <div className="action-box-eyebrow">
            <Sparkles size={13} color="#d97706" />
            <span>ACTIONABLE INTELLIGENCE</span>
          </div>

          <div className="action-box-card">
            {isAtRisk ? (
              <>
                <div className="action-card-title" style={{ color: '#c2410c' }}>
                  <AlertTriangle size={16} />
                  <span>Immediate Recovery Recommended</span>
                </div>
                <p className="action-card-text">
                  You are <strong>{gapPct}%</strong> below the mandatory eligibility line. Attending the next <strong>{classes_needed} consecutive sessions</strong> will safely pull you back into compliance.
                </p>
              </>
            ) : (
              <>
                <div className="action-card-title" style={{ color: '#047857' }}>
                  <ShieldCheck size={16} />
                  <span>Freedom Buffer Available</span>
                </div>
                <p className="action-card-text">
                  You've earned attendance leeway. You maintain a <strong>+{gapPct}% safety buffer</strong> over the 75% line with room for emergency flexibility.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="hero-action-buttons">
          {isAtRisk ? (
            <button className="btn-primary hero-btn-action" onClick={onViewRecovery}>
              <span>View Priority Recovery Plan</span>
              <ArrowUpRight size={16} />
            </button>
          ) : (
            <button className="btn-primary hero-btn-action" onClick={onOpenFreedom} style={{ background: '#168447' }}>
              <span>Check Freedom Buffer</span>
              <Compass size={16} />
            </button>
          )}

          <button className="btn-secondary hero-btn-action" onClick={onOpenSimulator}>
            <span>Run What-If Simulation</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
