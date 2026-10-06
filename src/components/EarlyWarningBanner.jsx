import React from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

export default function EarlyWarningBanner({
  message = "At your current trend, you may fall below 75% in approximately 3 weeks.",
  onViewPlan,
  onDismiss
}) {
  return (
    <div className="early-warning-banner">
      <div className="early-warning-left">
        <AlertTriangle size={20} className="early-warning-icon" />
        <div>
          <div className="early-warning-title">EARLY WARNING • SHORTAGE RISK DETECTED</div>
          <div className="early-warning-text">{message}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onViewPlan}
          className="btn-primary"
          style={{
            padding: '7px 14px',
            fontSize: '12.5px',
            background: 'var(--status-risk-accent)',
            boxShadow: 'none'
          }}
        >
          <span>View Recovery Plan</span>
          <ArrowRight size={14} />
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{ color: 'var(--text-tertiary)', padding: '4px', borderRadius: '4px' }}
            title="Dismiss"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
