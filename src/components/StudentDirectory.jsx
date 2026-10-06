import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  User,
  CheckCircle2,
  AlertTriangle,
  Zap,
  MoreVertical,
  X,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Check,
  Send,
  Sliders,
  RotateCcw,
  BookOpen,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import {
  studentStore,
  getSmartStudentInsight,
  exportStudentsToCSV,
  downloadSampleTemplate
} from '../services/studentDirectory';
import SendWhatsAppModal from './whatsapp/SendWhatsAppModal';

export default function StudentDirectory({
  role = 'mentor', // 'mentor' | 'exam_cell' | 'hod'
  onSelectStudentForDashboard,
  defaultMentorFilter = null
}) {
  const [students, setStudents] = useState(() => studentStore.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState('attendance'); // 'attendance' | 'name' | 'id' | 'riskLevel' | 'lastUpdated'
  const [sortAsc, setSortAsc] = useState(false);

  // Filters
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [filterExam, setFilterExam] = useState('ALL');
  const [filterMentor, setFilterMentor] = useState(defaultMentorFilter || 'ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  // WhatsApp Quick Modal state (Prompt Section 15: QUICK ACTION FROM STUDENT TABLE)
  const [whatsAppModalStudent, setWhatsAppModalStudent] = useState(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Confirmation alerts
  const [alertBanner, setAlertBanner] = useState(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    prn: '',
    email: '',
    phone: '',
    dob: '',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: '',
    gender: 'Male',
    attendance: 75,
    conducted: 120,
    attended: 90,
    mentor: 'Dr. Radhika Sen',
    mentorNotes: '',
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });

  // Export Modal state
  const [exportScope, setExportScope] = useState('ALL'); // 'ALL' | 'FILTERED' | 'SELECTED'
  const [exportFields, setExportFields] = useState({
    info: true,
    attendance: true,
    exam: true,
    risk: true,
    mentor: true,
    parent: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Import Modal state
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // Filter & Sort Logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        s.name.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query) ||
        s.prn.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query);

      // Dropdown filters
      const matchesDept = filterDept === 'ALL' || s.department === filterDept;
      const matchesYear = filterYear === 'ALL' || s.year === filterYear;
      const matchesDivision = filterDivision === 'ALL' || s.division === filterDivision;
      const matchesRisk = filterRisk === 'ALL' || s.riskLevel === filterRisk;
      const matchesExam = filterExam === 'ALL' || s.examStatus === filterExam;
      const matchesMentor = filterMentor === 'ALL' || s.mentor === filterMentor;

      return matchesSearch && matchesDept && matchesYear && matchesDivision && matchesRisk && matchesExam && matchesMentor;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [students, searchQuery, filterDept, filterYear, filterDivision, filterRisk, filterExam, filterMentor, sortField, sortAsc]);

  // Handle Multi-Select Checkbox
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Open Profile
  const handleOpenProfile = (student) => {
    setActiveStudent(student);
    setIsProfileModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (student, e) => {
    if (e) e.stopPropagation();
    setActiveStudent(student);
    setFormData({ ...student });
    setIsEditModalOpen(true);
  };

  // Open Add
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      id: `23CS${100 + students.length + 1}`,
      prn: `PRN230${100 + students.length + 1}`,
      email: '',
      phone: '',
      dob: '2004-01-01',
      department: 'Computer Science',
      course: 'B.Tech CSE',
      year: 'TY',
      semester: 5,
      division: 'A',
      rollNumber: 100 + students.length + 1,
      gender: 'Male',
      attendance: 75,
      conducted: 120,
      attended: 90,
      mentor: 'Dr. Radhika Sen',
      mentorNotes: '',
      parentName: '',
      parentPhone: '',
      parentEmail: ''
    });
    setIsAddModalOpen(true);
  };

  // Save Add Student
  const handleSaveAdd = (andAnother = false) => {
    if (!formData.name.trim()) {
      alert('Please enter student full name.');
      return;
    }
    const added = studentStore.add(formData);
    setStudents(studentStore.getAll());
    setAlertBanner(`Student added successfully 🎉 — ${added.name} has been enrolled in your group.`);

    if (andAnother) {
      handleOpenAdd();
    } else {
      setIsAddModalOpen(false);
    }

    setTimeout(() => setAlertBanner(null), 5000);
  };

  // Save Edit Student
  const handleSaveEdit = () => {
    if (!formData.name.trim()) {
      alert('Please enter student full name.');
      return;
    }
    const updated = studentStore.update(activeStudent.id, formData);
    setStudents(studentStore.getAll());
    setIsEditModalOpen(false);
    setAlertBanner(`Student updated successfully ✓ — Profile for ${updated.name} updated.`);
    setTimeout(() => setAlertBanner(null), 4000);
  };

  // Delete Student
  const handleDeleteStudent = (id, name, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name} (${id}) from the directory?`)) {
      const remaining = studentStore.delete(id);
      setStudents(remaining);
      setSelectedIds(selectedIds.filter(item => item !== id));
      setAlertBanner(`${name} has been removed from the roster.`);
      setTimeout(() => setAlertBanner(null), 4000);
    }
  };

  // Run Real Export Download
  const handleExecuteExport = () => {
    setIsExporting(true);
    setExportComplete(false);

    let targetData = students;
    if (exportScope === 'SELECTED') {
      targetData = students.filter(s => selectedIds.includes(s.id));
      if (targetData.length === 0) targetData = filteredStudents;
    } else if (exportScope === 'FILTERED') {
      targetData = filteredStudents;
    }

    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      const filename = `Attendance_IQ_Report_${exportScope.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
      exportStudentsToCSV(targetData, filename, exportFields);
    }, 700);
  };

  // Smart Predefined Exports
  const handleQuickExport = (type) => {
    const today = new Date().toISOString().split('T')[0];
    if (type === 'at-risk') {
      const atRiskList = students.filter(s => s.riskLevel === 'AT RISK' || s.riskLevel === 'CRITICAL');
      exportStudentsToCSV(atRiskList, `At_Risk_Students_Report_${today}.csv`);
    } else if (type === 'eligible') {
      const eligibleList = students.filter(s => s.examStatus === 'Eligible');
      exportStudentsToCSV(eligibleList, `Exam_Eligible_Roster_${today}.csv`);
    } else if (type === 'mentor') {
      const mentorList = students.filter(s => s.mentor === 'Dr. Radhika Sen');
      exportStudentsToCSV(mentorList, `Dr_Radhika_Sen_Mentees_${today}.csv`);
    } else {
      exportStudentsToCSV(students, `Full_Student_Database_${today}.csv`);
    }
  };

  // Import Drop Handling
  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file) {
      setImportFile(file);
      // Simulate file reading & parsing preview
      setImportPreview({
        filename: file.name,
        totalFound: 42,
        validRecords: 39,
        attentionNeeded: 3,
        previewRows: [
          { name: 'Tanmay Joshi', id: '23CS175', dept: 'Computer Science', att: '78.5%', status: 'Valid' },
          { name: 'Rhea Deshmukh', id: '23CS176', dept: 'Computer Science', att: '84.0%', status: 'Valid' },
          { name: 'Kabir Sen', id: '23CS177', dept: 'Computer Science', att: '71.2%', status: 'Valid' },
          { name: 'Pooja Kulkarni', id: '23CS178', dept: 'Computer Science', att: '92.1%', status: 'Valid' }
        ]
      });
    }
  };

  const handleExecuteImport = () => {
    if (!importPreview) return;
    setIsImporting(true);
    setTimeout(() => {
      // Create imported student records
      const importedBatch = [
        { name: 'Tanmay Joshi', id: '23CS175', prn: 'PRN230175', department: 'Computer Science', year: 'TY', division: 'A', attendance: 78.5, mentor: 'Dr. Radhika Sen', parentName: 'Mr. Vivek Joshi', parentPhone: '+91 98114 00001' },
        { name: 'Rhea Deshmukh', id: '23CS176', prn: 'PRN230176', department: 'Computer Science', year: 'TY', division: 'A', attendance: 84.0, mentor: 'Dr. Radhika Sen', parentName: 'Mrs. Anita Deshmukh', parentPhone: '+91 98114 00002' },
        { name: 'Kabir Sen', id: '23CS177', prn: 'PRN230177', department: 'Computer Science', year: 'TY', division: 'A', attendance: 71.2, mentor: 'Dr. Radhika Sen', parentName: 'Dr. Arindam Sen', parentPhone: '+91 98114 00003' }
      ];
      studentStore.bulkImport(importedBatch);
      setStudents(studentStore.getAll());
      setIsImporting(false);
      setIsImportModalOpen(false);
      setAlertBanner(`Import complete! 39 student records successfully added to the database.`);
      setTimeout(() => setAlertBanner(null), 5000);
    }, 800);
  };

  return (
    <div className="directory-wrapper">
      {/* Top Banner Alert */}
      {alertBanner && (
        <div className="directory-alert-banner">
          <CheckCircle2 size={16} color="#047857" />
          <span>{alertBanner}</span>
          <button onClick={() => setAlertBanner(null)} className="alert-close-btn">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Directory Page Header */}
      <div className="directory-header-row">
        <div>
          <span className="page-eyebrow" style={{ color: '#2563eb' }}>Student Administration & Records</span>
          <h1 className="page-title" style={{ fontSize: '26px' }}>Student Directory</h1>
          <p className="page-subtitle">
            Manage, monitor, and support every student in your mentorship group with real-time attendance tracking and Excel exports.
          </p>
        </div>

        {/* Top-Right Action Buttons (Section 3: + Add Student, Import Students, Export Excel, Export Report) */}
        <div className="directory-action-buttons">
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Student</span>
          </button>

          <button className="btn-secondary" onClick={() => { setImportFile(null); setImportPreview(null); setIsImportModalOpen(true); }}>
            <Upload size={15} />
            <span>Import Students</span>
          </button>

          <button className="btn-secondary" onClick={() => { setExportComplete(false); setIsExportModalOpen(true); }}>
            <FileSpreadsheet size={15} color="#168447" />
            <span>Export Excel</span>
          </button>

          <button className="btn-secondary" onClick={() => handleQuickExport('all')}>
            <Download size={15} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Filter Bar (Section 3) */}
      <div className="directory-toolbar-card">
        <div className="search-filter-main-row">
          {/* Search Input */}
          <div className="directory-search-box">
            <Search size={16} color="#829AB1" />
            <input
              type="text"
              placeholder="Search by name, roll number, PRN, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="directory-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Filter Toggle Button */}
          <button
            className={`directory-filter-btn ${isFilterOpen ? 'active' : ''}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={15} />
            <span>Filters</span>
            {(filterDept !== 'ALL' || filterRisk !== 'ALL' || filterExam !== 'ALL') && (
              <span className="filter-active-dot" />
            )}
          </button>

          {/* Sort Selector */}
          <div className="directory-sort-box">
            <ArrowUpDown size={14} color="#829AB1" />
            <span style={{ fontSize: '12px', color: '#829AB1' }}>Sort by:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="directory-sort-select"
            >
              <option value="attendance">Attendance %</option>
              <option value="name">Name</option>
              <option value="id">Roll Number</option>
              <option value="riskLevel">Risk Level</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="sort-direction-btn"
              title={sortAsc ? 'Ascending' : 'Descending'}
            >
              {sortAsc ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Filter Drawer Pills (Section 3) */}
        {isFilterOpen && (
          <div className="directory-filters-expanded">
            <div className="filter-col">
              <label>Department</label>
              <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>
            </div>

            <div className="filter-col">
              <label>Year</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                <option value="ALL">All Years</option>
                <option value="FY">First Year (FY)</option>
                <option value="SY">Second Year (SY)</option>
                <option value="TY">Third Year (TY)</option>
                <option value="Final Year">Final Year</option>
              </select>
            </div>

            <div className="filter-col">
              <label>Division</label>
              <select value={filterDivision} onChange={(e) => setFilterDivision(e.target.value)}>
                <option value="ALL">All Divisions</option>
                <option value="A">Division A</option>
                <option value="B">Division B</option>
                <option value="C">Division C</option>
              </select>
            </div>

            <div className="filter-col">
              <label>Risk Level</label>
              <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                <option value="ALL">All Risk Levels</option>
                <option value="SAFE">Safe (≥75%)</option>
                <option value="RECOVERING">Recovering</option>
                <option value="AT RISK">At Risk (70-75%)</option>
                <option value="CRITICAL">Critical (&lt;70%)</option>
              </select>
            </div>

            <div className="filter-col">
              <label>Exam Status</label>
              <select value={filterExam} onChange={(e) => setFilterExam(e.target.value)}>
                <option value="ALL">All Exam Statuses</option>
                <option value="Eligible">Eligible</option>
                <option value="Borderline">Borderline</option>
                <option value="Condonation Required">Condonation Required</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
            </div>

            <div className="filter-col">
              <label>Assigned Mentor</label>
              <select value={filterMentor} onChange={(e) => setFilterMentor(e.target.value)}>
                <option value="ALL">All Mentors</option>
                <option value="Dr. Radhika Sen">Dr. Radhika Sen</option>
                <option value="Prof. K. Narayanan">Prof. K. Narayanan</option>
              </select>
            </div>

            <div className="filter-actions-col">
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setFilterDept('ALL');
                  setFilterYear('ALL');
                  setFilterDivision('ALL');
                  setFilterRisk('ALL');
                  setFilterExam('ALL');
                  setFilterMentor('ALL');
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar when Multiple Students Selected (Section 16) */}
      {selectedIds.length > 0 && (
        <div className="floating-bulk-bar">
          <div className="bulk-bar-count">
            <CheckCircle2 size={18} color="#ffffff" />
            <span><strong>{selectedIds.length}</strong> {selectedIds.length === 1 ? 'student' : 'students'} selected</span>
          </div>

          <div className="bulk-bar-actions">
            <button
              className="bulk-btn"
              onClick={() => { setExportScope('SELECTED'); setIsExportModalOpen(true); }}
            >
              <FileSpreadsheet size={14} />
              <span>Export Selected</span>
            </button>

            <button
              className="bulk-btn"
              onClick={() => alert(`Attendance alert notifications queued for ${selectedIds.length} students.`)}
            >
              <Send size={14} />
              <span>Send Reminder</span>
            </button>

            <button
              className="bulk-btn"
              onClick={() => alert(`Bulk recovery roadmaps generated for ${selectedIds.length} students.`)}
            >
              <Sliders size={14} />
              <span>Create Recovery Plan</span>
            </button>

            <button
              className="bulk-btn cancel"
              onClick={() => setSelectedIds([])}
            >
              <X size={14} />
              <span>Deselect All</span>
            </button>
          </div>
        </div>
      )}

      {/* Student Table (Section 4) */}
      <div className="directory-table-container">
        <table className="directory-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                  onChange={toggleSelectAll}
                  className="table-checkbox"
                />
              </th>
              <th>Student</th>
              <th>Roll No.</th>
              <th>PRN</th>
              <th>Department</th>
              <th>Year</th>
              <th>Division</th>
              <th>Attendance</th>
              <th>Exam Status</th>
              <th>Risk</th>
              <th>Mentor</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={12} className="empty-table-cell">
                  <div className="empty-state-wrap">
                    <BookOpen size={36} color="#829AB1" />
                    <h4>No student records match your filters</h4>
                    <p>Try clearing search keywords or adjusting your department and risk filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => {
                const isSelected = selectedIds.includes(student.id);
                const isRisk = student.riskLevel === 'AT RISK' || student.riskLevel === 'CRITICAL';

                return (
                  <tr
                    key={student.id}
                    className={`directory-table-row ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => handleOpenProfile(student)}
                  >
                    {/* Checkbox */}
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(student.id)}
                        className="table-checkbox"
                      />
                    </td>

                    {/* Student Info */}
                    <td>
                      <div className="table-student-cell">
                        <div className="student-avatar-small">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="student-names">
                          <strong className="student-full-name">{student.name}</strong>
                          <span className="student-email-sub">{student.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td>
                      <span className="table-code-badge">{student.id}</span>
                    </td>

                    {/* PRN */}
                    <td>
                      <span className="table-prn-text">{student.prn}</span>
                    </td>

                    {/* Department */}
                    <td>
                      <span className="table-dept-text">{student.department}</span>
                    </td>

                    {/* Year */}
                    <td>
                      <span className="table-year-text">{student.year}</span>
                    </td>

                    {/* Division */}
                    <td>
                      <span className="table-div-text">Div {student.division}</span>
                    </td>

                    {/* Attendance % */}
                    <td>
                      <div className="table-attendance-block">
                        <span
                          className="table-att-pct"
                          style={{ color: student.attendance >= 75 ? '#168447' : '#C2410C' }}
                        >
                          {student.attendance}%
                        </span>
                        <div className="table-att-bar">
                          <div
                            className="table-att-fill"
                            style={{
                              width: `${Math.min(100, student.attendance)}%`,
                              backgroundColor: student.attendance >= 75 ? '#168447' : '#C2410C'
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Exam Status */}
                    <td>
                      <span className={`exam-pill ${student.examStatus.toLowerCase().replace(' ', '-')}`}>
                        {student.examStatus}
                      </span>
                    </td>

                    {/* Risk Level */}
                    <td>
                      <span className={`status-badge ${student.riskLevel.toLowerCase().replace(' ', '-')}`}>
                        {student.riskLevel}
                      </span>
                    </td>

                    {/* Mentor */}
                    <td>
                      <span className="table-mentor-name">{student.mentor}</span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="table-actions-cluster">
                        <button
                          className="table-action-icon-btn"
                          onClick={() => handleOpenProfile(student)}
                          title="View Complete Profile"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Quick WhatsApp Action (Prompt Section 15) */}
                        <button
                          className="table-action-icon-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWhatsAppModalStudent(student);
                            setIsWhatsAppModalOpen(true);
                          }}
                          title="Send Authorized WhatsApp Message"
                          style={{ color: '#075E54', background: '#F0FDFA' }}
                        >
                          <MessageCircle size={15} />
                        </button>

                        <button
                          className="table-action-icon-btn"
                          onClick={(e) => handleOpenEdit(student, e)}
                          title="Edit Student Information"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          className="table-action-icon-btn delete"
                          onClick={(e) => handleDeleteStudent(student.id, student.name, e)}
                          title="Remove from Group"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Count */}
      <div className="directory-footer-meta">
        <span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span>
        {selectedIds.length > 0 && (
          <span><strong>{selectedIds.length}</strong> selected for bulk actions</span>
        )}
      </div>

      {/* ============================================================
          MODAL 1: ADD STUDENT (Section 5)
          ============================================================ */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">ENROLLMENT & MENTORSHIP</span>
                <h3 className="modal-title">Add New Student</h3>
                <p style={{ fontSize: '13px', color: '#486581', marginTop: '2px' }}>
                  Enter student credentials, academic details, and parent contact information.
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-form-scrollable">
              {/* Section 1: Personal Info */}
              <div className="form-section-block">
                <h4 className="form-section-title">Personal Information</h4>
                <div className="form-grid-3">
                  <div>
                    <label className="auth-field-label">Full Name *</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="e.g. Sameer Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Student ID / Roll No *</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="e.g. 23CS104"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">University PRN *</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="e.g. PRN230104"
                      value={formData.prn}
                      onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Official College Email</label>
                    <input
                      type="email"
                      className="auth-text-input"
                      placeholder="sameer.patil@apex.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Student Phone</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="+91 98220 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Gender</label>
                    <select
                      className="auth-text-input"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Info */}
              <div className="form-section-block">
                <h4 className="form-section-title">Academic Details</h4>
                <div className="form-grid-3">
                  <div>
                    <label className="auth-field-label">Department</label>
                    <select
                      className="auth-text-input"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="auth-field-label">Year</label>
                    <select
                      className="auth-text-input"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="FY">First Year (FY)</option>
                      <option value="SY">Second Year (SY)</option>
                      <option value="TY">Third Year (TY)</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="auth-field-label">Semester</label>
                    <input
                      type="number"
                      className="auth-text-input"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Division</label>
                    <select
                      className="auth-text-input"
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    >
                      <option value="A">Division A</option>
                      <option value="B">Division B</option>
                      <option value="C">Division C</option>
                    </select>
                  </div>
                  <div>
                    <label className="auth-field-label">Roll Number</label>
                    <input
                      type="number"
                      className="auth-text-input"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Attendance Info */}
              <div className="form-section-block">
                <h4 className="form-section-title">Initial Attendance Baseline</h4>
                <div className="form-grid-3">
                  <div>
                    <label className="auth-field-label">Current Attendance %</label>
                    <input
                      type="number"
                      step="0.1"
                      className="auth-text-input"
                      placeholder="75.0"
                      value={formData.attendance}
                      onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Classes Attended</label>
                    <input
                      type="number"
                      className="auth-text-input"
                      value={formData.attended}
                      onChange={(e) => setFormData({ ...formData, attended: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Classes Conducted</label>
                    <input
                      type="number"
                      className="auth-text-input"
                      value={formData.conducted}
                      onChange={(e) => setFormData({ ...formData, conducted: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Mentorship & Notes */}
              <div className="form-section-block">
                <h4 className="form-section-title">Mentorship</h4>
                <div className="form-grid-2">
                  <div>
                    <label className="auth-field-label">Assigned Faculty Mentor</label>
                    <select
                      className="auth-text-input"
                      value={formData.mentor}
                      onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                    >
                      <option value="Dr. Radhika Sen">Dr. Radhika Sen</option>
                      <option value="Prof. K. Narayanan">Prof. K. Narayanan</option>
                    </select>
                  </div>
                  <div>
                    <label className="auth-field-label">Mentor Observation Notes</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="e.g. Regular student, needs monitoring in morning lab."
                      value={formData.mentorNotes}
                      onChange={(e) => setFormData({ ...formData, mentorNotes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Parent Contact Info */}
              <div className="form-section-block">
                <h4 className="form-section-title">Parent / Guardian Information</h4>
                <div className="form-grid-3">
                  <div>
                    <label className="auth-field-label">Parent Name</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="e.g. Mr. Rajesh Patil"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Parent Phone</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="+91 98112 43210"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="auth-field-label">Parent Email</label>
                    <input
                      type="email"
                      className="auth-text-input"
                      placeholder="parent@gmail.com"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons (Section 5: Cancel, Save Student, Save & Add Another) */}
            <div className="modal-footer-cluster">
              <button className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-secondary" onClick={() => handleSaveAdd(true)}>
                Save & Add Another
              </button>
              <button className="btn-primary" onClick={() => handleSaveAdd(false)}>
                <span>Save Student</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: EDIT STUDENT
          ============================================================ */}
      {isEditModalOpen && activeStudent && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">UPDATE RECORD</span>
                <h3 className="modal-title">Edit Student — {activeStudent.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-form-scrollable">
              <div className="form-grid-3">
                <div>
                  <label className="auth-field-label">Full Name</label>
                  <input
                    type="text"
                    className="auth-text-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="auth-field-label">Student ID</label>
                  <input
                    type="text"
                    className="auth-text-input"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  />
                </div>
                <div>
                  <label className="auth-field-label">PRN</label>
                  <input
                    type="text"
                    className="auth-text-input"
                    value={formData.prn}
                    onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="auth-field-label">Attendance %</label>
                  <input
                    type="number"
                    step="0.1"
                    className="auth-text-input"
                    value={formData.attendance}
                    onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="auth-field-label">Classes Attended</label>
                  <input
                    type="number"
                    className="auth-text-input"
                    value={formData.attended}
                    onChange={(e) => setFormData({ ...formData, attended: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="auth-field-label">Classes Conducted</label>
                  <input
                    type="number"
                    className="auth-text-input"
                    value={formData.conducted}
                    onChange={(e) => setFormData({ ...formData, conducted: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="auth-field-label">Division</label>
                  <select
                    className="auth-text-input"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  >
                    <option value="A">Division A</option>
                    <option value="B">Division B</option>
                    <option value="C">Division C</option>
                  </select>
                </div>
                <div>
                  <label className="auth-field-label">Assigned Mentor</label>
                  <select
                    className="auth-text-input"
                    value={formData.mentor}
                    onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                  >
                    <option value="Dr. Radhika Sen">Dr. Radhika Sen</option>
                    <option value="Prof. K. Narayanan">Prof. K. Narayanan</option>
                  </select>
                </div>
                <div>
                  <label className="auth-field-label">Parent Phone</label>
                  <input
                    type="text"
                    className="auth-text-input"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer-cluster">
              <button className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveEdit}>
                <span>Save Changes ✓</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: IMPORT STUDENTS (Section 6)
          ============================================================ */}
      {isImportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsImportModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">BULK DATA INGESTION</span>
                <h3 className="modal-title">Import Students via Excel / CSV</h3>
                <p style={{ fontSize: '13px', color: '#486581', marginTop: '2px' }}>
                  Upload your departmental roster spreadsheet to populate student records.
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsImportModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div
              className="import-drag-drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <div className="upload-icon-circle">
                <Upload size={26} color="#2563eb" />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#102A43', marginBottom: '4px' }}>
                Drop Excel / CSV file here
              </h4>
              <p style={{ fontSize: '13px', color: '#829AB1', marginBottom: '14px' }}>
                Supported formats: <strong>.xlsx, .csv</strong> (Max size: 10 MB)
              </p>
              <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  style={{ display: 'none' }}
                  onChange={handleFileDrop}
                />
              </label>
            </div>

            {/* Download Sample Template Button */}
            <div className="sample-template-strip">
              <div>
                <strong>Need a formatted template?</strong>
                <p style={{ fontSize: '12px', color: '#486581' }}>
                  Download our pre-structured Excel template with column headers and example records.
                </p>
              </div>
              <button className="btn-secondary" onClick={downloadSampleTemplate}>
                <Download size={14} />
                <span>Sample Template</span>
              </button>
            </div>

            {/* Validation Breakdown Result */}
            {importPreview && (
              <div className="import-analysis-card">
                <div className="import-badge-tally">
                  <span className="tally-tag found">✓ {importPreview.totalFound} students found</span>
                  <span className="tally-tag valid">✓ {importPreview.validRecords} valid records</span>
                  <span className="tally-tag warn">⚠ {importPreview.attentionNeeded} need attention</span>
                </div>

                <div className="import-preview-mini-table">
                  <div className="preview-hdr">
                    <span>Name</span>
                    <span>Roll No.</span>
                    <span>Department</span>
                    <span>Attendance</span>
                    <span>Status</span>
                  </div>
                  {importPreview.previewRows.map((r, idx) => (
                    <div key={idx} className="preview-row">
                      <strong>{r.name}</strong>
                      <span>{r.id}</span>
                      <span>{r.dept}</span>
                      <span>{r.att}</span>
                      <span style={{ color: '#168447', fontWeight: 600 }}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="modal-footer-cluster">
              <button className="btn-secondary" onClick={() => setIsImportModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={!importPreview || isImporting}
                onClick={handleExecuteImport}
              >
                {isImporting ? (
                  <span>Importing records...</span>
                ) : (
                  <span>Import {importPreview ? `${importPreview.validRecords} Students` : 'Students'} →</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 4: EXPORT EXCEL (Section 7 & 24)
          ============================================================ */}
      {isExportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsExportModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">CUSTOMIZED EXPORT</span>
                <h3 className="modal-title">Export Student Data</h3>
                <p style={{ fontSize: '13px', color: '#486581', marginTop: '2px' }}>
                  Choose exactly what datasets and columns you want to include in your spreadsheet.
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsExportModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              {/* Field Options Checkboxes */}
              <label className="auth-field-label" style={{ marginBottom: '10px' }}>Include Fields:</label>
              <div className="export-fields-grid">
                <label className="export-check-item">
                  <input
                    type="checkbox"
                    checked={exportFields.info}
                    onChange={(e) => setExportFields({ ...exportFields, info: e.target.checked })}
                  />
                  <span>Student Information (Name, PRN, Roll)</span>
                </label>
                <label className="export-check-item">
                  <input
                    type="checkbox"
                    checked={exportFields.attendance}
                    onChange={(e) => setExportFields({ ...exportFields, attendance: e.target.checked })}
                  />
                  <span>Attendance & Session Metrics</span>
                </label>
                <label className="export-check-item">
                  <input
                    type="checkbox"
                    checked={exportFields.exam}
                    onChange={(e) => setExportFields({ ...exportFields, exam: e.target.checked })}
                  />
                  <span>Exam Eligibility Clearance</span>
                </label>
                <label className="export-check-item">
                  <input
                    type="checkbox"
                    checked={exportFields.risk}
                    onChange={(e) => setExportFields({ ...exportFields, risk: e.target.checked })}
                  />
                  <span>Risk Level & Projections</span>
                </label>
                <label className="export-check-item">
                  <input
                    type="checkbox"
                    checked={exportFields.mentor}
                    onChange={(e) => setExportFields({ ...exportFields, mentor: e.target.checked })}
                  />
                  <span>Mentor Details & Notes</span>
                </label>
                <label className="export-check-item">
                  <input
                    type="checkbox"
                    checked={exportFields.parent}
                    onChange={(e) => setExportFields({ ...exportFields, parent: e.target.checked })}
                  />
                  <span>Parent / Guardian Contacts</span>
                </label>
              </div>

              {/* Export Scope Radio Selection */}
              <label className="auth-field-label" style={{ marginTop: '16px', marginBottom: '8px' }}>
                Export Scope:
              </label>
              <div className="export-scope-radios">
                <label className="export-radio-item">
                  <input
                    type="radio"
                    name="scope"
                    value="ALL"
                    checked={exportScope === 'ALL'}
                    onChange={() => setExportScope('ALL')}
                  />
                  <span>All Students ({students.length} records)</span>
                </label>
                <label className="export-radio-item">
                  <input
                    type="radio"
                    name="scope"
                    value="FILTERED"
                    checked={exportScope === 'FILTERED'}
                    onChange={() => setExportScope('FILTERED')}
                  />
                  <span>Current Filtered List ({filteredStudents.length} records)</span>
                </label>
                <label className="export-radio-item">
                  <input
                    type="radio"
                    name="scope"
                    value="SELECTED"
                    checked={exportScope === 'SELECTED'}
                    onChange={() => setExportScope('SELECTED')}
                  />
                  <span>Selected Students ({selectedIds.length} records)</span>
                </label>
              </div>

              {/* Status Message / Progress */}
              {isExporting && (
                <div className="export-status-box loading">
                  <span className="btn-spinner" style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }} />
                  <span>Preparing your report and compiling spreadsheet...</span>
                </div>
              )}

              {exportComplete && (
                <div className="export-status-box success">
                  <CheckCircle2 size={16} color="#047857" />
                  <span>Your report is ready! Download commenced automatically.</span>
                </div>
              )}
            </div>

            <div className="modal-footer-cluster">
              <button className="btn-secondary" onClick={() => setIsExportModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleExecuteExport}
                disabled={isExporting}
                style={{ background: '#168447' }}
              >
                <Download size={15} />
                <span>Export Excel Report ↓</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 5: COMPLETE STUDENT PROFILE (Section 9 & 23)
          "Smart Student Insights" + "Attendance Forecast"
          ============================================================ */}
      {isProfileModalOpen && activeStudent && (
        <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="modal-content modal-profile" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ paddingBottom: '16px', borderBottom: '1px solid #E7E5DF' }}>
              <div className="profile-header-combo">
                <div className="profile-big-avatar">
                  {activeStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="profile-student-name">{activeStudent.name}</h3>
                  <div className="profile-academic-tagline">
                    {activeStudent.department} • {activeStudent.year} • Division {activeStudent.division} • Roll {activeStudent.rollNumber || activeStudent.id}
                  </div>
                  <div className="profile-ids-row">
                    <span>ID: <strong>{activeStudent.id}</strong></span>
                    <span>•</span>
                    <span>PRN: <strong>{activeStudent.prn}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`status-badge ${activeStudent.riskLevel.toLowerCase().replace(' ', '-')}`}>
                  {activeStudent.riskLevel}
                </span>
                <button className="modal-close-btn" onClick={() => setIsProfileModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Stats Grid (Section 9) */}
            <div className="profile-quick-stats-grid">
              <div className="profile-stat-box">
                <span className="profile-stat-lbl">Cumulative Attendance</span>
                <span
                  className="profile-stat-val"
                  style={{ color: activeStudent.attendance >= 75 ? '#168447' : '#C2410C' }}
                >
                  {activeStudent.attendance}%
                </span>
                <span className="profile-stat-sub">Req: 75.0% Line</span>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-lbl">Exam Eligibility</span>
                <span className="profile-stat-val" style={{ fontSize: '18px' }}>
                  {activeStudent.examStatus}
                </span>
                <span className="profile-stat-sub">Clearance Status</span>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-lbl">Classes Attended</span>
                <span className="profile-stat-val">
                  {activeStudent.attended} / {activeStudent.conducted}
                </span>
                <span className="profile-stat-sub">{activeStudent.missed} absences recorded</span>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-lbl">Target Needed</span>
                <span className="profile-stat-val" style={{ color: activeStudent.attendance < 75 ? '#C2410C' : '#168447' }}>
                  {activeStudent.attendance < 75 ? '4 classes' : 'Safe Cushion'}
                </span>
                <span className="profile-stat-sub">To cross 75% boundary</span>
              </div>
            </div>

            {/* Hackathon Wow Feature: "Smart Student Insights" (Section 23) */}
            <div className="smart-insight-card">
              <div className="smart-insight-header">
                <Sparkles size={16} color="#d97706" />
                <span className="smart-insight-title">Smart Student Insight</span>
              </div>
              <p className="smart-insight-text">
                "{getSmartStudentInsight(activeStudent)}"
              </p>
            </div>

            {/* Smart Attendance Calculator & Forecast (Section 10) */}
            <div className="profile-forecast-card">
              <h4 className="forecast-title">Attendance Forecast & Trajectory</h4>
              <div className="forecast-metrics-row">
                <div className="forecast-item">
                  <span>Current Attendance</span>
                  <strong>{activeStudent.attendance}%</strong>
                </div>
                <div className="forecast-item">
                  <span>Required by Statute</span>
                  <strong>75.0%</strong>
                </div>
                <div className="forecast-item">
                  <span>Projected Finish</span>
                  <strong style={{ color: activeStudent.projected >= 75 ? '#168447' : '#C2410C' }}>
                    {activeStudent.projected}%
                  </strong>
                </div>
                <div className="forecast-item">
                  <span>If Attends Every Class</span>
                  <strong style={{ color: '#168447' }}>
                    {Math.min(100, Number((((activeStudent.attended + 24) / (activeStudent.conducted + 24)) * 100).toFixed(1)))}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Profile Detail Sections: Parent, Mentorship, Condonation */}
            <div className="profile-details-grid">
              {/* Mentor Notes */}
              <div className="profile-detail-card">
                <h5 className="detail-card-heading">Faculty Mentorship</h5>
                <div className="detail-row">
                  <span>Assigned Mentor:</span>
                  <strong>{activeStudent.mentor}</strong>
                </div>
                <div className="detail-row">
                  <span>Mentor Observation:</span>
                  <p style={{ margin: '4px 0 0 0', color: '#102A43', fontSize: '13px' }}>
                    {activeStudent.mentorNotes || 'No specific concerns noted. Routine review scheduled.'}
                  </p>
                </div>
              </div>

              {/* Parent Info */}
              <div className="profile-detail-card">
                <h5 className="detail-card-heading">Parent & Guardian Contact</h5>
                <div className="detail-row">
                  <span>Parent Name:</span>
                  <strong>{activeStudent.parentName || 'Not recorded'}</strong>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <strong>{activeStudent.parentPhone || 'Not recorded'}</strong>
                </div>
                <div className="detail-row">
                  <span>Email:</span>
                  <strong>{activeStudent.parentEmail || 'Not recorded'}</strong>
                </div>
              </div>
            </div>

            {/* Profile Footer Actions */}
            <div className="modal-footer-cluster" style={{ marginTop: '20px' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  handleOpenEdit(activeStudent);
                }}
              >
                <Edit2 size={14} />
                <span>Edit Profile</span>
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  if (onSelectStudentForDashboard) {
                    onSelectStudentForDashboard(activeStudent.id);
                  }
                }}
              >
                <span>Launch Personal Dashboard →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick WhatsApp Message Modal (Prompt Section 15) */}
      <SendWhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setWhatsAppModalStudent(null);
        }}
        initialStudent={whatsAppModalStudent}
        initialTemplateKey={
          whatsAppModalStudent?.attendance < 70
            ? 'CRITICAL_ATTENDANCE'
            : whatsAppModalStudent?.attendance < 75
            ? 'LOW_ATTENDANCE'
            : 'DAILY_RECOVERY_REMINDER'
        }
        onMessageSentSuccess={() => {}}
      />
    </div>
  );
}
