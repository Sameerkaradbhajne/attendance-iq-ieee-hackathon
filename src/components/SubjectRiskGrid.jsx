import React, { useState } from 'react';
import { ChevronRight, Shield, AlertTriangle, CheckCircle2, BookOpen, Filter } from 'lucide-react';
import AnimatedCircularMeter from './visual/AnimatedCircularMeter';
import SubjectDetailModal from './visual/SubjectDetailModal';

export default function SubjectRiskGrid({ subjects = [], onSelectSubject }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [filterRisk, setFilterRisk] = useState('ALL'); // 'ALL' | 'SAFE' | 'WATCH' | 'AT RISK' | 'CRITICAL'

  const filteredSubjects = subjects.filter(sub => {
    if (filterRisk === 'ALL') return true;
    return sub.risk_level === filterRisk;
  });

  const handleCardClick = (sub) => {
    setSelectedSubject(sub);
    if (onSelectSubject) onSelectSubject(sub);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Your Subjects & Attendance Health</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Course-by-course attendance circles and minimum session recovery requirements
          </p>
        </div>

        {/* Risk Filter Tabs (Prompt Requirement 7) */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'SAFE', label: '🟢 Safe' },
            { id: 'WATCH', label: '🟡 Watch' },
            { id: 'AT RISK', label: '🟠 At Risk' },
            { id: 'CRITICAL', label: '🔴 Critical' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterRisk(f.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: filterRisk === f.id ? '1px solid #102A43' : '1px solid #E2E8F0',
                background: filterRisk === f.id ? '#102A43' : '#FFFFFF',
                color: filterRisk === f.id ? '#FFFFFF' : '#475569',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
        {filteredSubjects.map((sub) => {
          const riskKey = (sub.risk_level || 'SAFE').toLowerCase().replace(' ', '-');
          const isAtRisk = sub.risk_level === 'AT RISK' || sub.risk_level === 'CRITICAL';
          const safeCushion = Math.max(0, Math.floor(((sub.attended || 18) - 0.75 * (sub.conducted || 24)) / 0.75));

          return (
            <div
              key={sub.code}
              className="subject-card"
              onClick={() => handleCardClick(sub)}
              style={{
                cursor: 'pointer',
                borderRadius: '18px',
                padding: '20px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(16, 42, 67, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: '#F1F5F9', color: '#334E68', padding: '2px 6px', borderRadius: '4px' }}>
                      {sub.code}
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#102A43', margin: '4px 0 0' }}>
                      {sub.name}
                    </h4>
                  </div>
                  <span className={`status-badge ${riskKey}`} style={{ fontSize: '11px' }}>
                    {sub.risk_level}
                  </span>
                </div>

                {/* Animated Circular Meter inside Subject Card (Prompt Requirement 3) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', margin: '12px 0 16px' }}>
                  <AnimatedCircularMeter
                    percentage={sub.current_pct || 75.0}
                    size={96}
                    strokeWidth={8}
                    label=""
                    showGlow={false}
                  />

                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#102A43' }}>
                      {sub.attended || 18} / {sub.conducted || 24} classes
                    </div>
                    <div style={{ color: '#829AB1', marginTop: '2px' }}>
                      Faculty: {sub.faculty || 'Prof. S. Sengupta'}
                    </div>
                    <div style={{ marginTop: '4px', fontWeight: 700, color: isAtRisk ? '#C2410C' : '#059669' }}>
                      {isAtRisk ? `⚠ Shortfall: ${(75 - (sub.current_pct || 0)).toFixed(1)}%` : `✓ Buffer: ${safeCushion} safe absences`}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                <span style={{ fontSize: '11.5px', color: isAtRisk ? '#C2410C' : '#168447', fontWeight: 700 }}>
                  {sub.classes_needed > 0 ? `Target: Attend next ${sub.classes_needed} classes` : 'Safe zone maintained'}
                </span>
                <span style={{ fontSize: '11.5px', color: '#0D9488', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  View Details <ChevronRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Interactive Subject Detail Modal (Prompt Requirement 4) */}
      <SubjectDetailModal
        isOpen={Boolean(selectedSubject)}
        onClose={() => setSelectedSubject(null)}
        subject={selectedSubject}
      />
    </div>
  );
}
