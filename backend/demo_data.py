import random
from typing import List, Dict, Any
from backend.projection_engine import calculate_projection

# Default Institutional Attendance Policy
DEFAULT_POLICY = {
    "required_threshold": 75.0,
    "warning_threshold": 78.0,
    "critical_threshold": 70.0,
    "condonation_min_threshold": 65.0,
    "safety_buffer_classes": 2,
    "institution_name": "Apex Institute of Technology & Engineering",
    "academic_session": "Fall Semester 2026",
    "exam_start_date": "2026-11-20"
}

# Standard Subject catalogue
SUBJECTS_CATALOG = {
    "CSE": [
        {"code": "CS301", "name": "Design & Analysis of Algorithms", "short": "DAA", "faculty": "Prof. S. Sengupta", "total_planned": 42},
        {"code": "CS302", "name": "Database Engineering", "short": "DE", "faculty": "Dr. M. Iyer", "total_planned": 38},
        {"code": "CS303", "name": "Modern JavaScript & Web Architecture", "short": "JavaScript", "faculty": "Prof. T. Bose", "total_planned": 40},
        {"code": "CS304", "name": "Mathematical Analysis & Statistics", "short": "MAS", "faculty": "Dr. N. Roy", "total_planned": 36},
        {"code": "CS305", "name": "Computer Networks & Security", "short": "CN", "faculty": "Dr. V. K. Gupta", "total_planned": 40},
    ],
    "ECE": [
        {"code": "EC301", "name": "Digital Signal Processing", "short": "DSP", "faculty": "Dr. P. Deshmukh", "total_planned": 40},
        {"code": "EC302", "name": "VLSI Design & Architecture", "short": "VLSI", "faculty": "Prof. R. Menon", "total_planned": 38},
        {"code": "EC303", "name": "Embedded Microcontrollers", "short": "EMC", "faculty": "Dr. S. Nair", "total_planned": 36},
    ],
    "AIML": [
        {"code": "AI301", "name": "Deep Learning & Neural Networks", "short": "DLNN", "faculty": "Dr. K. Swaminathan", "total_planned": 42},
        {"code": "AI302", "name": "Natural Language Processing", "short": "NLP", "faculty": "Prof. J. Reddy", "total_planned": 38},
        {"code": "AI303", "name": "Computer Vision & Robotics", "short": "CV", "faculty": "Dr. A. Joseph", "total_planned": 40},
    ],
    "ME": [
        {"code": "ME301", "name": "Thermodynamics & Heat Transfer", "short": "TD", "faculty": "Dr. H. Patel", "total_planned": 40},
        {"code": "ME302", "name": "Fluid Mechanics", "short": "FM", "faculty": "Prof. C. Das", "total_planned": 38},
    ]
}

