import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Printer,
  ShieldCheck,
  FileText,
  Users,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Eye,
  Check,
  X,
  Award,
  Sparkles,
  Layers,
  FileDown,
  HelpCircle
} from 'lucide-react';
import StudentDirectory from './StudentDirectory';
import { studentStore, exportStudentsToCSV } from '../services/studentDirectory';

export default function ExamCellDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'directory' | 'condonation' | 'report' | 'exports'
  const [reportSearch, setReportSearch] = useState('');
  const [reportDeptFilter, setReportDeptFilter] = useState('ALL');
  const [reportStatusFilter, setReportStatusFilter] = useState('ALL');

  // Condonation applications state (live interactive)
  const [condonationList, setCondonationList] = useState([
    {
      id: 'COND-26-001',
      studentId: '23CS104',
      name: 'Sameer Patil',
      prn: 'PRN230104',
      dept: 'Computer Science',
      year: 'TY',
      attendance: 74.2,
      required: 75.0,
      shortfall: '0.8%',
      reason: 'Viral fever hospitalization (3 days)',
      documents: 'Civil Hospital Certificate + Admission Discharge Slip',
      status: 'Under Review',
      submissionDate: '2026-10-02',
      mentorNote: 'Recommended by Dr. Radhika Sen. Academic coursework is complete.'
    },
    {
      id: 'COND-26-002',
      studentId: '23CS124',
      name: 'Aditya More',
      prn: 'PRN230124',
      dept: 'Computer Science',
      year: 'TY',
      attendance: 69.8,
      required: 75.0,
      shortfall: '5.2%',
      reason: 'Inter-University Basketball Tournament (Zonal Representation)',
      documents: 'Sports Director Official Deputation Letter',
      status: 'Pending',
      submissionDate: '2026-10-03',
      mentorNote: 'Represented college at State Level. Recommended for university sports duty condonation.'
    },
    {
      id: 'COND-26-003',
      studentId: '23IT142',
      name: 'Aman Patel',
      prn: 'PRN230142',
      dept: 'Information Tech',
      year: 'TY',
      attendance: 71.5,
      required: 75.0,
      shortfall: '3.5%',
      reason: 'Orthopedic Fracture (Ankle Injury, 2 weeks recovery)',
      documents: 'Orthopedic Surgeon Certificate & Fitness Slip',
      status: 'Approved',
      submissionDate: '2026-09-28',
      mentorNote: 'Verified with parents. All internal assignments and tutorials submitted.'
    },
    {
      id: 'COND-26-004',
      studentId: '23CS189',
      name: 'Rohan Kulkarni',
      prn: 'PRN230189',
      dept: 'Computer Science',
      year: 'TY',
      attendance: 64.2,
      required: 75.0,
      shortfall: '10.8%',
      reason: 'Personal family engagement & unexcused absenteeism',
      documents: 'Self-attested explanation letter (No medical certificate)',
      status: 'Rejected',
      submissionDate: '2026-09-25',
      mentorNote: 'Below 65% statutory threshold. Institutional guidelines do not permit condonation.'
    },
    {
      id: 'COND-26-005',
      studentId: '23DS132',
      name: 'Priya Shah',
      prn: 'PRN230132',
      dept: 'Data Science',
      year: 'TY',
      attendance: 73.1,
      required: 75.0,
      shortfall: '1.9%',
      reason: 'Smart India Hackathon Finalist Round travel',
      documents: 'MoE Innovation Cell Participation Letter & Rail Tickets',
      status: 'Under Review',
      submissionDate: '2026-10-04',
      mentorNote: 'Brought 2nd runner up trophy for college. Strongly recommended for technical condonation.'
    }
  ]);

  const [selectedCondonation, setSelectedCondonation] = useState(null);
  const [condonationSuccessMsg, setCondonationSuccessMsg] = useState('');

  // Handle Condonation status change
  const handleCondonationAction = (id, newStatus) => {
    setCondonationList(prev =>
      prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
    );
    const item = condonationList.find(c => c.id === id);
    setCondonationSuccessMsg(`Condonation for ${item?.name || 'student'} marked as "${newStatus}".`);
    setTimeout(() => setCondonationSuccessMsg(''), 4000);
    if (selectedCondonation && selectedCondonation.id === id) {
      setSelectedCondonation(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Eligibility roster candidates from student store + institutional data
  const allDirectoryStudents = studentStore.getAll();
  const rosterCandidates = allDirectoryStudents.map(s => {
    const isApproved = condonationList.find(c => c.studentId === s.id && c.status === 'Approved');
    const isPending = condonationList.find(c => c.studentId === s.id && (c.status === 'Pending' || c.status === 'Under Review'));
    
    let eligibility = 'ELIGIBLE';
    let condonation = 'None';
    let finalStatus = 'Clearance Approved';
    let hallTicket = 'ISSUED';
    let shortfall = 0;

    if (s.attendance < 75) {
      shortfall = (75 - s.attendance).toFixed(1);
      if (s.attendance < 65) {
        eligibility = 'NOT ELIGIBLE';
        condonation = 'Ineligible (<65%)';
        finalStatus = 'Detained';
        hallTicket = 'LOCKED';
      } else if (isApproved) {
        eligibility = 'CONDONED';
        condonation = 'Approved (Medical/Duty)';
        finalStatus = 'Clearance Approved (Condoned)';
        hallTicket = 'ISSUED';
      } else if (isPending) {
        eligibility = 'CONDONATION PENDING';
        condonation = 'Under Review';
        finalStatus = 'Provisional Clearance';
        hallTicket = 'PROVISIONAL';
      } else {
        eligibility = 'AT RISK';
        condonation = 'Action Required';
        finalStatus = 'Clearance Withheld';
        hallTicket = 'WITHHELD';
      }
    }

    return {
      id: s.id,
      prn: s.prn,
      name: s.name,
      dept: s.department,
      year: s.year,
      division: s.division,
      attendance: s.attendance,
      shortfall: shortfall > 0 ? `${shortfall}%` : '0.0%',
      eligibility,
      condonation,
      finalStatus,
      hallTicket,
      mentor: s.mentor
    };
  });

  const filteredRoster = rosterCandidates.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(reportSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(reportSearch.toLowerCase()) ||
      c.prn.toLowerCase().includes(reportSearch.toLowerCase());
    const matchDept = reportDeptFilter === 'ALL' || c.dept === reportDeptFilter;
    const matchStatus = reportStatusFilter === 'ALL' || c.eligibility === reportStatusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  // Smart Predefined Exports trigger
  const handleSmartExport = (type) => {
    const list = studentStore.getAll();
    let exportSet = list;
    let filename = `Attendance_IQ_${type}_Export.csv`;

    switch (type) {
      case 'Full_Student_Report':
        exportSet = list;
        filename = 'Apex_Full_Student_Administration_Report.csv';
        break;
      case 'Attendance_Report':
        exportSet = list;
        filename = 'Apex_Fall_Semester_Attendance_Register.csv';
        break;
      case 'At_Risk_Students':
        exportSet = list.filter(s => s.attendance < 75);
        filename = 'Apex_At_Risk_Attendance_Defaulters.csv';
        break;
      case 'Exam_Eligibility_Report':
        exportSet = list;
        filename = 'Apex_Controller_Of_Exams_Gazetted_Roll.csv';
        break;
      case 'Mentor_Wise_Students':
        exportSet = [...list].sort((a, b) => a.mentor.localeCompare(b.mentor));
        filename = 'Apex_Mentor_Allocation_And_Monitoring_Report.csv';
        break;
      case 'Department_Wise_Report':
        exportSet = [...list].sort((a, b) => a.department.localeCompare(b.department));
        filename = 'Apex_Departmental_Attendance_Summary.csv';
        break;
      case 'Monthly_Attendance_Report':
        exportSet = list;
        filename = 'Apex_October_2026_Monthly_Attendance_Audit.csv';
        break;
      default:
        break;
    }

    exportStudentsToCSV(exportSet, filename);
  };

  return (
    <div className="examcell-dashboard-container" style={{ paddingBottom: '60px' }}>
      {/* Top Banner / Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0d9488', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Examination Administration
            </span>
            <span style={{ background: '#ccfbf1', color: '#115e59', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
              University Compliance Statute § 75.0%
            </span>
          </div>
          <h1 className="page-title" style={{ fontSize: '28px', color: '#102a43', margin: 0, fontWeight: 800 }}>
            Exam Eligibility Control Center
          </h1>
          <p className="page-subtitle" style={{ color: '#486581', margin: '4px 0 0 0', fontSize: '14.5px' }}>
            Monitor eligibility, identify exceptions and prepare exam-ready reports.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px' }}
            onClick={() => handleSmartExport('Exam_Eligibility_Report')}
          >
            <Download size={15} />
            <span>Export Gazetted Roll</span>
          </button>
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px', background: '#0d9488', color: '#fff' }}
            onClick={() => window.print()}
          >
            <Printer size={15} />
            <span>Print Official Roster</span>
          </button>
        </div>
      </div>

      {/* Live QR In-Class Attendance Stream Banner (Section 18) */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDFA 0%, #ECFDF5 100%)',
        border: '1px solid #99F6E4',
        borderRadius: '14px',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0D9488', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F766E' }}>
            Live QR Attendance Stream:
          </span>
          <span style={{ fontSize: '12.5px', color: '#115E59' }}>
            Data Structures (TY CSE - A) • 36 verified present • 3 students moved into exam clearance safe zone
          </span>
        </div>
        <span style={{ background: '#CCFBF1', color: '#0F766E', fontSize: '11px', fontWeight: 800, padding: '3px 9px', borderRadius: '6px' }}>
          Real-Time Synced
        </span>
      </div>

      {/* Confirmation notification banner */}
      {condonationSuccessMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '12px 18px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '13.5px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{condonationSuccessMsg}</span>
        </div>
      )}

      {/* Institutional Overview Metrics: 1,248 / 1,084 / 102 / 62 / 38 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          borderLeft: '4px solid #334e68'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#627d98', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Total Students
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#102a43', marginTop: '4px' }}>
            1,248
          </div>
          <div style={{ fontSize: '11.5px', color: '#829ab1', marginTop: '2px' }}>
            Across 5 Academic Depts
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Eligible
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
            1,084
          </div>
          <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '2px' }}>
            86.9% • Ready for hall tickets
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            At Risk
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
            102
          </div>
          <div style={{ fontSize: '11.5px', color: '#b45309', marginTop: '2px' }}>
            70% – 74.9% • Under watch
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          borderLeft: '4px solid #ef4444'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Not Eligible
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#b91c1c', marginTop: '4px' }}>
            62
          </div>
          <div style={{ fontSize: '11.5px', color: '#b91c1c', marginTop: '2px' }}>
            &lt;65% • Detained list
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Condonation Required
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#6d28d9', marginTop: '4px' }}>
            38
          </div>
          <div style={{ fontSize: '11.5px', color: '#6d28d9', marginTop: '2px' }}>
            65% – 75% • Claims pending
          </div>
        </div>
      </div>

      {/* Visual Eligibility Distribution Meter */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '18px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#102a43', margin: 0 }}>
              Eligibility Overview & Statutory Distribution
            </h3>
            <p style={{ fontSize: '12.5px', color: '#627d98', margin: '2px 0 0 0' }}>
              Minimum 75.0% threshold mandated by university regulation for end-semester admit clearance.
            </p>
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#102a43', background: '#f0f4f8', padding: '4px 10px', borderRadius: '6px' }}>
            1,248 Audited Records
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div style={{
          height: '14px',
          width: '100%',
          backgroundColor: '#e2e8f0',
          borderRadius: '7px',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '12px'
        }}>
          <div style={{ width: '86.9%', backgroundColor: '#10b981' }} title="Eligible: 86.9% (1,084)" />
          <div style={{ width: '8.2%', backgroundColor: '#f59e0b' }} title="At Risk: 8.2% (102)" />
          <div style={{ width: '3.0%', backgroundColor: '#8b5cf6' }} title="Condonation: 3.0% (38)" />
          <div style={{ width: '5.0%', backgroundColor: '#ef4444' }} title="Not Eligible: 5.0% (62)" />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '12px', color: '#486581' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span><strong>Eligible (≥75%):</strong> 1,084 (86.9%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
            <span><strong>At Risk (70–74.9%):</strong> 102 (8.2%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8b5cf6', display: 'inline-block' }} />
            <span><strong>Condonation (65–75%):</strong> 38 (3.0%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
            <span><strong>Not Eligible (&lt;65%):</strong> 62 (5.0%)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Exam Cell */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            color: activeTab === 'overview' ? '#0d9488' : '#627d98',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '3px solid #0d9488' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s'
          }}
        >
          <Layers size={16} />
          <span>Eligibility Control</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: activeTab === 'directory' ? 700 : 500,
            color: activeTab === 'directory' ? '#0d9488' : '#627d98',
            border: 'none',
            borderBottom: activeTab === 'directory' ? '3px solid #0d9488' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s'
          }}
        >
          <Users size={16} />
          <span>Student Directory & Data</span>
        </button>

        <button
          onClick={() => setActiveTab('condonation')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: activeTab === 'condonation' ? 700 : 500,
            color: activeTab === 'condonation' ? '#0d9488' : '#627d98',
            border: 'none',
            borderBottom: activeTab === 'condonation' ? '3px solid #0d9488' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s'
          }}
        >
          <ShieldCheck size={16} />
          <span>Condonation Management ({condonationList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: activeTab === 'report' ? 700 : 500,
            color: activeTab === 'report' ? '#0d9488' : '#627d98',
            border: 'none',
            borderBottom: activeTab === 'report' ? '3px solid #0d9488' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s'
          }}
        >
          <FileText size={16} />
          <span>Exam Eligibility Report</span>
        </button>

        <button
          onClick={() => setActiveTab('exports')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: activeTab === 'exports' ? 700 : 500,
            color: activeTab === 'exports' ? '#0d9488' : '#627d98',
            border: 'none',
            borderBottom: activeTab === 'exports' ? '3px solid #0d9488' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s'
          }}
        >
          <FileSpreadsheet size={16} />
          <span>Smart Exports Hub</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & DEFAULTERS */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Action Callout Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #fed7aa',
              borderRadius: '16px',
              padding: '20px',
              backgroundColor: '#fffaf0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={18} color="#c2410c" />
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#9a3412', margin: 0 }}>
                  Immediate Defaulter Audit Required
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: '#7c2d12', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                62 students fall strictly below the statutory 65.0% threshold. University statute dictates automatic examination detention unless institutional exemption is certified by Dean.
              </p>
              <button
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#fdba74', color: '#9a3412' }}
                onClick={() => {
                  setActiveTab('report');
                  setReportStatusFilter('NOT ELIGIBLE');
                }}
              >
                Inspect Detained Roster →
              </button>
            </div>

            <div style={{
              background: '#fff',
              border: '1px solid #ddd6fe',
              borderRadius: '16px',
              padding: '20px',
              backgroundColor: '#faf5ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={18} color="#6d28d9" />
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#5b21b6', margin: 0 }}>
                  Condonation Applications Awaiting Clearance
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: '#4c1d95', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                38 students submitted medical, academic representation, or university duty documentation for attendance between 65% and 75%.
              </p>
              <button
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#c4b5fd', color: '#5b21b6' }}
                onClick={() => setActiveTab('condonation')}
              >
                Open Condonation Desk ({condonationList.length}) →
              </button>
            </div>
          </div>

          {/* Quick Gazetted Candidates Sample Roster */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#102a43', margin: 0 }}>
                  Critical Compliance Cases
                </h3>
                <p style={{ fontSize: '12.5px', color: '#627d98', margin: '2px 0 0 0' }}>
                  Students requiring immediate exam cell clearance before hall tickets dispatch
                </p>
              </div>
              <button
                className="btn-secondary"
                style={{ fontSize: '12.5px', padding: '6px 12px' }}
                onClick={() => setActiveTab('report')}
              >
                View Full Gazetted Roll ({rosterCandidates.length})
              </button>
            </div>

            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="mentor-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Student</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Dept & Roll</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Attendance</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Shortfall</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '12px', color: '#486581' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterCandidates.slice(0, 6).map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#102a43', fontSize: '13.5px' }}>{c.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#627d98' }}>{c.prn}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334e68' }}>
                        {c.dept} • {c.id}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: c.attendance >= 75 ? '#059669' : c.attendance >= 70 ? '#d97706' : '#dc2626'
                        }}>
                          {c.attendance}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', color: '#486581' }}>
                        {c.shortfall}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background:
                            c.eligibility === 'ELIGIBLE' ? '#ecfdf5' :
                            c.eligibility === 'CONDONED' ? '#f5f3ff' :
                            c.eligibility === 'AT RISK' ? '#fffbeb' : '#fef2f2',
                          color:
                            c.eligibility === 'ELIGIBLE' ? '#047857' :
                            c.eligibility === 'CONDONED' ? '#6d28d9' :
                            c.eligibility === 'AT RISK' ? '#b45309' : '#b91c1c'
                        }}>
                          {c.finalStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '11.5px', padding: '4px 10px' }}
                          onClick={() => {
                            setActiveTab('directory');
                          }}
                        >
                          Audit Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMBEDDED STUDENT DIRECTORY (ROLE = EXAM CELL) */}
      {activeTab === 'directory' && (
        <div style={{ marginTop: '10px' }}>
          <StudentDirectory role="exam_cell" />
        </div>
      )}

      {/* TAB 3: CONDONATION MANAGEMENT */}
      {activeTab === 'condonation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#102a43', margin: 0 }}>
                  Condonation Applications Desk
                </h3>
                <p style={{ fontSize: '13px', color: '#627d98', margin: '4px 0 0 0' }}>
                  Students below required 75.0% threshold who qualify for condonation (65%–75%) under medical grounds, university representation, or bereavement.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '12.5px', padding: '6px 12px' }}
                  onClick={() => handleSmartExport('At_Risk_Students')}
                >
                  <Download size={14} />
                  <span>Export Condonation Roll</span>
                </button>
              </div>
            </div>

            {/* Condonation Table */}
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="mentor-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Student</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Attendance</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Required</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Shortfall</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Reason</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Documents</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '12px', color: '#486581' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {condonationList.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#102a43', fontSize: '13.5px' }}>{item.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#627d98' }}>{item.studentId} • {item.dept}</div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13.5px', color: item.attendance >= 70 ? '#b45309' : '#dc2626' }}>
                          {item.attendance}%
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334e68' }}>
                        {item.required}%
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>
                        -{item.shortfall}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#334e68', maxWidth: '180px' }}>
                        {item.reason}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '12px', color: '#627d98', maxWidth: '200px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '3px 7px', borderRadius: '4px' }}>
                          <FileText size={12} />
                          {item.documents.length > 28 ? item.documents.slice(0, 28) + '...' : item.documents}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background:
                            item.status === 'Approved' ? '#ecfdf5' :
                            item.status === 'Rejected' ? '#fef2f2' :
                            item.status === 'Under Review' ? '#eff6ff' : '#fffbeb',
                          color:
                            item.status === 'Approved' ? '#047857' :
                            item.status === 'Rejected' ? '#b91c1c' :
                            item.status === 'Under Review' ? '#1d4ed8' : '#b45309'
                        }}>
                          {item.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11.5px' }}
                            title="Inspect application evidence"
                            onClick={() => setSelectedCondonation(item)}
                          >
                            Review
                          </button>
                          <button
                            style={{
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              color: '#065f46',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            title="Grant exam clearance under condonation"
                            onClick={() => handleCondonationAction(item.id, 'Approved')}
                          >
                            Approve
                          </button>
                          <button
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#991b1b',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            title="Reject condonation claim"
                            onClick={() => handleCondonationAction(item.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Condonation Review Modal */}
          {selectedCondonation && (
            <div className="modal-backdrop" onClick={() => setSelectedCondonation(null)}>
              <div className="modal-box" style={{ maxWidth: '580px', padding: '24px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#102a43', margin: 0 }}>
                      Condonation Dossier Review
                    </h3>
                    <span style={{ fontSize: '12px', color: '#627d98' }}>Docket: {selectedCondonation.id}</span>
                  </div>
                  <button
                    onClick={() => setSelectedCondonation(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: '#627d98', display: 'block', fontSize: '11.5px' }}>Student</span>
                      <strong>{selectedCondonation.name} ({selectedCondonation.studentId})</strong>
                    </div>
                    <div>
                      <span style={{ color: '#627d98', display: 'block', fontSize: '11.5px' }}>PRN</span>
                      <strong>{selectedCondonation.prn}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#627d98', display: 'block', fontSize: '11.5px' }}>Current Attendance</span>
                      <strong style={{ color: selectedCondonation.attendance >= 70 ? '#b45309' : '#b91c1c' }}>
                        {selectedCondonation.attendance}% (-{selectedCondonation.shortfall})
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#627d98', display: 'block', fontSize: '11.5px' }}>Department</span>
                      <strong>{selectedCondonation.dept} • {selectedCondonation.year}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#334e68', marginBottom: '4px' }}>
                    Reason for Exemption Claim:
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#102a43', background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '8px' }}>
                    {selectedCondonation.reason}
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#334e68', marginBottom: '4px' }}>
                    Attached Documentary Evidence:
                  </div>
                  <div style={{ fontSize: '13px', color: '#0d9488', background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} />
                    <span>{selectedCondonation.documents}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#334e68', marginBottom: '4px' }}>
                    Mentor & Departmental Endorsement:
                  </div>
                  <div style={{ fontSize: '13px', color: '#486581', fontStyle: 'italic', background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '8px' }}>
                    "{selectedCondonation.mentorNote}"
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => handleCondonationAction(selectedCondonation.id, 'Rejected')}
                    style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                  >
                    Reject Claim
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => handleCondonationAction(selectedCondonation.id, 'Approved')}
                    style={{ background: '#059669', color: '#fff' }}
                  >
                    Approve Condonation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: EXAM ELIGIBILITY REPORT */}
      {activeTab === 'report' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43', margin: 0 }}>
                  Exam Eligibility Gazetted Roster
                </h3>
                <p style={{ fontSize: '13px', color: '#627d98', margin: '4px 0 0 0' }}>
                  Statutory gazetted candidate list for final hall ticket clearance and exam entry.
                </p>
              </div>

              {/* Export Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '6px 12px' }}
                  onClick={() => handleSmartExport('Exam_Eligibility_Report')}
                >
                  <FileSpreadsheet size={15} color="#059669" />
                  <span>Export Excel</span>
                </button>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '6px 12px' }}
                  onClick={() => window.print()}
                >
                  <FileText size={15} color="#dc2626" />
                  <span>Export PDF</span>
                </button>
                <button
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '6px 14px' }}
                  onClick={() => window.print()}
                >
                  <Printer size={15} />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', flex: 1, minWidth: '220px' }}>
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search candidate name, roll, or PRN..."
                  value={reportSearch}
                  onChange={e => setReportSearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
                />
              </div>

              <select
                value={reportDeptFilter}
                onChange={e => setReportDeptFilter(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#fff' }}
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Tech">Information Tech</option>
                <option value="Data Science">Data Science</option>
                <option value="Electronics & Telecom">Electronics & Telecom</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
              </select>

              <select
                value={reportStatusFilter}
                onChange={e => setReportStatusFilter(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#fff' }}
              >
                <option value="ALL">All Eligibility Statuses</option>
                <option value="ELIGIBLE">Eligible</option>
                <option value="CONDONED">Condoned</option>
                <option value="CONDONATION PENDING">Condonation Pending</option>
                <option value="AT RISK">At Risk</option>
                <option value="NOT ELIGIBLE">Not Eligible (Detained)</option>
              </select>
            </div>

            {/* Gazetted Report Table */}
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="mentor-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Student</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>PRN</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Department</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Attendance</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Eligibility</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Shortfall</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Condonation</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#486581' }}>Final Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoster.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#102a43', fontSize: '13.5px' }}>{c.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#627d98' }}>Roll: {c.id}</div>
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334e68', fontFamily: 'monospace' }}>
                        {c.prn}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '13px', color: '#486581' }}>
                        {c.dept} ({c.year}-{c.division})
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: c.attendance >= 75 ? '#059669' : c.attendance >= 70 ? '#d97706' : '#dc2626'
                        }}>
                          {c.attendance}%
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background:
                            c.eligibility === 'ELIGIBLE' ? '#ecfdf5' :
                            c.eligibility === 'CONDONED' ? '#f5f3ff' :
                            c.eligibility === 'AT RISK' ? '#fffbeb' : '#fef2f2',
                          color:
                            c.eligibility === 'ELIGIBLE' ? '#047857' :
                            c.eligibility === 'CONDONED' ? '#6d28d9' :
                            c.eligibility === 'AT RISK' ? '#b45309' : '#b91c1c'
                        }}>
                          {c.eligibility}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '13px', color: '#486581' }}>
                        {c.shortfall}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#334e68' }}>
                        {c.condonation}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontWeight: 600,
                          fontSize: '12px',
                          color:
                            c.finalStatus.includes('Approved') ? '#047857' :
                            c.finalStatus.includes('Withheld') ? '#b45309' : '#b91c1c'
                        }}>
                          {c.finalStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SMART EXPORT HUB */}
      {activeTab === 'exports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43', margin: 0 }}>
              Institutional Smart Export Hub
            </h3>
            <p style={{ fontSize: '13px', color: '#627d98', margin: '4px 0 20px 0' }}>
              Pre-configured academic datasets formatted for Excel (.xlsx/.csv), ready for internal committee reviews, Dean submission, and parent audits.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Export Card 1 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>📊</span>
                    <strong style={{ fontSize: '14.5px', color: '#102a43' }}>Full Student Report</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#627d98', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                    Complete database with 19 attributes: personal IDs, parent contact, attendance % and mentors.
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', width: '100%' }}
                  onClick={() => handleSmartExport('Full_Student_Report')}
                >
                  <Download size={14} />
                  <span>Download Full Report (.csv)</span>
                </button>
              </div>

              {/* Export Card 2 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>📈</span>
                    <strong style={{ fontSize: '14.5px', color: '#102a43' }}>Attendance Report</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#627d98', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                    Detailed lecture registers, classes attended, classes conducted, and attendance percentages.
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', width: '100%' }}
                  onClick={() => handleSmartExport('Attendance_Report')}
                >
                  <Download size={14} />
                  <span>Download Attendance Sheet</span>
                </button>
              </div>

              {/* Export Card 3 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>⚠</span>
                    <strong style={{ fontSize: '14.5px', color: '#102a43' }}>At-Risk Students</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#627d98', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                    Filtered list of all students under 75% for mentor intervention and early-warning letters.
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', width: '100%' }}
                  onClick={() => handleSmartExport('At_Risk_Students')}
                >
                  <Download size={14} />
                  <span>Download At-Risk List</span>
                </button>
              </div>

              {/* Export Card 4 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>🎓</span>
                    <strong style={{ fontSize: '14.5px', color: '#102a43' }}>Exam Eligibility Report</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#627d98', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                    Official gazetted clearance roster including shortfall, condonation status and hall ticket validity.
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', width: '100%' }}
                  onClick={() => handleSmartExport('Exam_Eligibility_Report')}
                >
                  <Download size={14} />
                  <span>Download Gazetted Roll</span>
                </button>
              </div>

              {/* Export Card 5 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>👨‍🏫</span>
                    <strong style={{ fontSize: '14.5px', color: '#102a43' }}>Mentor-wise Students</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#627d98', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                    Grouped by faculty mentors to coordinate batch counseling sessions and recovery monitoring.
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', width: '100%' }}
                  onClick={() => handleSmartExport('Mentor_Wise_Students')}
                >
                  <Download size={14} />
                  <span>Download Mentor Groups</span>
                </button>
              </div>

              {/* Export Card 6 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>🏫</span>
                    <strong style={{ fontSize: '14.5px', color: '#102a43' }}>Department-wise Report</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#627d98', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                    Department comparison breakdown for Computer Science, IT, Data Science, EXTC and Mechanical.
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', width: '100%' }}
                  onClick={() => handleSmartExport('Department_Wise_Report')}
                >
                  <Download size={14} />
                  <span>Download Dept Roster</span>
                </button>
              </div>

              {/* Export Card 7 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>📅</span>
                    <strong style={{ fontSize: '14.5px', color: '#102a43' }}>Monthly Attendance Report</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#627d98', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                    October 2026 month-close attendance archive for Dean and Registrar compliance filing.
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', width: '100%' }}
                  onClick={() => handleSmartExport('Monthly_Attendance_Report')}
                >
                  <Download size={14} />
                  <span>Download Monthly Archive</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
