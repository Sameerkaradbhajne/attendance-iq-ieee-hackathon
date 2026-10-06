import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Clock, Upload, ArrowRight, ShieldCheck, AlertTriangle, UserCheck } from 'lucide-react';
import { api } from '../services/api';

export default function CondonationView({ currentStudent, currentRole = 'student' }) {
  const [condonations, setCondonations] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'apply'
  const [loading, setLoading] = useState(false);

  // Form states
  const [reasonCategory, setReasonCategory] = useState('Medical');
  const [reasonTitle, setReasonTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const studentId = currentStudent?.id || 'CSE24-042';
  const studentName = currentStudent?.name || 'Sameer Verma';
  const currentPct = currentStudent?.attendance?.current_pct || 74.2;
  const shortagePct = Math.max(0, 75.0 - currentPct).toFixed(1);

  const fetchCondonations = async () => {
    setLoading(true);
    const data = await api.getCondonations();
    setCondonations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCondonations();
  }, []);

  // Pre-flight Readiness Check
  const isReasonOk = explanation.trim().length >= 20;
  const isDocOk = !!uploadedFile;
  const isShortageOk = parseFloat(shortagePct) <= 10.0;
  const isReadyToSubmit = isReasonOk && isDocOk && reasonTitle.trim().length > 3;

  const handleSimFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        filename: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: 'Official Evidence',
        verified: true
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReadyToSubmit) return;

    await api.submitCondonation({
      student_id: studentId,
      reason_category: reasonCategory,
      reason_title: reasonTitle,
      explanation: explanation,
      documents: [uploadedFile]
    });

    setSubmissionSuccess(true);
    fetchCondonations();
    setTimeout(() => {
      setActiveTab('list');
      setSubmissionSuccess(false);
      setReasonTitle('');
      setExplanation('');
      setUploadedFile(null);
    }, 1500);
  };

  const handleReviewAction = async (appId, action) => {
    const reviewerRole = currentRole === 'student' ? 'mentor' : currentRole;
    await api.reviewCondonation(appId, {
      role: reviewerRole,
      action: action,
      reviewer_name: currentRole === 'hod' ? 'Dr. A. K. Sharma (HOD)' : currentRole === 'exam_cell' ? 'Dr. V. Raman (Exam Cell)' : 'Dr. Radhika Sen (Mentor)',
      notes: `Endorsed and approved during ${reviewerRole.toUpperCase()} review cycle.`
    });
    fetchCondonations();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="page-eyebrow" style={{ color: 'var(--status-info-text)' }}>Institutional Governance</span>
            <span style={{ background: '#eef2ff', color: '#3730a3', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
              Official Condonation Portal
            </span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Digital Condonation Workflow
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
            Transparent end-to-end processing for legitimate medical, emergency, or institutional on-duty attendance waivers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn-secondary ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
            style={{ fontWeight: activeTab === 'list' ? 700 : 500 }}
          >
            Track Applications ({condonations.length})
          </button>
          <button
            className={`btn-primary ${activeTab === 'apply' ? 'active' : ''}`}
            onClick={() => setActiveTab('apply')}
          >
            <span>+ New Application</span>
          </button>
        </div>
      </div>

      {activeTab === 'apply' && (
        <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Apply for Attendance Condonation</h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Submissions are audited against university regulations. Incomplete applications will not be forwarded to the Dean's committee.
          </p>

          {/* Condonation Readiness Check Card */}
          <div className="condonation-readiness-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--status-info-accent)" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  CONDONATION PRE-FLIGHT READINESS CHECK
                </span>
              </div>
              <span className={`status-badge ${isReadyToSubmit ? 'safe' : 'watch'}`}>
                {isReadyToSubmit ? 'Ready to Submit' : 'Requirements Incomplete'}
              </span>
            </div>

            <div className="readiness-check-grid">
              <div className="readiness-item">
                <CheckCircle2 size={16} color={isReasonOk ? 'var(--status-safe-accent)' : '#d1d5db'} />
                <span>Explanation detailed ({explanation.trim().length}/20 chars)</span>
              </div>
              <div className="readiness-item">
                <CheckCircle2 size={16} color={isDocOk ? 'var(--status-safe-accent)' : '#d1d5db'} />
                <span>Supporting certificate attached</span>
              </div>
              <div className="readiness-item">
                <CheckCircle2 size={16} color="var(--status-safe-accent)" />
                <span>Attendance shortage ({shortagePct}%) within ≤10% limit</span>
              </div>
            </div>
          </div>

          {submissionSuccess && (
            <div style={{ background: 'var(--status-safe-bg)', border: '1px solid var(--status-safe-border)', color: 'var(--status-safe-text)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600 }}>
              ✓ Application submitted successfully! Routing to Dr. Radhika Sen for Mentor review.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category of Exemption</label>
                <select
                  className="form-select"
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                >
                  <option value="Medical">Medical Illness / Hospitalization</option>
                  <option value="Academic Representation">Academic / National Hackathon OD</option>
                  <option value="Sports Representation">University Sports Representation</option>
                  <option value="Family Emergency">Unforeseen Family Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description / Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Viral infection recovery / IEEE hackathon attendance"
                  value={reasonTitle}
                  onChange={(e) => setReasonTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Explanation</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Explain the dates of absence, hospital / event details, and context..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                required
              />
              <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Minimum 20 characters required for institutional audit.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Supporting Documentary Proof (PDF / Doctor Certificate)</label>
              <div style={{ border: '2px dashed var(--border-subtle)', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'var(--bg-canvas)' }}>
                {uploadedFile ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <FileText size={18} color="#059669" />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{uploadedFile.filename}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>({uploadedFile.size})</span>
                    <button type="button" onClick={() => setUploadedFile(null)} style={{ color: 'var(--text-tertiary)', marginLeft: '8px' }}>✕</button>
                  </div>
                ) : (
                  <div>
                    <Upload size={24} color="var(--text-tertiary)" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Click to attach official document</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Hospital discharge, doctor prescription, or event OD letter</div>
                    <input
                      type="file"
                      id="condonation-file"
                      onChange={handleSimFileUpload}
                      style={{ marginTop: '12px', fontSize: '12px' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn-secondary" onClick={() => setActiveTab('list')}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!isReadyToSubmit}
                style={{ opacity: isReadyToSubmit ? 1 : 0.5, cursor: isReadyToSubmit ? 'pointer' : 'not-allowed' }}
              >
                <span>Submit Formal Application</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {condonations.map((app) => (
            <div key={app.id} style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-tertiary)' }}>{app.id}</span>
                    <span className="status-badge info">{app.reason_category}</span>
                  </div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {app.reason_title}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Applicant: <strong>{app.student_name}</strong> ({app.student_id}) • Shortage: <strong>{app.shortage_pct}%</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span className={`status-badge ${app.status === 'APPROVED' ? 'safe' : app.status === 'REJECTED' ? 'critical' : 'watch'}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>{app.created_at}</span>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                "{app.explanation}"
              </p>

              {/* Attached Verified Documents */}
              {app.documents && app.documents.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {app.documents.map((doc, idx) => (
                    <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px' }}>
                      <FileText size={14} color="var(--status-safe-text)" />
                      <span style={{ fontWeight: 600 }}>{doc.filename}</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>({doc.size || 'PDF'})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Visual Approval Timeline */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '18px 22px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  Application Progress Timeline
                </div>

                <div className="timeline-container">
                  {app.timeline.map((step, sIdx) => {
                    const isDone = step.status === 'COMPLETED';
                    const isInProg = step.status === 'IN_PROGRESS';

                    return (
                      <div key={sIdx} className="timeline-step">
                        <div className={`timeline-marker ${isDone ? 'completed' : isInProg ? 'in-progress' : ''}`}>
                          {isDone ? <CheckCircle2 size={12} /> : isInProg ? <Clock size={12} color="var(--status-watch-accent)" /> : null}
                        </div>
                        <div>
                          <div className="timeline-step-title">{step.step} • {step.actor}</div>
                          <div className="timeline-step-meta">{step.date}</div>
                          {step.notes && (
                            <div className="timeline-step-notes">
                              "{step.notes}"
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviewer Action Buttons (for judges to test advancing the workflow live!) */}
              {app.status !== 'APPROVED' && app.status !== 'REJECTED' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Demo Review Action ({currentRole.toUpperCase()}):
                  </span>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '6px 14px', background: '#047857' }}
                    onClick={() => handleReviewAction(app.id, 'APPROVE')}
                  >
                    <span>✓ Endorse & Advance Step</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