def generate_weekly_history(conducted: int, attended: int, weeks: int = 8) -> List[Dict[str, Any]]:
    """Generate realistic weekly trend data points for chart drawing."""
    history = []
    classes_per_week = max(1, conducted // weeks)
    rem_attended = attended
    rem_conducted = conducted
    
    for w in range(1, weeks + 1):
        if w == weeks:
            w_conducted = rem_conducted
            w_attended = rem_attended
        else:
            w_conducted = min(rem_conducted, classes_per_week)
            # Add subtle variance
            rate = attended / conducted if conducted > 0 else 0.75
            w_attended = min(w_conducted, max(0, round(w_conducted * (rate + random.uniform(-0.15, 0.15)))))
            rem_conducted -= w_conducted
            rem_attended -= w_attended
            
        cum_pct = round((w_attended / w_conducted) * 100, 1) if w_conducted > 0 else 75.0
        history.append({
            "week": f"W{w}",
            "week_label": f"Week {w}",
            "conducted": w_conducted,
            "attended": w_attended,
            "pct": cum_pct
        })
    return history

def build_student_record(
    student_id: str,
    name: str,
    email: str,
    department: str,
    semester: int,
    section: str,
    mentor_name: str,
    parent_name: str,
    parent_phone: str,
    target_overall_pct: float,
    trend_type: str = "stable", # "declining", "improving", "stable"
    avatar: str = ""
) -> Dict[str, Any]:
    subjects = SUBJECTS_CATALOG.get(department, SUBJECTS_CATALOG["CSE"])
    subject_records = []
    
    total_conducted = 0
    total_attended = 0
    total_remaining = 0
    
    for sub in subjects:
        conducted = round(sub["total_planned"] * 0.65) # currently ~65% through semester
        remaining = sub["total_planned"] - conducted
        
        # Adjust subject attendance around target
        if trend_type == "declining":
            # high in past, declining recently
            variation = random.uniform(-6, 2)
            sub_pct = max(55.0, min(95.0, target_overall_pct + variation))
            attended = round((sub_pct / 100.0) * conducted)
            # recent history shows absent streak (e.g. [0, 0, 1, 0, 0])
            recent_history = [0, 1, 0, 0, 0] if sub["short"] in ["DAA", "DE"] else [1, 0, 1, 1, 0]
        elif trend_type == "improving":
            variation = random.uniform(-3, 5)
            sub_pct = max(60.0, min(95.0, target_overall_pct + variation))
            attended = round((sub_pct / 100.0) * conducted)
            recent_history = [1, 1, 1, 0, 1]
        else: # stable
            variation = random.uniform(-4, 4)
            sub_pct = max(60.0, min(95.0, target_overall_pct + variation))
            attended = round((sub_pct / 100.0) * conducted)
            recent_history = [1, 1, 0, 1, 1]
            
        proj = calculate_projection(
            conducted=conducted,
            attended=attended,
            remaining=remaining,
            recent_history=recent_history,
            required_threshold=DEFAULT_POLICY["required_threshold"],
            warning_threshold=DEFAULT_POLICY["warning_threshold"]
        )
        
        weekly = generate_weekly_history(conducted, attended, weeks=8)
        
        subject_records.append({
            "code": sub["code"],
            "name": sub["name"],
            "short": sub["short"],
            "faculty": sub["faculty"],
            "conducted": conducted,
            "attended": attended,
            "remaining": remaining,
            "total_planned": sub["total_planned"],
            "current_pct": proj["current_pct"],
            "projected_pct": proj["projected_pct"],
            "trend": proj["trend"],
            "trend_label": proj["trend_label"],
            "risk_level": proj["risk_level"],
            "risk_color": proj["risk_color"],
            "classes_needed": proj["classes_needed_to_recover"],
            "is_recoverable": proj["is_recoverable"],
            "recovery_difficulty": proj["recovery_difficulty"],
            "recovery_label": proj["recovery_label"],
            "freedom_buffer": proj["freedom_buffer"],
            "weekly_trend": weekly
        })
        
        total_conducted += conducted
        total_attended += attended
        total_remaining += remaining
        
    # Aggregate student projection
    overall_current_pct = round((total_attended / total_conducted) * 100, 1)
    
    # Recent history across subjects for overall momentum
    if trend_type == "declining":
        overall_recent = [0, 1, 0, 0, 1, 0, 0, 1]
    elif trend_type == "improving":
        overall_recent = [1, 1, 1, 0, 1, 1, 1, 1]
    else:
        overall_recent = [1, 1, 0, 1, 1, 1, 0, 1]
        
    overall_proj = calculate_projection(
        conducted=total_conducted,
        attended=total_attended,
        remaining=total_remaining,
        recent_history=overall_recent,
        required_threshold=DEFAULT_POLICY["required_threshold"],
        warning_threshold=DEFAULT_POLICY["warning_threshold"]
    )
    
    # Sort subjects by priority for recovery
    risk_rank = {"CRITICAL": 1, "AT RISK": 2, "WATCH": 3, "SAFE": 4}
    recovery_priorities = sorted(
        [s for s in subject_records if s["risk_level"] in ["CRITICAL", "AT RISK", "WATCH"]],
        key=lambda x: (risk_rank.get(x["risk_level"], 5), -x["classes_needed"])
    )
    
    # Generate overall weekly series
    overall_weekly = []
    for w in range(1, 9):
        w_conducted = sum(s["weekly_trend"][w-1]["conducted"] for s in subject_records)
        w_attended = sum(s["weekly_trend"][w-1]["attended"] for s in subject_records)
        w_pct = round((w_attended / w_conducted) * 100, 1) if w_conducted > 0 else 75.0
        overall_weekly.append({
            "week": f"Week {w}",
            "conducted": w_conducted,
            "attended": w_attended,
            "pct": w_pct,
            "threshold": DEFAULT_POLICY["required_threshold"]
        })
        
    return {
        "id": student_id,
        "name": name,
        "email": email,
        "department": department,
        "semester": semester,
        "section": section,
        "mentor_name": mentor_name,
        "parent_name": parent_name,
        "parent_phone": parent_phone,
        "avatar": avatar or f"https://api.dicebear.com/7.x/notionists/svg?seed={name}",
        "attendance": {
            "current_pct": overall_proj["current_pct"],
            "projected_pct": overall_proj["projected_pct"],
            "max_possible_pct": overall_proj["max_possible_pct"],
            "conducted": total_conducted,
            "attended": total_attended,
            "remaining": total_remaining,
            "trend": overall_proj["trend"],
            "trend_label": overall_proj["trend_label"],
            "risk_level": overall_proj["risk_level"],
            "risk_color": overall_proj["risk_color"],
            "classes_needed": overall_proj["classes_needed_to_recover"],
            "is_recoverable": overall_proj["is_recoverable"],
            "recovery_difficulty": overall_proj["recovery_difficulty"],
            "recovery_label": overall_proj["recovery_label"],
            "freedom_buffer": overall_proj["freedom_buffer"],
            "shortage_warning": overall_proj["shortage_warning"],
            "explanation": overall_proj["explanation"],
            "weekly_trend": overall_weekly
        },
        "subjects": subject_records,
        "recovery_priorities": recovery_priorities
    }

# Build rich dataset with ~100 realistic students
STUDENTS_DATABASE: Dict[str, Dict[str, Any]] = {}

# Featured Demo Personas matching prompt specs
DEMO_STUDENTS_CONFIG = [
    # 1. Sameer Verma - Core Demo Student (At Risk, 74.2% -> Projected 72.8%)
    {
        "id": "CSE24-042",
        "name": "Sameer Verma",
        "email": "sameer.verma@apex.edu",
        "department": "CSE",
        "semester": 5,
        "section": "A",
        "mentor_name": "Dr. Radhika Sen",
        "parent_name": "Mr. R. Verma",
        "parent_phone": "+91 98112 43210",
        "target_pct": 74.2,
        "trend": "declining"
    },
    # 2. Ananya Rao - Demo Student for "Attendance Freedom Meter" (86.4% Safe Zone)
    {
        "id": "CSE24-018",
        "name": "Ananya Rao",
        "email": "ananya.rao@apex.edu",
        "department": "CSE",
        "semester": 5,
        "section": "A",
        "mentor_name": "Dr. Radhika Sen",
        "parent_name": "Mrs. Sunita Rao",
        "parent_phone": "+91 98450 12890",
        "target_pct": 86.4,
        "trend": "stable"
    },
    # 3. Rohan Mehta - Demo Student for "Critical Condonation Workflow"
    {
        "id": "CSE24-089",
        "name": "Rohan Mehta",
        "email": "rohan.mehta@apex.edu",
        "department": "CSE",
        "semester": 5,
        "section": "B",
        "mentor_name": "Dr. Radhika Sen",
        "parent_name": "Mr. Vikram Mehta",
        "parent_phone": "+91 97230 45892",
        "target_pct": 67.8,
        "trend": "declining"
    },
    # 4. Priya Sharma - Demo Student for Early Warning (78.5% but steep drop)
    {
        "id": "CSE24-031",
        "name": "Priya Sharma",
        "email": "priya.sharma@apex.edu",
        "department": "CSE",
        "semester": 5,
        "section": "A",
        "mentor_name": "Dr. Radhika Sen",
        "parent_name": "Dr. K. Sharma",
        "parent_phone": "+91 99100 87341",
        "target_pct": 78.5,
        "trend": "declining"
    },
    # 5. Kabir Khan - Recovered / Rising Star
    {
        "id": "CSE24-065",
        "name": "Kabir Khan",
        "email": "kabir.khan@apex.edu",
        "department": "CSE",
        "semester": 5,
        "section": "B",
        "mentor_name": "Dr. Radhika Sen",
        "parent_name": "Mr. Tariq Khan",
        "parent_phone": "+91 98210 76543",
        "target_pct": 75.8,
        "trend": "improving"
    }
]

# Populate Featured Students
for cfg in DEMO_STUDENTS_CONFIG:
    rec = build_student_record(
        student_id=cfg["id"],
        name=cfg["name"],
        email=cfg["email"],
        department=cfg["department"],
        semester=cfg["semester"],
        section=cfg["section"],
        mentor_name=cfg["mentor_name"],
        parent_name=cfg["parent_name"],
        parent_phone=cfg["parent_phone"],
        target_overall_pct=cfg["target_pct"],
        trend_type=cfg["trend"]
    )
    # Exact calibration for Sameer Verma as specified in user prompt
    if cfg["id"] == "CSE24-042":
        rec["attendance"]["current_pct"] = 74.2
        rec["attendance"]["projected_pct"] = 72.8
        rec["attendance"]["risk_level"] = "AT RISK"
        rec["attendance"]["risk_color"] = "orange"
        rec["attendance"]["classes_remaining"] = 24
        rec["attendance"]["classes_needed"] = 21
        rec["attendance"]["recovery_label"] = "Attend at least 21 of next 24 classes"
        rec["attendance"]["recovery_difficulty"] = "Hard"
        rec["attendance"]["freedom_buffer"] = 0
        rec["attendance"]["shortage_warning"] = "At your current trend, you may fall below 75% in approximately 3 weeks."
        
        # Calibrate subject cards to match prompt specification
        for sub in rec["subjects"]:
            if sub["short"] == "DAA":
                sub["current_pct"] = 68.0
                sub["projected_pct"] = 65.4
                sub["risk_level"] = "CRITICAL"
                sub["risk_color"] = "red"
                sub["classes_needed"] = 8
                sub["recovery_label"] = "Attend next 8/8 classes"
                sub["recovery_difficulty"] = "Very Hard"
            elif sub["short"] == "DE":
                sub["current_pct"] = 72.0
                sub["projected_pct"] = 70.8
                sub["risk_level"] = "AT RISK"
                sub["risk_color"] = "orange"
                sub["classes_needed"] = 6
                sub["recovery_label"] = "Attend next 6/7 classes"
                sub["recovery_difficulty"] = "Hard"
            elif sub["short"] == "JavaScript":
                sub["current_pct"] = 81.0
                sub["projected_pct"] = 82.5
                sub["risk_level"] = "SAFE"
                sub["risk_color"] = "green"
                sub["classes_needed"] = 0
                sub["recovery_label"] = "Maintain current attendance"
                sub["recovery_difficulty"] = "Already Safe"
            elif sub["short"] == "MAS":
                sub["current_pct"] = 79.0
                sub["projected_pct"] = 78.4
                sub["risk_level"] = "SAFE"
                sub["risk_color"] = "green"
                sub["classes_needed"] = 0
                sub["recovery_label"] = "Maintain current attendance"
                sub["recovery_difficulty"] = "Already Safe"
        
        # Re-sort recovery priorities
        rec["recovery_priorities"] = [s for s in rec["subjects"] if s["risk_level"] in ["CRITICAL", "AT RISK"]]
        
    elif cfg["id"] == "CSE24-018": # Ananya Rao (Freedom Meter)
        rec["attendance"]["current_pct"] = 86.4
        rec["attendance"]["projected_pct"] = 85.0
        rec["attendance"]["risk_level"] = "SAFE"
        rec["attendance"]["risk_color"] = "green"
        rec["attendance"]["freedom_buffer"] = 4
        rec["attendance"]["classes_needed"] = 0
        rec["attendance"]["recovery_label"] = "Safe Zone"
        rec["attendance"]["recovery_difficulty"] = "Already Safe"
        rec["attendance"]["shortage_warning"] = "Attendance trajectory is healthy with generous buffer."
        
    STUDENTS_DATABASE[cfg["id"]] = rec

# Generate 95+ realistic cohort students across CSE, ECE, AIML, ME
random.seed(42)
FIRST_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Shaurya", "Atharva", "Advik", "Pranav", "Advaith", "Aarush", "Dhruv", "Rishabh", "Tanmay", "Ayush",
    "Diya", "Saanvi", "Aanya", "Aadhya", "Pari", "Ananya", "Myra", "Isha", "Riya", "Avani", "Navya",
    "Khushi", "Sneha", "Tanvi", "Pooja", "Meera", "Swati", "Nandini", "Kavya", "Bhavna", "Ritu", "Gauri"
]
LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Gupta", "Singh", "Kumar", "Iyer", "Nair", "Reddy", "Rao",
    "Chopra", "Joshi", "Bhat", "Deshmukh", "Choudhury", "Bose", "Menon", "Saxena", "Kapoor", "Banerjee"
]

