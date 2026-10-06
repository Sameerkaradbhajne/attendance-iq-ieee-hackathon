import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Mail,
  Calendar,
  Sparkles,
  Phone,
  LayoutGrid,
  List,
  Target,
  FileSpreadsheet,
  Download,
  Clock,
  MessageSquare,
  QrCode,
  Check,
  Eye,
  FileText
} from 'lucide-react';
import StudentDirectory from './StudentDirectory';
import MentorQRModal from './qr/MentorQRModal';
import { qrAttendanceService } from '../services/qrAttendanceService';
import SendWhatsAppModal from './whatsapp/SendWhatsAppModal';
import ManageWhatsAppRosterModal from './whatsapp/ManageWhatsAppRosterModal';
import NotificationCenterView from './whatsapp/NotificationCenterView';
import { whatsAppNotificationService } from '../services/whatsappService';
import SubjectManagementView from './visual/SubjectManagementView';

export default function MentorDashboard({ onSelectStudent }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'directory' | 'action_center' | 'qr_sessions' | 'notifications' | 'subjects'
  const [actionFilter, setActionFilter] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedSessionDetail, setSelectedSessionDetail] = useState(null);

  // WhatsApp states
  const [isSendWhatsAppOpen, setIsSendWhatsAppOpen] = useState(false);
  const [isManageWhatsAppOpen, setIsManageWhatsAppOpen] = useState(false);
  const [whatsAppQuickStudent, setWhatsAppQuickStudent] = useState(null);
  const [whatsAppQuickTemplate, setWhatsAppQuickTemplate] = useState('LOW_ATTENDANCE');

  // Mentor cohort metrics (Section 2)
  const cohortMetrics = {
    totalStudents: 42,
    safeStudents: 31,
    atRiskStudents: 8,
    criticalStudents: 3,
    avgAttendance: 78.6,
    examEligibleCount: 36,
    examEligibleTotal: 42
  };

  // Immediate Attention Required List (Section 2)
  const attentionStudents = [
    {
      id: '23CS104',
      name: 'Sameer Patil',
      attendance: 74.2,
      risk: 'At Risk',
      actionLabel: 'Recovery Plan →',
      actionType: 'recovery',
      note: '0.8% below safe line. 4 consecutive classes needed.'
    },
    {
      id: '23CS109',
      name: 'Rahul Deshmukh',
      attendance: 68.4,
      risk: 'Critical',
      actionLabel: 'Meet Student →',
      actionType: 'meet',
      note: 'Shortage in OS Lab. Medical evidence required.'
    },
    {
      id: '23CS140',
      name: 'Priya Shah',
      attendance: 71.8,
      risk: 'At Risk',
      actionLabel: 'Check Condonation →',
      actionType: 'condonation',
      note: 'Dental surgery certificate submitted.'
    },
    {
      id: '23CS129',
      name: 'Tanvi Kadam',
      attendance: 64.2,
      risk: 'Critical',
      actionLabel: 'Parent Call →',
      actionType: 'parent',
      note: 'Extended absence. Guardian notified.'
    }
  ];

  // Action Center Cards (Section 11)
  const actionCenterCards = [
    {
      id: 'below-75',
      title: 'Students Below 75%',
      count: 11,
      badge: 'Immediate Priority',
      badgeColor: '#b91c1c',
      desc: 'Students with attendance below the mandatory institutional line.',
      icon: AlertTriangle,
      color: '#c2410c'
    },
    {
      id: 'near-eligibility',
      title: 'Students Near Eligibility',
      count: 6,
      badge: 'Quick Win',
      badgeColor: '#d97706',
      desc: 'Between 73% and 75%. Need 1 to 3 classes to become safe.',
      icon: Target,
      color: '#d97706'
    },
    {
      id: 'dropping',
      title: 'Attendance Dropping',
      count: 5,
      badge: 'Trend Warning',
      badgeColor: '#ea580c',
      desc: 'Declining momentum in the past 2 weeks.',
      icon: TrendingDown,
      color: '#ea580c'
    },
    {
      id: 'no-plan',
      title: 'Without Recovery Plans',
      count: 4,
      badge: 'Action Needed',
      badgeColor: '#7c3aed',
      desc: 'At risk students who haven\'t initiated a session roadmap.',
      icon: Clock,
      color: '#7c3aed'
    },
    {
      id: 'parent-followup',
      title: 'Parent Follow-ups',
      count: 3,
      badge: 'Communication',
      badgeColor: '#e11d48',
      desc: 'Critical deficit cases requiring guardian consultation.',
      icon: Phone,
      color: '#e11d48'
    },
    {
      id: 'mentor-meeting',
      title: 'Needing Mentor Meeting',
      count: 7,
      badge: 'Scheduled',
      badgeColor: '#2563eb',
      desc: 'One-on-one academic advisory sessions pending.',
      icon: Users,
      color: '#2563eb'
    }
  ];

  // Predefined QR Attendance Sessions History (Section 17)
  const sessionHistory = [
    {
      id: 'DS-TY-A-061026',
      subject: 'Data Structures',
      code: 'CS301',
      division: 'TY CSE - A',
      time: '10:30 AM',
      present: 36,
      total: 42,
      absent: 6,
      pct: 85.7,
      duration: '10 mins',
      date: 'Today, 06 Oct'
    },
    {
      id: 'OS-TY-A-051026',
      subject: 'Operating Systems',
      code: 'CS302',
      division: 'TY CSE - A',
      time: '12:00 PM',
      present: 39,
      total: 42,
      absent: 3,
      pct: 92.8,
      duration: '10 mins',
      date: 'Yesterday, 05 Oct'
    },
    {
      id: 'DBMS-TY-A-041026',
      subject: 'Database Engineering',
      code: 'CS303',
      division: 'TY CSE - A',
      time: '09:00 AM',
      present: 40,
      total: 42,
      absent: 2,
      pct: 95.2,
      duration: '15 mins',
      date: '04 Oct 2026'
    }
  ];

  return (
    <div className="mentor-dashboard-container">
      {/* Top Header (Section 2 & QR Attendance Button) */}
      <div className="mentor-header-area">
        <div>
          <span className="page-eyebrow" style={{ color: '#d97706' }}>Faculty Mentorship Workspace</span>
          <h1 className="page-title">Good morning, Dr. Radhika 👋</h1>
          <p className="page-subtitle">Here's how your students are doing today.</p>
        </div>

        {/* Top Right Action & Tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Main "+ Start QR Attendance" Button (Section 2) */}
          <button
            className="btn-primary"
            onClick={() => setIsQRModalOpen(true)}
            style={{
              background: '#0D9488',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              fontSize: '13px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
            }}
          >
            <QrCode size={16} />
            <span>+ Start QR Attendance</span>
          </button>

          {/* Navigation Tabs */}
          <div className="mentor-nav-tabs">
            <button
              className={`mentor-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutGrid size={15} />
              <span>Overview & Alerts</span>
            </button>
            <button
              className={`mentor-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => setActiveTab('directory')}
            >
              <List size={15} />
              <span>Student Directory</span>
            </button>
            <button
              className={`mentor-tab-btn ${activeTab === 'action_center' ? 'active' : ''}`}
              onClick={() => setActiveTab('action_center')}
            >
              <Zap size={15} />
              <span>Action Center</span>
            </button>
            <button
              className={`mentor-tab-btn ${activeTab === 'qr_sessions' ? 'active' : ''}`}
              onClick={() => setActiveTab('qr_sessions')}
            >
              <Clock size={15} />
              <span>Sessions ({sessionHistory.length})</span>
            </button>
            <button
              className={`mentor-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <MessageSquare size={15} />
              <span>Notification Center</span>
            </button>
            <button
              className={`mentor-tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              <FileText size={15} />
              <span>Subjects (15)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          VIEW 1: OVERVIEW & ALERTS (Section 2)
          ============================================================ */}
      {activeTab === 'overview' && (
        <>
          {/* 1. WHATSAPP COMMUNICATION CARD & ATTENTION WIDGET (Sections 1 & 17) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Feature Card: WhatsApp Communication */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '20px 24px',
                boxShadow: '0 4px 14px rgba(16, 42, 67, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#075E54', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                        💬 WhatsApp Communication
                      </h3>
                      <span style={{ fontSize: '11px', color: '#075E54', fontWeight: 700 }}>
                        Institutional Outreach Channel
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '11.5px', background: '#DCF8C6', color: '#075E54', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                    Active
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: '#627D98', margin: '8px 0 16px' }}>
                  "Reach students instantly when their attendance needs attention."
                </p>

                {/* 4 Stats Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px', textAlign: 'center' }}>
                  <div style={{ background: '#FAF8F3', padding: '10px 6px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#102A43' }}>38 / 42</div>
                    <div style={{ fontSize: '10.5px', color: '#627D98' }}>Connected</div>
                  </div>
                  <div style={{ background: '#F0FDFA', padding: '10px 6px', borderRadius: '10px', border: '1px solid #CCFBF1' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F766E' }}>36</div>
                    <div style={{ fontSize: '10.5px', color: '#627D98' }}>Enabled</div>
                  </div>
                  <div style={{ background: '#FEF2F2', padding: '10px 6px', borderRadius: '10px', border: '1px solid #FEE2E2' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#DC2626' }}>4</div>
                    <div style={{ fontSize: '10.5px', color: '#627D98' }}>Needs Number</div>
                  </div>
                  <div style={{ background: '#FAF5FF', padding: '10px 6px', borderRadius: '10px', border: '1px solid #F3E8FF' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#7E22CE' }}>24</div>
                    <div style={{ fontSize: '10.5px', color: '#627D98' }}>This Week</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsManageWhatsAppOpen(true)}
                  className="btn-primary"
                  style={{ flex: 1, background: '#075E54', padding: '8px 14px', borderRadius: '10px', fontSize: '12.5px', color: '#FFF' }}
                >
                  Manage WhatsApp →
                </button>
                <button
                  type="button"
                  onClick={() => { setWhatsAppQuickStudent(null); setIsSendWhatsAppOpen(true); }}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 14px', borderRadius: '10px', fontSize: '12.5px' }}
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Attention Widget: WhatsApp Attention (Section 17) */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '20px 24px',
                boxShadow: '0 4px 14px rgba(16, 42, 67, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>💬</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                      WhatsApp Attention
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', background: '#FEF2F2', color: '#B91C1C', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                    Immediate Priority
                  </span>
                </div>

                <div style={{ margin: '10px 0 14px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
                    8 students need communication.
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12.5px' }}>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>🔴 3 Critical (&lt;70%)</span>
                    <span style={{ color: '#D97706', fontWeight: 700 }}>🟡 5 At Risk (70-74.9%)</span>
                  </div>
                </div>

                <div style={{ background: '#FAF8F3', borderRadius: '10px', padding: '10px 14px', border: '1px solid #E5E7EB', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#627D98' }}>Last communication activity:</div>
                  <div style={{ fontSize: '12.5px', color: '#102A43', fontWeight: 600, marginTop: '2px' }}>
                    "Recovery reminders sent 18 minutes ago."
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setWhatsAppQuickTemplate('CRITICAL_ATTENDANCE');
                    setIsSendWhatsAppOpen(true);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', background: '#102A43', padding: '8px 14px', borderRadius: '10px', fontSize: '12.5px' }}
                >
                  Review Students & Dispatch →
                </button>
              </div>
            </div>
          </div>

          {/* 6 Overview Metric Cards (Section 2) */}
          <div className="mentor-metric-cards-six">
            {/* My Students */}
            <div className="mentor-stat-card" onClick={() => setActiveTab('directory')}>
              <span className="mstat-label">My Students</span>
              <div className="mstat-num">{cohortMetrics.totalStudents}</div>
              <span className="mstat-sub">Assigned Mentees</span>
            </div>

            {/* Safe */}
            <div className="mentor-stat-card safe-card">
              <span className="mstat-label">Safe</span>
              <div className="mstat-num" style={{ color: '#168447' }}>{cohortMetrics.safeStudents}</div>
              <span className="mstat-sub">students ≥75% line</span>
            </div>

            {/* At Risk */}
            <div className="mentor-stat-card risk-card">
              <span className="mstat-label">At Risk</span>
              <div className="mstat-num" style={{ color: '#c2410c' }}>{cohortMetrics.atRiskStudents}</div>
              <span className="mstat-sub">students (70–74.9%)</span>
            </div>

            {/* Critical */}
            <div className="mentor-stat-card critical-card">
              <span className="mstat-label">Critical</span>
              <div className="mstat-num" style={{ color: '#b91c1c' }}>{cohortMetrics.criticalStudents}</div>
              <span className="mstat-sub">students &lt;70%</span>
            </div>

            {/* Avg Attendance */}
            <div className="mentor-stat-card">
              <span className="mstat-label">Avg Attendance</span>
              <div className="mstat-num" style={{ color: '#2563eb' }}>{cohortMetrics.avgAttendance}%</div>
              <span className="mstat-sub">Cohort Momentum</span>
            </div>

            {/* Exam Eligible */}
            <div className="mentor-stat-card">
              <span className="mstat-label">Exam Eligible</span>
              <div className="mstat-num" style={{ color: '#102A43' }}>
                {cohortMetrics.examEligibleCount} <span style={{ fontSize: '16px', color: '#829AB1' }}>/ {cohortMetrics.examEligibleTotal}</span>
              </div>
              <span className="mstat-sub">Clearance Ready</span>
            </div>
          </div>

          {/* Attention Required Section (Section 2: "⚠ 8 students need attention") */}
          <div className="attention-required-card">
            <div className="attention-card-header">
              <div className="attention-title-group">
                <span className="attention-warning-pill">⚠ ATTENTION REQUIRED</span>
                <h3 className="attention-main-title">8 students need proactive guidance</h3>
                <p className="attention-subtitle">
                  These students have fallen below the mandatory 75% institutional standard and require recovery roadmap intervention.
                </p>
              </div>

              <button
                className="btn-secondary"
                onClick={() => setActiveTab('directory')}
                style={{ fontSize: '12.5px', padding: '6px 14px' }}
              >
                <span>View Full Group ({cohortMetrics.totalStudents}) →</span>
              </button>
            </div>

            <div className="attention-students-grid">
              {attentionStudents.map((item) => (
                <div key={item.id} className="attention-student-item">
                  <div className="attention-item-top">
                    <div>
                      <strong className="attention-student-name">{item.name}</strong>
                      <span className="attention-student-id">{item.id}</span>
                    </div>
                    <div className="attention-pct-badge">
                      <span className="att-num" style={{ color: item.risk === 'Critical' ? '#b91c1c' : '#c2410c' }}>
                        {item.attendance}%
                      </span>
                      <span className={`status-badge-mini ${item.risk === 'Critical' ? 'critical' : 'at-risk'}`}>
                        {item.risk}
                      </span>
                    </div>
                  </div>

                  <p className="attention-item-note">{item.note}</p>

                  <div className="attention-item-footer">
                    <button
                      className="attention-action-btn"
                      onClick={() => onSelectStudent ? onSelectStudent(item.id) : setActiveTab('directory')}
                    >
                      <span>{item.actionLabel}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Roster Preview Strip with "Open Student Directory" Button */}
          <div className="mentor-quick-directory-strip">
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#102A43', marginBottom: '2px' }}>
                Complete Student Management Directory
              </h4>
              <p style={{ fontSize: '13px', color: '#486581' }}>
                Search, filter, add new students, edit profiles, and export cohort data to Excel (.xlsx / .csv).
              </p>
            </div>
            <button className="btn-primary" onClick={() => setActiveTab('directory')}>
              <span>Open Student Directory (42 Students) →</span>
            </button>
          </div>
        </>
      )}

      {/* ============================================================
          VIEW 2: STUDENT DIRECTORY (Section 3 & 4)
          ============================================================ */}
      {activeTab === 'directory' && (
        <StudentDirectory
          role="mentor"
          defaultMentorFilter="Dr. Radhika Sen"
          onSelectStudentForDashboard={(id) => onSelectStudent && onSelectStudent(id)}
        />
      )}

      {/* ============================================================
          VIEW 3: MENTOR ACTION CENTER (Section 11)
          ============================================================ */}
      {activeTab === 'action_center' && (
        <div className="action-center-container">
          <div className="section-title-wrap" style={{ textAlign: 'left', margin: '0 0 24px 0' }}>
            <span className="section-eyebrow">INTERVENTION WORKFLOWS</span>
            <h2 className="section-headline">Mentor Action Center</h2>
            <p className="section-subheadline">
              One-click triage cohorts to quickly address attendance shortfalls, schedule meetings, and follow up with guardians.
            </p>
          </div>

          <div className="action-center-grid">
            {actionCenterCards.map(card => {
              const IconComp = card.icon;
              return (
                <div
                  key={card.id}
                  className="action-center-card"
                  onClick={() => setActiveTab('directory')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="action-card-top-row">
                    <div className="action-icon-circle" style={{ background: `${card.color}15`, color: card.color }}>
                      <IconComp size={22} />
                    </div>
                    <span className="action-card-count" style={{ color: card.color }}>
                      {card.count}
                    </span>
                  </div>

                  <h3 className="action-card-title">{card.title}</h3>
                  <p className="action-card-desc">{card.desc}</p>

                  <div className="action-card-footer">
                    <span className="action-card-badge" style={{ borderColor: `${card.color}40`, color: card.color }}>
                      {card.badge}
                    </span>
                    <span className="action-card-arrow">
                      View Students →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 4: ATTENDANCE SESSIONS HISTORY (Section 17)
          ============================================================ */}
      {activeTab === 'qr_sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '24px', boxShadow: '0 3px 12px rgba(16,42,67,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                  Today's QR Attendance Sessions
                </h3>
                <p style={{ fontSize: '13px', color: '#627D98', margin: '4px 0 0 0' }}>
                  Audited in-class attendance sessions conducted with time-limited security QR codes.
                </p>
              </div>

              <button
                className="btn-primary"
                onClick={() => setIsQRModalOpen(true)}
                style={{ background: '#0D9488', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <QrCode size={15} />
                <span>+ Start New Session</span>
              </button>
            </div>

            {/* Sessions Table */}
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="mentor-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Subject & Division</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Scheduled Time</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Turnout</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Attendance %</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Duration</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '12px', color: '#486581' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionHistory.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#102A43', fontSize: '13.5px' }}>{s.subject}</div>
                        <div style={{ fontSize: '11.5px', color: '#627D98' }}>{s.division} • {s.code}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334E68' }}>
                        {s.date} · {s.time}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#047857' }}>
                          {s.present}
                        </span>
                        <span style={{ fontSize: '12px', color: '#829AB1' }}> / {s.total} present ({s.absent} absent)</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontWeight: 800,
                          fontSize: '13px',
                          color: s.pct >= 90 ? '#047857' : s.pct >= 75 ? '#0D9488' : '#C2410C'
                        }}>
                          {s.pct}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#627D98' }}>
                        {s.duration}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '12px', padding: '5px 12px' }}
                          onClick={() => setSelectedSessionDetail(s)}
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 5: NOTIFICATION CENTER (Prompt: NOTIFICATION CENTER)
          ============================================================ */}
      {activeTab === 'notifications' && (
        <NotificationCenterView
          onOpenSendModal={() => {
            setWhatsAppQuickStudent(null);
            setIsSendWhatsAppOpen(true);
          }}
        />
      )}

      {/* ============================================================
          VIEW 6: SUBJECT MANAGEMENT (Prompt Requirement 10)
          ============================================================ */}
      {activeTab === 'subjects' && (
        <SubjectManagementView
          onSelectSubjectDetail={(sub) => {}}
        />
      )}

      {/* Session Details Modal (Section 17) */}
      {selectedSessionDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedSessionDetail(null)}>
          <div className="modal-box" style={{ maxWidth: '520px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                  Session Audit Dossier
                </h3>
                <span style={{ fontSize: '12px', color: '#627D98' }}>{selectedSessionDetail.id}</span>
              </div>
              <button
                onClick={() => setSelectedSessionDetail(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Subject</span>
                  <strong>{selectedSessionDetail.subject}</strong>
                </div>
                <div>
                  <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Division</span>
                  <strong>{selectedSessionDetail.division}</strong>
                </div>
                <div>
                  <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Turnout</span>
                  <strong style={{ color: '#047857' }}>{selectedSessionDetail.present} / {selectedSessionDetail.total} ({selectedSessionDetail.pct}%)</strong>
                </div>
                <div>
                  <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Time & Date</span>
                  <strong>{selectedSessionDetail.date} · {selectedSessionDetail.time}</strong>
                </div>
              </div>
            </div>

            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px', fontSize: '12.5px', color: '#065F46' }}>
              ✓ All 36 recorded scans verified via rotating QR token and student biometric PIN. Zero proxy claims logged.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn-primary"
                onClick={() => setSelectedSessionDetail(null)}
                style={{ background: '#102A43', color: '#FFFFFF', fontSize: '12.5px' }}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentor QR Attendance Modal */}
      <MentorQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onSessionEnded={(summary) => {
          // Live toast or notification
        }}
      />

      {/* Send WhatsApp Modal */}
      <SendWhatsAppModal
        isOpen={isSendWhatsAppOpen}
        onClose={() => setIsSendWhatsAppOpen(false)}
        initialStudent={whatsAppQuickStudent}
        initialTemplateKey={whatsAppQuickTemplate}
        onMessageSentSuccess={() => {
          // Feedback
        }}
      />

      {/* Manage WhatsApp Roster & Consent Modal */}
      <ManageWhatsAppRosterModal
        isOpen={isManageWhatsAppOpen}
        onClose={() => setIsManageWhatsAppOpen(false)}
        onUpdated={() => {}}
      />
    </div>
  );
}
