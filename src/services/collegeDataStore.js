// College Demo Data Store for Attendance IQ
// Generates and manages 100+ realistic students across 7 engineering departments,
// 15+ university subjects, faculty mentors, attendance histories, WhatsApp links, and parent details.

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics Engineering'
];

export const YEARS = ['FE', 'SE', 'TY', 'Final Year'];
export const DIVISIONS = ['A', 'B', 'C'];

export const SUBJECTS_CATALOG = [
  {
    code: 'CS301',
    name: 'Data Structures',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 4,
    faculty: 'Dr. Radhika Sen',
    room: 'Hall 204',
    schedule: 'Mon, Wed 10:00 AM',
    requiredAttendance: 75.0,
    totalPlanned: 42
  },
  {
    code: 'CS302',
    name: 'Database Management Systems',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 4,
    faculty: 'Prof. Vikram Malhotra',
    room: 'Hall 108',
    schedule: 'Tue, Thu 11:30 AM',
    requiredAttendance: 75.0,
    totalPlanned: 40
  },
  {
    code: 'CS303',
    name: 'Operating Systems',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 4,
    faculty: 'Dr. Arvind Sharma',
    room: 'Hall 201',
    schedule: 'Mon, Fri 02:00 PM',
    requiredAttendance: 75.0,
    totalPlanned: 38
  },
  {
    code: 'CS304',
    name: 'Computer Networks',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 3,
    faculty: 'Prof. Sneha Kulkarni',
    room: 'Hall 305',
    schedule: 'Wed, Fri 09:00 AM',
    requiredAttendance: 75.0,
    totalPlanned: 36
  },
  {
    code: 'CS305',
    name: 'Web Development',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 3,
    faculty: 'Prof. Rohan Deshmukh',
    room: 'Lab 3',
    schedule: 'Tue, Thu 02:00 PM',
    requiredAttendance: 75.0,
    totalPlanned: 36
  },
  {
    code: 'AI401',
    name: 'Artificial Intelligence',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    credits: 4,
    faculty: 'Dr. Meera Nambiar',
    room: 'Hall 402',
    schedule: 'Mon, Wed 11:30 AM',
    requiredAttendance: 75.0,
    totalPlanned: 40
  },
  {
    code: 'AI402',
    name: 'Machine Learning',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    credits: 4,
    faculty: 'Prof. Amitava Ghosh',
    room: 'AI Lab 1',
    schedule: 'Tue, Thu 10:00 AM',
    requiredAttendance: 75.0,
    totalPlanned: 40
  },
  {
    code: 'MA301',
    name: 'Mathematics III',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 4,
    faculty: 'Dr. Suresh Varma',
    room: 'Hall 101',
    schedule: 'Mon, Wed, Fri 08:00 AM',
    requiredAttendance: 75.0,
    totalPlanned: 45
  },
  {
    code: 'CS306',
    name: 'Software Engineering',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 3,
    faculty: 'Prof. Kavita Rao',
    room: 'Hall 206',
    schedule: 'Tue, Thu 01:00 PM',
    requiredAttendance: 75.0,
    totalPlanned: 36
  },
  {
    code: 'CS307',
    name: 'Computer Architecture',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 3,
    faculty: 'Prof. Pradeep Nair',
    room: 'Hall 202',
    schedule: 'Mon, Wed 01:00 PM',
    requiredAttendance: 75.0,
    totalPlanned: 36
  },
  {
    code: 'IT301',
    name: 'Java Programming',
    department: 'Information Technology',
    semester: 5,
    credits: 4,
    faculty: 'Prof. Pooja Patil',
    room: 'Software Lab 2',
    schedule: 'Mon, Thu 03:00 PM',
    requiredAttendance: 75.0,
    totalPlanned: 38
  },
  {
    code: 'IT302',
    name: 'Python Programming',
    department: 'Information Technology',
    semester: 5,
    credits: 4,
    faculty: 'Dr. Sameer Khan',
    room: 'Data Lab',
    schedule: 'Tue, Fri 11:30 AM',
    requiredAttendance: 75.0,
    totalPlanned: 38
  },
  {
    code: 'IT303',
    name: 'Cloud Computing',
    department: 'Information Technology',
    semester: 5,
    credits: 3,
    faculty: 'Prof. Rajesh Iyer',
    room: 'Hall 304',
    schedule: 'Wed, Fri 01:00 PM',
    requiredAttendance: 75.0,
    totalPlanned: 34
  },
  {
    code: 'IT304',
    name: 'Cyber Security',
    department: 'Information Technology',
    semester: 5,
    credits: 3,
    faculty: 'Dr. Alok Verma',
    room: 'Hall 308',
    schedule: 'Tue, Thu 09:00 AM',
    requiredAttendance: 75.0,
    totalPlanned: 34
  },
  {
    code: 'HU301',
    name: 'Engineering Economics',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 2,
    faculty: 'Prof. Sunita Menon',
    room: 'Hall 105',
    schedule: 'Wed 03:00 PM',
    requiredAttendance: 75.0,
    totalPlanned: 20
  }
];

