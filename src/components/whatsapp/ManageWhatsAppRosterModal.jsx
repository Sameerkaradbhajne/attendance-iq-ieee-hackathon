import React, { useState } from 'react';
import {
  X,
  Plus,
  Upload,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  MessageCircle,
  FileUp
} from 'lucide-react';
import {
  whatsAppNotificationService,
  maskPhoneNumber
} from '../../services/whatsappService';

export default function ManageWhatsAppRosterModal({
  isOpen,
  onClose,
  onUpdated
}) {
  const [students, setStudents] = useState(() => whatsAppNotificationService.getStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'CONNECTED' | 'MISSING' | 'DISABLED'

  // Single Add/Edit modal state
  const [editingStudent, setEditingStudent] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Bulk Import modal state
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [importStats, setImportStats] = useState(null);

  if (!isOpen) return null;

  // Filter students
  const filteredStudents = students.filter(s => {
    if (filterStatus === 'CONNECTED' && s.status !== 'CONNECTED') return false;
    if (filterStatus === 'MISSING' && s.status !== 'MISSING') return false;
    if (filterStatus === 'DISABLED' && s.status !== 'DISABLED') return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q) || (s.phone && s.phone.includes(q));
  });

  const openAddNumberModal = (student) => {
    setEditingStudent(student);
    setPhoneInput(student.phone ? student.phone.replace('+91', '').trim() : '');
    setConsentChecked(student.consentGiven || false);
    setValidationError('');
  };

  const handleSaveNumber = () => {
    const raw = phoneInput.replace(/[^0-9]/g, '');
    if (raw.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!consentChecked) {
      setValidationError('Student institutional consent is mandatory to comply with communication policy.');
      return;
    }

    const formatted = `+91 ${raw.slice(0, 5)} ${raw.slice(5, 10)}`;
    const updated = whatsAppNotificationService.updateStudentPhone(editingStudent.id, formatted, true);
    setStudents(updated);
    setEditingStudent(null);
    if (onUpdated) onUpdated();
  };

  // Sample CSV / Excel simulated import
  const handleSimulateCSVImport = () => {
    const sampleRecords = [
      { id: '23CS121', name: 'Rahul More', phone: '+91 98223 34567' },
      { id: '23CS134', name: 'Pooja Patil', phone: '+91 98224 45678' },
      { id: '23CS142', name: 'Tanvi Joshi', phone: '+91 98225 56789' },
      { id: '23CS150', name: 'Vikram Deshmukh', phone: '+91 98226 67890' }
    ];

    const stats = whatsAppNotificationService.bulkImportStudents(sampleRecords);
    setImportStats(stats);
    setStudents(whatsAppNotificationService.getStudents());
    if (onUpdated) onUpdated();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: '860px',
          width: '92%',
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(16, 42, 67, 0.22)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '88vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
                justifyContent: 'center'
              }}
            >
              <Phone size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                Manage Student WhatsApp Roster & Consent
              </h3>
              <p style={{ fontSize: '13px', color: '#627D98', margin: '3px 0 0' }}>
                Secure contact linking with end-to-end institutional privacy and student opt-in management.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="icon-action-btn" style={{ borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Stats Row & Actions */}
        <div
          style={{
            padding: '16px 24px',
            background: '#FAF8F3',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#627D98' }}>Connected: </span>
              <strong style={{ color: '#059669' }}>
                {students.filter(s => s.status === 'CONNECTED').length} / {students.length}
              </strong>
            </div>
            <div>
              <span style={{ color: '#627D98' }}>Missing Number: </span>
              <strong style={{ color: '#DC2626' }}>
                {students.filter(s => s.status === 'MISSING').length}
              </strong>
            </div>
            <div>
              <span style={{ color: '#627D98' }}>Opted Out: </span>
              <strong style={{ color: '#D97706' }}>
                {students.filter(s => s.status === 'DISABLED').length}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsBulkImportOpen(true)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#102A43',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Upload size={14} />
              <span>Import Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ padding: '16px 24px 8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Filter by name, roll number, or phone..."
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

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'CONNECTED', 'MISSING', 'DISABLED'].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterStatus(f)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: filterStatus === f ? '1px solid #075E54' : '1px solid #E2E8F0',
                  background: filterStatus === f ? '#F0FDFA' : '#FFFFFF',
                  color: filterStatus === f ? '#075E54' : '#64748B',
                  cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Student Roster Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 24px' }}>
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '12px' }}>
                  <th style={{ padding: '10px 14px' }}>Student</th>
                  <th style={{ padding: '10px 14px' }}>Roll No.</th>
                  <th style={{ padding: '10px 14px' }}>Attendance</th>
                  <th style={{ padding: '10px 14px' }}>WhatsApp Number</th>
                  <th style={{ padding: '10px 14px' }}>Status & Consent</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <strong style={{ color: '#102A43' }}>{student.name}</strong>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>
                        {student.roll}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: student.attendance >= 75 ? '#168447' : '#C2410C'
                        }}
                      >
                        {student.attendance}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontFamily: 'monospace', color: student.phone ? '#102A43' : '#94A3B8' }}>
                        {maskPhoneNumber(student.phone)}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      {student.status === 'CONNECTED' ? (
                        <span style={{ color: '#059669', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} /> Connected & Opted-In
                        </span>
                      ) : student.status === 'DISABLED' ? (
                        <span style={{ color: '#D97706', fontSize: '12px', fontWeight: 700 }}>
                          ⏸ Notifications Disabled
                        </span>
                      ) : (
                        <span style={{ color: '#DC2626', fontSize: '12px', fontWeight: 700 }}>
                          ⚠ Number Missing
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => openAddNumberModal(student)}
                        style={{
                          background: student.status === 'MISSING' ? '#075E54' : '#F1F5F9',
                          color: student.status === 'MISSING' ? '#FFFFFF' : '#102A43',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {student.status === 'MISSING' ? '+ Add Number' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #E5E7EB',
            background: '#FAF8F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#627D98'
          }}
        >
          <span>🔒 Complies with Student Privacy Directives & Institutional WhatsApp Policy</span>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ background: '#102A43', padding: '8px 18px', borderRadius: '8px' }}
          >
            Done
          </button>
        </div>
      </div>

      {/* SUB-MODAL 1: ADD / EDIT WHATSAPP NUMBER */}
      {editingStudent && (
        <div
          className="modal-overlay"
          style={{ zIndex: 1200, background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setEditingStudent(null)}
        >
          <div
            className="modal-container"
            style={{
              maxWidth: '460px',
              width: '90%',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                {editingStudent.phone ? 'Update WhatsApp Number' : 'Connect Student WhatsApp'}
              </h4>
              <button onClick={() => setEditingStudent(null)} className="icon-action-btn">
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#FAF8F3', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
              <strong style={{ display: 'block', color: '#102A43' }}>{editingStudent.name}</strong>
              <span style={{ fontSize: '12px', color: '#627D98' }}>{editingStudent.roll} • {editingStudent.division}</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '6px' }}>
                WhatsApp Mobile Number
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                  +91
                </span>
                <input
                  type="text"
                  placeholder="98220 12345"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  <strong>Student Consent Verified:</strong> Student has provided explicit permission to receive official Attendance IQ recovery alerts & notifications.
                </span>
              </label>
            </div>

            {validationError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '8px 12px', borderRadius: '8px', color: '#B91C1C', fontSize: '12px', marginBottom: '16px' }}>
                {validationError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNumber}
                className="btn-primary"
                style={{ background: '#075E54', padding: '8px 16px', borderRadius: '8px' }}
              >
                Save Number
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: BULK CSV IMPORT */}
      {isBulkImportOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 1200, background: 'rgba(0,0,0,0.5)' }}
          onClick={() => { setIsBulkImportOpen(false); setImportStats(null); }}
        >
          <div
            className="modal-container"
            style={{
              maxWidth: '520px',
              width: '90%',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                Bulk Import Student WhatsApp Contacts
              </h4>
              <button onClick={() => { setIsBulkImportOpen(false); setImportStats(null); }} className="icon-action-btn">
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#627D98', marginBottom: '16px' }}>
              Upload an Excel (.xlsx) or CSV file with columns: <code>StudentID</code>, <code>StudentName</code>, <code>WhatsAppNumber</code>.
            </p>

            {importStats ? (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <strong style={{ color: '#065F46', display: 'block', marginBottom: '8px' }}>
                  ✓ Import Completed Successfully!
                </strong>
                <div style={{ fontSize: '13px', color: '#047857', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>• Total records processed: <strong>{importStats.total}</strong></div>
                  <div>• Valid contacts linked: <strong>{importStats.valid}</strong></div>
                  <div>• Duplicates or skipped: <strong>{importStats.duplicates}</strong></div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: '#F8FAFC',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}
                onClick={handleSimulateCSVImport}
              >
                <FileUp size={36} color="#075E54" style={{ margin: '0 auto 8px' }} />
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#102A43', margin: '0 0 4px' }}>
                  Click to Upload Sample WhatsApp Contact Roster
                </h5>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                  Automatically links verified WhatsApp numbers for 4 pending students
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { setIsBulkImportOpen(false); setImportStats(null); }}
                className="btn-primary"
                style={{ background: '#102A43', padding: '8px 18px', borderRadius: '8px' }}
              >
                {importStats ? 'Done' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
