// Attendance IQ - WhatsApp Notification & Attendance Recovery Service
// Enterprise architecture with Provider Abstraction (Mock for Hackathon Demo + Meta WhatsApp Business API integration)

// Storage keys
const WA_MESSAGES_KEY = 'attendance_iq_wa_messages_v1';
const WA_STUDENTS_KEY = 'attendance_iq_wa_students_v1';
const WA_SETTINGS_KEY = 'attendance_iq_wa_settings_v1';
const RECOVERY_CASES_KEY = 'attendance_iq_recovery_cases_v1';

// Configurable Risk Thresholds (Section: RISK LEVELS)
export const DEFAULT_RISK_THRESHOLDS = {
  safe: 80.0,       // >= 80% Safe
  watch: 75.0,      // 75% - 79.9% Watch
  atRisk: 70.0,     // 70% - 74.9% At Risk
  critical: 70.0    // < 70% Critical
};

// Configurable Notification Settings (Section: NOTIFICATION SETTINGS)
export const DEFAULT_NOTIFICATION_SETTINGS = {
  lowAttendanceThreshold: 75.0,
  criticalThreshold: 70.0,
  reminderFrequency: 'DAILY', // 'DAILY' | 'EVERY_2_DAYS' | 'WEEKLY'
  mentorEscalationDays: 3,
  parentNotificationEnabled: true,
  studentNotificationEnabled: true,
  providerMode: 'DEMO' // 'DEMO' | 'REAL'
};

// Accurate Attendance Recovery Formula (Section: SMART RECOVERY CALCULATION)
// Minimum X classes needed: (A + X) / (C + X) >= T  =>  X = ceil((T*C - A) / (1 - T))
export function calculateClassesNeeded(attended, conducted, targetRate = 0.75) {
  if (conducted === 0) return 0;
  const currentRate = attended / conducted;
  if (currentRate >= targetRate) return 0;
  const needed = Math.ceil((targetRate * conducted - attended) / (1 - targetRate));
  return Math.max(1, needed);
}

// Calculate projected attendance if student attends next X classes
export function calculateProjectedAttendance(attended, conducted, nextClassesAttended, totalNextClasses = 24) {
  const newAttended = attended + nextClassesAttended;
  const newConducted = conducted + totalNextClasses;
  return Number(((newAttended / newConducted) * 100).toFixed(1));
}

// Phone Number Masking Utility (Section 18: WHATSAPP NUMBER PRIVACY)
export function maskPhoneNumber(phone) {
  if (!phone) return 'Not Configured';
  const clean = phone.replace(/\s+/g, '');
  if (clean.length < 8) return phone;
  const start = clean.slice(0, 5);
  const end = clean.slice(-3);
  return `${start} ••••• ${end}`;
}

