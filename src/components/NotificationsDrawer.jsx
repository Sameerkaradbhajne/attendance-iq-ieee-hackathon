import React from 'react';
import { Bell, X, AlertTriangle, Target, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function NotificationsDrawer({ isOpen, onClose, notifications = [], onNavigate }) {
  if (!isOpen) return null;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Early Warning': return <AlertTriangle size={16} color="var(--status-risk-accent)" />;
      case 'Recovery': return <Target size={16} color="var(--status-info-accent)" />;
      case 'Condonation': return <FileText size={16} color="var(--status-safe-accent)" />;
      default: return <CheckCircle2 size={16} color="var(--text-tertiary)" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '420px',
          height: '100vh',
          maxHeight: '100vh',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-subtle)',
          margin: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} />
            <h3 className="modal-title" style={{ fontSize: '16px' }}>Notification Center</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-tertiary)', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  background: notif.unread ? 'var(--bg-subtle)' : '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                onClick={() => {
                  if (notif.category === 'Recovery') onNavigate('recovery');
                  else if (notif.category === 'Condonation') onNavigate('condonation');
                  else onNavigate('dashboard');
                  onClose();
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getCategoryIcon(notif.category)}
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      {notif.category}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{notif.timestamp}</span>
                </div>

                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {notif.title}
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {notif.message}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 600, marginTop: '8px' }}>
                  <span>View Details</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
