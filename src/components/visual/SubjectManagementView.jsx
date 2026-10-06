import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import collegeDataStore from '../../services/collegeDataStore';

export default function SubjectManagementView({ onSelectSubjectDetail }) {
  const [subjects, setSubjects] = useState(() => collegeDataStore.getAllSubjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding subject
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    faculty: '',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 4,
    room: 'Hall 204',
    schedule: 'Mon, Wed 10:00 AM',
    requiredAttendance: 75.0,
    totalPlanned: 40
  });

  const filteredSubjects = subjects.filter(sub => {
    if (selectedDept !== 'ALL' && sub.department !== selectedDept) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      sub.name.toLowerCase().includes(q) ||
      sub.code.toLowerCase().includes(q) ||
      sub.faculty.toLowerCase().includes(q)
    );
  });

  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;

    const updated = collegeDataStore.addSubject(formData);
    setSubjects(updated);
    setIsAddModalOpen(false);
    setFormData({
      code: '',
      name: '',
      faculty: '',
      department: 'Computer Science & Engineering',
      semester: 5,
      credits: 4,
      room: 'Hall 204',
      schedule: 'Mon, Wed 10:00 AM',
      requiredAttendance: 75.0,
      totalPlanned: 40
    });
  };

  return (
    <div style={{ padding: '4px 0 32px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF8F3 0%, #F5F1E8 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
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
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
              Academic Curriculum Administration
            </span>
            <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
              {subjects.length} Courses Active
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#102A43', margin: 0 }}>
            Subject & Curriculum Management
          </h2>
          <p style={{ fontSize: '13px', color: '#627D98', margin: '4px 0 0' }}>
            Create and maintain academic courses, faculty allocations, classroom venues, and attendance criteria.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{
            background: '#0D9488',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
          }}
        >
          <Plus size={16} />
          <span>+ Add New Subject</span>
        </button>
      </div>

      {/* Search & Department Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search by course name, code, or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '13px'
            }}
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={{
            padding: '9px 14px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            fontSize: '13px',
            background: '#FFFFFF',
            color: '#102A43',
            fontWeight: 600
          }}
        >
          <option value="ALL">All Departments</option>
          <option value="Computer Science & Engineering">CSE</option>
          <option value="Information Technology">IT</option>
          <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
          <option value="Electronics & Telecommunication">ENTC</option>
        </select>
      </div>

      {/* Subject Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredSubjects.map(sub => (
          <div
            key={sub.code}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 4px 14px rgba(16, 42, 67, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ background: '#F1F5F9', color: '#1E3A5F', fontSize: '11.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                  {sub.code}
                </span>
                <span style={{ fontSize: '11.5px', background: '#ECFDF5', color: '#047857', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                  Req: {sub.requiredAttendance}%
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#102A43', margin: '0 0 6px 0' }}>
                {sub.name}
              </h3>
              <div style={{ fontSize: '12.5px', color: '#627D98', marginBottom: '14px' }}>
                Faculty: <strong style={{ color: '#334E68' }}>{sub.faculty}</strong>
              </div>

              <div style={{ background: '#FAF8F3', borderRadius: '10px', padding: '10px 12px', border: '1px solid #E5E7EB', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px', marginBottom: '16px' }}>
                <div>
                  <span style={{ color: '#829AB1', display: 'block' }}>ROOM / VENUE</span>
                  <strong style={{ color: '#102A43' }}>{sub.room}</strong>
                </div>
                <div>
                  <span style={{ color: '#829AB1', display: 'block' }}>SCHEDULE</span>
                  <strong style={{ color: '#102A43' }}>{sub.schedule}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', color: '#627D98' }}>
                Semester {sub.semester} • {sub.credits} Credits
              </span>
              <button
                type="button"
                onClick={() => onSelectSubjectDetail && onSelectSubjectDetail(sub)}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '5px 12px' }}
              >
                <span>View Details →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {isAddModalOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 2200 }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="modal-container"
            style={{
              maxWidth: '540px',
              width: '92%',
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(16, 42, 67, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102A43', margin: 0 }}>
                Add New Academic Subject
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="icon-action-btn">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubjectSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '4px' }}>
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS308"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '4px' }}>
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Computing"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '4px' }}>
                    Faculty Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. S. Joshi"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '4px' }}>
                    Classroom / Room
                  </label>
                  <input
                    type="text"
                    placeholder="Hall 204"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#102A43', marginBottom: '4px' }}>
                  Weekly Schedule
                </label>
                <input
                  type="text"
                  placeholder="Mon, Thu 10:00 AM"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#627D98', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: '#0D9488', padding: '9px 20px', borderRadius: '10px' }}
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
