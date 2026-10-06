import React, { useState } from 'react';
import { X, RefreshCw, ShieldCheck, QrCode, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';
import AttendanceQRCode from './AttendanceQRCode';
import { qrAttendanceService } from '../../services/qrAttendanceService';

export default function StudentIdentityQRModal({
  isOpen,
  onClose,
  studentName = 'Sameer Patil',
  studentId = '23CS104',
  division = 'TY CSE - A'
}) {
  const [tokenKey, setTokenKey] = useState(() => qrAttendanceService.getStudentIdentityPayload(studentId));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshedNotice, setRefreshedNotice] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setTokenKey(qrAttendanceService.getStudentIdentityPayload(studentId));
    setRefreshedNotice(true);
    setTimeout(() => setRefreshedNotice(false), 2000);
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
          maxWidth: isFullscreen ? '100vw' : '460px',
          height: isFullscreen ? '100vh' : 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: isFullscreen ? '0' : '24px',
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
        {/* Top Control Bar */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
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
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={onClose}
            style={{
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
        </div>

        {/* Title */}
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F0FDFA', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
          <QrCode size={22} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102A43', margin: '0 0 4px 0' }}>
          My Attendance Identity QR
        </h3>
        <p style={{ fontSize: '13px', color: '#627D98', margin: '0 0 20px 0' }}>
          Authorized institutional identification for hall ticket audits and library access
        </p>

        {/* QR Display */}
        <div style={{ background: '#FAF8F3', padding: '16px', borderRadius: '20px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
          <AttendanceQRCode
            value={tokenKey}
            size={isFullscreen ? 320 : 220}
          />
        </div>

        {/* Student Details Card */}
        <div style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12.5px', textAlign: 'left' }}>
            <div>
              <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Student Name</span>
              <strong style={{ color: '#102A43' }}>{studentName}</strong>
            </div>
            <div>
              <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Roll / ID</span>
              <strong style={{ color: '#102A43' }}>{studentId}</strong>
            </div>
            <div>
              <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Class</span>
              <strong style={{ color: '#102A43' }}>{division}</strong>
            </div>
            <div>
              <span style={{ color: '#829AB1', fontSize: '11px', display: 'block' }}>Status</span>
              <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                Active Student
              </span>
            </div>
          </div>
        </div>

        {refreshedNotice && (
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginBottom: '10px' }}>
            ✓ Temporary token refreshed
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px' }}
          >
            <RefreshCw size={14} />
            <span>Refresh QR</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{ flex: 1, background: '#102A43', color: '#FFFFFF', fontSize: '12.5px' }}
          >
            <span>{isFullscreen ? 'Exit Full Screen' : 'Show Full Screen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
