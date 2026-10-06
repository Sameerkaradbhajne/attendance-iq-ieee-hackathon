import React from 'react';
import {
  LayoutDashboard,
  Target,
  Sliders,
  Compass,
  FileText,
  Upload,
  Settings,
  Bell,
  Home,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Users,
  BarChart2,
  FileCheck,
  Heart,
  QrCode,
  BookOpen
} from 'lucide-react';

export default function Navigation({
  currentRole,
  currentStudentId,
  activeTab,
  onSelectRole,
  onSelectStudent,
  onNavigate,
  onOpenImport,
  onOpenPolicy,
  onOpenNotifications,
  onOpenQRScanner,
  onOpenIdentityQR,
  unreadCount = 2
}) {
  const isStudentRole = currentRole === 'student';

  return (
    <>
      {/* Sticky Compact Top Demo Switcher Bar for Judges */}
      <div className="demo-bar">
        <div className="demo-bar-left">
          <span className="demo-badge">Hackathon Persona Bar</span>
          <div className="demo-role-pills">
            <button
              className={`role-pill-btn ${currentRole === 'landing' ? 'active' : ''}`}
              onClick={() => onSelectRole('landing')}
            >
              🌐 Landing Page
            </button>
            <button
              className={`role-pill-btn ${currentRole === 'login' ? 'active' : ''}`}
              onClick={() => onSelectRole('login')}
            >
              🔑 Login Experience
            </button>
            <span style={{ color: '#4b5563', margin: '0 4px' }}>|</span>
            <button
              className={`role-pill-btn ${isStudentRole && currentStudentId === 'CSE24-042' ? 'active' : ''}`}
              onClick={() => { onSelectRole('student'); onSelectStudent('CSE24-042'); }}
            >
              👨‍🎓 Student (Sameer • 74.2% At Risk)
            </button>
            <button
              className={`role-pill-btn ${isStudentRole && currentStudentId === 'CSE24-018' ? 'active' : ''}`}
              onClick={() => { onSelectRole('student'); onSelectStudent('CSE24-018'); }}
            >
              ✨ Safe Student (Ananya • 86.4% Freedom)
            </button>
            <button
              className={`role-pill-btn ${currentRole === 'mentor' ? 'active' : ''}`}
              onClick={() => onSelectRole('mentor')}
            >
              👩‍🏫 Mentor (Dr. Radhika)
            </button>
            <button
              className={`role-pill-btn ${currentRole === 'hod' ? 'active' : ''}`}
              onClick={() => onSelectRole('hod')}
            >
              🏛️ HOD (Dr. Sharma)
            </button>
            <button
              className={`role-pill-btn ${currentRole === 'exam_cell' ? 'active' : ''}`}
              onClick={() => onSelectRole('exam_cell')}
            >
              📋 Exam Cell
            </button>
            <button
              className={`role-pill-btn ${currentRole === 'parent' ? 'active' : ''}`}
              onClick={() => onSelectRole('parent')}
            >
              👨‍👩‍👦 Parent View
            </button>
          </div>
        </div>
      </div>

      {/* Main Editorial Application Header */}
      {currentRole !== 'landing' && currentRole !== 'login' && (
        <header className="app-header">
          <div className="brand-section">
            <div className="brand-logo-mark" onClick={() => onSelectRole('landing')} style={{ cursor: 'pointer' }}>
              <GraduationCap size={18} color="#ffffff" />
            </div>
            <div className="brand-text">
              <span className="brand-title">ATTENDANCE IQ</span>
              <span className="brand-tagline">Attendance Intelligence & Recovery</span>
            </div>
          </div>

          {/* Student Sub-Navigation Tabs */}
          {isStudentRole && (
            <nav className="main-nav" aria-label="Student Navigation">
              <button
                className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('dashboard')}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </button>

              <button
                className={`nav-link-btn ${activeTab === 'recovery' ? 'active' : ''}`}
                onClick={() => onNavigate('recovery')}
              >
                <Target size={15} />
                <span>Recovery Plan</span>
              </button>

              <button
                className={`nav-link-btn ${activeTab === 'simulator' ? 'active' : ''}`}
                onClick={() => onNavigate('simulator')}
              >
                <Sliders size={15} />
                <span>What-If Simulator</span>
              </button>

              <button
                className={`nav-link-btn ${activeTab === 'freedom' ? 'active' : ''}`}
                onClick={() => onNavigate('freedom')}
              >
                <Compass size={15} />
                <span>Freedom Meter</span>
              </button>

              <button
                className={`nav-link-btn ${activeTab === 'subjects' ? 'active' : ''}`}
                onClick={() => onNavigate('subjects')}
              >
                <BookOpen size={15} />
                <span>Subjects</span>
              </button>

              <button
                className={`nav-link-btn ${activeTab === 'condonation' ? 'active' : ''}`}
                onClick={() => onNavigate('condonation')}
              >
                <FileText size={15} />
                <span>Condonation</span>
              </button>

              <button
                className="nav-link-btn"
                onClick={onOpenQRScanner}
                style={{
                  background: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  fontWeight: 700
                }}
                title="Scan classroom attendance QR"
              >
                <QrCode size={15} color="#059669" />
                <span>Scan QR</span>
              </button>
            </nav>
          )}

          {/* Quick Institutional Utilities */}
          <div className="header-actions">
            {isStudentRole && onOpenIdentityQR && (
              <button
                className="icon-action-btn"
                onClick={onOpenIdentityQR}
                title="My Attendance Identity QR"
                aria-label="Attendance Identity QR"
                style={{ color: '#0D9488' }}
              >
                <QrCode size={16} />
              </button>
            )}

            <button
              className="icon-action-btn"
              onClick={onOpenImport}
              title="Import CSV Records"
              aria-label="Import CSV"
            >
              <Upload size={16} />
            </button>

            <button
              className="icon-action-btn"
              onClick={onOpenPolicy}
              title="Institution Compliance Policy (75%)"
              aria-label="Institutional Policy"
            >
              <Settings size={16} />
            </button>

            <button
              className="icon-action-btn"
              onClick={onOpenNotifications}
              title="Attendance Alerts & Early Warnings"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && <span className="badge-dot" />}
            </button>

            {/* Active Persona Pill */}
            <div className="user-profile-badge">
              <div
                className="user-avatar-placeholder"
                style={{
                  background: isStudentRole
                    ? (currentStudentId === 'CSE24-042' ? '#eef5fc' : '#ecfdf5')
                    : currentRole === 'mentor' ? '#fbf4ea'
                    : currentRole === 'hod' ? '#f2eff9'
                    : currentRole === 'exam_cell' ? '#e6f6f3'
                    : '#faefed',
                  color: isStudentRole
                    ? (currentStudentId === 'CSE24-042' ? '#2563eb' : '#059669')
                    : currentRole === 'mentor' ? '#d97706'
                    : currentRole === 'hod' ? '#7c3aed'
                    : currentRole === 'exam_cell' ? '#0d9488'
                    : '#e11d48'
                }}
              >
                {isStudentRole ? (currentStudentId === 'CSE24-042' ? 'SV' : 'AK') : currentRole.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name-text">
                  {isStudentRole
                    ? (currentStudentId === 'CSE24-042' ? 'Sameer Verma' : 'Ananya Kumar')
                    : currentRole === 'mentor' ? 'Dr. Radhika Sen'
                    : currentRole === 'hod' ? 'Dr. A. K. Sharma'
                    : currentRole === 'exam_cell' ? 'Exam Cell Officer'
                    : 'Mr. R. Verma'}
                </span>
                <span className="user-role-text">
                  {isStudentRole
                    ? (currentStudentId === 'CSE24-042' ? 'CSE Sem 5 · At Risk (74.2%)' : 'CSE Sem 5 · Safe (86.4%)')
                    : currentRole === 'mentor' ? 'Faculty Mentor'
                    : currentRole === 'hod' ? 'Head of Department'
                    : currentRole === 'exam_cell' ? 'Academic Administration'
                    : 'Guardian'}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
