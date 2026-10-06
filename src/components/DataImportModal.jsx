import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, X } from 'lucide-react';
import { api } from '../services/api';

export default function DataImportModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const res = await api.importAttendanceCSV(file);
    setImportResult(res);
    setLoading(false);
    if (res.success && onImportSuccess) {
      onImportSuccess(res);
    }
  };

  const handleDownloadSample = () => {
    window.location.href = '/api/sample-csv';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div>
            <span className="page-eyebrow">Data Ingestion Engine</span>
            <h3 className="modal-title">Import Attendance Records (CSV)</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-tertiary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Upload institutional attendance sheets. The engine will validate column schemas, check student IDs, and update projection models.
        </p>

        {/* Format guide and Sample Download */}
        <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Required Columns:
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              Student ID, Subject, Date, Status (Present/Absent)
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDownloadSample}
            style={{ fontSize: '11.5px', padding: '6px 10px' }}
          >
            <Download size={13} />
            <span>Sample CSV</span>
          </button>
        </div>

        {/* Drag and Drop Box */}
        <div style={{
          border: '2px dashed var(--border-subtle)',
          borderRadius: '14px',
          padding: '28px',
          textAlign: 'center',
          background: 'var(--bg-canvas)',
          marginBottom: '20px'
        }}>
          {file ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 18px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <FileSpreadsheet size={20} color="#059669" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{file.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <button
                type="button"
                onClick={() => { setFile(null); setImportResult(null); }}
                style={{ marginLeft: '12px', color: 'var(--text-tertiary)' }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div>
              <Upload size={28} color="var(--text-tertiary)" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Select attendance CSV to upload
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Supports standard university exported .csv spreadsheets
              </div>
              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                onChange={handleFileChange}
                style={{ marginTop: '14px', fontSize: '12px' }}
              />
            </div>
          )}
        </div>

        {/* Ingestion Validation Results */}
        {importResult && (
          <div style={{
            background: importResult.success ? 'var(--status-safe-bg)' : 'var(--status-critical-bg)',
            border: `1px solid ${importResult.success ? 'var(--status-safe-border)' : 'var(--status-critical-border)'}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {importResult.success ? (
                <CheckCircle2 size={18} color="var(--status-safe-accent)" />
              ) : (
                <AlertCircle size={18} color="var(--status-critical-accent)" />
              )}
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: importResult.success ? 'var(--status-safe-text)' : 'var(--status-critical-text)' }}>
                {importResult.success ? 'Ingestion & Validation Succeeded' : 'Validation Error Encountered'}
              </span>
            </div>

            {importResult.success ? (
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Processed <strong>{importResult.rows_processed}</strong> records • Imported: <strong>{importResult.rows_imported}</strong> • Rejected: <strong>{importResult.rows_rejected}</strong>
              </div>
            ) : (
              <div style={{ fontSize: '12.5px', color: 'var(--status-critical-text)' }}>
                {importResult.error}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={!file || loading}
            style={{ opacity: !file || loading ? 0.6 : 1 }}
          >
            <span>{loading ? 'Validating...' : 'Validate & Import'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
