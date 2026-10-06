import React, { useState, useEffect } from 'react';
import {
  QrCode,
  X,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import AttendanceQRCode from './AttendanceQRCode';
import { qrAttendanceService } from '../../services/qrAttendanceService';
import { exportStudentsToCSV } from '../../services/studentDirectory';

export default function MentorQRModal({ isOpen, onClose, onSessionEnded }) {
  const [step, setStep] = useState('CREATE'); // 'CREATE' | 'LIVE_SESSION' | 'SUMMARY'
  const [formData, setFormData] = useState({
    subject: 'Data Structures',
    code: 'CS301',
    division: 'TY CSE - A',
    semester: 5,
    date: '06 Oct 2026',
    time: '10:30 AM',
    durationMinutes: 10
  });

  const [activeSession, setActiveSession] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes
  const [summaryData, setSummaryData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Subscribe to live scan events
  useEffect(() => {
    const unsubscribe = qrAttendanceService.subscribe((event, data) => {
      if (event === 'ATTENDANCE_MARKED') {
        setActiveSession(prev => {
          if (!prev) return prev;
          // Avoid duplicate attendees in local state
          const exists = prev.attendees.some(a => a.id === data.attendee.id);
          if (exists) return prev;
          return {
            ...prev,
            attendees: [data.attendee, ...prev.attendees]
          };
        });
      }
    });
    return unsubscribe;
  }, []);

  // Timer countdown
  useEffect(() => {
    if (step !== 'LIVE_SESSION' || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, secondsRemaining]);

  if (!isOpen) return null;

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartSession = (e) => {
    e.preventDefault();
    const session = qrAttendanceService.startSession(formData);
    setActiveSession(session);
    setSecondsRemaining(formData.durationMinutes * 60);
    setStep('LIVE_SESSION');
  };

  const handleEndSession = () => {
    const summary = qrAttendanceService.endSession();
    setSummaryData(summary);
    setStep('SUMMARY');
    if (onSessionEnded) onSessionEnded(summary);
  };

  const handleExportSummaryExcel = () => {
    if (!summaryData) return;
    const records = summaryData.attendees.map(a => ({
      id: a.id,
      name: a.name,
      department: summaryData.department,
      division: summaryData.division,
      subject: summaryData.subject,
      date: summaryData.date,
      time: a.time,
      status: a.status
    }));
    exportStudentsToCSV(records, `Attendance_IQ_${summaryData.id}_Roster.csv`);
  };

  // Add simulated attendee for interactive judge demonstration
  const handleSimulateQuickScan = () => {
    const demoNames = [
      { id: '23CS104', name: 'Sameer Patil', time: 'Just now' },
      { id: '23CS112', name: 'Kavita Rao', time: 'Just now' },
      { id: '23CS119', name: 'Devendra K.', time: 'Just now' }
    ];
    const pick = demoNames.find(n => !activeSession?.attendees.some(a => a.id === n.id)) || {
      id: `23CS${Math.floor(100 + Math.random() * 80)}`,
      name: 'Sahil Deshmukh',
      time: 'Just now'
    };

    qrAttendanceService.processScan({
      studentId: pick.id,
      studentName: pick.name,
      studentDivision: 'TY CSE - A'
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(16, 42, 67, 0.72)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isFullscreen ? '0' : '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: isFullscreen ? '100vw' : '100%',
          maxWidth: isFullscreen ? '100vw' : step === 'LIVE_SESSION' ? '880px' : '580px',
          height: isFullscreen ? '100vh' : 'auto',
          maxHeight: isFullscreen ? '100vh' : '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: isFullscreen ? '0' : '24px',
          boxShadow: '0 25px 60px rgba(16, 42, 67, 0.25)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Floating Control Bar */}
        <div style={{ position: 'absolute', top: '18px', right: '18px', display: 'flex', gap: '8px', zIndex: 10 }}>
          {step === 'LIVE_SESSION' && (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                background: '#F0F4F8',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334E68'
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Display'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              background: '#F0F4F8',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334E68'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ============================================================
            STEP 1: CREATE ATTENDANCE SESSION FORM
            ============================================================ */}
        {step === 'CREATE' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#CCFBF1', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Smart QR Attendance
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                  Create Attendance Session
                </h2>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: '#627D98', margin: '4px 0 24px 0' }}>
              Generate a time-limited, rotating security QR code for in-class verification.
            </p>

            <form onSubmit={handleStartSession} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-grid-2col">
                <div className="form-field">
                  <label>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Data Structures">Data Structures (CS301)</option>
                    <option value="Operating Systems">Operating Systems (CS302)</option>
                    <option value="Database Engineering">Database Engineering (CS303)</option>
                    <option value="Computer Networks">Computer Networks (CS304)</option>
                    <option value="Web Architecture">Web Architecture (CS305)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Class / Division</label>
                  <select
                    value={formData.division}
                    onChange={e => setFormData({ ...formData, division: e.target.value })}
                  >
                    <option value="TY CSE - A">TY CSE - A (42 Students)</option>
                    <option value="TY CSE - B">TY CSE - B (40 Students)</option>
                    <option value="SY IT - A">SY IT - A (45 Students)</option>
                    <option value="Final Year CSE">Final Year CSE (38 Students)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-3col">
                <div className="form-field">
                  <label>Semester</label>
                  <input
                    type="number"
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
                  />
                </div>

                <div className="form-field">
                  <label>Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>QR Duration</label>
                  <select
                    value={formData.durationMinutes}
                    onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  >
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes (Recommended)</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>
              </div>

              {/* Security Banner */}
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12.5px',
                color: '#166534'
              }}>
                <ShieldCheck size={18} color="#15803D" />
                <span>
                  <strong>Anti-Proxy Security:</strong> This QR uses temporary signed tokens and class verification to prevent unauthorized off-campus scans.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: '#0D9488', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <QrCode size={16} />
                  <span>Generate Attendance QR</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            STEP 2: FULL-SCREEN ATTENDANCE SESSION VIEW
            ============================================================ */}
        {step === 'LIVE_SESSION' && activeSession && (
          <div style={{ padding: isFullscreen ? '40px' : '32px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Session Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 12px', borderRadius: '20px', color: '#065F46', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span>Attendance Session Active</span>
              </div>
              <h2 style={{ fontSize: isFullscreen ? '32px' : '26px', fontWeight: 800, color: '#102A43', margin: '4px 0 2px 0' }}>
                {activeSession.subject}
              </h2>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#486581' }}>
                {activeSession.division} • Semester {activeSession.semester}
              </div>
              <p style={{ fontSize: '13px', color: '#829AB1', margin: '4px 0 0 0' }}>
                Scan to mark your attendance using your smartphone camera
              </p>
            </div>

            {/* Main Interactive Grid: QR Center & Live Feed Right */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isFullscreen ? '1fr 380px' : '1fr 320px',
              gap: '24px',
              alignItems: 'center',
              flex: 1
            }}>
              {/* Left / Center QR Card */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                background: '#FAF8F3',
                borderRadius: '20px',
                border: '1px solid #E2E8F0'
              }}>
                <AttendanceQRCode
                  value={activeSession.token}
                  size={isFullscreen ? 300 : 230}
                  subtleScanLine={true}
                />

                {/* Session ID & Timer */}
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11.5px', color: '#627D98', fontWeight: 600 }}>
                    Session ID: <strong style={{ color: '#102A43' }}>{activeSession.id}</strong>
                  </div>

                  <div style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    color: secondsRemaining < 120 ? '#DC2626' : '#102A43',
                    fontVariantNumeric: 'tabular-nums',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <Clock size={24} color={secondsRemaining < 120 ? '#DC2626' : '#0D9488'} />
                    <span>{formatTimer(secondsRemaining)}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#829AB1' }}>remaining</span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#627D98', marginTop: '4px' }}>
                    🔒 QR refreshes automatically for security • Class verified
                  </div>
                </div>
              </div>

              {/* Right: Live Attendance Counter & Roster Feed */}
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                maxHeight: isFullscreen ? '480px' : '380px'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#627D98', textTransform: 'uppercase' }}>
                      Live Attendance
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#0D9488' }}>
                      {activeSession.attendees.length} / {activeSession.totalStudents}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: `${(activeSession.attendees.length / activeSession.totalStudents) * 100}%`,
                        height: '100%',
                        background: '#10B981',
                        transition: 'width 0.4s ease-out'
                      }}
                    />
                  </div>
                </div>

                {/* Recently Joined List */}
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#486581', marginBottom: '8px' }}>
                  Recently Marked Present ({activeSession.attendees.length}):
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                  {activeSession.attendees.map((a, idx) => (
                    <div
                      key={`${a.id}-${idx}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: idx === 0 ? '#ECFDF5' : '#F8FAFC',
                        border: idx === 0 ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        animation: 'fadeInDown 0.25s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={14} color="#059669" />
                        <div>
                          <strong style={{ fontSize: '12.5px', color: '#102A43', display: 'block' }}>{a.name}</strong>
                          <span style={{ fontSize: '10.5px', color: '#829AB1' }}>{a.id}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#627D98' }}>{a.time}</span>
                    </div>
                  ))}
                </div>

                {/* Judge Demo Quick-Scan Trigger */}
                <button
                  type="button"
                  onClick={handleSimulateQuickScan}
                  style={{
                    marginTop: '12px',
                    background: '#F0FDFA',
                    border: '1px dashed #0D9488',
                    color: '#0F766E',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  title="Simulate student scanning this QR"
                >
                  <Sparkles size={13} />
                  <span>Simulate Student Scan (Demo Trigger)</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              <div style={{ fontSize: '12.5px', color: '#627D98' }}>
                Present: <strong style={{ color: '#047857' }}>{activeSession.attendees.length}</strong> · Pending: <strong style={{ color: '#B45309' }}>{activeSession.totalStudents - activeSession.attendees.length}</strong>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-primary"
                  onClick={handleEndSession}
                  style={{ background: '#DC2626', color: '#FFFFFF', padding: '9px 20px', fontSize: '13px' }}
                >
                  <span>End Attendance Session</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 3: ATTENDANCE SESSION SUMMARY (Section 12)
            ============================================================ */}
        {step === 'SUMMARY' && summaryData && (
          <div style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                <CheckCircle2 size={28} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                Attendance Complete ✓
              </h2>
              <p style={{ fontSize: '14px', color: '#486581', margin: '4px 0 0 0' }}>
                {summaryData.subject} • {summaryData.division}
              </p>
            </div>

            {/* Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11.5px', color: '#627D98', fontWeight: 700 }}>STUDENTS PRESENT</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                  {summaryData.presentCount} <span style={{ fontSize: '14px', color: '#829AB1' }}>/ {summaryData.totalStudents}</span>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11.5px', color: '#627D98', fontWeight: 700 }}>STUDENTS ABSENT</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#B91C1C', marginTop: '2px' }}>
                  {summaryData.absentCount}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11.5px', color: '#627D98', fontWeight: 700 }}>ATTENDANCE RATE</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#102A43', marginTop: '2px' }}>
                  {summaryData.attendancePct}%
                </div>
              </div>
            </div>

            {/* Smart Attendance Insight (Section 19) */}
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
              border: '1px solid #BBF7D0',
              borderRadius: '14px',
              padding: '14px 18px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={14} color="#059669" />
                <span>Smart Attendance Insight</span>
              </div>
              <p style={{ fontSize: '13px', color: '#14532D', margin: 0, lineHeight: 1.5 }}>
                {summaryData.smartInsight}
              </p>
            </div>

            {/* At-Risk Impact Strip */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FED7AA', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', fontSize: '12.5px', color: '#9A3412' }}>
              <strong>At-Risk Students Recorded Present:</strong> {summaryData.atRiskPresent.join(', ')}
            </div>

            {/* Bottom Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn-secondary"
                onClick={handleExportSummaryExcel}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <FileSpreadsheet size={15} color="#059669" />
                <span>Export Excel</span>
              </button>

              <button
                className="btn-primary"
                onClick={onClose}
                style={{ background: '#102A43', color: '#FFFFFF', fontSize: '13px' }}
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
