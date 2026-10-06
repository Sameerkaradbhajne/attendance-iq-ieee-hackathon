import React from 'react';
import { CheckCheck, ExternalLink, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

export default function WhatsAppPreviewCard({
  recipientName = 'Sameer Patil',
  recipientPhone = '+91 98220 12345',
  messageText = '',
  timestamp = '10:42 AM',
  status = 'DELIVERED', // 'SENT' | 'DELIVERED' | 'READ'
  onOpenRecoveryPlan
}) {
  return (
    <div
      style={{
        background: '#ECE5DD', // Authentic WhatsApp background tint
        borderRadius: '18px',
        padding: '16px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 4px 14px rgba(16, 42, 67, 0.08)',
        border: '1px solid #D1D5DB',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* WhatsApp Chat Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#075E54',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <strong style={{ fontSize: '13px', color: '#111827' }}>Attendance IQ Alerts</strong>
              <span style={{ fontSize: '11px', color: '#0D9488' }} title="Verified Official Institution Account">
                ✓
              </span>
            </div>
            <span style={{ fontSize: '10.5px', color: '#6B7280' }}>Official Academic System</span>
          </div>
        </div>

        <span style={{ fontSize: '10px', background: '#DCF8C6', color: '#075E54', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
          WhatsApp Preview
        </span>
      </div>

      {/* WhatsApp Message Bubble */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px 12px 12px 4px',
          padding: '12px 14px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#111827',
          whiteSpace: 'pre-wrap',
          position: 'relative',
          wordBreak: 'break-word'
        }}
      >
        {/* Render text with soft styling */}
        {messageText}

        {/* Interactive CTA Link Button */}
        {messageText.includes('Recovery Plan') && (
          <div style={{ marginTop: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}>
            <button
              type="button"
              onClick={onOpenRecoveryPlan}
              style={{
                width: '100%',
                background: '#F0FDFA',
                border: '1px solid #0D9488',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0F766E',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>View My Recovery Plan</span>
              <ExternalLink size={13} />
            </button>
          </div>
        )}

        {/* Message Timestamp & Status Checks */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '4px',
            marginTop: '6px',
            fontSize: '10.5px',
            color: '#6B7280'
          }}
        >
          <span>{timestamp}</span>
          <CheckCheck size={14} color={status === 'READ' ? '#3B82F6' : '#9CA3AF'} />
        </div>
      </div>
    </div>
  );
}
