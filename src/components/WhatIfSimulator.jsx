import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

export default function WhatIfSimulator({
  studentId = 'CSE24-042',
  studentData,
  onReset
}) {
  const [missCount, setMissCount] = useState(2);
  const [attendPctScenario, setAttendPctScenario] = useState(null); // null = baseline, 100 = 100%, 90 = 90%
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);

  const conducted = studentData?.attendance?.conducted || 130;
  const attended = studentData?.attendance?.attended || 96;
  const remaining = studentData?.attendance?.remaining || 24;
  const currentPct = studentData?.attendance?.current_pct || 74.2;

  // Run simulation whenever missCount or scenario changes
  useEffect(() => {
    let isCancelled = false;
    const runSim = async () => {
      setLoading(true);
      const res = await api.simulateWhatIf(studentId, {
        missNextN: missCount,
        attendRemainingPct: attendPctScenario
      });
      if (!isCancelled) {
        setSimulation(res);
        setLoading(false);
      }
    };
    runSim();
    return () => { isCancelled = true; };
  }, [studentId, missCount, attendPctScenario, conducted, attended, remaining]);

  const handleSliderChange = (e) => {
    setMissCount(parseInt(e.target.value, 10));
    setAttendPctScenario(null);
  };

  const setPreset = (misses, attendPct = null) => {
    setMissCount(misses);
    setAttendPctScenario(attendPct);
  };

  const simRisk = simulation?.sim_risk || (currentPct - (missCount * 0.7) >= 75 ? 'SAFE' : 'AT RISK');
  const simPct = simulation?.sim_projected_pct || Number((((attended) / (conducted + missCount)) * 100).toFixed(1));
  const delta = simulation?.delta || Number((simPct - currentPct).toFixed(1));
  const isEligible = simPct >= 75.0;

  return (
    <div className="simulator-panel">
      {/* Header */}
      <div className="simulator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="page-eyebrow" style={{ color: '#7c3aed' }}>Scenario Modeling</span>
          <span style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
            Live Calculation
          </span>
        </div>
        <h1 className="page-title">
          "What-If?" Attendance Simulator
        </h1>
        <p className="page-subtitle">
          Test real decisions before making them. Slide the control below to see exactly how missing classes changes your final percentage and exam clearance.
        </p>
      </div>

      {/* Simulator Two-Column Layout */}
      <div className="simulator-content-grid">
        {/* Left Column: Interactive Controls */}
        <div className="sim-controls-card">
          <div className="sim-card-heading-row">
            <h3 className="sim-box-title">Scenario Parameters</h3>
            <button
              className="sim-reset-btn"
              onClick={() => { setMissCount(0); setAttendPctScenario(null); }}
              title="Reset simulator"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider: Miss Next N Classes */}
          <div className="slider-control-group">
            <div className="slider-label-row">
              <label htmlFor="miss-slider" className="sim-control-label">
                If I miss upcoming classes:
              </label>
              <span className="slider-value-badge">
                {missCount === 0 ? '0 classes (Perfect attendance)' : `${missCount} ${missCount === 1 ? 'class' : 'classes'}`}
              </span>
            </div>

            <input
              id="miss-slider"
              type="range"
              min="0"
              max={Math.min(12, remaining)}
              value={missCount}
              onChange={handleSliderChange}
              className="sim-slider-input"
            />

            <div className="slider-ticks-row">
              <span>0 (attend all)</span>
              <span>3</span>
              <span>6</span>
              <span>9</span>
              <span>12 classes</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="sim-presets-block">
            <span className="sim-preset-label">Quick Scenarios:</span>
            <div className="sim-preset-buttons">
              <button
                className={`preset-pill ${missCount === 1 ? 'active' : ''}`}
                onClick={() => setPreset(1)}
              >
                Miss 1 class (flu/fever)
              </button>
              <button
                className={`preset-pill ${missCount === 3 ? 'active' : ''}`}
                onClick={() => setPreset(3)}
              >
                Miss 3 classes (hackathon)
              </button>
              <button
                className={`preset-pill ${missCount === 0 && attendPctScenario === 100 ? 'active' : ''}`}
                onClick={() => setPreset(0, 100)}
              >
                Attend 100% remaining
              </button>
            </div>
          </div>

          {/* Baseline reference block */}
          <div className="sim-baseline-note">
            <div className="baseline-row">
              <span>Current Attendance:</span>
              <strong>{currentPct}% ({attended}/{conducted})</strong>
            </div>
            <div className="baseline-row">
              <span>Remaining Classes:</span>
              <strong>{remaining} sessions planned</strong>
            </div>
            <div className="baseline-row">
              <span>Required for Exam:</span>
              <strong style={{ color: '#168447' }}>75.0% threshold</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Live Outcome Consequence */}
        <div className="sim-results-card">
          <span className="sim-results-eyebrow">PROJECTED CONSEQUENCE</span>

          {/* Big Forecast Comparison */}
          <div className="sim-comparison-box">
            <div className="sim-stat-col">
              <span className="sim-stat-lbl">Current Rate</span>
              <span className="sim-stat-val">{currentPct}%</span>
            </div>

            <div className="sim-arrow-col">
              <ArrowRight size={20} color="#94a3b8" />
            </div>

            <div className="sim-stat-col">
              <span className="sim-stat-lbl">Simulated Finish</span>
              <span
                className="sim-stat-val highlight"
                style={{ color: isEligible ? '#168447' : '#c2410c' }}
              >
                {simPct}%
              </span>
            </div>
          </div>

          {/* Delta Indicator */}
          <div className="sim-delta-row">
            {delta < 0 ? (
              <span className="sim-delta-pill negative">
                <TrendingDown size={14} />
                <span>{delta}% drop in final score</span>
              </span>
            ) : (
              <span className="sim-delta-pill positive">
                <TrendingUp size={14} />
                <span>+{delta}% improvement</span>
              </span>
            )}
          </div>

          {/* Exam Eligibility Verdict Card */}
          <div className={`sim-verdict-box ${isEligible ? 'eligible' : 'ineligible'}`}>
            <div className="verdict-icon-row">
              {isEligible ? (
                <>
                  <CheckCircle2 size={24} color="#168447" />
                  <div>
                    <h4 className="verdict-title" style={{ color: '#168447' }}>
                      Exam Eligible ✓
                    </h4>
                    <p className="verdict-desc">
                      Even after missing {missCount} classes, you finish at <strong>{simPct}%</strong>, staying above the 75% institutional requirement.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={24} color="#c2410c" />
                  <div>
                    <h4 className="verdict-title" style={{ color: '#c2410c' }}>
                      Exam Ineligible ❌
                    </h4>
                    <p className="verdict-desc">
                      Missing {missCount} classes drops your projected attendance to <strong>{simPct}%</strong> (below 75%). You will require medical condonation or extra sessions.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recommended Action Advice */}
          <div className="sim-advice-footer">
            <strong>Advisory: </strong>
            <span>
              {isEligible
                ? "This scenario maintains compliance. You have enough buffer to proceed safely."
                : `To protect your clearance, keep your absences to a maximum of 0 sessions until you reach 76%.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
