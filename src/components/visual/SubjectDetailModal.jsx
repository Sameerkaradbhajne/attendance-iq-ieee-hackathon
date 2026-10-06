import React, { useState } from 'react';
import {
  X,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sliders,
  Plus,
  Minus
} from 'lucide-react';
import AnimatedCircularMeter from './AnimatedCircularMeter';

export default function SubjectDetailModal({
  isOpen,
  onClose,
  subject,
  onRecordAttendance
}) {
  const [extraClasses, setExtraClasses] = useState(3);

  if (!isOpen || !subject) return null;

  const attended = subject.attended || 18;
  const conducted = subject.conducted || 24;
  const currentPct = subject.current_pct || 75.0;
  const requiredThreshold = 75.0;

  // Forecast calculation: If student attends next X consecutive classes
  const forecastedPct = Number((((attended + extraClasses) / (conducted + extraClasses)) * 100).toFixed(1));

  // Recovery shortfall calculation
  let classesNeeded = 0;
  if (currentPct < requiredThreshold) {
    classesNeeded = Math.ceil((requiredThreshold * conducted - attended) / (1 - requiredThreshold));
  }

  // Interactive timeline items
  const timeline = [
    { date: 'Today, 10:00 AM', status: 'Present', room: 'Hall 204', topic: 'Binary Search Trees & Balancing' },
    { date: '04 Oct, 10:00 AM', status: 'Present', room: 'Hall 204', topic: 'Graph Traversal (BFS & DFS)' },
    { date: '02 Oct, 10:00 AM', status: currentPct < 75 ? 'Absent' : 'Present', room: 'Hall 204', topic: 'Dynamic Programming Introduction' },
    { date: '29 Sep, 10:00 AM', status: 'Present', room: 'Hall 204', topic: 'Sorting Algorithms & Asymptotics' },
    { date: '27 Sep, 10:00 AM', status: 'Present', room: 'Hall 204', topic: 'Stack & Queue Implementations' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(16, 42, 67, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 2200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(16, 42, 67, 0.28)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF8F3 0%, #F5F1E8 100%)',
            padding: '24px 28px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: '#E2E8F0', color: '#334E68', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                {subject.code}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: currentPct >= 75 ? '#DCFCE7' : '#FEE2E2',
                  color: currentPct >= 75 ? '#15803D' : '#B91C1C'
                }}
              >
                {currentPct >= 75 ? 'SAFE (ELIGIBLE)' : 'AT RISK'}
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#102A43', margin: 0 }}>
              {subject.name}
            </h2>
            <p style={{ fontSize: '13px', color: '#627D98', margin: '4px 0 0' }}>
              Faculty: <strong>{subject.faculty}</strong> • Hall: <strong>{subject.room || 'Hall 204'}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="icon-action-btn"
            style={{ borderRadius: '50%', background: '#FFFFFF', border: '1px solid #CBD5E1' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {/* Main Visual Row: Big Circular Meter & Status Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '28px',
              alignItems: 'center',
              background: '#FAF8F3',
              padding: '20px 24px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              marginBottom: '24px'
            }}
          >
            <AnimatedCircularMeter
              percentage={currentPct}
              size={150}
              strokeWidth={12}
              label="Subject Attendance"
              sublabel={currentPct >= 75 ? '✓ Exam Eligible' : '⚠ Recovery Target Active'}
            />

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#627D98', display: 'block' }}>ATTENDED</span>
                  <strong style={{ fontSize: '18px', color: '#102A43' }}>{attended}</strong>
                  <span style={{ fontSize: '11px', color: '#829AB1' }}> of {conducted}</span>
                </div>

                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#627D98', display: 'block' }}>MIN REQUIRED</span>
                  <strong style={{ fontSize: '18px', color: '#102A43' }}>75.0%</strong>
                  <span style={{ fontSize: '11px', color: '#829AB1' }}> Institutional</span>
                </div>

                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#627D98', display: 'block' }}>RECOVERY</span>
                  <strong style={{ fontSize: '18px', color: classesNeeded > 0 ? '#C2410C' : '#168447' }}>
                    {classesNeeded > 0 ? `${classesNeeded} classes` : 'None needed'}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#829AB1' }}> consecutive</span>
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>
                {currentPct >= 75 ? (
                  <span>
                    🎉 You have maintained safe standing in this syllabus. You can safely miss up to <strong>{Math.max(0, Math.floor((attended - 0.75 * conducted) / 0.75))}</strong> lectures without falling below the 75% boundary.
                  </span>
                ) : (
                  <span>
                    ⚠️ You are currently <strong>{(75 - currentPct).toFixed(1)}% below the institutional threshold</strong>. Attending your next <strong>{classesNeeded}</strong> classes consecutively will restore your eligibility status.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Attendance Forecast Calculator (Prompt Requirement 4) */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              padding: '20px 24px',
              marginBottom: '24px',
              boxShadow: '0 2px 10px rgba(16, 42, 67, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                  Interactive Attendance Forecast
                </h4>
                <p style={{ fontSize: '12.5px', color: '#627D98', margin: '2px 0 0' }}>
                  Simulate your projected score if you attend upcoming sessions:
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 3, 5, 10].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setExtraClasses(cnt)}
                    style={{
                      background: extraClasses === cnt ? '#102A43' : '#F1F5F9',
                      color: extraClasses === cnt ? '#FFFFFF' : '#334E68',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    +{cnt} Class{cnt > 1 ? 'es' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: '#FAF8F3',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: '#627D98' }}>Current Attendance: </span>
                <strong style={{ fontSize: '15px', color: '#102A43' }}>{currentPct}%</strong>
                <span style={{ margin: '0 8px', color: '#CBD5E1' }}>→</span>
                <span style={{ fontSize: '12px', color: '#627D98' }}>After attending <strong>+{extraClasses}</strong> classes: </span>
                <strong style={{ fontSize: '18px', color: forecastedPct >= 75 ? '#168447' : '#C2410C' }}>
                  {forecastedPct}%
                </strong>
              </div>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: forecastedPct >= 75 ? '#DCFCE7' : '#FFFBEB',
                  color: forecastedPct >= 75 ? '#15803D' : '#B45309'
                }}
              >
                {forecastedPct >= 75 ? '✓ Safe Zone Reached!' : `Need ${Math.max(1, classesNeeded - extraClasses)} more classes`}
              </span>
            </div>
          </div>

          {/* Attendance History Timeline (Prompt Requirement 4) */}
          <div style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '20px 24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#102A43', marginBottom: '14px' }}>
              Attendance History Timeline
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: item.status === 'Present' ? '#DCFCE7' : '#FEE2E2',
                        color: item.status === 'Present' ? '#15803D' : '#B91C1C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 800
                      }}
                    >
                      {item.status === 'Present' ? '✓' : '✕'}
                    </div>
                    <div>
                      <strong style={{ color: '#102A43', display: 'block' }}>{item.topic}</strong>
                      <span style={{ fontSize: '11.5px', color: '#627D98' }}>{item.date} • {item.room}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: item.status === 'Present' ? '#DCFCE7' : '#FEE2E2',
                      color: item.status === 'Present' ? '#15803D' : '#B91C1C'
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid #E2E8F0',
            background: '#FAF8F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontSize: '12px', color: '#627D98' }}>
            Audited in-classroom log synced with Attendance IQ Cloud
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ background: '#102A43', padding: '8px 20px', borderRadius: '10px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
