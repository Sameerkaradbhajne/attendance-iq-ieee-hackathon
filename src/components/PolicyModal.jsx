import React, { useState } from 'react';
import { Settings, Check, X, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function PolicyModal({ isOpen, onClose, currentPolicy, onPolicyUpdated }) {
  const [formData, setFormData] = useState({
    required_threshold: currentPolicy?.required_threshold || 75.0,
    warning_threshold: currentPolicy?.warning_threshold || 78.0,
    critical_threshold: currentPolicy?.critical_threshold || 70.0,
    condonation_min_threshold: currentPolicy?.condonation_min_threshold || 65.0,
    safety_buffer_classes: currentPolicy?.safety_buffer_classes || 2,
    exam_start_date: currentPolicy?.exam_start_date || '2026-11-20'
  });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('threshold') || name.includes('classes') ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.updatePolicy(formData);
    setSaved(true);
    if (onPolicyUpdated) onPolicyUpdated(formData);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div>
            <span className="page-eyebrow">Academic Regulations</span>
            <h3 className="modal-title">Institutional Attendance Policy</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-tertiary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Tune institutional criteria. All projection algorithms, freedom buffer calculations, and alert triggers adapt dynamically.
        </p>

        {saved && (
          <div style={{ background: 'var(--status-safe-bg)', border: '1px solid var(--status-safe-border)', color: 'var(--status-safe-text)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
            ✓ Policy rules updated across all departments!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Mandatory Required Threshold (%)</label>
              <input
                type="number"
                step="0.5"
                min="50"
                max="95"
                name="required_threshold"
                value={formData.required_threshold}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Standard: 75.0%</span>
            </div>

            <div className="form-group">
              <label className="form-label">Early Warning Trigger (%)</label>
              <input
                type="number"
                step="0.5"
                min="50"
                max="95"
                name="warning_threshold"
                value={formData.warning_threshold}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Standard: 78.0%</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Critical Shortage Threshold (%)</label>
              <input
                type="number"
                step="0.5"
                min="50"
                max="95"
                name="critical_threshold"
                value={formData.critical_threshold}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Standard: 70.0%</span>
            </div>

            <div className="form-group">
              <label className="form-label">Medical Condonation Floor (%)</label>
              <input
                type="number"
                step="0.5"
                min="50"
                max="95"
                name="condonation_min_threshold"
                value={formData.condonation_min_threshold}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Minimum floor: 65.0%</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Scheduled Exam Commencement Date</label>
            <input
              type="date"
              name="exam_start_date"
              value={formData.exam_start_date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <span>Save & Apply Criteria</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
