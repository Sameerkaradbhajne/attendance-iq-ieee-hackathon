import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Flame,
  Sparkles,
  BookOpen,
  Calendar,
  Check
} from 'lucide-react';

export default function RecoveryPlan({ studentData, onOpenCondonation }) {
  const [checkedClasses, setCheckedClasses] = useState([true, true]); // Initial 2 classes simulated checked

  const subjects = studentData?.subjects || [];
  const currentPct = studentData?.attendance?.current_pct || 74.2;
  const classesNeededTotal = studentData?.attendance?.classes_needed || 4;

  // Interactive recovery checklist classes
  const recoveryClasses = [
    { id: 1, name: 'CS501 Computer Networks', date: 'Tomorrow, 10:00 AM', room: 'Hall 204' },
    { id: 2, name: 'CS502 Operating Systems Lab', date: 'Wednesday, 02:00 PM', room: 'Lab 3' },
    { id: 3, name: 'CS503 Theory of Computation', date: 'Thursday, 11:30 AM', room: 'Hall 108' },
    { id: 4, name: 'CS504 Database Management', date: 'Friday, 09:00 AM', room: 'Hall 201' },
    { id: 5, name: 'CS505 Software Engineering', date: 'Next Monday, 01:30 PM', room: 'Hall 305' }
  ];

  const toggleCheck = (idx) => {
    setCheckedClasses(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  const isSafeZoneReached = checkedClasses.length >= 4;

  return (
    <div className="recovery-planner-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="page-eyebrow" style={{ color: '#c2410c' }}>Priority Intervention Roadmap</span>
          <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
            Action Target
          </span>
        </div>
        <h1 className="page-title">
          Attendance Recovery Intelligence
        </h1>
        <p className="page-subtitle">
          Instead of passive warnings, here is your clear session-by-session target to cross the mandatory 75.0% line before exams.
        </p>
      </div>

      {/* Target Roadmap Card */}
      <div className="recovery-overview-card">
        <div className="recovery-overview-left">
          <div className="recovery-icon-circle">
            <Target size={24} color="#c2410c" />
          </div>
          <div>
            <div className="recovery-status-badge">
              <span>Goal: Reach 75.0% Eligibility</span>
            </div>
            <h3 className="recovery-headline">
              Attend the next <strong>{classesNeededTotal} scheduled classes</strong>
            </h3>
            <p className="recovery-subtext">
              Current attendance: <strong>{currentPct}%</strong>. Target: <strong>75.0%</strong>. Progress: <strong>██████░░░░░░</strong>. Estimated recovery outcome: <strong>75.3%</strong>.
            </p>
          </div>
        </div>

        <div className="recovery-stats-pill">
          <div className="recovery-stat-col">
            <span className="recovery-stat-lbl">Shortage</span>
            <span className="recovery-stat-num" style={{ color: '#c2410c' }}>{(Math.max(0, 75.0 - currentPct)).toFixed(1)}%</span>
          </div>
          <div className="recovery-stat-divider" />
          <div className="recovery-stat-col">
            <span className="recovery-stat-lbl">Recovery Target</span>
            <span className="recovery-stat-num" style={{ color: '#168447' }}>75.3%</span>
          </div>
        </div>
      </div>

      {/* TODAY'S ATTENDANCE RECOVERY TASK (Prompt: RECOVERY TASK SYSTEM) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '20px 24px',
          marginBottom: '24px',
          boxShadow: '0 4px 14px rgba(16, 42, 67, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🎯</span>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#102A43', margin: 0 }}>
              TODAY'S RECOVERY TASK
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#627D98' }}>
              Goal: <strong>3 / 3 classes</strong>
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '6px',
                background: checkedClasses.length >= 3 ? '#ECFDF5' : '#FFFBEB',
                color: checkedClasses.length >= 3 ? '#047857' : '#B45309'
              }}
            >
              {checkedClasses.length >= 3 ? '✓ Daily task completed' : `Progress: ${Math.min(3, checkedClasses.length)} / 3`}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { id: 't1', name: 'Data Structures', time: '10:00 AM', room: 'Hall 204', idx: 0 },
            { id: 't2', name: 'Operating Systems', time: '12:00 PM', room: 'Hall 108', idx: 1 },
            { id: 't3', name: 'DBMS Lab', time: '02:00 PM', room: 'Lab 3', idx: 2 }
          ].map(task => {
            const isDone = checkedClasses.includes(task.idx);
            return (
              <div
                key={task.id}
                onClick={() => toggleCheck(task.idx)}
                style={{
                  border: isDone ? '1px solid #10B981' : '1px solid #E2E8F0',
                  background: isDone ? '#ECFDF5' : '#FAF8F3',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#102A43' }}>
                    {isDone ? '✓ ' : '○ '} {task.name}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#627D98' }}>{task.time} • {task.room}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDone ? '#059669' : '#D97706' }}>
                  {isDone ? 'Attended' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Step-by-Step Checklist */}
      <div className="recovery-interactive-checklist-box">
        <div className="checklist-header-row">
          <div>
            <h3 className="checklist-box-title">Simulate Your Next Classes</h3>
            <p className="checklist-box-subtitle">
              Check off your upcoming lectures below to see your progress toward the safe zone.
            </p>
          </div>
          <div className="checklist-progress-pill">
            {checkedClasses.length} of {recoveryClasses.length} Completed
          </div>
        </div>

        {/* The 5 Interactive Classes */}
        <div className="checklist-items-stack">
          {recoveryClasses.map((item, idx) => {
            const isChecked = checkedClasses.includes(idx);
            return (
              <div
                key={item.id}
                className={`checklist-item-row ${isChecked ? 'completed' : ''}`}
                onClick={() => toggleCheck(idx)}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') toggleCheck(idx); }}
              >
                <div className={`checklist-check-circle ${isChecked ? 'checked' : ''}`}>
                  {isChecked && <Check size={14} color="#ffffff" strokeWidth={3} />}
                </div>

                <div className="checklist-item-details">
                  <div className="checklist-item-name">
                    <span>{item.name}</span>
                    <span className="checklist-step-tag">Class {idx + 1}</span>
                  </div>
                  <div className="checklist-item-meta">
                    <Calendar size={12} color="#94a3b8" />
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.room}</span>
                  </div>
                </div>

                <div className="checklist-item-status">
                  {isChecked ? (
                    <span className="status-badge-inline safe">Attended ✓</span>
                  ) : (
                    <span className="status-badge-inline pending">Upcoming</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Celebration Announcement when Safe Zone reached */}
        {isSafeZoneReached ? (
          <div className="recovery-celebration-banner">
            <span className="celebration-emoji">🎉</span>
            <div>
              <h4 className="celebration-title">You're back in the safe zone!</h4>
              <p className="celebration-text">
                With 4 completed sessions, your attendance crosses <strong>75.0%</strong>. Keep this up and exam eligibility is guaranteed!
              </p>
            </div>
          </div>
        ) : (
          <div className="recovery-hint-banner">
            <Sparkles size={16} color="#d97706" />
            <span>
              Check <strong>{4 - checkedClasses.length} more {4 - checkedClasses.length === 1 ? 'class' : 'classes'}</strong> above to see the safe zone confirmation!
            </span>
          </div>
        )}
      </div>

      {/* Course-by-Course Subject Recovery Targets */}
      <div className="subject-recovery-breakdown-card">
        <h3 className="section-sub-title">Subject-Wise Recovery Breakdown</h3>
        <p className="section-sub-desc">
          Specific recovery requirements by individual course syllabus:
        </p>

        <div className="subject-recovery-table">
          <div className="sub-table-header">
            <span>Subject</span>
            <span>Current</span>
            <span>Projected</span>
            <span>Action Required</span>
            <span>Difficulty</span>
          </div>

          {subjects.map((sub) => (
            <div key={sub.code} className="sub-table-row">
              <div className="sub-table-title-col">
                <strong>{sub.code}</strong>
                <span>{sub.name}</span>
              </div>
              <div className="sub-table-pct">
                {sub.current_pct}%
              </div>
              <div className="sub-table-proj">
                {sub.projected_pct}%
              </div>
              <div className="sub-table-action">
                {sub.classes_needed > 0 ? (
                  <span style={{ color: '#c2410c', fontWeight: 600 }}>
                    Attend {sub.classes_needed} of next {sub.remaining}
                  </span>
                ) : (
                  <span style={{ color: '#168447', fontWeight: 600 }}>
                    Safe buffer maintained
                  </span>
                )}
              </div>
              <div className="sub-table-diff">
                <span className={`diff-pill ${sub.recovery_difficulty.toLowerCase().replace(' ', '-')}`}>
                  {sub.recovery_difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condonation Fallback Option */}
      <div className="condonation-fallback-strip">
        <div>
          <h4 className="condonation-strip-title">Have genuine medical or extenuating absence?</h4>
          <p className="condonation-strip-desc">
            If illness or official university representation caused absences, you can submit medical certificates for up to 10% condonation approval.
          </p>
        </div>
        <button className="btn-secondary" onClick={onOpenCondonation}>
          <span>Apply for Condonation →</span>
        </button>
      </div>
    </div>
  );
}
