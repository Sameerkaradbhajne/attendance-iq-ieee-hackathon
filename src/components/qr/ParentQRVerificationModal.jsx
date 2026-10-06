import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CheckCircle2, Lock, Smartphone } from 'lucide-react';
import AttendanceQRCode from './AttendanceQRCode';
import { qrAttendanceService } from '../../services/qrAttendanceService';

export default function ParentQRVerificationModal({
  isOpen,
  onClose,
  studentName = 'Sameer Patil',
  studentId = '23CS104'
}) {
  const [tokenPayload] = useState(() => qrAttendanceService.getParentVerificationPayload(studentId));
  const todayRecord = qrAttendanceService.getTodayParentAttendance(studentId);

  if (!isOpen) return null;

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
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(16, 42, 67, 0.25)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F0F4F8',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334E68'
          }}
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
          <ShieldCheck size={24} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102A43', margin: '0 0 4px 0' }}>
          Attendance Verification QR
        </h3>
        <p style={{ fontSize: '13px', color: '#627D98', margin: '0 0 20px 0' }}>
          Scan with any mobile device to securely verify today's in-class attendance record.
        </p>

        {/* QR Card */}
        <div style={{ background: '#FAF8F3', padding: '16px', borderRadius: '20px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
          <AttendanceQRCode
            value={tokenPayload}
            size={220}
          />
        </div>

        {/* Verification Summary Dossier */}
        <div style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#627D98', fontWeight: 700 }}>STUDENT</span>
            <strong style={{ fontSize: '13.5px', color: '#102A43' }}>{studentName}</strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12.5px' }}>
            <div>
              <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Date</span>
              <strong style={{ color: '#334E68' }}>06 Oct 2026</strong>
            </div>
            <div>
              <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Today's Status</span>
              <span style={{ color: '#059669', fontWeight: 800 }}>✓ Present</span>
            </div>
            <div>
              <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Subject</span>
              <strong style={{ color: '#334E68' }}>{todayRecord.subject}</strong>
            </div>
            <div>
              <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Verification Time</span>
              <strong style={{ color: '#334E68' }}>{todayRecord.time}</strong>
            </div>
          </div>
        </div>

        {/* Anti-fraud privacy notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#627D98', marginBottom: '16px' }}>
          <Lock size={12} color="#0D9488" />
          <span>Zero private academic data exposed • Cryptographically signed certificate</span>
        </div>

        <button
          className="btn-primary"
          onClick={onClose}
          style={{ width: '100%', background: '#102A43', color: '#FFFFFF', padding: '10px', fontSize: '13px' }}
        >
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
