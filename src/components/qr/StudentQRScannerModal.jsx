import React, { useState } from 'react';
import {
  Camera,
  X,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { qrAttendanceService } from '../../services/qrAttendanceService';

export default function StudentQRScannerModal({
  isOpen,
  onClose,
  studentName = 'Sameer Patil',
  studentId = '23CS104',
  studentDivision = 'TY CSE - A',
  onAttendanceMarked
}) {
  const [viewState, setViewState] = useState('SCANNER'); // 'SCANNER' | 'SUCCESS' | 'ERROR'
  const [scanResult, setScanResult] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [demoScenario, setDemoScenario] = useState('VALID'); // 'VALID' | 'EXPIRED' | 'WRONG_CLASS' | 'ALREADY_MARKED' | 'INVALID'

  if (!isOpen) return null;

  const handleExecuteScan = (scenarioToUse = demoScenario) => {
    const result = qrAttendanceService.processScan({
      studentId,
      studentName,
      studentDivision,
      scenario: scenarioToUse
    });

    setScanResult(result);

    if (result.status === 'SUCCESS') {
      setViewState('SUCCESS');
      if (onAttendanceMarked) onAttendanceMarked(result);
    } else {
      setViewState('ERROR');
    }
  };

  const handleReset = () => {
    setViewState('SCANNER');
    setScanResult(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(16, 42, 67, 0.75)',
        backdropFilter: 'blur(6px)',
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
          boxShadow: '0 25px 60px rgba(16, 42, 67, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'scaleIn 0.2s ease-out'
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
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#102A43',
            zIndex: 10,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <X size={16} />
        </button>

        {/* ============================================================
            VIEW 1: SCANNER INTERFACE
            ============================================================ */}
        {viewState === 'SCANNER' && (
          <div>
            {/* Header */}
            <div style={{ padding: '24px 24px 16px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Attendance IQ Scanner
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#102A43', margin: '2px 0 4px 0' }}>
                Scan Attendance QR
              </h2>
              <p style={{ fontSize: '13px', color: '#627D98', margin: 0 }}>
                Position the QR code inside the frame to record your presence
              </p>
            </div>

            {/* Simulated Camera Viewfinder */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '280px',
                backgroundColor: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Camera background simulation grid */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.15,
                  backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Viewfinder Target Box */}
              <div
                style={{
                  width: '190px',
                  height: '190px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* 4 Corner Target Brackets */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '22px', height: '22px', borderTop: '3px solid #14B8A6', borderLeft: '3px solid #14B8A6', borderRadius: '4px 0 0 0' }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: '22px', height: '22px', borderTop: '3px solid #14B8A6', borderRight: '3px solid #14B8A6', borderRadius: '0 4px 0 0' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '22px', height: '22px', borderBottom: '3px solid #14B8A6', borderLeft: '3px solid #14B8A6', borderRadius: '0 0 0 4px' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '22px', height: '22px', borderBottom: '3px solid #14B8A6', borderRight: '3px solid #14B8A6', borderRadius: '0 0 4px 0' }} />

                {/* Animated Green Laser Scan Line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#14B8A6',
                    boxShadow: '0 0 10px #14B8A6, 0 0 20px #14B8A6',
                    animation: 'scanLaser 2s infinite ease-in-out'
                  }}
                />

                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Looking for QR...
                </span>
              </div>

              {/* Viewfinder Controls (Torch Toggle) */}
              <div style={{ position: 'absolute', bottom: '14px', display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setTorchOn(!torchOn)}
                  style={{
                    background: torchOn ? '#F59E0B' : 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap size={13} />
                  <span>{torchOn ? 'Torch On' : 'Flashlight'}</span>
                </button>
              </div>
            </div>

            {/* Instruction Callout */}
            <div style={{ padding: '16px 24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'center' }}>
              <p style={{ fontSize: '12.5px', color: '#627D98', margin: 0 }}>
                💡 <strong>Instructions:</strong> Ask your mentor or faculty to display the active session attendance QR.
              </p>
            </div>

            {/* Hackathon Judge Demo Toggles & Action */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#627D98', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Demo Presentation Scenarios:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleExecuteScan('VALID')}
                    style={{
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#065F46',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    ✓ Valid Attendance
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteScan('ALREADY_MARKED')}
                    style={{
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      color: '#1E40AF',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    🔁 Already Marked
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteScan('WRONG_CLASS')}
                    style={{
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      color: '#92400E',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    🚫 Wrong Class
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteScan('EXPIRED')}
                    style={{
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      color: '#991B1B',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    ⏳ Expired Session
                  </button>
                </div>
              </div>

              {/* Main Simulate Scan Button */}
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleExecuteScan('VALID')}
                style={{ width: '100%', background: '#0D9488', color: '#FFFFFF', padding: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Camera size={16} />
                <span>Simulate QR Scan (Live Verification)</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 2: SUCCESS CONFIRMATION (Section 5 & 6)
            ============================================================ */}
        {viewState === 'SUCCESS' && scanResult && (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            {/* Success Animation Circle & Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                animation: 'pulse 1.2s'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#059669', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Identity Verified
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#102A43', margin: '4px 0 4px 0' }}>
              ✓ Attendance Marked
            </h2>
            <p style={{ fontSize: '14.5px', fontWeight: 700, color: '#334E68', margin: '0 0 20px 0' }}>
              {scanResult.subject} ({scanResult.code}) • {scanResult.division}
            </p>

            {/* Attendance Boost Card */}
            <div
              style={{
                background: '#FAF8F3',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontSize: '12px', color: '#627D98', fontWeight: 600 }}>Your Attendance Progress</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '6px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#C2410C' }}>
                  {scanResult.prevPct}%
                </span>
                <span style={{ fontSize: '16px', color: '#829AB1' }}>→</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#059669' }}>
                  {scanResult.newPct}%
                </span>
                <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '11.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                  {scanResult.boost}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600, marginTop: '6px' }}>
                ✓ Closer to the 75.0% institutional threshold!
              </div>
            </div>

            {/* Meta tags */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: '#627D98', marginBottom: '24px' }}>
              <span>📅 {scanResult.date}</span>
              <span>⏰ {scanResult.time}</span>
              <span>🔒 Signed Token</span>
            </div>

            <button
              className="btn-primary"
              onClick={onClose}
              style={{ width: '100%', background: '#102A43', color: '#FFFFFF', padding: '11px', fontSize: '13.5px' }}
            >
              <span>View Attendance</span>
            </button>
          </div>
        )}

        {/* ============================================================
            VIEW 3: ERROR / WARNING SCREENS (Sections 7, 8, 9, 10)
            ============================================================ */}
        {viewState === 'ERROR' && scanResult && (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            {/* Error Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background:
                  scanResult.status === 'ALREADY_MARKED' ? '#EFF6FF' :
                  scanResult.status === 'WRONG_CLASS' ? '#FFFBEB' : '#FEF2F2',
                color:
                  scanResult.status === 'ALREADY_MARKED' ? '#2563EB' :
                  scanResult.status === 'WRONG_CLASS' ? '#D97706' : '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              {scanResult.status === 'ALREADY_MARKED' ? (
                <CheckCircle2 size={36} color="#2563EB" />
              ) : scanResult.status === 'WRONG_CLASS' ? (
                <ShieldAlert size={36} color="#D97706" />
              ) : (
                <XCircle size={36} color="#DC2626" />
              )}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#102A43', margin: '0 0 8px 0' }}>
              {scanResult.message}
            </h2>

            {/* Detailed Explanation */}
            {scanResult.status === 'WRONG_CLASS' && (
              <div style={{ background: '#FFFBEB', border: '1px solid #FED7AA', borderRadius: '12px', padding: '14px', marginBottom: '20px', textAlign: 'left', fontSize: '13px', color: '#9A3412' }}>
                <div style={{ marginBottom: '6px' }}>
                  You are enrolled in: <strong>{scanResult.details?.enrolled}</strong>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  This session is for: <strong>{scanResult.details?.session}</strong>
                </div>
                <div style={{ fontSize: '11.5px', color: '#B45309', marginTop: '6px' }}>
                  Attendance was NOT marked to prevent accidental cross-batch records.
                </div>
              </div>
            )}

            {scanResult.status === 'ALREADY_MARKED' && (
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '14px', marginBottom: '20px', fontSize: '13px', color: '#1E40AF' }}>
                <div>Subject: <strong>{scanResult.subject}</strong></div>
                <div style={{ marginTop: '4px' }}>Recorded at: <strong>{scanResult.markedAt}</strong></div>
                <div style={{ fontSize: '11.5px', color: '#3B82F6', marginTop: '6px' }}>
                  Duplicate scan ignored. Your record is already secure.
                </div>
              </div>
            )}

            {scanResult.status === 'EXPIRED' && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px', marginBottom: '20px', fontSize: '13px', color: '#991B1B' }}>
                {scanResult.details}
              </div>
            )}

            {scanResult.status === 'INVALID' && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px', marginBottom: '20px', fontSize: '13px', color: '#991B1B' }}>
                {scanResult.details}
              </div>
            )}

            {/* Error Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                onClick={handleReset}
                style={{ flex: 1, padding: '10px' }}
              >
                <span>Try Again</span>
              </button>
              <button
                className="btn-primary"
                onClick={onClose}
                style={{ flex: 1, padding: '10px', background: '#102A43', color: '#FFFFFF' }}
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
