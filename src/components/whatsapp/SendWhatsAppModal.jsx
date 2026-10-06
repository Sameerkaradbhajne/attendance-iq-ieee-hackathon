import React, { useState, useMemo } from 'react';
import {
  X,
  MessageCircle,
  Users,
  Send,
  Sparkles,
  Check,
  Search,
  Filter,
  CheckCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import WhatsAppPreviewCard from './WhatsAppPreviewCard';
import {
  MESSAGE_TEMPLATES,
  renderTemplate,
  whatsAppNotificationService,
  maskPhoneNumber
} from '../../services/whatsappService';

export default function SendWhatsAppModal({
  isOpen,
  onClose,
  initialStudent = null, // Single student if clicked from quick action
  initialTemplateKey = 'LOW_ATTENDANCE',
  onMessageSentSuccess
}) {
  const [step, setStep] = useState(initialStudent ? 2 : 1); // 1: Select, 2: Message & Template, 3: Confirm & Preview, 4: Progress
  const [students, setStudents] = useState(() => whatsAppNotificationService.getStudents());
  const [selectedIds, setSelectedIds] = useState(() => initialStudent ? [initialStudent.id] : []);
  const [filterSelection, setFilterSelection] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'AT_RISK' | 'BELOW_75' | 'INCOMPLETE_TASKS'
  const [searchQuery, setSearchQuery] = useState('');

  // Step 2 & 3: Template & Personalization
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(initialTemplateKey);
  const [customText, setCustomText] = useState('');
  const [previewStudentId, setPreviewStudentId] = useState(initialStudent ? initialStudent.id : '');

  // Step 4: Sending Progress State
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0, sentCount: 0, failedCount: 0 });
  const [sendSummary, setSendSummary] = useState(null);

  // Filter students based on selection preset and search
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Preset filters
      if (filterSelection === 'CRITICAL' && s.risk !== 'CRITICAL') return false;
      if (filterSelection === 'AT_RISK' && s.risk !== 'AT_RISK') return false;
      if (filterSelection === 'BELOW_75' && s.attendance >= 75) return false;
      if (filterSelection === 'INCOMPLETE_TASKS') {
        const hasPending = s.todayTasks?.some(t => !t.completed);
        if (!hasPending) return false;
      }

      // Search match
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        s.name.toLowerCase().includes(query) ||
        s.roll.toLowerCase().includes(query) ||
        (s.phone && s.phone.includes(query))
      );
    });
  }, [students, filterSelection, searchQuery]);

  if (!isOpen) return null;

  // Toggle selection
  const toggleSelectStudent = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectAllFiltered = () => {
    const validFilteredIds = filteredStudents
      .filter(s => s.status === 'CONNECTED' && s.consentGiven)
      .map(s => s.id);
    setSelectedIds(validFilteredIds);
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  // Resolve current preview student
  const activePreviewStudent = useMemo(() => {
    if (previewStudentId) {
      const found = students.find(s => s.id === previewStudentId);
      if (found) return found;
    }
    if (selectedIds.length > 0) {
      const found = students.find(s => s.id === selectedIds[0]);
      if (found) return found;
    }
    return students[0] || null;
  }, [students, previewStudentId, selectedIds]);

  // Generate personalized text for preview
  const previewMessageText = useMemo(() => {
    if (!activePreviewStudent) return '';
    const tmplObj = MESSAGE_TEMPLATES[selectedTemplateKey];
    const templateRaw = selectedTemplateKey === 'CUSTOM' ? (customText || 'Hi {{student_name}}, please meet me regarding your attendance.') : (tmplObj?.template || '');
    
    return whatsAppNotificationService.buildPersonalizedText(templateRaw, activePreviewStudent);
  }, [activePreviewStudent, selectedTemplateKey, customText]);

  // Execute Sending Flow
  const handleStartSending = async () => {
    const recipients = students.filter(s => selectedIds.includes(s.id));
    if (recipients.length === 0) return;

    setStep(4);
    setIsSending(true);
    setSendProgress({ current: 0, total: recipients.length, sentCount: 0, failedCount: 0 });

    const result = await whatsAppNotificationService.sendBulkPersonalizedMessages({
      studentIds: selectedIds,
      templateKey: selectedTemplateKey,
      customTemplateText: selectedTemplateKey === 'CUSTOM' ? customText : null,
      onProgress: (progress) => {
        setSendProgress(progress);
      }
    });

    setIsSending(false);
    setSendSummary(result);
    if (onMessageSentSuccess) {
      onMessageSentSuccess(result);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: step === 3 ? '880px' : '760px',
          width: '92%',
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(16, 42, 67, 0.22)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Steps */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF8F3 0%, #F5F1E8 100%)',
            padding: '20px 24px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#075E54',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(7, 94, 84, 0.25)'
              }}
            >
              <MessageCircle size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                  Send WhatsApp Attendance Communication
                </h3>
                <span
                  style={{
                    background: '#DCF8C6',
                    color: '#075E54',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  Authorized Mentor Channel
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#627D98', margin: '3px 0 0' }}>
                Deliver personalized recovery tasks and official attendance alerts straight to student devices.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-action-btn"
            style={{ borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E2E8F0' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div
          style={{
            background: '#FAF8F3',
            padding: '12px 24px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12.5px', fontWeight: 600 }}>
            <span style={{ color: step >= 1 ? '#075E54' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step >= 1 ? '#075E54' : '#E2E8F0', color: step >= 1 ? '#FFF' : '#64748B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>1</span>
              Select Students ({selectedIds.length})
            </span>
            <ChevronRight size={14} color="#CBD5E1" />
            <span style={{ color: step >= 2 ? '#075E54' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step >= 2 ? '#075E54' : '#E2E8F0', color: step >= 2 ? '#FFF' : '#64748B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>2</span>
              Message Template
            </span>
            <ChevronRight size={14} color="#CBD5E1" />
            <span style={{ color: step >= 3 ? '#075E54' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step >= 3 ? '#075E54' : '#E2E8F0', color: step >= 3 ? '#FFF' : '#64748B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>3</span>
              Personalized Preview
            </span>
            <ChevronRight size={14} color="#CBD5E1" />
            <span style={{ color: step >= 4 ? '#075E54' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step >= 4 ? '#075E54' : '#E2E8F0', color: step >= 4 ? '#FFF' : '#64748B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>4</span>
              Delivery Status
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* ============================================================
              STEP 1: SELECT STUDENTS
              ============================================================ */}
          {step === 1 && (
            <div>
              {/* Preset Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {[
                  { id: 'ALL', label: 'All Students' },
                  { id: 'CRITICAL', label: '🔴 All Critical (< 70%)' },
                  { id: 'AT_RISK', label: '🟡 All At-Risk (70-74.9%)' },
                  { id: 'BELOW_75', label: '⚠ Students Below 75%' },
                  { id: 'INCOMPLETE_TASKS', label: '🎯 Incomplete Recovery Tasks' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterSelection(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: filterSelection === tab.id ? '1px solid #075E54' : '1px solid #E2E8F0',
                      background: filterSelection === tab.id ? '#F0FDFA' : '#FFFFFF',
                      color: filterSelection === tab.id ? '#075E54' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Bulk Select Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search by student name or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #075E54',
                      background: '#FFFFFF',
                      color: '#075E54',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Select All Matching ({filteredStudents.filter(s => s.status === 'CONNECTED' && s.consentGiven).length})
                  </button>
                  <button
                    type="button"
                    onClick={deselectAll}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      color: '#64748B',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              {/* Student Selection Table */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '12px' }}>
                      <th style={{ padding: '10px 14px', width: '36px' }}>Select</th>
                      <th style={{ padding: '10px 14px' }}>Student</th>
                      <th style={{ padding: '10px 14px' }}>Attendance</th>
                      <th style={{ padding: '10px 14px' }}>Risk Status</th>
                      <th style={{ padding: '10px 14px' }}>WhatsApp Status</th>
                      <th style={{ padding: '10px 14px' }}>Recommended Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                          No students found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map(student => {
                        const isSelected = selectedIds.includes(student.id);
                        const canMessage = student.status === 'CONNECTED' && student.consentGiven;
                        const rec = whatsAppNotificationService.getRecommendedMessage(student);

                        return (
                          <tr
                            key={student.id}
                            onClick={() => canMessage && toggleSelectStudent(student.id)}
                            style={{
                              borderBottom: '1px solid #F1F5F9',
                              cursor: canMessage ? 'pointer' : 'not-allowed',
                              background: isSelected ? '#F0FDFA' : 'transparent',
                              opacity: canMessage ? 1 : 0.65
                            }}
                          >
                            <td style={{ padding: '10px 14px' }} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={!canMessage}
                                onChange={() => toggleSelectStudent(student.id)}
                                style={{ cursor: canMessage ? 'pointer' : 'not-allowed' }}
                              />
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <strong style={{ color: '#102A43', display: 'block' }}>{student.name}</strong>
                              <span style={{ fontSize: '11px', color: '#627D98' }}>{student.roll} • {maskPhoneNumber(student.phone)}</span>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <span
                                style={{
                                  fontWeight: 800,
                                  color: student.attendance >= 75 ? '#168447' : (student.attendance >= 70 ? '#D97706' : '#B91C1C')
                                }}
                              >
                                {student.attendance}%
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: student.risk === 'CRITICAL' ? '#FEF2F2' : student.risk === 'AT_RISK' ? '#FFFBEB' : '#ECFDF5',
                                  color: student.risk === 'CRITICAL' ? '#B91C1C' : student.risk === 'AT_RISK' ? '#B45309' : '#047857'
                                }}
                              >
                                {student.risk === 'CRITICAL' ? '🔴 Critical' : student.risk === 'AT_RISK' ? '🟡 At Risk' : '🟢 Safe'}
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              {student.status === 'CONNECTED' ? (
                                <span style={{ color: '#059669', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <CheckCheck size={13} /> Connected
                                </span>
                              ) : (
                                <span style={{ color: '#DC2626', fontSize: '11px', fontWeight: 700 }}>
                                  ⚠ {student.status}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ fontSize: '11.5px', color: '#0F766E', background: '#F0FDFA', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                                {rec.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 2: MESSAGE TEMPLATE SELECTION
              ============================================================ */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
                  Select Authorized Message Template
                </h4>
                <p style={{ fontSize: '12.5px', color: '#627D98' }}>
                  Standard institutional templates are pre-approved to ensure clarity, non-spam compliance, and student dignity.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {Object.keys(MESSAGE_TEMPLATES).map(key => {
                  const tmpl = MESSAGE_TEMPLATES[key];
                  const isSelected = selectedTemplateKey === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedTemplateKey(key)}
                      style={{
                        border: isSelected ? '2px solid #075E54' : '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '14px',
                        cursor: 'pointer',
                        background: isSelected ? '#F0FDFA' : '#FFFFFF',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#102A43' }}>
                          {tmpl.name}
                        </span>
                        {isSelected && <span style={{ color: '#075E54', fontWeight: 800 }}>✓</span>}
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#627D98', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {tmpl.template}
                      </p>
                    </div>
                  );
                })}

                {/* Custom Message Option */}
                <div
                  onClick={() => setSelectedTemplateKey('CUSTOM')}
                  style={{
                    border: selectedTemplateKey === 'CUSTOM' ? '2px solid #075E54' : '1px dashed #CBD5E1',
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    background: selectedTemplateKey === 'CUSTOM' ? '#F0FDFA' : '#FAFAFA'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#102A43' }}>
                      ✍️ Custom Mentor Advisory
                    </span>
                    {selectedTemplateKey === 'CUSTOM' && <span style={{ color: '#075E54', fontWeight: 800 }}>✓</span>}
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#627D98', margin: 0 }}>
                    Compose custom text with available variable placeholders.
                  </p>
                </div>
              </div>

              {/* Custom Message Editor if selected */}
              {selectedTemplateKey === 'CUSTOM' && (
                <div style={{ background: '#FAF8F3', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
                    Custom Message Content
                  </label>
                  <textarea
                    rows={4}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Hi {{student_name}}, please meet me tomorrow at 11 AM regarding your attendance..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontFamily: 'inherit'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Insert placeholders:</span>
                    {['{{student_name}}', '{{attendance}}', '{{required_attendance}}', '{{classes_needed}}', '{{mentor_name}}', '{{recovery_link}}'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setCustomText(prev => prev + ' ' + tag)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '4px',
                          fontSize: '11px',
                          padding: '2px 6px',
                          cursor: 'pointer',
                          color: '#075E54'
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              STEP 3: CONFIRMATION & LIVE PERSONALIZED PREVIEW
              ============================================================ */}
          {step === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              {/* Left Column: Summary and Recipient switch */}
              <div>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#102A43', marginBottom: '8px' }}>
                    Campaign Summary
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#475569' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Selected Recipients:</span>
                      <strong style={{ color: '#102A43' }}>{selectedIds.length} students</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Message Type:</span>
                      <strong style={{ color: '#075E54' }}>
                        {selectedTemplateKey === 'CUSTOM' ? 'Custom Advisory' : MESSAGE_TEMPLATES[selectedTemplateKey]?.name}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Channel:</span>
                      <strong style={{ color: '#075E54' }}>WhatsApp Business API (Encrypted)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Cooldown Safety:</span>
                      <span style={{ color: '#059669', fontWeight: 600 }}>✓ Verified (No recent duplicate)</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
                    Preview Personalization for Student:
                  </label>
                  <select
                    value={activePreviewStudent?.id || ''}
                    onChange={(e) => setPreviewStudentId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px'
                    }}
                  >
                    {students.filter(s => selectedIds.includes(s.id)).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.roll} • {s.attendance}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#92400E' }}>
                  <strong>Institutional Compliance Note:</strong>
                  <p style={{ margin: '4px 0 0' }}>
                    Each student receives their exact mathematically calculated recovery shortfall. Phone numbers are masked for FERPA/privacy adherence.
                  </p>
                </div>
              </div>

              {/* Right Column: Live WhatsApp Bubble Preview */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
                  Student Screen Live Rendering:
                </label>
                <WhatsAppPreviewCard
                  recipientName={activePreviewStudent?.name}
                  recipientPhone={maskPhoneNumber(activePreviewStudent?.phone)}
                  messageText={previewMessageText}
                  timestamp="Just now"
                  status="DELIVERED"
                  onOpenRecoveryPlan={() => alert('Opens student authenticated recovery plan')}
                />
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 4: SENDING STATE & PROGRESS
              ============================================================ */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              {isSending ? (
                <div>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F0FDFA', color: '#075E54', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <RefreshCw size={28} className="animate-spin" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102A43', marginBottom: '8px' }}>
                    Delivering WhatsApp Messages...
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#627D98', marginBottom: '24px' }}>
                    Sending {sendProgress.current} of {sendProgress.total} authorized messages via WhatsApp Provider
                  </p>

                  {/* Progress Bar */}
                  <div style={{ maxWidth: '420px', margin: '0 auto', background: '#E2E8F0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${sendProgress.total ? (sendProgress.current / sendProgress.total) * 100 : 0}%`,
                        height: '100%',
                        background: '#075E54',
                        transition: 'width 0.25s ease'
                      }}
                    />
                  </div>
                </div>
              ) : sendSummary ? (
                <div>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCheck size={36} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102A43', marginBottom: '6px' }}>
                    Campaign Completed!
                  </h3>
                  <p style={{ fontSize: '14px', color: '#627D98', marginBottom: '20px' }}>
                    ✓ <strong>{sendSummary.sentCount}</strong> of {sendSummary.total} messages successfully delivered to student WhatsApp accounts.
                  </p>

                  <div style={{ maxWidth: '360px', margin: '0 auto', background: '#FAF8F3', borderRadius: '12px', padding: '14px', border: '1px solid #E2E8F0', textAlign: 'left', fontSize: '12.5px', color: '#475569', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Successful Deliveries:</span>
                      <strong style={{ color: '#059669' }}>{sendSummary.sentCount}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Failed / Skipped:</span>
                      <strong style={{ color: '#DC2626' }}>{sendSummary.failedCount}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Logged to History:</span>
                      <strong style={{ color: '#102A43' }}>Yes (Encrypted Log)</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-primary"
                    style={{ background: '#075E54', padding: '10px 24px', borderRadius: '10px', color: '#FFF' }}
                  >
                    Close & View Message History
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        {step < 4 && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #E5E7EB',
              background: '#FAF8F3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
              ) : (
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  {selectedIds.length} students selected
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748B',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              {step === 1 && (
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => setStep(2)}
                  className="btn-primary"
                  style={{
                    background: selectedIds.length > 0 ? '#075E54' : '#94A3B8',
                    cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Continue to Template</span>
                  <ArrowRight size={15} />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-primary"
                  style={{
                    background: '#075E54',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Preview Messages</span>
                  <ArrowRight size={15} />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handleStartSending}
                  className="btn-primary"
                  style={{
                    background: '#075E54',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={15} />
                  <span>Send {selectedIds.length} WhatsApp Messages →</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