// Pre-defined WhatsApp Message Templates (Section: WHATSAPP MESSAGE TYPES)
export const MESSAGE_TEMPLATES = {
  LOW_ATTENDANCE: {
    id: 'LOW_ATTENDANCE',
    name: 'Low Attendance Alert',
    template: `Attendance IQ 🔔\n\nHi {{student_name}} 👋\n\nYour current attendance is: {{attendance}}%\nRequired: {{required_attendance}}%\n\nYou are currently at risk of losing exam eligibility.\nThe good news? You can still recover.\n\n🎯 Recovery target: Attend the next {{classes_needed}} classes.\n📚 Today's task: Attend all scheduled classes.\n\n🔗 View Recovery Plan: {{recovery_link}}\n\nAttendance IQ\nSmarter Attendance. Brighter Future. 🌿`
  },
  CRITICAL_ATTENDANCE: {
    id: 'CRITICAL_ATTENDANCE',
    name: 'Critical Attendance Alert',
    template: `Attendance IQ ⚠ CRITICAL ALERT\n\nHi {{student_name}},\n\nYour semester attendance has dropped to {{attendance}}% (Institutional minimum: {{required_attendance}}%).\n\n🚨 Immediate Recovery Action Required:\nAttend the next {{classes_needed}} consecutive classes without absence.\n\nYour Faculty Mentor ({{mentor_name}}) has prepared an official academic recovery task roadmap.\n\n🔗 Open Your Recovery Plan: {{recovery_link}}\n\nPlease attend tomorrow's lectures to avoid exam detention.`
  },
  DAILY_RECOVERY_REMINDER: {
    id: 'DAILY_RECOVERY_REMINDER',
    name: 'Daily Recovery Reminder',
    template: `Good morning, {{student_name}} ☀️\n\nYour attendance recovery task is waiting for today:\n🎯 Today's target: {{today_classes_count}} classes\n\nCompleted this week: {{completed_tasks}} / {{classes_needed}}\n\nKeep going — you're getting closer to {{required_attendance}}%! 💪\n\n🔗 Continue Recovery Plan: {{recovery_link}}`
  },
  RECOVERY_PLAN: {
    id: 'RECOVERY_PLAN',
    name: 'Personalized Recovery Plan',
    template: `Attendance IQ 🎯 Recovery Roadmap\n\nHi {{student_name}},\n\nA personalized attendance recovery roadmap has been assigned by {{mentor_name}}.\n\n• Current Attendance: {{attendance}}%\n• Target to Reach: {{required_attendance}}%\n• Sessions Required: {{classes_needed}} classes\n\n🔗 Access Plan: {{recovery_link}}`
  },
  EXAM_ELIGIBILITY_WARNING: {
    id: 'EXAM_ELIGIBILITY_WARNING',
    name: 'Exam Eligibility Warning',
    template: `Apex Institute of Technology • Exam Cell Notice\n\nDear {{student_name}},\n\nEnd-semester exam hall ticket provisional clearance is currently WITHHELD due to attendance ({{attendance}}% vs mandatory {{required_attendance}}%).\n\nComplete {{classes_needed}} recovery lectures before final roster publication on 20 Nov.\n\n🔗 Verify Clearance: {{recovery_link}}`
  },
  RECOVERY_SUCCESS: {
    id: 'RECOVERY_SUCCESS',
    name: 'Exam Eligibility Restored',
    template: `🎉 You're back on track!\n\nHi {{student_name}},\n\nCongratulations! Your attendance has improved to {{attendance}}%.\n\nYou are now:\n✓ Exam Eligible (Clearance Approved)\n\nYour recovery roadmap has been successfully completed. Keep it up! 🚀\n\nAttendance IQ`
  },
  MENTOR_ESCALATION: {
    id: 'MENTOR_ESCALATION',
    name: 'Faculty Mentor Escalation',
    template: `⚠ Faculty Mentor Alert • Attendance IQ\n\nStudent: {{student_name}}\nAttendance: {{attendance}}% (Status: Critical)\nRecovery progress: {{completed_tasks}} / {{classes_needed}} sessions.\n\nRecommended Action: Schedule one-on-one mentor advisory counseling.\n\n🔗 Open Dossier: {{recovery_link}}`
  },
  PARENT_ALERT: {
    id: 'PARENT_ALERT',
    name: 'Guardian Transparency Notice',
    template: `Attendance IQ • Apex Institute of Technology\n\nAttendance update for {{student_name}}:\nCurrent attendance: {{attendance}}% (Target: {{required_attendance}}%)\nStatus: {{status_label}}\n\nA recovery roadmap has been generated. Please encourage your ward to attend upcoming lab sessions.\n\n🔗 Guardian View: {{recovery_link}}`
  }
};

// Render template helper
export function renderTemplate(templateStr, variables = {}) {
  let output = templateStr;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    output = output.replace(regex, variables[key]);
  });
  return output;
}

