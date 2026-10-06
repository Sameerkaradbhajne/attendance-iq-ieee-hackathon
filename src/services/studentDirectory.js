// Student Directory & Data Management Service for Attendance IQ
// Real in-memory & localStorage store with real Excel/CSV Export and Import Engine

const STORAGE_KEY = 'attendance_iq_students_v1';

export const INITIAL_STUDENTS = [
  {
    id: '23CS104',
    prn: 'PRN230104',
    name: 'Sameer Patil',
    email: 'sameer.patil@apex.edu',
    phone: '+91 98220 12345',
    dob: '2004-08-14',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 104,
    gender: 'Male',
    attendance: 74.2,
    conducted: 120,
    attended: 89,
    missed: 31,
    projected: 72.8,
    riskLevel: 'AT RISK',
    examStatus: 'Borderline',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Struggling with early morning lab attendance. Recommended 4 consecutive sessions recovery.',
    parentName: 'Mr. Rajesh Patil',
    parentPhone: '+91 98112 43210',
    parentEmail: 'rajesh.patil@gmail.com',
    condonationStatus: 'Under Review',
    condonationReason: 'Viral fever hospitalization (3 days)',
    lastUpdated: '2026-10-05'
  },
  {
    id: '23CS118',
    prn: 'PRN230118',
    name: 'Ananya Joshi',
    email: 'ananya.joshi@apex.edu',
    phone: '+91 98221 23456',
    dob: '2004-05-22',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 118,
    gender: 'Female',
    attendance: 86.4,
    conducted: 120,
    attended: 104,
    missed: 16,
    projected: 85.0,
    riskLevel: 'SAFE',
    examStatus: 'Eligible',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Consistent academic performance. Has 4 classes of freedom cushion.',
    parentName: 'Mrs. Sunita Joshi',
    parentPhone: '+91 98112 54321',
    parentEmail: 'sunita.joshi@gmail.com',
    condonationStatus: 'None',
    condonationReason: '',
    lastUpdated: '2026-10-06'
  },
  {
    id: '23CS109',
    prn: 'PRN230109',
    name: 'Rahul Deshmukh',
    email: 'rahul.deshmukh@apex.edu',
    phone: '+91 98222 34567',
    dob: '2004-11-03',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 109,
    gender: 'Male',
    attendance: 68.4,
    conducted: 120,
    attended: 82,
    missed: 38,
    projected: 66.0,
    riskLevel: 'CRITICAL',
    examStatus: 'Not Eligible',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Severe deficit in Operating Systems. Urgent parent meeting scheduled.',
    parentName: 'Mr. Arvind Deshmukh',
    parentPhone: '+91 98112 65432',
    parentEmail: 'arvind.deshmukh@gmail.com',
    condonationStatus: 'Pending',
    condonationReason: 'Represented college at State Volleyball tournament',
    lastUpdated: '2026-10-04'
  },
  {
    id: '23CS122',
    prn: 'PRN230122',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@apex.edu',
    phone: '+91 98223 45678',
    dob: '2004-03-19',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 122,
    gender: 'Female',
    attendance: 91.2,
    conducted: 120,
    attended: 109,
    missed: 11,
    projected: 90.5,
    riskLevel: 'SAFE',
    examStatus: 'Eligible',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Class representative nominee. Exemplary attendance throughout.',
    parentName: 'Dr. Mahesh Kulkarni',
    parentPhone: '+91 98112 76543',
    parentEmail: 'mahesh.kulkarni@gmail.com',
    condonationStatus: 'None',
    condonationReason: '',
    lastUpdated: '2026-10-06'
  },
  {
    id: '23CS135',
    prn: 'PRN230135',
    name: 'Aditya More',
    email: 'aditya.more@apex.edu',
    phone: '+91 98224 56789',
    dob: '2004-09-28',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 135,
    gender: 'Male',
    attendance: 76.1,
    conducted: 120,
    attended: 91,
    missed: 29,
    projected: 76.8,
    riskLevel: 'RECOVERING',
    examStatus: 'Borderline',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Improved by 3.2% in the last fortnight. Currently above the 75% line.',
    parentName: 'Mr. Sanjay More',
    parentPhone: '+91 98112 87654',
    parentEmail: 'sanjay.more@gmail.com',
    condonationStatus: 'None',
    condonationReason: '',
    lastUpdated: '2026-10-05'
  },
  {
    id: '23CS140',
    prn: 'PRN230140',
    name: 'Priya Shah',
    email: 'priya.shah@apex.edu',
    phone: '+91 98225 67890',
    dob: '2004-01-11',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 140,
    gender: 'Female',
    attendance: 71.8,
    conducted: 120,
    attended: 86,
    missed: 34,
    projected: 73.5,
    riskLevel: 'AT RISK',
    examStatus: 'Condonation Required',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Needs 5 classes to reach 75%. Medical documents under verification.',
    parentName: 'Mrs. Rekha Shah',
    parentPhone: '+91 98112 98765',
    parentEmail: 'rekha.shah@gmail.com',
    condonationStatus: 'Pending',
    condonationReason: 'Severe dental surgery requiring rest',
    lastUpdated: '2026-10-03'
  },
  {
    id: '23CS112',
    prn: 'PRN230112',
    name: 'Rohan Shinde',
    email: 'rohan.shinde@apex.edu',
    phone: '+91 98226 78901',
    dob: '2004-07-04',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 112,
    gender: 'Male',
    attendance: 83.3,
    conducted: 120,
    attended: 100,
    missed: 20,
    projected: 82.5,
    riskLevel: 'SAFE',
    examStatus: 'Eligible',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Good participation in technical clubs.',
    parentName: 'Mr. Prakash Shinde',
    parentPhone: '+91 98113 09876',
    parentEmail: 'prakash.shinde@gmail.com',
    condonationStatus: 'None',
    condonationReason: '',
    lastUpdated: '2026-10-06'
  },
  {
    id: '23CS129',
    prn: 'PRN230129',
    name: 'Tanvi Kadam',
    email: 'tanvi.kadam@apex.edu',
    phone: '+91 98227 89012',
    dob: '2004-12-15',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 129,
    gender: 'Female',
    attendance: 64.2,
    conducted: 120,
    attended: 77,
    missed: 43,
    projected: 62.0,
    riskLevel: 'CRITICAL',
    examStatus: 'Not Eligible',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Extended medical absence. Formal medical condonation must be submitted.',
    parentName: 'Mr. Hemant Kadam',
    parentPhone: '+91 98113 10987',
    parentEmail: 'hemant.kadam@gmail.com',
    condonationStatus: 'Under Review',
    condonationReason: 'Dengue recovery certificate attached',
    lastUpdated: '2026-10-02'
  },
  {
    id: '23CS147',
    prn: 'PRN230147',
    name: 'Yash Chopra',
    email: 'yash.chopra@apex.edu',
    phone: '+91 98228 90123',
    dob: '2004-04-09',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 147,
    gender: 'Male',
    attendance: 73.5,
    conducted: 120,
    attended: 88,
    missed: 32,
    projected: 74.5,
    riskLevel: 'AT RISK',
    examStatus: 'Borderline',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Close to safety line. Needs 2 classes to clear threshold.',
    parentName: 'Mr. Ashok Chopra',
    parentPhone: '+91 98113 21098',
    parentEmail: 'ashok.chopra@gmail.com',
    condonationStatus: 'None',
    condonationReason: '',
    lastUpdated: '2026-10-04'
  },
  {
    id: '23CS152',
    prn: 'PRN230152',
    name: 'Meera Nair',
    email: 'meera.nair@apex.edu',
    phone: '+91 98229 01234',
    dob: '2004-10-20',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'A',
    rollNumber: 152,
    gender: 'Female',
    attendance: 88.5,
    conducted: 120,
    attended: 106,
    missed: 14,
    projected: 87.0,
    riskLevel: 'SAFE',
    examStatus: 'Eligible',
    mentor: 'Dr. Radhika Sen',
    mentorNotes: 'Top 5 in division attendance.',
    parentName: 'Mrs. Geeta Nair',
    parentPhone: '+91 98113 32109',
    parentEmail: 'geeta.nair@gmail.com',
    condonationStatus: 'None',
    condonationReason: '',
    lastUpdated: '2026-10-06'
  },
  {
    id: '23CS161',
    prn: 'PRN230161',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@apex.edu',
    phone: '+91 98230 12345',
    dob: '2004-06-18',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'B',
    rollNumber: 161,
    gender: 'Male',
    attendance: 79.5,
    conducted: 120,
    attended: 95,
    missed: 25,
    projected: 80.0,
    riskLevel: 'SAFE',
    examStatus: 'Eligible',
    mentor: 'Prof. K. Narayanan',
    mentorNotes: 'Comfortable margin above 75%.',
    parentName: 'Mr. Sunil Malhotra',
    parentPhone: '+91 98113 43210',
    parentEmail: 'sunil.malhotra@gmail.com',
    condonationStatus: 'None',
    condonationReason: '',
    lastUpdated: '2026-10-05'
  },
  {
    id: '23CS168',
    prn: 'PRN230168',
    name: 'Kavita Rathore',
    email: 'kavita.rathore@apex.edu',
    phone: '+91 98231 23456',
    dob: '2004-02-27',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 'TY',
    semester: 5,
    division: 'B',
    rollNumber: 168,
    gender: 'Female',
    attendance: 72.5,
    conducted: 120,
    attended: 87,
    missed: 33,
    projected: 73.0,
    riskLevel: 'AT RISK',
    examStatus: 'Condonation Required',
    mentor: 'Prof. K. Narayanan',
    mentorNotes: 'Needs 3 classes. Parent informed via SMS.',
    parentName: 'Mr. Digvijay Rathore',
    parentPhone: '+91 98113 54321',
    parentEmail: 'digvijay.rathore@gmail.com',
    condonationStatus: 'Approved',
    condonationReason: 'University Youth Festival Delegate',
    lastUpdated: '2026-10-04'
  }
];