DEPARTMENTS = ["CSE", "ECE", "AIML", "ME"]
DEP_MENTORS = {
    "CSE": "Dr. Radhika Sen",
    "ECE": "Prof. K. Nair",
    "AIML": "Dr. K. Swaminathan",
    "ME": "Dr. H. Patel"
}

cohort_idx = 1
for dep in DEPARTMENTS:
    count = 35 if dep == "CSE" else 22
    for _ in range(count):
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        fullname = f"{fname} {lname}"
        roll = f"{dep}24-{str(cohort_idx).zfill(3)}"
        cohort_idx += 1
        
        # Distribution of attendance: ~65% safe, ~18% watch, ~11% at risk, ~6% critical
        rand_val = random.random()
        if rand_val < 0.08:
            target_pct = random.uniform(58.0, 68.0)
            trend = "declining"
        elif rand_val < 0.22:
            target_pct = random.uniform(70.0, 74.5)
            trend = random.choice(["declining", "stable"])
        elif rand_val < 0.40:
            target_pct = random.uniform(75.0, 78.5)
            trend = random.choice(["declining", "improving", "stable"])
        else:
            target_pct = random.uniform(79.0, 93.0)
            trend = random.choice(["stable", "improving"])
            
        std_rec = build_student_record(
            student_id=roll,
            name=fullname,
            email=f"{fname.lower()}.{lname.lower()}@apex.edu",
            department=dep,
            semester=5,
            section="A" if random.random() > 0.5 else "B",
            mentor_name=DEP_MENTORS[dep],
            parent_name=f"Mr. {lname}",
            parent_phone=f"+91 {random.randint(90000, 99999)} {random.randint(10000, 99999)}",
            target_overall_pct=round(target_pct, 1),
            trend_type=trend
        )
        STUDENTS_DATABASE[roll] = std_rec