// Initial Mentor's Student WhatsApp Directory (Section 2: ADD STUDENT WHATSAPP NUMBER)
export const INITIAL_WHATSAPP_STUDENTS = [
  {
    id: '23CS104',
    name: 'Sameer Patil',
    roll: '23CS104',
    department: 'Computer Science',
    division: 'TY CSE - A',
    attendance: 68.4,
    conducted: 120,
    attended: 82,
    risk: 'CRITICAL',
    phone: '+91 98220 12345',
    status: 'CONNECTED', // 'CONNECTED' | 'MISSING' | 'INVALID' | 'DISABLED' | 'PENDING'
    consentGiven: true,
    lastContacted: '18 mins ago',
    activeRecoveryPlan: true,
    todayTasks: [
      { id: 'T1', subject: 'Data Structures', time: '10:00 AM', completed: true },
      { id: 'T2', subject: 'Operating Systems', time: '12:00 PM', completed: false },
      { id: 'T3', subject: 'DBMS Lab', time: '02:00 PM', completed: false }
    ]
  },
  {
    id: '23CS118',
    name: 'Ananya Joshi',
    roll: '23CS118',
    department: 'Computer Science',
    division: 'TY CSE - A',
    attendance: 82.6,
    conducted: 120,
    attended: 99,
    risk: 'SAFE',
    phone: '+91 98221 23456',
    status: 'CONNECTED',
    consentGiven: true,
    lastContacted: '2 days ago',
    activeRecoveryPlan: false,
    todayTasks: []
  },
  {
    id: '23CS121',
    name: 'Rahul More',
    roll: '23CS121',
    department: 'Computer Science',
    division: 'TY CSE - A',
    attendance: 72.8,
    conducted: 120,
    attended: 87,
    risk: 'AT_RISK',
    phone: '',
    status: 'MISSING',
    consentGiven: false,
    lastContacted: 'Never',
    activeRecoveryPlan: true,
    todayTasks: [
      { id: 'T1', subject: 'Data Structures', time: '10:00 AM', completed: false },
      { id: 'T2', subject: 'Operating Systems', time: '12:00 PM', completed: false }
    ]
  },
  {
    id: '23CS109',
    name: 'Rahul Deshmukh',
    roll: '23CS109',
    department: 'Computer Science',
    division: 'TY CSE - A',
    attendance: 67.2,
    conducted: 120,
    attended: 81,
    risk: 'CRITICAL',
    phone: '+91 98223 34567',
    status: 'CONNECTED',
    consentGiven: true,
    lastContacted: 'Yesterday',
    activeRecoveryPlan: true,
    todayTasks: [
      { id: 'T1', subject: 'Data Structures', time: '10:00 AM', completed: true },
      { id: 'T2', subject: 'Operating Systems', time: '12:00 PM', completed: false }
    ]
  },
  {
    id: '23CS140',
    name: 'Priya Shah',
    roll: '23CS140',
    department: 'Computer Science',
    division: 'TY CSE - A',
    attendance: 71.8,
    conducted: 120,
    attended: 86,
    risk: 'AT_RISK',
    phone: '+91 98224 45678',
    status: 'CONNECTED',
    consentGiven: true,
    lastContacted: '3 days ago',
    activeRecoveryPlan: true,
    todayTasks: []
  },
  {
    id: '23CS129',
    name: 'Tanvi Kadam',
    roll: '23CS129',
    department: 'Computer Science',
    division: 'TY CSE - A',
    attendance: 64.2,
    conducted: 120,
    attended: 77,
    risk: 'CRITICAL',
    phone: '+91 98225 56789',
    status: 'CONNECTED',
    consentGiven: true,
    lastContacted: '4 days ago',
    activeRecoveryPlan: true,
    todayTasks: []
  },
  {
    id: '23CS132',
    name: 'Sneha Kulkarni',
    roll: '23CS132',
    department: 'Computer Science',
    division: 'TY CSE - A',
    attendance: 78.4,
    conducted: 120,
    attended: 94,
    risk: 'WATCH',
    phone: '+91 98226 67890',
    status: 'CONNECTED',
    consentGiven: true,
    lastContacted: '1 week ago',
    activeRecoveryPlan: false,
    todayTasks: []
  },
  {
    id: '23CS145',
    name: 'Aditya More',
    roll: '23CS145',
    department: 'Computer Science',
    division: 'TY CSE - A',
    attendance: 69.8,
    conducted: 120,
    attended: 84,
    risk: 'CRITICAL',
    phone: '',
    status: 'MISSING',
    consentGiven: false,
    lastContacted: 'Never',
    activeRecoveryPlan: true,
    todayTasks: []
  }
];

// Initial Message History Log (Section: MESSAGE LOG)
export const INITIAL_MESSAGE_LOG = [
  {
    id: 'msg-wa-101',
    studentId: '23CS104',
    studentName: 'Sameer Patil',
    phone: '+91 98220 12345',
    templateId: 'CRITICAL_ATTENDANCE',
    messageType: 'Critical Attendance Alert',
    trigger: 'Attendance dropped to 68.4% (<70%)',
    sentBy: 'Dr. Radhika Sen',
    sentAt: '10:42 AM',
    status: 'DELIVERED', // 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
    classesNeeded: 8,
    attendance: 68.4
  },
  {
    id: 'msg-wa-102',
    studentId: '23CS109',
    studentName: 'Rahul Deshmukh',
    phone: '+91 98223 34567',
    templateId: 'DAILY_RECOVERY_REMINDER',
    messageType: 'Daily Recovery Reminder',
    trigger: 'Scheduled 9:00 AM Morning Run',
    sentBy: 'Dr. Radhika Sen',
    sentAt: '09:15 AM',
    status: 'READ',
    classesNeeded: 9,
    attendance: 67.2
  },
  {
    id: 'msg-wa-103',
    studentId: '23CS140',
    studentName: 'Priya Shah',
    phone: '+91 98224 45678',
    templateId: 'LOW_ATTENDANCE',
    messageType: 'Low Attendance Alert',
    trigger: 'Attendance < 75%',
    sentBy: 'Dr. Radhika Sen',
    sentAt: 'Yesterday, 04:30 PM',
    status: 'READ',
    classesNeeded: 5,
    attendance: 71.8
  },
  {
    id: 'msg-wa-104',
    studentId: '23CS129',
    studentName: 'Tanvi Kadam',
    phone: '+91 98225 56789',
    templateId: 'PARENT_ALERT',
    messageType: 'Guardian Transparency Notice',
    trigger: 'Persistent Critical Shortage (4 days)',
    sentBy: 'System Automation',
    sentAt: '04 Oct, 11:20 AM',
    status: 'DELIVERED',
    classesNeeded: 12,
    attendance: 64.2
  }
];

