import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import AttendanceHealthCard from './components/AttendanceHealthCard';
import EarlyWarningBanner from './components/EarlyWarningBanner';
import AttendanceTrendChart from './components/AttendanceTrendChart';
import SubjectRiskGrid from './components/SubjectRiskGrid';
import WhatIfSimulator from './components/WhatIfSimulator';
import FreedomMeter from './components/FreedomMeter';
import RecoveryPlan from './components/RecoveryPlan';
import CondonationView from './components/CondonationView';
import MentorDashboard from './components/MentorDashboard';
import HODDashboard from './components/HODDashboard';
import ExamCellDashboard from './components/ExamCellDashboard';
import ParentView from './components/ParentView';
import DataImportModal from './components/DataImportModal';
import PolicyModal from './components/PolicyModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import LandingPage from './components/LandingPage';
import RoleLoginPage from './components/RoleLoginPage';
import StudentQRScannerModal from './components/qr/StudentQRScannerModal';
import StudentIdentityQRModal from './components/qr/StudentIdentityQRModal';
import HackathonWhatsAppDemoBar from './components/whatsapp/HackathonWhatsAppDemoBar';
import { api, fallbackStudents, fallbackPolicy } from './services/api';
import { QrCode } from 'lucide-react';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Attendance IQ ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '640px', margin: '40px auto', background: '#fff', border: '1px solid #fed7aa', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 16px rgba(16, 42, 67, 0.08)' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌿</div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#102a43', marginBottom: '8px' }}>Attendance IQ Notice</h2>
          <p style={{ fontSize: '13.5px', color: '#627d98', marginBottom: '20px' }}>
            {this.state.error?.message || 'A temporary display issue occurred while rendering this view.'}
          </p>
          <button
            className="btn-primary"
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
          >
            Reload View
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Current view: 'landing' | 'login' | 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const [activeLoginRole, setActiveLoginRole] = useState('student'); // 'student' | 'mentor' | 'hod' | 'examCell' | 'parent'

  // Dashboard role & student state
  const [currentRole, setCurrentRole] = useState('student'); // 'student' | 'mentor' | 'hod' | 'exam_cell' | 'parent'
  const [currentStudentId, setCurrentStudentId] = useState('CSE24-042'); // Sameer Verma (At Risk)
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'recovery' | 'simulator' | 'freedom' | 'condonation'
  const [studentData, setStudentData] = useState(() => fallbackStudents['CSE24-042'] || null);
  const [policy, setPolicy] = useState(() => fallbackPolicy);
  const [notifications, setNotifications] = useState([]);
  const [warningDismissed, setWarningDismissed] = useState(false);

  // Modals
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isIdentityQROpen, setIsIdentityQROpen] = useState(false);

  const handleAttendanceMarkedSuccess = (scanResult) => {
    setStudentData(prev => {
      if (!prev) return prev;
      const attended = (prev.attendance.attended || 96) + 1;
      const conducted = (prev.attendance.conducted || 130) + 1;
      const newPct = Number(((attended / conducted) * 100).toFixed(1));
      return {
        ...prev,
        attendance: {
          ...prev.attendance,
          attended,
          conducted,
          current_pct: newPct,
          projected_pct: Number((newPct - 1.2).toFixed(1)),
          risk_level: newPct >= 75 ? 'SAFE' : 'AT RISK'
        }
      };
    });

    setNotifications(prev => [
      {
        id: `notif-qr-${Date.now()}`,
        category: 'QR Verification',
        title: '✓ Attendance Marked via QR',
        message: `${scanResult.subject} attendance verified at ${scanResult.time}. Attendance rose to ${scanResult.newPct}%.`,
        timestamp: 'Just now',
        unread: true,
        action_link: '/dashboard',
        severity: 'green'
      },
      ...prev
    ]);
  };

  // Load initial policy and notifications
  useEffect(() => {
    const loadData = async () => {
      const pol = await api.getPolicy();
      setPolicy(pol);
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    };
    loadData();
  }, []);

  // Reload student whenever student ID changes
  useEffect(() => {
    let cancelled = false;
    const fetchStudent = async () => {
      const data = await api.getStudent(currentStudentId);
      if (!cancelled) setStudentData(data);
    };
    fetchStudent();
    return () => { cancelled = true; };
  }, [currentStudentId]);

  // Navigate to login from landing page role cards
  const handleRoleCardClick = (roleKey) => {
    setActiveLoginRole(roleKey);
    setCurrentView('login');
  };

  // Successful login handler -> redirects to the corresponding dashboard
  const handleLoginSuccess = ({ role, roleKey }) => {
    const targetDashboardRole = roleKey === 'examCell' ? 'exam_cell' : roleKey;
    setCurrentRole(targetDashboardRole);
    if (targetDashboardRole === 'student') {
      setCurrentStudentId('CSE24-042');
      setActiveTab('dashboard');
    }
    setCurrentView('dashboard');
  };

  // Demo bar role switcher
  const handleSelectRole = (role) => {
    if (role === 'landing') {
      setCurrentView('landing');
      return;
    }
    if (role === 'login') {
      setActiveLoginRole('student');
      setCurrentView('login');
      return;
    }
    setCurrentRole(role);
    setCurrentView('dashboard');
    if (role === 'student') {
      setActiveTab('dashboard');
    }
  };

  const handleSelectStudent = (id) => {
    setCurrentStudentId(id);
    setCurrentRole('student');
    setCurrentView('dashboard');
    setActiveTab('dashboard');
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setCurrentRole('student');
    setCurrentView('dashboard');
  };

  const handlePolicyUpdated = (newPolicy) => {
    setPolicy(newPolicy);
  };

  const isAtRiskStudent = studentData?.attendance?.risk_level === 'AT RISK' || studentData?.attendance?.risk_level === 'CRITICAL';

  return (
    <div className="app-wrapper">
      {/* Top Demo Persona Bar (Available throughout app for judge quick-swapping) */}
      <div className="demo-bar">
        <div className="demo-bar-left">
          <span className="demo-badge">Hackathon Demo Switcher</span>
          <div className="demo-role-pills">
            <button
              className={`role-pill-btn ${currentView === 'landing' ? 'active' : ''}`}
              onClick={() => setCurrentView('landing')}
            >
              🌐 Landing Page
            </button>
            <button
              className={`role-pill-btn ${currentView === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveLoginRole('student'); setCurrentView('login'); }}
            >
              🔑 Login Experience
            </button>
            <span style={{ color: '#4b5563', margin: '0 4px' }}>|</span>
            <button
              className={`role-pill-btn ${currentView === 'dashboard' && currentRole === 'student' && currentStudentId === 'CSE24-042' ? 'active' : ''}`}
              onClick={() => { handleSelectRole('student'); handleSelectStudent('CSE24-042'); }}
            >
              👨‍🎓 Student (Sameer • 74.2%)
            </button>
            <button
              className={`role-pill-btn ${currentView === 'dashboard' && currentRole === 'student' && currentStudentId === 'CSE24-018' ? 'active' : ''}`}
              onClick={() => { handleSelectRole('student'); handleSelectStudent('CSE24-018'); }}
            >
              ✨ Safe (Ananya • 86.4%)
            </button>
            <button
              className={`role-pill-btn ${currentView === 'dashboard' && currentRole === 'mentor' ? 'active' : ''}`}
              onClick={() => handleSelectRole('mentor')}
            >
              👩‍🏫 Mentor (Dr. Radhika)
            </button>
            <button
              className={`role-pill-btn ${currentView === 'dashboard' && currentRole === 'hod' ? 'active' : ''}`}
              onClick={() => handleSelectRole('hod')}
            >
              🏛️ HOD (Dr. Sharma)
            </button>
            <button
              className={`role-pill-btn ${currentView === 'dashboard' && currentRole === 'exam_cell' ? 'active' : ''}`}
              onClick={() => handleSelectRole('exam_cell')}
            >
              📋 Exam Cell
            </button>
            <button
              className={`role-pill-btn ${currentView === 'dashboard' && currentRole === 'parent' ? 'active' : ''}`}
              onClick={() => handleSelectRole('parent')}
            >
              👨‍👩‍👦 Parent View
            </button>
          </div>
        </div>
      </div>

      {/* 1. LANDING PAGE VIEW */}
      {currentView === 'landing' && (
        <LandingPage
          onSelectRoleLogin={handleRoleCardClick}
          onExploreDashboard={() => { setCurrentRole('student'); setCurrentView('dashboard'); }}
        />
      )}

      {/* 2. ROLE-BASED LOGIN EXPERIENCE (MATCHING USER REFERENCE) */}
      {currentView === 'login' && (
        <RoleLoginPage
          initialRole={activeLoginRole}
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setCurrentView('landing')}
        />
      )}

      {/* 3. AUTHENTICATED DASHBOARD VIEWS */}
      {currentView === 'dashboard' && (
        <>
          <Navigation
            currentRole={currentRole}
            currentStudentId={currentStudentId}
            activeTab={activeTab}
            onSelectRole={handleSelectRole}
            onSelectStudent={handleSelectStudent}
            onNavigate={handleNavigate}
            onOpenImport={() => setIsImportOpen(true)}
            onOpenPolicy={() => setIsPolicyOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onOpenIdentityQR={() => setIsIdentityQROpen(true)}
            unreadCount={notifications.filter(n => n.unread).length}
          />

          <ErrorBoundary>
            <main className="page-container">
            {/* STUDENT DASHBOARD */}
            {currentRole === 'student' && studentData && (
              <>
                {activeTab === 'dashboard' && (
                  <div>
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                      <div>
                        <div className="page-eyebrow">Personal Attendance Intelligence</div>
                        <h1 className="page-title">Good morning, {studentData.name.split(' ')[0]} 👋</h1>
                        <p className="page-subtitle">
                          Here's where your semester attendance stands and where it's projected to finish before exams.
                        </p>
                      </div>

                      <button
                        className="btn-primary"
                        onClick={() => setIsQRScannerOpen(true)}
                        style={{
                          background: '#0D9488',
                          color: '#FFFFFF',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
                        }}
                      >
                        <QrCode size={16} />
                        <span>Scan Attendance QR</span>
                      </button>
                    </div>

                    {/* Proactive Early Warning Banner */}
                    {isAtRiskStudent && !warningDismissed && (
                      <EarlyWarningBanner
                        message={studentData.attendance.shortage_warning}
                        onViewPlan={() => setActiveTab('recovery')}
                        onDismiss={() => setWarningDismissed(true)}
                      />
                    )}

                    {/* Hero Attendance Health Centerpiece Card */}
                    <AttendanceHealthCard
                      attendance={studentData.attendance}
                      studentName={studentData.name}
                      onViewRecovery={() => setActiveTab('recovery')}
                      onOpenSimulator={() => setActiveTab('simulator')}
                      onOpenFreedom={() => setActiveTab('freedom')}
                    />

                    {/* Hackathon Core Differentiator: Prominent Freedom Meter Spotlight Card */}
                    <div className="dashboard-freedom-spotlight">
                      <div className="spotlight-left">
                        <div className="spotlight-badge-row">
                          <span className="spotlight-tag">⭐ SIGNATURE FEATURE</span>
                          <span className="spotlight-title">Attendance Freedom Meter</span>
                        </div>

                        {studentData.attendance.current_pct >= 75.0 ? (
                          <>
                            <div className="spotlight-metric-line">
                              <span className="spotlight-big-num">4</span>
                              <span className="spotlight-num-label">classes of freedom earned</span>
                            </div>
                            <div className="spotlight-pills-track">
                              <span className="pills-emoji">🟢 🟢 🟢 🟢 ⚪ ⚪</span>
                              <span className="pills-caption">4 safe absence buffer</span>
                            </div>
                            <p className="spotlight-fun-text">
                              "You've earned some breathing room! Go touch some grass 🌿 (or maybe that Bhandara trip 😄). Just don't disappear for a week!"
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="spotlight-metric-line">
                              <span className="spotlight-big-num at-risk">0</span>
                              <span className="spotlight-num-label">classes of buffer right now</span>
                            </div>
                            <div className="spotlight-pills-track">
                              <span className="pills-emoji">⚪ ⚪ ⚪ ⚪ ⚪ ⚪</span>
                              <span className="pills-caption">0.8% below 75% line</span>
                            </div>
                            <p className="spotlight-fun-text">
                              "Attend the next 4 scheduled classes to enter the safe zone and unlock your first Freedom Class!"
                            </p>
                          </>
                        )}
                      </div>

                      <div className="spotlight-right-actions">
                        <button
                          className="btn-primary"
                          onClick={() => setActiveTab('simulator')}
                          style={{ background: studentData.attendance.current_pct >= 75.0 ? '#168447' : '#102A43' }}
                        >
                          <span>Test in What-If Simulator →</span>
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => setActiveTab('freedom')}
                        >
                          <span>Open Full Freedom Meter</span>
                        </button>
                      </div>
                    </div>

                    {/* Subject-Wise Risk Map */}
                    <div style={{ marginBottom: '32px' }}>
                      <SubjectRiskGrid
                        subjects={studentData.subjects}
                        onSelectSubject={() => {}}
                      />
                    </div>

                    {/* Historical Attendance Trend & Projected Line Chart */}
                    <div className="card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Attendance Story</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Weekly cumulative progress vs projected trajectory and {policy?.required_threshold || 75.0}% mandatory institutional line
                          </p>
                        </div>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '12px', padding: '5px 12px' }}
                          onClick={() => setActiveTab('simulator')}
                        >
                          Run Hypothetical Simulation
                        </button>
                      </div>

                      <AttendanceTrendChart
                        data={studentData.attendance.weekly_trend}
                        projectedPct={studentData.attendance.projected_pct}
                        thresholdPct={policy?.required_threshold || 75.0}
                      />
                    </div>
                  </div>
                )}

                {/* RISK & RECOVERY TAB */}
                {activeTab === 'recovery' && (
                  <RecoveryPlan
                    studentData={studentData}
                    onOpenCondonation={() => setActiveTab('condonation')}
                  />
                )}

                {/* WHAT-IF SIMULATOR TAB */}
                {activeTab === 'simulator' && (
                  <WhatIfSimulator
                    studentId={currentStudentId}
                    studentData={studentData}
                  />
                )}

                {/* FREEDOM METER TAB */}
                {activeTab === 'freedom' && (
                  <FreedomMeter
                    studentData={studentData}
                    onSwitchToSafeStudent={() => handleSelectStudent('CSE24-018')}
                  />
                )}

                {/* SUBJECTS TAB */}
                {activeTab === 'subjects' && (
                  <div style={{ marginTop: '12px' }}>
                    <SubjectRiskGrid
                      subjects={studentData.subjects}
                      onSelectSubject={() => {}}
                    />
                  </div>
                )}

                {/* CONDONATION WORKFLOW TAB */}
                {activeTab === 'condonation' && (
                  <CondonationView
                    currentStudent={studentData}
                    currentRole={currentRole}
                  />
                )}
              </>
            )}

            {/* MENTOR VIEW */}
            {currentRole === 'mentor' && (
              <MentorDashboard
                onSelectStudent={(id) => handleSelectStudent(id)}
              />
            )}

            {/* HOD VIEW */}
            {currentRole === 'hod' && (
              <HODDashboard />
            )}

            {/* EXAM CELL VIEW */}
            {currentRole === 'exam_cell' && (
              <ExamCellDashboard />
            )}

            {/* PARENT VIEW */}
            {currentRole === 'parent' && (
              <ParentView
                studentData={studentData}
              />
            )}
          </main>
          </ErrorBoundary>
        </>
      )}

      {/* CSV Data Import Modal */}
      <DataImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={() => {}}
      />

      {/* Institutional Policy Settings Modal */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        currentPolicy={policy}
        onPolicyUpdated={handlePolicyUpdated}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onNavigate={handleNavigate}
      />

      {/* Student QR Scanner Modal */}
      <StudentQRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        studentName={studentData?.name || 'Sameer Patil'}
        studentId={currentStudentId}
        studentDivision="TY CSE - A"
        onAttendanceMarked={handleAttendanceMarkedSuccess}
      />

      {/* Student Identity QR Modal */}
      <StudentIdentityQRModal
        isOpen={isIdentityQROpen}
        onClose={() => setIsIdentityQROpen(false)}
        studentName={studentData?.name || 'Sameer Patil'}
        studentId={currentStudentId}
        division="TY CSE - A"
      />

      {/* Interactive Hackathon WhatsApp Demo Bar for Judges */}
      <HackathonWhatsAppDemoBar
        onNavigateToRecovery={() => {
          setCurrentRole('student');
          setCurrentStudentId('CSE24-042');
          setCurrentView('dashboard');
          setActiveTab('recovery');
        }}
        onStudentUpdated={(updated) => {}}
      />
    </div>
  );
}