# Pre-seeded Condonation Applications with Realistic Multi-stage Workflow
CONDONATION_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "CND-2026-089",
        "student_id": "CSE24-089",
        "student_name": "Rohan Mehta",
        "department": "CSE",
        "semester": 5,
        "current_pct": 67.8,
        "shortage_pct": 7.2,
        "reason_category": "Medical",
        "reason_title": "Severe Fractured Right Wrist & Hospitalization",
        "explanation": "Suffered fracture during university sports trials on Oct 4. Hospitalized at Apollo Hospital for 12 days. Medical cast advised for 3 weeks.",
        "documents": [
            {"filename": "Apollo_Discharge_Summary_Oct2026.pdf", "size": "1.4 MB", "type": "Medical Record", "verified": True},
            {"filename": "Orthopedic_Fitness_Certificate.pdf", "size": "820 KB", "type": "Doctor Certificate", "verified": True}
        ],
        "created_at": "2026-10-08T09:30:00Z",
        "status": "HOD_REVIEW", # SUBMITTED -> MENTOR_APPROVED -> HOD_REVIEW -> EXAM_CELL_REVIEW -> APPROVED
        "timeline": [
            {
                "step": "Submission",
                "status": "COMPLETED",
                "actor": "Rohan Mehta (Student)",
                "date": "2026-10-08 09:30 AM",
                "notes": "Application and genuine medical proofs submitted via portal."
            },
            {
                "step": "Mentor Review",
                "status": "COMPLETED",
                "actor": "Dr. Radhika Sen (Mentor)",
                "date": "2026-10-09 11:15 AM",
                "notes": "Verified genuine hospital admission with parents. Strongly recommended for 7% condonation waiver."
            },
            {
                "step": "HOD Review",
                "status": "IN_PROGRESS",
                "actor": "Dr. A. K. Sharma (HOD CSE)",
                "date": "Pending Review",
                "notes": "Under departmental verification."
            },
            {
                "step": "Exam Cell",
                "status": "PENDING",
                "actor": "Dr. V. Raman (Controller of Exams)",
                "date": "Awaiting HOD signoff",
                "notes": "Will issue final hall ticket eligibility."
            }
        ],
        "readiness_check": {
            "reason_provided": True,
            "document_uploaded": True,
            "attendance_verified": True,
            "shortage_within_limit": True, # shortage 7.2% is within 10% medical relaxation window
            "status": "VERIFIED_READY"
        }
    },
    {
        "id": "CND-2026-042",
        "student_id": "CSE24-042",
        "student_name": "Sameer Verma",
        "department": "CSE",
        "semester": 5,
        "current_pct": 74.2,
        "shortage_pct": 0.8,
        "reason_category": "Academic Representation",
        "reason_title": "IEEE Smart Mobility National Hackathon Participation",
        "explanation": "Represented Apex Institute at the IEEE National Hackathon finals in Bengaluru with official institutional approval letter.",
        "documents": [
            {"filename": "IEEE_Official_Invitation_Letter.pdf", "size": "650 KB", "type": "Event Letter", "verified": True},
            {"filename": "Faculty_Advisor_OD_Slip.pdf", "size": "420 KB", "type": "OD Approval", "verified": True}
        ],
        "created_at": "2026-10-10T14:15:00Z",
        "status": "MENTOR_APPROVED",
        "timeline": [
            {
                "step": "Submission",
                "status": "COMPLETED",
                "actor": "Sameer Verma (Student)",
                "date": "2026-10-10 02:15 PM",
                "notes": "On-Duty (OD) condonation request submitted with travel proof."
            },
            {
                "step": "Mentor Review",
                "status": "COMPLETED",
                "actor": "Dr. Radhika Sen (Mentor)",
                "date": "2026-10-11 10:00 AM",
                "notes": "Represented institute with prior dean permission. Approved."
            },
            {
                "step": "HOD Review",
                "status": "IN_PROGRESS",
                "actor": "Dr. A. K. Sharma (HOD CSE)",
                "date": "Pending Review",
                "notes": "Forwarded with recommendation."
            },
            {
                "step": "Exam Cell",
                "status": "PENDING",
                "actor": "Dr. V. Raman (Exam Cell)",
                "date": "Queued",
                "notes": "Subject to HOD clearance."
            }
        ],
        "readiness_check": {
            "reason_provided": True,
            "document_uploaded": True,
            "attendance_verified": True,
            "shortage_within_limit": True,
            "status": "VERIFIED_READY"
        }
    }
]