export const FACULTY_MENTORS = [
  'Dr. Radhika Sen',
  'Dr. Arvind Sharma',
  'Prof. Vikram Malhotra',
  'Prof. Sneha Kulkarni',
  'Dr. Meera Nambiar',
  'Prof. Rohan Deshmukh'
];

// Helper: Calculate classes needed for 75%
export function calcClassesNeeded(attended, conducted, target = 0.75) {
  if (conducted === 0) return 0;
  if (attended / conducted >= target) return 0;
  return Math.max(1, Math.ceil((target * conducted - attended) / (1 - target)));
}

// Helper: Calculate freedom classes buffer
export function calcFreedomBuffer(attended, conducted, target = 0.75) {
  if (conducted === 0) return 0;
  let buffer = 0;
  while ((attended / (conducted + buffer + 1)) >= target) {
    buffer++;
    if (buffer > 50) break;
  }
  return buffer;
}

// Deterministic mock generator for 100+ Indian students
function generateSeedStudents() {
  const firstNames = [
    'Aarav', 'Sameer', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Neha', 'Rahul', 'Isha', 'Tanvi',
    'Vikram', 'Pooja', 'Varun', 'Shreya', 'Kunal', 'Riya', 'Arjun', 'Simran', 'Kavya', 'Gaurav',
    'Aayush', 'Divya', 'Siddharth', 'Bhavna', 'Harsh', 'Anushka', 'Manish', 'Kritika', 'Nikhil', 'Sneha',
    'Akash', 'Swati', 'Pranav', 'Payal', 'Deepak', 'Megha', 'Sanjay', 'Natasha', 'Mayank', 'Richa',
    'Yash', 'Pallavi', 'Chirag', 'Vidhi', 'Dev', 'Shubham', 'Tanmay', 'Alok', 'Mohit', 'Juhi'
  ];

  const lastNames = [
    'Patil', 'Sharma', 'Joshi', 'Mehta', 'Verma', 'Deshmukh', 'Kulkarni', 'Shah', 'Nair', 'Iyer',
    'Malhotra', 'Gupta', 'Chopra', 'Rao', 'Reddy', 'Singh', 'Banerjee', 'Ghosh', 'Chatterjee', 'Agarwal',
    'Bose', 'Menon', 'Kadam', 'Pawar', 'Shinde', 'Bhat', 'Gowda', 'Pillai', 'Saxena', 'Pandey'
  ];

  const students = [];

  // Key hero students
  students.push({
    id: '23CS104',
    roll: '23CS104',
    prn: 'PRN230104',
    name: 'Sameer Patil',
    email: 'sameer.patil@apex.edu',
    phone: '+91 98220 12345',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    department: 'Computer Science & Engineering',
    year: 'TY',
    division: 'A',
    semester: 5,
    gender: 'Male',
    mentor: 'Dr. Radhika Sen',
    parentName: 'Mr. Rajesh Patil',
    parentPhone: '+91 98112 43210',
    parentEmail: 'rajesh.patil@gmail.com',
    attendance: 74.2,
    attended: 89,
    conducted: 120,
    remaining: 24,
    risk: 'AT RISK',
    examStatus: 'Borderline',
    whatsAppStatus: 'CONNECTED',
    consentGiven: true,
    mentorNotes: 'Struggling with morning sessions. 4 consecutive classes needed for safe zone.',
    subjects: [
      { code: 'CS301', name: 'Data Structures', faculty: 'Dr. Radhika Sen', attended: 21, conducted: 28, current_pct: 75.0, risk_level: 'WATCH' },
      { code: 'CS302', name: 'Database Management', faculty: 'Prof. Vikram Malhotra', attended: 22, conducted: 26, current_pct: 84.6, risk_level: 'SAFE' },
      { code: 'CS303', name: 'Operating Systems', faculty: 'Dr. Arvind Sharma', attended: 17, conducted: 26, current_pct: 65.4, risk_level: 'CRITICAL' },
      { code: 'CS304', name: 'Computer Networks', faculty: 'Prof. Sneha Kulkarni', attended: 18, conducted: 24, current_pct: 75.0, risk_level: 'WATCH' },
      { code: 'CS305', name: 'Web Development', faculty: 'Prof. Rohan Deshmukh', attended: 11, conducted: 16, current_pct: 68.8, risk_level: 'CRITICAL' }
    ],
    history: [
      { date: 'Today, 10:00 AM', subject: 'Data Structures', status: 'Present', method: 'QR Verified' },
      { date: 'Yesterday, 02:00 PM', subject: 'Operating Systems', status: 'Absent', method: 'Unverified' },
      { date: '04 Oct, 11:30 AM', subject: 'DBMS', status: 'Present', method: 'QR Verified' },
      { date: '03 Oct, 09:00 AM', subject: 'Computer Networks', status: 'Present', method: 'QR Verified' },
      { date: '02 Oct, 10:00 AM', subject: 'Web Development', status: 'Absent', method: 'Unverified' }
    ]
  });

  students.push({
    id: '23CS118',
    roll: '23CS118',
    prn: 'PRN230118',
    name: 'Ananya Joshi',
    email: 'ananya.joshi@apex.edu',
    phone: '+91 98221 23456',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    department: 'Computer Science & Engineering',
    year: 'TY',
    division: 'A',
    semester: 5,
    gender: 'Female',
    mentor: 'Dr. Radhika Sen',
    parentName: 'Mrs. Sunita Joshi',
    parentPhone: '+91 98221 98765',
    parentEmail: 'sunita.joshi@gmail.com',
    attendance: 86.4,
    attended: 104,
    conducted: 120,
    remaining: 24,
    risk: 'SAFE',
    examStatus: 'Eligible',
    whatsAppStatus: 'CONNECTED',
    consentGiven: true,
    mentorNotes: 'Consistent high achiever. 4 safe freedom classes buffer.',
    subjects: [
      { code: 'CS301', name: 'Data Structures', faculty: 'Dr. Radhika Sen', attended: 26, conducted: 28, current_pct: 92.9, risk_level: 'SAFE' },
      { code: 'CS302', name: 'Database Management', faculty: 'Prof. Vikram Malhotra', attended: 24, conducted: 26, current_pct: 92.3, risk_level: 'SAFE' },
      { code: 'CS303', name: 'Operating Systems', faculty: 'Dr. Arvind Sharma', attended: 21, conducted: 26, current_pct: 80.8, risk_level: 'SAFE' },
      { code: 'CS304', name: 'Computer Networks', faculty: 'Prof. Sneha Kulkarni', attended: 21, conducted: 24, current_pct: 87.5, risk_level: 'SAFE' },
      { code: 'CS305', name: 'Web Development', faculty: 'Prof. Rohan Deshmukh', attended: 12, conducted: 16, current_pct: 75.0, risk_level: 'WATCH' }
    ],
    history: [
      { date: 'Today, 10:00 AM', subject: 'Data Structures', status: 'Present', method: 'QR Verified' },
      { date: 'Yesterday, 02:00 PM', subject: 'Operating Systems', status: 'Present', method: 'QR Verified' },
      { date: '04 Oct, 11:30 AM', subject: 'DBMS', status: 'Present', method: 'QR Verified' }
    ]
  });

  students.push({
    id: '23CS101',
    roll: '23CS101',
    prn: 'PRN230101',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@apex.edu',
    phone: '+91 98222 34567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    department: 'Computer Science & Engineering',
    year: 'TY',
    division: 'A',
    semester: 5,
    gender: 'Male',
    mentor: 'Dr. Radhika Sen',
    parentName: 'Mr. Deepak Mehta',
    parentPhone: '+91 98222 87654',
    parentEmail: 'deepak.mehta@gmail.com',
    attendance: 82.4,
    attended: 99,
    conducted: 120,
    remaining: 24,
    risk: 'SAFE',
    examStatus: 'Eligible',
    whatsAppStatus: 'CONNECTED',
    consentGiven: true,
    mentorNotes: 'Solid classroom engagement. Exam clearance certified.',
    subjects: [
      { code: 'CS301', name: 'Data Structures', faculty: 'Dr. Radhika Sen', attended: 24, conducted: 28, current_pct: 85.7, risk_level: 'SAFE' },
      { code: 'CS302', name: 'Database Management', faculty: 'Prof. Vikram Malhotra', attended: 23, conducted: 26, current_pct: 88.5, risk_level: 'SAFE' },
      { code: 'CS303', name: 'Operating Systems', faculty: 'Dr. Arvind Sharma', attended: 19, conducted: 26, current_pct: 73.1, risk_level: 'AT RISK' },
      { code: 'CS304', name: 'Computer Networks', faculty: 'Prof. Sneha Kulkarni', attended: 20, conducted: 24, current_pct: 83.3, risk_level: 'SAFE' },
      { code: 'CS305', name: 'Web Development', faculty: 'Prof. Rohan Deshmukh', attended: 13, conducted: 16, current_pct: 81.3, risk_level: 'SAFE' }
    ],
    history: [
      { date: 'Today, 10:00 AM', subject: 'Data Structures', status: 'Present', method: 'QR Verified' },
      { date: 'Yesterday, 02:00 PM', subject: 'Operating Systems', status: 'Present', method: 'QR Verified' }
    ]
  });

  // Generate 102 more students to reach 105 total realistic records
  for (let i = 4; i <= 105; i++) {
    const fName = firstNames[(i * 7) % firstNames.length];
    const lName = lastNames[(i * 11) % lastNames.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const yr = YEARS[i % YEARS.length];
    const div = DIVISIONS[i % DIVISIONS.length];
    const sem = yr === 'FE' ? 1 : yr === 'SE' ? 3 : yr === 'TY' ? 5 : 7;
    const mentor = FACULTY_MENTORS[i % FACULTY_MENTORS.length];
    const rollNum = 100 + i;
    const deptCode = dept === 'Computer Science & Engineering' ? 'CS' :
                     dept === 'Information Technology' ? 'IT' :
                     dept === 'Artificial Intelligence & Data Science' ? 'AI' :
                     dept === 'Electronics & Telecommunication' ? 'ET' :
                     dept === 'Mechanical Engineering' ? 'ME' : 'CV';
    const id = `23${deptCode}${rollNum}`;

    // Attendance distribution: ~65% Safe, ~20% Watch/At Risk, ~15% Critical
    const seedPct = ((i * 19) % 45) + 55; // 55% to 99%
    const conducted = 120;
    const attended = Math.round((seedPct / 100) * conducted);
    const actualPct = Number(((attended / conducted) * 100).toFixed(1));

    let risk = 'SAFE';
    let examStatus = 'Eligible';
    if (actualPct < 70) {
      risk = 'CRITICAL';
      examStatus = 'Detained';
    } else if (actualPct < 75) {
      risk = 'AT RISK';
      examStatus = 'Borderline';
    } else if (actualPct < 80) {
      risk = 'WATCH';
      examStatus = 'Eligible';
    }

    const phoneDigit = String(10000 + (i * 37)).padStart(5, '0');
    const phone = `+91 9822${i % 10} ${phoneDigit}`;
    const waStatus = (i % 9 === 0) ? 'MISSING' : (i % 14 === 0) ? 'DISABLED' : 'CONNECTED';

    // 5 standard subjects for each student
    const studentSubjects = SUBJECTS_CATALOG.slice(0, 5).map(sub => {
      const subConducted = 25;
      const subVar = ((i * 13 + sub.name.length) % 15) - 7;
      const subAttended = Math.min(subConducted, Math.max(12, Math.round(((actualPct + subVar) / 100) * subConducted)));
      const subPct = Number(((subAttended / subConducted) * 100).toFixed(1));
      let subRisk = 'SAFE';
      if (subPct < 70) subRisk = 'CRITICAL';
      else if (subPct < 75) subRisk = 'AT RISK';
      else if (subPct < 80) subRisk = 'WATCH';

      return {
        code: sub.code,
        name: sub.name,
        faculty: sub.faculty,
        conducted: subConducted,
        attended: subAttended,
        current_pct: subPct,
        risk_level: subRisk
      };
    });

    students.push({
      id,
      roll: id,
      prn: `PRN230${rollNum}`,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@apex.edu`,
      phone,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345678) % 50000000}?auto=format&fit=crop&w=150&q=80`,
      department: dept,
      year: yr,
      division: div,
      semester: sem,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      mentor,
      parentName: `Mr. ${lName}`,
      parentPhone: `+91 9811${i % 10} ${phoneDigit}`,
      parentEmail: `${lName.toLowerCase()}.parent@gmail.com`,
      attendance: actualPct,
      attended,
      conducted,
      remaining: 24,
      risk,
      examStatus,
      whatsAppStatus: waStatus,
      consentGiven: waStatus === 'CONNECTED',
      mentorNotes: actualPct < 75 ? `Shortfall of ${(75 - actualPct).toFixed(1)}%. Personalized recovery roadmap required.` : 'Attendance buffer verified.',
      subjects: studentSubjects,
      history: [
        { date: 'Today, 10:00 AM', subject: studentSubjects[0].name, status: actualPct >= 70 ? 'Present' : 'Absent', method: 'QR Verified' },
        { date: 'Yesterday, 02:00 PM', subject: studentSubjects[1].name, status: 'Present', method: 'QR Verified' },
        { date: '04 Oct, 11:30 AM', subject: studentSubjects[2].name, status: 'Present', method: 'QR Verified' }
      ]
    });
  }

  return students;
}

const STORAGE_KEY = 'attendance_iq_college_dataset_v2';
const SUBJECTS_KEY = 'attendance_iq_subjects_dataset_v2';

class CollegeDataStore {
  constructor() {
    this.listeners = [];
    this.students = this.loadStudents();
    this.subjects = this.loadSubjects();
  }

  loadStudents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to read students from storage:', e);
    }
    const seed = generateSeedStudents();
    this.saveStudents(seed);
    return seed;
  }

  saveStudents(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.students = data;
      this.notify();
    } catch (e) {
      console.warn('Failed to save students to storage:', e);
    }
  }

  loadSubjects() {
    try {
      const stored = localStorage.getItem(SUBJECTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to read subjects from storage:', e);
    }
    this.saveSubjects(SUBJECTS_CATALOG);
    return SUBJECTS_CATALOG;
  }

  saveSubjects(subs) {
    try {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subs));
      this.subjects = subs;
      this.notify();
    } catch (e) {
      console.warn('Failed to save subjects to storage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => {
      try { l(this.students, this.subjects); } catch (e) { console.error(e); }
    });
  }

  getAllStudents() {
    return this.students;
  }

  getStudentById(id) {
    return this.students.find(s => s.id === id || s.roll === id) || this.students[0];
  }

  getAllSubjects() {
    return this.subjects;
  }

  addSubject(newSubject) {
    const updated = [newSubject, ...this.subjects];
    this.saveSubjects(updated);
    return updated;
  }

  updateSubject(code, updatedData) {
    const updated = this.subjects.map(s => s.code === code ? { ...s, ...updatedData } : s);
    this.saveSubjects(updated);
    return updated;
  }

  // Record verified attendance (e.g. from QR scan or manual teacher toggle)
  recordStudentAttendance(studentId, subjectName = 'Data Structures') {
    const updated = this.students.map(st => {
      if (st.id === studentId || st.roll === studentId) {
        const newAttended = st.attended + 1;
        const newConducted = st.conducted + 1;
        const newPct = Number(((newAttended / newConducted) * 100).toFixed(1));

        let newRisk = 'SAFE';
        let newExam = 'Eligible';
        if (newPct < 70) {
          newRisk = 'CRITICAL';
          newExam = 'Detained';
        } else if (newPct < 75) {
          newRisk = 'AT RISK';
          newExam = 'Borderline';
        } else if (newPct < 80) {
          newRisk = 'WATCH';
        }

        const updatedSubjects = st.subjects.map(sub => {
          if (sub.name.toLowerCase().includes(subjectName.toLowerCase()) || subjectName.toLowerCase().includes(sub.name.toLowerCase())) {
            const subAtt = sub.attended + 1;
            const subCond = sub.conducted + 1;
            const subPct = Number(((subAtt / subCond) * 100).toFixed(1));
            return {
              ...sub,
              attended: subAtt,
              conducted: subCond,
              current_pct: subPct,
              risk_level: subPct >= 75 ? 'SAFE' : 'AT RISK'
            };
          }
          return sub;
        });

        const newHistoryItem = {
          date: 'Just now',
          subject: subjectName,
          status: 'Present',
          method: 'QR Verified (Attendance IQ)'
        };

        return {
          ...st,
          attended: newAttended,
          conducted: newConducted,
          attendance: newPct,
          risk: newRisk,
          examStatus: newExam,
          subjects: updatedSubjects,
          history: [newHistoryItem, ...(st.history || [])]
        };
      }
      return st;
    });

    this.saveStudents(updated);
    return this.getStudentById(studentId);
  }

  // Add a new student record
  addStudent(newStudent) {
    const updated = [newStudent, ...this.students];
    this.saveStudents(updated);
    return updated;
  }

  // Update existing student profile
  updateStudent(id, partial) {
    const updated = this.students.map(s => (s.id === id ? { ...s, ...partial } : s));
    this.saveStudents(updated);
    return updated;
  }

  // Delete student
  deleteStudent(id) {
    const updated = this.students.filter(s => s.id !== id);
    this.saveStudents(updated);
    return updated;
  }
}

export const collegeDataStore = new CollegeDataStore();
export default collegeDataStore;