// ============================================================================
// PROVIDER ABSTRACTION (Section: WHATSAPP PROVIDER ARCHITECTURE)
// ============================================================================

class WhatsAppProvider {
  async sendMessage(params) {
    throw new Error('sendMessage() must be implemented by provider');
  }
  async sendTemplateMessage(params) {
    throw new Error('sendTemplateMessage() must be implemented by provider');
  }
  async getMessageStatus(messageId) {
    throw new Error('getMessageStatus() must be implemented by provider');
  }
}

// 1. Mock Provider for Hackathon / Presentation Demo
export class MockWhatsAppProvider extends WhatsAppProvider {
  async sendMessage({ to, text, studentName, templateId }) {
    // Simulate real-world network latency (350ms)
    await new Promise(resolve => setTimeout(resolve, 350));

    const messageId = `wamid.HB_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      messageId,
      status: 'SENT',
      recipient: to,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'MockWhatsAppProvider (Demo Mode)'
    };
  }

  async sendTemplateMessage({ to, templateName, variables }) {
    await new Promise(resolve => setTimeout(resolve, 350));
    return {
      success: true,
      messageId: `wamid.TMPL_${Date.now()}`,
      status: 'SENT',
      recipient: to,
      template: templateName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}

// 2. Production Meta WhatsApp Business Cloud API Provider (Isolated, zero hardcoded credentials)
export class RealWhatsAppProvider extends WhatsAppProvider {
  constructor(config = {}) {
    super();
    // Environment variables (Meta Graph API)
    this.apiUrl = config.apiUrl || (typeof process !== 'undefined' ? process.env?.WHATSAPP_API_URL : null) || 'https://graph.facebook.com/v19.0';
    this.accessToken = config.accessToken || (typeof process !== 'undefined' ? process.env?.WHATSAPP_ACCESS_TOKEN : null);
    this.phoneNumberId = config.phoneNumberId || (typeof process !== 'undefined' ? process.env?.WHATSAPP_PHONE_NUMBER_ID : null);
  }

  async sendMessage({ to, text }) {
    if (!this.accessToken || !this.phoneNumberId) {
      console.warn('RealWhatsAppProvider: Missing API credentials. Falling back to secure mock dispatch.');
      return new MockWhatsAppProvider().sendMessage({ to, text });
    }

    try {
      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: text }
        })
      });

      const data = await response.json();
      return {
        success: response.ok,
        messageId: data.messages?.[0]?.id,
        status: response.ok ? 'SENT' : 'FAILED',
        error: data.error
      };
    } catch (error) {
      console.error('RealWhatsAppProvider execution failed:', error);
      return { success: false, status: 'FAILED', error: error.message };
    }
  }
}

// ============================================================================
// WHATSAPP NOTIFICATION SERVICE (Section: WhatsAppNotificationService)
// ============================================================================

class NotificationService {
  constructor() {
    this.provider = new MockWhatsAppProvider();
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(event, data) {
    this.listeners.forEach(cb => {
      try { cb(event, data); } catch (e) { console.error('WA listener error:', e); }
    });
  }

  // Get active provider based on admin settings
  getProvider() {
    const settings = this.getSettings();
    if (settings.providerMode === 'REAL') {
      return new RealWhatsAppProvider();
    }
    return this.provider;
  }

  // Read message logs
  getMessages() {
    try {
      const stored = localStorage.getItem(WA_MESSAGES_KEY);
      return stored ? JSON.parse(stored) : INITIAL_MESSAGE_LOG;
    } catch (e) {
      return INITIAL_MESSAGE_LOG;
    }
  }

  saveMessages(messages) {
    try {
      localStorage.setItem(WA_MESSAGES_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save WA messages:', e);
    }
  }

  // Read student WhatsApp roster
  getStudents() {
    try {
      const stored = localStorage.getItem(WA_STUDENTS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_WHATSAPP_STUDENTS;
    } catch (e) {
      return INITIAL_WHATSAPP_STUDENTS;
    }
  }

  saveStudents(students) {
    try {
      localStorage.setItem(WA_STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.warn('Could not save WA students:', e);
    }
  }

  // Read admin settings
  getSettings() {
    try {
      const stored = localStorage.getItem(WA_SETTINGS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATION_SETTINGS;
    } catch (e) {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(WA_SETTINGS_KEY, JSON.stringify(settings));
      this.emit('SETTINGS_UPDATED', settings);
    } catch (e) {
      console.warn('Could not save WA settings:', e);
    }
  }

  // Smart message recommendation logic (Section 16: SMART RECOMMENDATIONS)
  getSmartRecommendation(student) {
    const att = Number(student.attendance);
    if (att < 70) {
      return {
        recommendedTemplate: 'CRITICAL_ATTENDANCE',
        label: 'Send Critical Attendance Alert',
        urgency: 'HIGH',
        color: '#B91C1C',
        reason: 'Attendance < 70% institutional statutory minimum'
      };
    } else if (att < 75) {
      return {
        recommendedTemplate: student.activeRecoveryPlan ? 'DAILY_RECOVERY_REMINDER' : 'LOW_ATTENDANCE',
        label: student.activeRecoveryPlan ? 'Send Daily Recovery Reminder' : 'Send Recovery Plan',
        urgency: 'MEDIUM',
        color: '#D97706',
        reason: 'Attendance between 70% and 74.9%'
      };
    } else if (att < 80) {
      return {
        recommendedTemplate: 'DAILY_RECOVERY_REMINDER',
        label: 'Send Attendance Reminder',
        urgency: 'LOW',
        color: '#0D9488',
        reason: 'Borderline buffer (75%–80%)'
      };
    }
    return {
      recommendedTemplate: null,
      label: 'Safe (No Message Needed)',
      urgency: 'NONE',
      color: '#059669',
      reason: 'Safe attendance record'
    };
  }

  // Send single WhatsApp notification
  async sendNotification({
    studentId,
    studentName,
    phone,
    templateKey = 'LOW_ATTENDANCE',
    mentorName = 'Dr. Radhika Sen',
    customText = null,
    trigger = 'Manual Mentor Dispatch'
  }) {
    const student = this.getStudents().find(s => s.id === studentId) || {
      id: studentId,
      name: studentName,
      attendance: 68.4,
      conducted: 120,
      attended: 82,
      phone
    };

    const classesNeeded = calculateClassesNeeded(student.attended, student.conducted, 0.75);
    const recoveryToken = `RECOV_${student.id}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const recoveryLink = `https://attendance-iq.apex.edu/recovery?auth=${recoveryToken}`;

    const templateObj = MESSAGE_TEMPLATES[templateKey] || MESSAGE_TEMPLATES.LOW_ATTENDANCE;
    let messageBody = customText || templateObj.template;

    // Personalize variables
    messageBody = renderTemplate(messageBody, {
      student_name: student.name,
      attendance: student.attendance,
      required_attendance: '75.0',
      classes_needed: classesNeeded,
      today_classes_count: 3,
      completed_tasks: student.todayTasks ? student.todayTasks.filter(t => t.completed).length : 1,
      mentor_name: mentorName,
      recovery_link: recoveryLink,
      status_label: student.attendance < 70 ? 'Critical' : 'At Risk'
    });

    // Dispatch via configured provider
    const provider = this.getProvider();
    const dispatchResult = await provider.sendMessage({
      to: student.phone || phone,
      text: messageBody,
      studentName: student.name,
      templateId: templateKey
    });

    // Create log record
    const newLog = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: student.id,
      studentName: student.name,
      phone: student.phone || phone,
      templateId: templateKey,
      messageType: templateObj.name,
      messageBody,
      trigger,
      sentBy: mentorName,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: dispatchResult.success ? 'DELIVERED' : 'FAILED',
      classesNeeded,
      attendance: student.attendance
    };