import collegeDataStore from './collegeDataStore';

export const studentStore = {
  // Load from collegeDataStore or storage
  getAll: () => {
    try {
      const liveCollege = collegeDataStore.getAllStudents();
      if (liveCollege && liveCollege.length >= 100) {
        return liveCollege.map(s => ({
          ...s,
          rollNumber: s.roll || s.id,
          gender: s.gender || 'Male',
          riskLevel: s.risk || (s.attendance >= 75 ? 'SAFE' : s.attendance >= 70 ? 'AT RISK' : 'CRITICAL'),
          examStatus: s.examStatus || (s.attendance >= 75 ? 'Eligible' : s.attendance >= 65 ? 'Borderline' : 'Detained'),
          lastUpdated: '2026-10-06'
        }));
      }
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_STUDENTS;
  },

  // Save to storage
  saveAll: (students) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    return students;
  },

  // Add single student
  add: (student) => {
    const list = studentStore.getAll();
    const newStudent = {
      ...student,
      id: student.id || `23CS${100 + list.length + 1}`,
      prn: student.prn || `PRN230${100 + list.length + 1}`,
      conducted: Number(student.conducted) || 120,
      attended: Number(student.attended) || Math.round((Number(student.attendance) / 100) * 120),
      missed: 120 - (Number(student.attended) || Math.round((Number(student.attendance) / 100) * 120)),
      projected: Number(student.attendance),
      riskLevel: Number(student.attendance) >= 75 ? 'SAFE' : Number(student.attendance) >= 70 ? 'AT RISK' : 'CRITICAL',
      examStatus: Number(student.attendance) >= 75 ? 'Eligible' : Number(student.attendance) >= 65 ? 'Condonation Required' : 'Not Eligible',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    list.unshift(newStudent);
    studentStore.saveAll(list);
    return newStudent;
  },

  // Update single student
  update: (id, updatedFields) => {
    const list = studentStore.getAll();
    const index = list.findIndex(s => s.id === id);
    if (index !== -1) {
      const updated = {
        ...list[index],
        ...updatedFields,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      // Recalculate status if attendance changed
      if (updatedFields.attendance !== undefined) {
        const att = Number(updatedFields.attendance);
        updated.riskLevel = att >= 75 ? 'SAFE' : att >= 70 ? 'AT RISK' : 'CRITICAL';
        updated.examStatus = att >= 75 ? 'Eligible' : att >= 65 ? 'Condonation Required' : 'Not Eligible';
      }
      list[index] = updated;
      studentStore.saveAll(list);
      return updated;
    }
    return null;
  },

  // Bulk import
  bulkImport: (newStudents) => {
    const list = studentStore.getAll();
    const formatted = newStudents.map((s, idx) => ({
      ...s,
      id: s.id || `23CS${200 + idx}`,
      prn: s.prn || `PRN230${200 + idx}`,
      conducted: Number(s.conducted) || 120,
      attended: Number(s.attended) || Math.round((Number(s.attendance || 75) / 100) * 120),
      missed: 120 - (Number(s.attended) || Math.round((Number(s.attendance || 75) / 100) * 120)),
      attendance: Number(s.attendance) || 75.0,
      projected: Number(s.attendance) || 75.0,
      riskLevel: Number(s.attendance) >= 75 ? 'SAFE' : Number(s.attendance) >= 70 ? 'AT RISK' : 'CRITICAL',
      examStatus: Number(s.attendance) >= 75 ? 'Eligible' : Number(s.attendance) >= 65 ? 'Condonation Required' : 'Not Eligible',
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
    const merged = [...formatted, ...list];
    studentStore.saveAll(merged);
    return merged;
  },

  // Delete student
  delete: (id) => {
    const list = studentStore.getAll();
    const filtered = list.filter(s => s.id !== id);
    studentStore.saveAll(filtered);
    return filtered;
  }
};

// Natural language "Smart Student Insights" Generator
export function getSmartStudentInsight(student) {
  if (!student) return '';
  const att = Number(student.attendance);
  const remaining = 24;

  if (att < 75) {
    const shortfall = (75 - att).toFixed(1);
    // Classes needed to reach 75: (attended + X) / (conducted + X) = 0.75
    // X = (0.75 * conducted - attended) / 0.25
    const needed = Math.max(1, Math.ceil((0.75 * student.conducted - student.attended) / 0.25));
    return `${student.name}'s attendance is ${att}%, just ${shortfall}% below the 75.0% institutional exam threshold. If ${student.gender === 'Female' ? 'she' : 'he'} attends the next ${needed} consecutive classes, ${student.gender === 'Female' ? 'she' : 'he'} is projected to safely cross the eligibility mark before semester finals.`;
  } else {
    const buffer = (att - 75).toFixed(1);
    const safeMiss = Math.floor((student.attended - 0.75 * student.conducted) / 0.75);
    return `${student.name} maintains a strong attendance record at ${att}%, with a healthy +${buffer}% cushion over the institutional line. ${student.gender === 'Female' ? 'She' : 'He'} can safely miss approximately ${Math.max(1, safeMiss)} upcoming sessions without falling below exam eligibility.`;
  }
}

// Client-side functional Excel/CSV Export
export function exportStudentsToCSV(students, filename = 'Attendance_IQ_Students.csv', options = {}) {
  const headers = [
    'Roll Number',
    'PRN',
    'Full Name',
    'Email',
    'Phone',
    'Department',
    'Year',
    'Semester',
    'Division',
    'Attendance %',
    'Classes Attended',
    'Classes Conducted',
    'Risk Level',
    'Exam Eligibility',
    'Assigned Mentor',
    'Parent Name',
    'Parent Phone',
    'Condonation Status',
    'Last Updated'
  ];

  const rows = students.map(s => [
    `"${s.id || ''}"`,
    `"${s.prn || ''}"`,
    `"${s.name || ''}"`,
    `"${s.email || ''}"`,
    `"${s.phone || ''}"`,
    `"${s.department || ''}"`,
    `"${s.year || ''}"`,
    s.semester || '',
    `"${s.division || ''}"`,
    `${s.attendance}%`,
    s.attended || '',
    s.conducted || '',
    `"${s.riskLevel || ''}"`,
    `"${s.examStatus || ''}"`,
    `"${s.mentor || ''}"`,
    `"${s.parentName || ''}"`,
    `"${s.parentPhone || ''}"`,
    `"${s.condonationStatus || 'None'}"`,
    `"${s.lastUpdated || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Download Sample Import Template
export function downloadSampleTemplate() {
  const sampleHeaders = [
    'Full Name',
    'Student ID',
    'PRN',
    'Email',
    'Phone',
    'Department',
    'Year',
    'Semester',
    'Division',
    'Attendance %',
    'Mentor',
    'Parent Name',
    'Parent Phone'
  ];

  const sampleRows = [
    ['Tanmay Joshi', '23CS175', 'PRN230175', 'tanmay.j@apex.edu', '+91 98232 00001', 'Computer Science', 'TY', '5', 'A', '78.5', 'Dr. Radhika Sen', 'Mr. Vivek Joshi', '+91 98114 00001'],
    ['Rhea Deshmukh', '23CS176', 'PRN230176', 'rhea.d@apex.edu', '+91 98232 00002', 'Computer Science', 'TY', '5', 'A', '84.0', 'Dr. Radhika Sen', 'Mrs. Anita Deshmukh', '+91 98114 00002'],
    ['Kabir Sen', '23CS177', 'PRN230177', 'kabir.s@apex.edu', '+91 98232 00003', 'Computer Science', 'TY', '5', 'A', '71.2', 'Dr. Radhika Sen', 'Dr. Arindam Sen', '+91 98114 00003']
  ];

  const csv = [sampleHeaders.join(','), ...sampleRows.map(r => r.join(',').replace(/\b(?!\b)/g, '"'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Attendance_IQ_Sample_Import_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
