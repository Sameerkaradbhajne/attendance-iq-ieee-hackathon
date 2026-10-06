import React, { useState } from 'react';
import {
  BarChart2,
  Users,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function HODDashboard() {
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  const departmentMetrics = {
    dept_name: 'Computer Science & Engineering',
    total_students: 420,
    overall_attendance_pct: 79.4,
    students_at_risk: 38,
    critical_cases: 11,
    mentors_count: 8,
    condonation_pending: 6
  };

  const sections = [
    { name: 'Section 5A', students: 66, avg_pct: 81.2, at_risk: 6, mentor: 'Dr. Radhika Sen' },
    { name: 'Section 5B', students: 68, avg_pct: 78.5, at_risk: 9, mentor: 'Prof. K. Narayanan' },
    { name: 'Section 5C', students: 65, avg_pct: 76.8, at_risk: 12, mentor: 'Dr. S. Mukherjee' },
    { name: 'Section 7A', students: 72, avg_pct: 82.4, at_risk: 4, mentor: 'Dr. M. Chawla' },
    { name: 'Section 7B', students: 74, avg_pct: 79.1, at_risk: 7, mentor: 'Prof. V. Gupta' }
  ];

  return (
    <div className="hod-dashboard-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="page-eyebrow" style={{ color: '#7c3aed' }}>Departmental Overview</span>
          <span style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
            CSE Department · Dr. A. K. Sharma
          </span>
        </div>
        <h1 className="page-title">
          Department Attendance Health
        </h1>
        <p className="page-subtitle">
          Real-time institutional oversight across semesters, section cohorts, and faculty mentor interventions.
        </p>
      </div>

      {/* Top Department Metrics */}
      <div className="hod-metrics-grid">
        <div className="hod-metric-card">
          <span className="hod-metric-lbl">Overall Dept Attendance</span>
          <div className="hod-metric-val" style={{ color: '#168447' }}>
            {departmentMetrics.overall_attendance_pct}%
          </div>
          <span className="hod-metric-sub">Across 420 enrolled students</span>
        </div>

        <div className="hod-metric-card">
          <span className="hod-metric-lbl">Students At Risk (70-75%)</span>
          <div className="hod-metric-val" style={{ color: '#c2410c' }}>
            {departmentMetrics.students_at_risk}
          </div>
          <span className="hod-metric-sub">Eligible for recovery plan</span>
        </div>

        <div className="hod-metric-card">
          <span className="hod-metric-lbl">Critical Shortage (&lt;70%)</span>
          <div className="hod-metric-val" style={{ color: '#b91c1c' }}>
            {departmentMetrics.critical_cases}
          </div>
          <span className="hod-metric-sub">Parent notices dispatched</span>
        </div>

        <div className="hod-metric-card">
          <span className="hod-metric-lbl">Condonation Pending</span>
          <div className="hod-metric-val" style={{ color: '#7c3aed' }}>
            {departmentMetrics.condonation_pending}
          </div>
          <span className="hod-metric-sub">Requires HOD endorsement</span>
        </div>
      </div>

      {/* Section Cohort Comparison */}
      <div className="hod-content-card">
        <div className="hod-card-header">
          <div>
            <h3 className="section-sub-title">Section Attendance Comparison</h3>
            <p className="section-sub-desc">
              Cohort performance and faculty mentor accountability
            </p>
          </div>
          <button
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '6px 14px' }}
            onClick={() => alert('Official Department Attendance Summary CSV downloaded.')}
          >
            <Download size={14} />
            <span>Export Roster CSV</span>
          </button>
        </div>

        <div className="hod-sections-table">
          <div className="hod-table-hdr">
            <span>Cohort Section</span>
            <span>Enrolled</span>
            <span>Average Attendance</span>
            <span>At-Risk Students</span>
            <span>Faculty Mentor</span>
          </div>

          {sections.map((sec) => (
            <div key={sec.name} className="hod-table-row">
              <div>
                <strong>{sec.name}</strong>
              </div>
              <div>
                {sec.students} students
              </div>
              <div>
                <span style={{ fontWeight: 700, color: sec.avg_pct >= 80 ? '#168447' : '#c2410c' }}>
                  {sec.avg_pct}%
                </span>
              </div>
              <div>
                <span className="status-badge at-risk" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {sec.at_risk} students
                </span>
              </div>
              <div style={{ color: '#575c66', fontSize: '13px' }}>
                {sec.mentor}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
