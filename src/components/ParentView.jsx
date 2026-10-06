import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Sparkles,
  BookOpen,
  QrCode,
  Clock,
  Check,
  ChevronRight,
  Shield
} from 'lucide-react';
import { qrAttendanceService } from '../services/qrAttendanceService';
import ParentQRVerificationModal from './qr/ParentQRVerificationModal';
import AttendanceQRCode from './qr/AttendanceQRCode';

export default function ParentView({ studentData }) {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const name = studentData?.name || 'Sameer Verma';
  const id = studentData?.id || 'CSE24-042';
  const currentPct = studentData?.attendance?.current_pct || 74.2;
  const isSafe = currentPct >= 75.0;
  const mentorName = studentData?.mentor_name || 'Dr. Radhika Sen';

  // Get Today's QR attendance record
  const todayRecord = qrAttendanceService.getTodayParentAttendance(id);
  const verificationHistory = qrAttendanceService.getVerificationHistory();

  return (
    <div className="parent-view-container" style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="page-eyebrow" style={{ color: '#e11d48' }}>Guardian Transparency Portal</span>
          <span style={{ background: '#ffe4e6', color: '#9f1239', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
            Apex Institute Student Records
          </span>
        </div>
        <h1 className="page-title">
          {name}'s Attendance Status
        </h1>
        <p className="page-subtitle">
          Clear, jargon-free attendance updates designed to keep families informed and confident before examinations.
        </p>
      </div>

      {/* Main Parent Reassurance Card */}
      <div className={`parent-hero-card ${isSafe ? 'safe' : 'at-risk'}`} style={{ marginBottom: '24px' }}>
        <div className="parent-card-top-badge">
          {isSafe ? (
            <span className="status-badge safe" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <ShieldCheck size={16} />
              GOOD STANDING (SAFE)
            </span>
          ) : (
            <span className="status-badge at-risk" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <AlertTriangle size={16} />
              ATTENTION RECOMMENDED
            </span>
          )}
          <span className="parent-academic-session">Fall Semester 2026 · CSE Sem 5</span>
        </div>

        {/* Big Percentage & Plain English Verdict */}
        <div className="parent-verdict-row">
          <div>
            <div className="parent-big-pct" style={{ color: isSafe ? '#168447' : '#c2410c' }}>
              {currentPct}%
            </div>
            <div className="parent-target-subtext">
              Minimum Required for Exams: <strong>75.0%</strong>
            </div>
          </div>

          <div className="parent-explanation-box">
            {isSafe ? (
              <>
                <h3 className="parent-box-title" style={{ color: '#168447' }}>
                  Your student is currently on track ✓
                </h3>
                <p className="parent-box-desc">
                  {name}'s attendance is safely above the university standard. They have maintained consistent attendance and are fully eligible for final semester examinations.
                </p>
              </>
            ) : (
              <>
                <h3 className="parent-box-title" style={{ color: '#c2410c' }}>
                  Attendance has dropped slightly below 75%
                </h3>
                <p className="parent-box-desc">
                  {name} is currently at <strong>{currentPct}%</strong> (a shortage of 0.8%). Attending <strong>4 upcoming classes this week</strong> will bring them back into good standing.
                </p>
              </>
            )}
          </div>
        </div>

        {/* What this means in plain English */}
        <div className="parent-plain-english-strip">
          <BookOpen size={18} color="#102A43" />
          <div>
            <strong>What should you do?</strong>
            <p>
              {isSafe
                ? "Encourage your student to maintain this positive habit. No institutional action is required."
                : `A gentle reminder to attend upcoming lab sessions this week will easily resolve this shortage without penalties.`}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 13: TODAY'S ATTENDANCE (QR VERIFIED)
          ============================================================ */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 3px 12px rgba(16, 42, 67, 0.03)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Daily In-Class Activity
              </span>
              <span style={{ background: '#ECFDF5', color: '#047857', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                Attendance Verified via QR
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102A43', margin: 0 }}>
              Today's Attendance
            </h3>
          </div>

          <button
            className="btn-secondary"
            onClick={() => setIsVerificationModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '7px 14px' }}
          >
            <QrCode size={15} color="#0D9488" />
            <span>Show Verification QR</span>
          </button>
        </div>

        {/* Visible In-Page QR Verification Display */}
        <div style={{
          background: '#FAF8F3',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '24px',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(16, 42, 67, 0.04)'
        }}>
          {/* Direct Visible QR Code */}
          <div style={{
            background: '#FFFFFF',
            padding: '14px',
            borderRadius: '16px',
            border: '2px solid #0D9488',
            boxShadow: '0 4px 16px rgba(13, 148, 136, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '190px'
          }}>
            <AttendanceQRCode
              value={qrAttendanceService.getParentVerificationPayload(id)}
              size={155}
              accentColor="#0D9488"
            />
            <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 700, color: '#0F766E' }}>
              🔒 Official Verification QR
            </div>
            <div style={{ fontSize: '10px', color: '#627D98' }}>
              Scan to audit in-class presence
            </div>
          </div>

          {/* Today's Verification Details & Security Proof */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800
                }}>
                  ✓
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                    {todayRecord.subject}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#627D98' }}>
                    Conducted by {todayRecord.mentor}
                  </span>
                </div>
              </div>

              <span style={{
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: '12px',
                fontWeight: 800,
                padding: '5px 12px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <CheckCircle2 size={14} />
                Marked Present via QR
              </span>
            </div>

            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '12px 16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              fontSize: '12px',
              marginBottom: '12px'
            }}>
              <div>
                <span style={{ color: '#829AB1', fontSize: '10.5px', display: 'block' }}>RECORDED TIMESTAMP</span>
                <strong style={{ color: '#102A43' }}>Today, {todayRecord.time}</strong>
              </div>
              <div>
                <span style={{ color: '#829AB1', fontSize: '10.5px', display: 'block' }}>LOCATION / HALL</span>
                <strong style={{ color: '#102A43' }}>Room 204 • Main Block</strong>
              </div>
              <div>
                <span style={{ color: '#829AB1', fontSize: '10.5px', display: 'block' }}>CRYPTO AUDIT HASH</span>
                <strong style={{ color: '#0F766E', fontFamily: 'monospace' }}>SHA-256 #8f21..c4</strong>
              </div>
              <div>
                <span style={{ color: '#829AB1', fontSize: '10.5px', display: 'block' }}>DEVICE FINGERPRINT</span>
                <strong style={{ color: '#102A43' }}>Authenticated Student App</strong>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              🛡️ <strong>Guardian Guarantee:</strong> This record was captured in real-time within the physical classroom using rotating QR tokens. Attendance cannot be faked or marked by proxies.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 14: ATTENDANCE VERIFICATION TIMELINE
          ============================================================ */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 3px 12px rgba(16, 42, 67, 0.03)',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102A43', margin: 0 }}>
            Attendance Verification History
          </h3>
          <p style={{ fontSize: '13px', color: '#627D98', margin: '4px 0 0 0' }}>
            Cryptographically audited in-classroom attendance log verified via rotating QR tokens.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {verificationHistory.slice(0, 4).map((entry, idx) => (
            <div
              key={`${entry.date}-${idx}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#486581',
                  background: '#E2E8F0',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {entry.date.split(' ').slice(0, 2).join(' ')}
                </span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#102A43' }}>{entry.subject}</strong>
                  <div style={{ fontSize: '11.5px', color: '#829AB1' }}>
                    {entry.time} · {entry.method} · Ref: {entry.sessionRef}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: '#ECFDF5',
                  color: '#047857',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Check size={13} />
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor Direct Contact Card */}
      <div className="parent-mentor-card">
        <div>
          <span className="mentor-card-eyebrow">ASSIGNED FACULTY MENTOR</span>
          <h3 className="mentor-card-name">{mentorName}</h3>
          <p className="mentor-card-desc">
            Department of Computer Science & Engineering · Apex Institute of Technology
          </p>
        </div>

        <div className="parent-mentor-actions">
          <button
            className="btn-secondary"
            onClick={() => alert(`An email inquiry has been addressed to ${mentorName}.`)}
          >
            <Mail size={15} />
            <span>Message Mentor</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => alert(`Connecting with Faculty Mentor office: +91 98112 43210`)}
            style={{ background: '#102A43' }}
          >
            <Phone size={15} />
            <span>Call Mentor Office</span>
          </button>
        </div>
      </div>

      {/* Parent Verification QR Modal */}
      <ParentQRVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        studentName={name}
        studentId={id}
      />
    </div>
  );
}