    const currentLogs = this.getMessages();
    this.saveMessages([newLog, ...currentLogs]);

    // Update student's last contacted timestamp
    const allStudents = this.getStudents().map(s => {
      if (s.id === student.id) {
        return { ...s, lastContacted: 'Just now' };
      }
      return s;
    });
    this.saveStudents(allStudents);

    this.emit('MESSAGE_SENT', newLog);
    return { success: true, log: newLog, messageBody };
  }

  // Bulk Send WhatsApp notifications (Section 12 & 13)
  async sendBulkNotifications({
    studentIds,
    templateKey = 'CRITICAL_ATTENDANCE',
    mentorName = 'Dr. Radhika Sen',
    onProgress
  }) {
    const allStudents = this.getStudents();
    const targets = allStudents.filter(s => studentIds.includes(s.id));
    const results = [];

    for (let i = 0; i < targets.length; i++) {
      const student = targets[i];
      if (onProgress) onProgress(i + 1, targets.length, student.name);
      const res = await this.sendNotification({
        studentId: student.id,
        studentName: student.name,
        phone: student.phone,
        templateKey,
        mentorName,
        trigger: 'Bulk Mentor Campaign'
      });
      results.push(res);
    }

    return results;
  }

  // Update or add student phone number with consent (Section 3: ADD WHATSAPP NUMBER)
  updateStudentPhone(studentId, phone, consentGiven = true) {
    const students = this.getStudents().map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          phone,
          status: phone ? 'CONNECTED' : 'MISSING',
          consentGiven: Boolean(consentGiven)
        };
      }
      return s;
    });
    this.saveStudents(students);
    this.emit('STUDENTS_UPDATED', students);
    return students;
  }

  // Bulk import phone numbers from Excel / CSV (Section 4: BULK ADD NUMBERS)
  bulkImportNumbers(records) {
    const current = this.getStudents();
    let updatedCount = 0;

    const merged = current.map(st => {
      const found = records.find(r => r.studentId === st.id || r.id === st.id);
      if (found && found.phone) {
        updatedCount++;
        return {
          ...st,
          phone: found.phone,
          status: 'CONNECTED',
          consentGiven: true
        };
      }
      return st;
    });

    this.saveStudents(merged);
    this.emit('STUDENTS_UPDATED', merged);
    return { total: records.length, updated: updatedCount };
  }

  // Alias helper methods matching UI callers
  getMessageHistory() {
    return this.getMessages();
  }

  getRecommendedMessage(student) {
    return this.getSmartRecommendation(student);
  }

  buildPersonalizedText(templateRaw, student, mentorName = 'Dr. Radhika Sen') {
    const classesNeeded = calculateClassesNeeded(student.attended || 82, student.conducted || 120, 0.75);
    const recoveryToken = `RECOV_${student.id || '23CS104'}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const recoveryLink = `https://attendance-iq.apex.edu/recovery?auth=${recoveryToken}`;
    return renderTemplate(templateRaw, {
      student_name: student.name || 'Sameer Patil',
      attendance: student.attendance || 68.4,
      required_attendance: '75.0',
      classes_needed: classesNeeded,
      today_classes_count: 3,
      completed_tasks: student.todayTasks ? student.todayTasks.filter(t => t.completed).length : 1,
      mentor_name: mentorName,
      recovery_link: recoveryLink,
      status_label: (student.attendance || 68.4) < 70 ? 'Critical' : 'At Risk'
    });
  }

  async sendBulkPersonalizedMessages({
    studentIds,
    templateKey = 'CRITICAL_ATTENDANCE',
    customTemplateText = null,
    mentorName = 'Dr. Radhika Sen',
    onProgress
  }) {
    const allStudents = this.getStudents();
    const targets = allStudents.filter(s => studentIds.includes(s.id));
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < targets.length; i++) {
      const student = targets[i];
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: targets.length,
          sentCount,
          failedCount,
          currentStudentName: student.name
        });
      }
      try {
        const res = await this.sendNotification({
          studentId: student.id,
          studentName: student.name,
          phone: student.phone,
          templateKey,
          customText: customTemplateText,
          mentorName,
          trigger: 'Bulk Mentor Campaign'
        });
        if (res.success) sentCount++;
        else failedCount++;
      } catch (e) {
        failedCount++;
      }
    }

    return { total: targets.length, sentCount, failedCount };
  }

  bulkImportStudents(records) {
    return this.bulkImportNumbers(records);
  }
}

export const WhatsAppNotificationService = new NotificationService();
export const whatsAppNotificationService = WhatsAppNotificationService;
export default WhatsAppNotificationService;

