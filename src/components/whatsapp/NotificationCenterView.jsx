import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  Settings,
  FileText,
  RotateCcw,
  Sliders,
  Check,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  AlertOctagon
} from 'lucide-react';
import WhatsAppPreviewCard from './WhatsAppPreviewCard';
import {
  MESSAGE_TEMPLATES,
  whatsAppNotificationService,
  maskPhoneNumber
} from '../../services/whatsappService';

export default function NotificationCenterView({
  onOpenSendModal
}) {
  const [activeSection, setActiveSection] = useState('LOG'); // 'LOG' | 'TEMPLATES' | 'SETTINGS'
  const [messages, setMessages] = useState(() => whatsAppNotificationService.getMessageHistory());
  const [settings, setSettings] = useState(() => whatsAppNotificationService.getSettings());
  const [previewTemplateKey, setPreviewTemplateKey] = useState('LOW_ATTENDANCE');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Stats calculation
  const sentTodayCount = messages.filter(m => m.status === 'SENT' || m.status === 'DELIVERED' || m.status === 'READ').length;
  const failedCount = messages.filter(m => m.status === 'FAILED').length;
  const scheduledCount = 8; // Scheduled daily recovery reminders

  // Filter messages
  const filteredMessages = messages.filter(m => {
    if (statusFilter === 'SENT' && m.status !== 'SENT') return false;
    if (statusFilter === 'DELIVERED' && m.status !== 'DELIVERED') return false;
    if (statusFilter === 'READ' && m.status !== 'READ') return false;
    if (statusFilter === 'FAILED' && m.status !== 'FAILED') return false;
    return true;
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    whatsAppNotificationService.saveSettings(settings);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  return (
    <div style={{ padding: '4px 0 24px' }}>
      {/* Top Banner Stats: Today's Dispatch Overview */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF8F3 0%, #F5F1E8 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E5E7EB',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#075E54', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Notification Hub
            </span>
            <span style={{ background: '#DCF8C6', color: '#075E54', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
              Meta Cloud API Ready
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#102A43', margin: 0 }}>
            WhatsApp Recovery & Notification Center
          </h2>
          <p style={{ fontSize: '13.5px', color: '#627D98', margin: '4px 0 0' }}>
            Enterprise notification orchestration with automated risk escalations and daily task nudges.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onOpenSendModal}
            className="btn-primary"
            style={{
              background: '#075E54',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(7, 94, 84, 0.2)'
            }}
          >
            <MessageCircle size={16} />
            <span>Send New Message →</span>
          </button>
        </div>
      </div>

      {/* Daily Metrics Row (Section: NOTIFICATION CENTER) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#102A43' }}>{sentTodayCount + 36}</div>
            <div style={{ fontSize: '12px', color: '#627D98' }}>Delivered This Week</div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#102A43' }}>{scheduledCount}</div>
            <div style={{ fontSize: '12px', color: '#627D98' }}>Reminders Scheduled</div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#DC2626' }}>{failedCount}</div>
            <div style={{ fontSize: '12px', color: '#627D98' }}>Delivery Failures</div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0FDFA', color: '#075E54', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#075E54' }}>99.2%</div>
            <div style={{ fontSize: '12px', color: '#627D98' }}>Provider Health</div>
          </div>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '20px' }}>
        {[
          { id: 'LOG', label: 'Message History Log', icon: FileText },
          { id: 'TEMPLATES', label: 'Message Templates (8)', icon: MessageCircle },
          { id: 'SETTINGS', label: 'Automated Thresholds & Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                background: isActive ? '#075E54' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          SECTION 1: MESSAGE HISTORY LOG TABLE
          ============================================================ */}
      {activeSection === 'LOG' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['ALL', 'READ', 'DELIVERED', 'SENT', 'FAILED'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    border: statusFilter === st ? '1px solid #075E54' : '1px solid #E2E8F0',
                    background: statusFilter === st ? '#F0FDFA' : '#FFFFFF',
                    color: statusFilter === st ? '#075E54' : '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '12px', color: '#627D98' }}>
              Showing <strong>{filteredMessages.length}</strong> message dispatches
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '12px' }}>
                <th style={{ padding: '10px 16px' }}>Student</th>
                <th style={{ padding: '10px 16px' }}>Phone</th>
                <th style={{ padding: '10px 16px' }}>Message Type</th>
                <th style={{ padding: '10px 16px' }}>Trigger / Reason</th>
                <th style={{ padding: '10px 16px' }}>Delivery Status</th>
                <th style={{ padding: '10px 16px' }}>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map(msg => (
                <tr key={msg.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#102A43' }}>{msg.studentName}</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: '#627D98' }}>{msg.studentId}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'monospace', color: '#475569', fontSize: '12px' }}>
                      {maskPhoneNumber(msg.phone)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: 600, color: '#0F766E' }}>
                      {msg.templateName || msg.templateKey}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      {msg.triggerReason || 'Attendance < 75%'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: msg.status === 'READ' ? '#ECFDF5' : (msg.status === 'DELIVERED' ? '#F0FDFA' : (msg.status === 'SENT' ? '#F8FAFC' : '#FEF2F2')),
                        color: msg.status === 'READ' ? '#047857' : (msg.status === 'DELIVERED' ? '#0F766E' : (msg.status === 'SENT' ? '#475569' : '#B91C1C'))
                      }}
                    >
                      {msg.status === 'READ' ? '✓✓ Read' : msg.status === 'DELIVERED' ? '✓✓ Delivered' : msg.status === 'SENT' ? '✓ Sent' : '⚠ Failed'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#627D98', fontSize: '12px' }}>
                    {msg.sentAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================
          SECTION 2: WHATSAPP MESSAGE TEMPLATES
          ============================================================ */}
      {activeSection === 'TEMPLATES' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.keys(MESSAGE_TEMPLATES).map(key => {
              const tmpl = MESSAGE_TEMPLATES[key];
              const isSelected = previewTemplateKey === key;
              return (
                <div
                  key={key}
                  onClick={() => setPreviewTemplateKey(key)}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid #075E54' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '14px', color: '#102A43' }}>{tmpl.name}</strong>
                    <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                      {tmpl.id}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#627D98', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {tmpl.template}
                  </p>
                </div>
              );
            })}
          </div>

          <div>
            <div style={{ position: 'sticky', top: '24px' }}>
              <div style={{ marginBottom: '8px', fontSize: '12.5px', fontWeight: 700, color: '#102A43' }}>
                Simulated WhatsApp Bubble Rendering
              </div>
              <WhatsAppPreviewCard
                recipientName="Sameer Patil"
                recipientPhone="+91 98220 12345"
                messageText={MESSAGE_TEMPLATES[previewTemplateKey]?.template
                  .replace('{{student_name}}', 'Sameer')
                  .replace('{{attendance}}', '68.4')
                  .replace('{{required_attendance}}', '75.0')
                  .replace('{{classes_needed}}', '8')
                  .replace('{{mentor_name}}', 'Dr. Radhika Sen')
                  .replace('{{recovery_link}}', 'https://attendance-iq.college.edu/recovery/auth?t=sample')}
                timestamp="10:42 AM"
                status="READ"
                onOpenRecoveryPlan={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 3: NOTIFICATION SETTINGS & THRESHOLDS
          ============================================================ */}
      {activeSection === 'SETTINGS' && (
        <form onSubmit={handleSaveSettings} style={{ maxWidth: '640px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#102A43', marginBottom: '6px' }}>
            Automated Alert Rules & Institutional Thresholds
          </h3>
          <p style={{ fontSize: '13px', color: '#627D98', marginBottom: '20px' }}>
            Define when Attendance IQ triggers automatic WhatsApp notifications and escalations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
                Low Attendance Threshold (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.lowAttendanceThreshold}
                onChange={(e) => setSettings({ ...settings, lowAttendanceThreshold: Number(e.target.value) })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B' }}>Triggers Low Attendance Alert</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
                Critical Shortfall Line (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.criticalThreshold}
                onChange={(e) => setSettings({ ...settings, criticalThreshold: Number(e.target.value) })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B' }}>Triggers Urgent Escalation Notice</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
              Daily Recovery Reminder Frequency
            </label>
            <select
              value={settings.reminderFrequency}
              onChange={(e) => setSettings({ ...settings, reminderFrequency: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            >
              <option value="DAILY">Daily (9:00 AM Before Morning Lectures)</option>
              <option value="EVERY_2_DAYS">Every 2 Days</option>
              <option value="WEEKLY">Weekly Summary Only</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
              Mentor Advisory Escalation
            </label>
            <select
              value={settings.mentorEscalationDays}
              onChange={(e) => setSettings({ ...settings, mentorEscalationDays: Number(e.target.value) })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            >
              <option value={3}>After 3 days with critical attendance</option>
              <option value={5}>After 5 days with critical attendance</option>
              <option value={7}>After 7 days with critical attendance</option>
            </select>
          </div>

          <div style={{ background: '#FAF8F3', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.studentNotificationEnabled}
                  onChange={(e) => setSettings({ ...settings, studentNotificationEnabled: e.target.checked })}
                />
                <span>Enable WhatsApp messages to authorized student devices</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.parentNotificationEnabled}
                  onChange={(e) => setSettings({ ...settings, parentNotificationEnabled: e.target.checked })}
                />
                <span>Enable Guardian transparency notices (Subject to consent)</span>
              </label>
            </div>
          </div>

          {savedSettingsNotice && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px', borderRadius: '8px', color: '#047857', fontSize: '12.5px', marginBottom: '16px' }}>
              ✓ Institutional Notification Rules Saved Successfully!
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ background: '#075E54', padding: '9px 20px', borderRadius: '8px' }}
          >
            Save Notification Configuration
          </button>
        </form>
      )}
    </div>
  );
}
