import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Compass,
  Info,
  AlertTriangle,
  Coffee,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  HelpCircle,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function FreedomMeter({
  studentData,
  onSwitchToSafeStudent,
  onOpenSimulator
}) {
  const [freedomData, setFreedomData] = useState(null);
  const [showMathModal, setShowMathModal] = useState(false);

  const studentId = studentData?.id || 'CSE24-042';
  const currentPct = studentData?.attendance?.current_pct || 74.2;
  const conducted = studentData?.attendance?.conducted || 130;
  const attended = studentData?.attendance?.attended || 96;
  const remaining = studentData?.attendance?.remaining || 24;
  const isSafeZone = currentPct >= 75.0;

  useEffect(() => {
    let cancelled = false;
    const fetchBuffer = async () => {
      const res = await api.getFreedomBuffer(studentId);
      if (!cancelled) setFreedomData(res);
    };
    fetchBuffer();
    return () => { cancelled = true; };
  }, [studentId, currentPct]);

  const bufferClasses = freedomData?.freedom_buffer_classes ?? (isSafeZone ? 4 : 0);
  const safetyMargin = freedomData?.safety_margin_pct ?? Math.max(0, currentPct - 75.0).toFixed(1);

  // Maximum visual pills to display
  const maxPills = 6;
  const filledPills = Math.min(bufferClasses, maxPills);

  return (
    <div className="freedom-meter-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="page-eyebrow" style={{ color: '#168447' }}>Core Differentiator</span>
          <span style={{ background: '#ecfdf5', color: '#168447', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
            Responsible Leeway Engine
          </span>
        </div>
        <h1 className="page-title">
          Attendance Freedom Meter
        </h1>
        <p className="page-subtitle">
          Instead of keeping students anxious, Attendance IQ calculates safe headroom so you know exactly when you can take a breather without violating university policy.
        </p>
      </div>

      {/* Main Freedom Card */}
      {isSafeZone ? (
        <div className="freedom-meter-card-hero safe-border">
          <div className="freedom-badge-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="status-badge safe" style={{ padding: '6px 14px', fontSize: '12.5px', fontWeight: 700 }}>
                <ShieldCheck size={16} />
                SAFE ZONE
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#102A43' }}>
                {studentData?.name} ({studentData?.id})
              </span>
            </div>
            <div className="freedom-cushion-pill">
              Buffer: +{safetyMargin}% above 75% line
            </div>
          </div>

          {/* Interactive Visual Meter: 🟢 🟢 🟢 🟢 ⚪ ⚪ */}
          <div className="freedom-interactive-display">
            <div className="freedom-meter-label-wrap">
              <span className="freedom-meter-eyebrow">YOUR ATTENDANCE FREEDOM</span>
              <div className="freedom-big-stat-line">
                <span className="freedom-count-hero">{bufferClasses}</span>
                <span className="freedom-count-unit">classes of freedom earned</span>
              </div>
            </div>

            {/* Visual Pills Meter */}
            <div className="freedom-pill-track-row" aria-label={`Freedom meter showing ${bufferClasses} classes available`}>
              {Array.from({ length: maxPills }).map((_, index) => {
                const isFilled = index < filledPills;
                return (
                  <div
                    key={index}
                    className={`freedom-circle-pill ${isFilled ? 'filled' : 'empty'}`}
                    title={isFilled ? `Safe class #${index + 1}` : 'No additional buffer'}
                  >
                    {isFilled ? '🟢' : '⚪'}
                  </div>
                );
              })}
            </div>

            <p className="freedom-human-message">
              You've earned some breathing room. You can safely miss up to <strong>{bufferClasses} classes</strong> across your remaining schedule and still conclude the semester safely at or above 75.0%.
            </p>
          </div>

          {/* Tasteful & Relatable Microcopy Strip */}
          <div className="freedom-microcopy-strip">
            <span className="microcopy-emoji">🌿</span>
            <div className="microcopy-content">
              <strong>Go touch some grass 🌿</strong>
              <span>
                "Maybe that Bhandara trip or weekend plan isn't a bad idea. Just don't disappear for a full week! 😄"
              </span>
            </div>
          </div>

          {/* Action Row: Connects directly to What-If Simulator + View Calculation */}
          <div className="freedom-action-bar">
            <button
              className="btn-primary"
              onClick={onOpenSimulator}
              style={{ background: '#168447' }}
            >
              <span>Test with What-If Simulator →</span>
              <Sliders size={16} />
            </button>

            <button
              className="btn-secondary"
              onClick={() => setShowMathModal(true)}
            >
              <Info size={15} />
              <span>View Calculation & Formula</span>
            </button>
          </div>
        </div>
      ) : (
        /* At Risk Student Freedom Meter State (Sameer Verma • 74.2%) */
        <div className="freedom-meter-card-hero risk-border">
          <div className="freedom-badge-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="status-badge at-risk" style={{ padding: '6px 14px', fontSize: '12.5px', fontWeight: 700 }}>
                <AlertTriangle size={16} />
                ZERO BUFFER (AT RISK)
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#102A43' }}>
                {studentData?.name} ({studentData?.id})
              </span>
            </div>
            <div className="freedom-cushion-pill at-risk">
              Shortage: 0.8% below 75% line
            </div>
          </div>

          <div className="freedom-interactive-display">
            <div className="freedom-meter-label-wrap">
              <span className="freedom-meter-eyebrow">CURRENT FREEDOM STATUS</span>
              <div className="freedom-big-stat-line">
                <span className="freedom-count-hero" style={{ color: '#c2410c' }}>0</span>
                <span className="freedom-count-unit">classes of buffer right now</span>
              </div>
            </div>

            {/* Visual Pills (All Empty) */}
            <div className="freedom-pill-track-row">
              {Array.from({ length: maxPills }).map((_, index) => (
                <div key={index} className="freedom-circle-pill empty" title="No buffer available">
                  ⚪
                </div>
              ))}
            </div>

            <p className="freedom-human-message">
              You are currently at <strong>74.2%</strong>. Missing any classes now directly worsens your exam eligibility. Attend your next <strong>4 scheduled classes</strong> to cross 75.0% and unlock your first Freedom Class.
            </p>
          </div>

          {/* Interactive Holiday Calculator: Can I Take a Day Off? (Prompt Requirement 5) */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px',
              margin: '20px 0',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ fontSize: '15px', color: '#102A43', display: 'block' }}>
                  🏖️ Can I Take a Day Off? (Holiday Calculator)
                </strong>
                <span style={{ fontSize: '12.5px', color: '#627D98' }}>
                  See how missing upcoming classes impacts your semester percentage:
                </span>
              </div>
            </div>

            {/* Selector Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 10].map(cnt => {
                const proj = Number(((attended / (conducted + cnt)) * 100).toFixed(1));
                const willBeSafe = proj >= 75.0;
                return (
                  <button
                    key={cnt}
                    type="button"
                    style={{
                      background: '#FAF8F3',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      textAlign: 'center',
                      flex: 1,
                      minWidth: '60px'
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#627D98' }}>Miss {cnt}</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: willBeSafe ? '#059669' : '#DC2626' }}>
                      {proj}%
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '10px', fontSize: '12.5px', color: '#991B1B' }}>
              ⚠️ <strong>Responsible Academic Guidance:</strong> "Better attend the next few classes! Your attendance buffer is currently in the red zone. Earn 4 safe lectures first."
            </div>
          </div>

          {/* Helpful Incentive Banner */}
          <div className="freedom-microcopy-strip warning">
            <span className="microcopy-emoji">🎯</span>
            <div className="microcopy-content">
              <strong>Lock in 4 classes first!</strong>
              <span>
                "Attend the upcoming lectures this week to enter the Safe Zone. Once at 75.5%, your freedom meter begins filling up!"
              </span>
            </div>
          </div>

          <div className="freedom-action-bar">
            {onSwitchToSafeStudent && (
              <button
                className="btn-primary"
                onClick={onSwitchToSafeStudent}
                style={{ background: '#102A43' }}
              >
                <span>Switch to Safe Student (Ananya • 86.4%) →</span>
              </button>
            )}

            <button
              className="btn-secondary"
              onClick={onOpenSimulator}
            >
              <span>Simulate Recovery in What-If</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Transparent Mathematical Breakdown Modal */}
      {showMathModal && (
        <div className="modal-overlay" onClick={() => setShowMathModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">TRANSPARENT MATHEMATICS</span>
                <h3 className="modal-title">How Freedom Buffer is Calculated</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowMathModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div className="math-formula-box">
                <code>
                  Max Missable = Floor((Attended - (Threshold × Conducted)) ÷ Threshold)
                </code>
              </div>

              <div className="math-breakdown-list">
                <div className="math-row">
                  <span>Conducted to Date (C):</span>
                  <strong>{conducted} lectures</strong>
                </div>
                <div className="math-row">
                  <span>Attended Sessions (A):</span>
                  <strong>{attended} lectures</strong>
                </div>
                <div className="math-row">
                  <span>Institutional Threshold (T):</span>
                  <strong>75.0% (0.75)</strong>
                </div>
                <div className="math-row">
                  <span>Required to Date (0.75 × {conducted}):</span>
                  <strong>{(conducted * 0.75).toFixed(1)} sessions</strong>
                </div>
                <div className="math-row highlight">
                  <span>Available Surplus Buffer:</span>
                  <strong style={{ color: '#168447' }}>~{bufferClasses} sessions</strong>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#575c66', marginTop: '14px', lineHeight: 1.5 }}>
                Even if you miss {bufferClasses} upcoming lectures and attend the remaining scheduled classes normally, your cumulative rate will remain above the required institutional 75.0% line.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button className="btn-primary" onClick={() => setShowMathModal(false)}>
                  Understood ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