# Notifications Stream
NOTIFICATIONS_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "notif-1",
        "category": "Early Warning",
        "title": "Attendance Shortage Risk Detected",
        "message": "At your current trend, you may fall below 75% in approximately 3 weeks. DAA and DE need immediate focus.",
        "timestamp": "10 minutes ago",
        "unread": True,
        "action_link": "/risk-recovery",
        "student_id": "CSE24-042",
        "severity": "orange"
    },
    {
        "id": "notif-2",
        "category": "Recovery",
        "title": "Recovery Plan Generated",
        "message": "Personalized target: Attend next 8 DAA classes and 6 DE classes to stabilize before November 15.",
        "timestamp": "2 hours ago",
        "unread": True,
        "action_link": "/risk-recovery",
        "student_id": "CSE24-042",
        "severity": "blue"
    },
    {
        "id": "notif-3",
        "category": "Condonation",
        "title": "Condonation Application Update",
        "message": "Dr. Radhika Sen (Mentor) approved your On-Duty Condonation application (#CND-2026-042). Next step: HOD signoff.",
        "timestamp": "Yesterday",
        "unread": False,
        "action_link": "/condonation",
        "student_id": "CSE24-042",
        "severity": "green"
    },
    {
        "id": "notif-4",
        "category": "Exam Eligibility",
        "title": "Semester Examination Roster Update",
        "message": "Exam Cell provisional eligibility audit scheduled for 18 Nov. Maintain attendance buffer.",
        "timestamp": "2 days ago",
        "unread": False,
        "action_link": "/dashboard",
        "student_id": "CSE24-042",
        "severity": "gray"
    }
]
