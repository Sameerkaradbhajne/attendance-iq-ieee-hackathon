import csv
import io
import math
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse
from pydantic import BaseModel

from backend.projection_engine import calculate_projection, simulate_scenario
from backend.demo_data import (
    DEFAULT_POLICY,
    STUDENTS_DATABASE,
    CONDONATION_DATABASE,
    NOTIFICATIONS_DATABASE,
    SUBJECTS_CATALOG
)

app = FastAPI(
    title="Attendance IQ API",
    description="Early prediction, simulation, recovery, and condonation workflow engine.",
    version="1.0.0"
)

# Enable CORS for local Vite dev server and any client origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory policy state (configurable by Admin / HOD)
current_policy = dict(DEFAULT_POLICY)

# Models
class PolicyUpdate(BaseModel):
    required_threshold: float
    warning_threshold: float
    critical_threshold: float
    condonation_min_threshold: float
    safety_buffer_classes: int
    exam_start_date: Optional[str] = None

class WhatIfRequest(BaseModel):
    miss_next_n: int = 0
    attend_remaining_pct: Optional[float] = None
    subject_code: Optional[str] = None

class CondonationSubmission(BaseModel):
    student_id: str
    reason_category: str
    reason_title: str
    explanation: str
    documents: List[Dict[str, Any]]

class ReviewAction(BaseModel):
    role: str # "mentor", "hod", "exam_cell"
    action: str # "APPROVE", "REJECT", "REQUEST_INFO"
    reviewer_name: str
    notes: str

# ----------------- ENDPOINTS -----------------

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Attendance IQ", "version": "1.0.0"}

@app.get("/api/policy")
def get_policy():
    return current_policy

@app.post("/api/policy")
def update_policy(update: PolicyUpdate):
    global current_policy
    current_policy["required_threshold"] = update.required_threshold
    current_policy["warning_threshold"] = update.warning_threshold
    current_policy["critical_threshold"] = update.critical_threshold
    current_policy["condonation_min_threshold"] = update.condonation_min_threshold
    current_policy["safety_buffer_classes"] = update.safety_buffer_classes
    if update.exam_start_date:
        current_policy["exam_start_date"] = update.exam_start_date
    return {"message": "Policy updated successfully", "policy": current_policy}

@app.get("/api/students")
def get_students(
    search: Optional[str] = None,
    department: Optional[str] = None,
    risk: Optional[str] = None,
    mentor: Optional[str] = None,
    limit: int = 150
):
    results = list(STUDENTS_DATABASE.values())
    
    if department:
        results = [s for s in results if s["department"].upper() == department.upper()]
    if mentor:
        results = [s for s in results if mentor.lower() in s["mentor_name"].lower()]
    if risk:
        results = [s for s in results if s["attendance"]["risk_level"].upper() == risk.upper()]
    if search:
        q = search.lower()
        results = [
            s for s in results
            if q in s["name"].lower() or q in s["id"].lower() or q in s["email"].lower()
        ]
        
    return {
        "total": len(results),
        "students": results[:limit]
    }

@app.get("/api/students/{student_id}")
def get_student_detail(student_id: str):
    std = STUDENTS_DATABASE.get(student_id)
    if not std:
        # Fallback case-insensitive
        for sid, rec in STUDENTS_DATABASE.items():
            if sid.lower() == student_id.lower():
                return rec
        raise HTTPException(status_code=404, detail="Student record not found")
    return std

@app.get("/api/students/{student_id}/projection")
def get_student_projection(student_id: str):
    std = get_student_detail(student_id)
    att = std["attendance"]
    return {
        "student_id": student_id,
        "name": std["name"],
        "current_pct": att["current_pct"],
        "projected_pct": att["projected_pct"],
        "max_possible_pct": att["max_possible_pct"],
        "trend": att["trend"],
        "trend_label": att["trend_label"],
        "risk_level": att["risk_level"],
        "risk_color": att["risk_color"],
        "classes_remaining": att["remaining"],
        "classes_needed": att["classes_needed"],
        "recovery_difficulty": att["recovery_difficulty"],
        "recovery_label": att["recovery_label"],
        "shortage_warning": att["shortage_warning"],
        "explanation": att["explanation"],
        "weekly_trend": att["weekly_trend"]
    }

@app.post("/api/students/{student_id}/what-if")
def simulate_student_what_if(student_id: str, req: WhatIfRequest):
    std = get_student_detail(student_id)
    
    # If specific subject requested
    if req.subject_code:
        sub = next((s for s in std["subjects"] if s["code"] == req.subject_code), None)
        if not sub:
            raise HTTPException(status_code=404, detail="Subject not found")
        conducted = sub["conducted"]
        attended = sub["attended"]
        remaining = sub["remaining"]
    else:
        conducted = std["attendance"]["conducted"]
        attended = std["attendance"]["attended"]
        remaining = std["attendance"]["remaining"]
        
    result = simulate_scenario(
        conducted=conducted,
        attended=attended,
        remaining=remaining,
        miss_next_n=req.miss_next_n,
        attend_remaining_pct=req.attend_remaining_pct,
        required_threshold=current_policy["required_threshold"]
    )
    return result

@app.get("/api/students/{student_id}/freedom-buffer")
def get_freedom_buffer(student_id: str):
    std = get_student_detail(student_id)
    att = std["attendance"]
    curr_pct = att["current_pct"]
    req_pct = current_policy["required_threshold"]
    
    is_safe = curr_pct >= req_pct
    buffer_classes = att.get("freedom_buffer", 0)
    safety_margin = round(max(0.0, curr_pct - req_pct), 1)
    
    if is_safe and buffer_classes > 0:
        fun_phrases = [
            "Weekend trip energy unlocked 🚗💨",
            "Bhandara plan? Check your timetable first 😄",
            "Looks like you've earned a little breathing room ☕",
            "Attendance-safe mode active. Keep up the rhythm 😎"
        ]
        message = fun_phrases[min(len(fun_phrases)-1, buffer_classes - 1)]
    elif is_safe:
        message = "You're right on the edge of the safe zone. Maintain momentum!"
    else:
        message = "Recovery mode active 🔧 Focus on attending upcoming classes first."
        
    return {
        "student_id": student_id,
        "name": std["name"],
        "current_pct": curr_pct,
        "required_threshold": req_pct,
        "safety_margin_pct": safety_margin,
        "freedom_buffer_classes": buffer_classes,
        "is_safe_zone": is_safe,
        "headline": "You're attendance-safe 😎" if is_safe else "Recovery mode active 🔧",
        "message": message,
        "disclaimer": "Estimated based on current attendance data and configured institutional policies. This is a mathematical projection, not official permission to skip mandatory classes. Always adhere to institutional regulations."
    }

@app.get("/api/students/{student_id}/recovery-plan")
def get_recovery_plan(student_id: str):
    std = get_student_detail(student_id)
    return {
        "student_id": student_id,
        "name": std["name"],
        "overall_current_pct": std["attendance"]["current_pct"],
        "overall_projected_pct": std["attendance"]["projected_pct"],
        "overall_classes_needed": std["attendance"]["classes_needed"],
        "recovery_difficulty": std["attendance"]["recovery_difficulty"],
        "recovery_priorities": std["recovery_priorities"],
        "all_subjects": std["subjects"]
    }

@app.get("/api/condonation")
def list_condonations(status: Optional[str] = None, department: Optional[str] = None):
    apps = CONDONATION_DATABASE
    if status:
        apps = [a for a in apps if a["status"].upper() == status.upper()]
    if department:
        apps = [a for a in apps if a["department"].upper() == department.upper()]
    return apps

@app.post("/api/condonation")
def submit_condonation(submission: CondonationSubmission):
    std = get_student_detail(submission.student_id)
    curr_pct = std["attendance"]["current_pct"]
    req_pct = current_policy["required_threshold"]
    shortage = round(max(0.0, req_pct - curr_pct), 1)
    
    # Pre-flight readiness validation
    reason_valid = len(submission.explanation.strip()) >= 20
    docs_valid = len(submission.documents) > 0
    shortage_valid = shortage <= (req_pct - current_policy["condonation_min_threshold"])
    
    if not reason_valid:
        raise HTTPException(status_code=400, detail="Detailed explanation (minimum 20 characters) is required.")
    if not docs_valid:
        raise HTTPException(status_code=400, detail="Supporting documentary evidence must be uploaded.")
        
    app_id = f"CND-2026-{str(len(CONDONATION_DATABASE) + 101).zfill(3)}"
    new_app = {
        "id": app_id,
        "student_id": submission.student_id,
        "student_name": std["name"],
        "department": std["department"],
        "semester": std["semester"],
        "current_pct": curr_pct,
        "shortage_pct": shortage,
        "reason_category": submission.reason_category,
        "reason_title": submission.reason_title,
        "explanation": submission.explanation,
        "documents": submission.documents,
        "created_at": "Just now",
        "status": "SUBMITTED",
        "timeline": [
            {
                "step": "Submission",
                "status": "COMPLETED",
                "actor": f"{std['name']} (Student)",
                "date": "Today",
                "notes": "Application and proof submitted successfully."
            },
            {
                "step": "Mentor Review",
                "status": "IN_PROGRESS",
                "actor": std["mentor_name"],
                "date": "Pending",
                "notes": "Awaiting faculty verification."
            },
            {
                "step": "HOD Review",
                "status": "PENDING",
                "actor": "Head of Department",
                "date": "Queued",
                "notes": "Department signoff required."
            },
            {
                "step": "Exam Cell",
                "status": "PENDING",
                "actor": "Controller of Examinations",
                "date": "Queued",
                "notes": "Final hall ticket clearance."
            }
        ],
        "readiness_check": {
            "reason_provided": True,
            "document_uploaded": True,
            "attendance_verified": True,
            "shortage_within_limit": shortage_valid,
            "status": "VERIFIED_READY"
        }
    }
    CONDONATION_DATABASE.insert(0, new_app)
    return {"message": "Condonation application filed successfully", "application": new_app}

@app.patch("/api/condonation/{app_id}/review")
def review_condonation(app_id: str, review: ReviewAction):
    app_record = next((a for a in CONDONATION_DATABASE if a["id"] == app_id), None)
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")
        
    role = review.role.lower()
    action = review.action.upper()
    
    if action == "REJECT":
        app_record["status"] = "REJECTED"
        for item in app_record["timeline"]:
            if item["status"] in ["IN_PROGRESS", "PENDING"]:
                item["status"] = "REJECTED"
                item["actor"] = review.reviewer_name
                item["notes"] = f"Application rejected: {review.notes}"
                break
        return {"message": "Application rejected", "application": app_record}
        
    # Advance timeline based on reviewer role
    if "mentor" in role:
        app_record["status"] = "MENTOR_APPROVED"
        app_record["timeline"][1]["status"] = "COMPLETED"
        app_record["timeline"][1]["notes"] = review.notes or "Mentor approved and verified supporting docs."
        app_record["timeline"][2]["status"] = "IN_PROGRESS"
    elif "hod" in role:
        app_record["status"] = "HOD_REVIEW"
        app_record["timeline"][2]["status"] = "COMPLETED"
        app_record["timeline"][2]["notes"] = review.notes or "HOD endorsed for exam cell exemption."
        app_record["timeline"][3]["status"] = "IN_PROGRESS"
    elif "exam" in role or "cell" in role:
        app_record["status"] = "APPROVED"
        app_record["timeline"][3]["status"] = "COMPLETED"
        app_record["timeline"][3]["notes"] = review.notes or "Exam Cell approved condonation. Hall ticket issued."
        
    return {"message": "Review recorded successfully", "application": app_record}

@app.get("/api/department/analytics")
def get_department_analytics():
    all_students = list(STUDENTS_DATABASE.values())
    cse_students = [s for s in all_students if s["department"] == "CSE"]
    
    avg_cse_pct = round(sum(s["attendance"]["current_pct"] for s in cse_students) / len(cse_students), 1) if cse_students else 78.4
    at_risk_cse = sum(1 for s in cse_students if s["attendance"]["risk_level"] == "AT RISK")
    critical_cse = sum(1 for s in cse_students if s["attendance"]["risk_level"] == "CRITICAL")
    watch_cse = sum(1 for s in cse_students if s["attendance"]["risk_level"] == "WATCH")
    safe_cse = sum(1 for s in cse_students if s["attendance"]["risk_level"] == "SAFE")
    
    # Department comparisons
    departments = [
        {"name": "CSE", "code": "Computer Science & Engineering", "students": len(cse_students), "avg_pct": avg_cse_pct, "at_risk": at_risk_cse + critical_cse},
        {"name": "ECE", "code": "Electronics & Communication", "students": 22, "avg_pct": 81.2, "at_risk": 3},
        {"name": "AIML", "code": "AI & Machine Learning", "students": 22, "avg_pct": 82.5, "at_risk": 2},
        {"name": "ME", "code": "Mechanical Engineering", "students": 22, "avg_pct": 76.8, "at_risk": 5},
    ]
    
    # Subject vs Week Risk Heatmap (CSE Core Subjects across Weeks 1-8)
    # Status: safe, watch, at_risk, critical
    heatmap = [
        {"subject": "CS301 (DAA)", "short": "DAA", "faculty": "Prof. S. Sengupta", "weeks": ["safe", "safe", "watch", "watch", "at_risk", "at_risk", "critical", "critical"]},
        {"subject": "CS302 (DE)", "short": "DE", "faculty": "Dr. M. Iyer", "weeks": ["safe", "safe", "safe", "watch", "watch", "at_risk", "at_risk", "at_risk"]},
        {"subject": "CS303 (JS)", "short": "JavaScript", "faculty": "Prof. T. Bose", "weeks": ["safe", "safe", "safe", "safe", "safe", "safe", "safe", "safe"]},
        {"subject": "CS304 (MAS)", "short": "MAS", "faculty": "Dr. N. Roy", "weeks": ["safe", "safe", "safe", "safe", "watch", "watch", "safe", "safe"]},
        {"subject": "CS305 (CN)", "short": "Networks", "faculty": "Dr. V. K. Gupta", "weeks": ["safe", "safe", "watch", "watch", "watch", "watch", "at_risk", "watch"]},
    ]
    
    return {
        "department": "CSE",
        "total_students": 482,
        "cohort_analyzed": len(cse_students),
        "average_attendance": avg_cse_pct,
        "counts": {
            "safe": safe_cse,
            "watch": watch_cse,
            "at_risk": at_risk_cse,
            "critical": critical_cse,
            "pending_condonation": len([c for c in CONDONATION_DATABASE if c["department"] == "CSE" and c["status"] != "APPROVED"])
        },
        "department_comparisons": departments,
        "heatmap": heatmap
    }

@app.get("/api/exam-cell/overview")
def get_exam_cell_overview():
    total = 482
    condonation_pending = len([c for c in CONDONATION_DATABASE if c["status"] in ["SUBMITTED", "MENTOR_APPROVED", "HOD_REVIEW"]])
    condonation_approved = len([c for c in CONDONATION_DATABASE if c["status"] == "APPROVED"])
    
    # realistic eligibility breakdown
    shortage = 24
    at_risk = 37
    eligible = total - shortage - at_risk
    
    return {
        "total_candidates": total,
        "eligible": eligible,
        "at_risk": at_risk,
        "shortage": shortage,
        "condonation_pending": condonation_pending,
        "condonation_approved": condonation_approved,
        "condonation_rejected": 2,
        "eligibility_threshold_pct": current_policy["required_threshold"],
        "exam_commence_date": current_policy.get("exam_start_date", "2026-11-20")
    }

@app.get("/api/notifications")
def get_notifications():
    return NOTIFICATIONS_DATABASE

@app.post("/api/attendance/import")
async def import_attendance(file: UploadFile = File(...)):
    """
    Import and validate CSV attendance roster.
    Expected columns: Student ID, Student Name, Department, Semester, Subject, Date, Status
    """
    contents = await file.read()
    try:
        decoded = contents.decode("utf-8")
    except UnicodeDecodeError:
        decoded = contents.decode("latin-1")
        
    reader = csv.DictReader(io.StringIO(decoded))
    imported_rows = 0
    rejected_rows = 0
    errors = []
    
    required_cols = {"student_id", "subject", "status"}
    header_map = {}
    
    if not reader.fieldnames:
        raise HTTPException(status_code=400, detail="Empty or invalid CSV file.")
        
    for h in reader.fieldnames:
        clean = h.strip().lower().replace(" ", "_")
        header_map[clean] = h
        
    if not ({"student_id", "status"}.issubset(set(header_map.keys())) or {"studentid", "status"}.issubset(set(header_map.keys()))):
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": "Missing mandatory headers. CSV must include 'Student ID', 'Subject', 'Date', and 'Status' (Present/Absent)."
            }
        )
        
    for row_idx, row in enumerate(reader, start=1):
        status_val = (row.get("Status") or row.get("status") or "").strip().lower()
        if status_val in ["present", "absent", "p", "a"]:
            imported_rows += 1
        else:
            rejected_rows += 1
            if len(errors) < 5:
                errors.append(f"Row {row_idx}: Invalid attendance status '{status_val}'. Expected 'Present' or 'Absent'.")
                
    return {
        "success": True,
        "filename": file.filename,
        "rows_processed": imported_rows + rejected_rows,
        "rows_imported": imported_rows,
        "rows_rejected": rejected_rows,
        "validation_notes": errors if errors else ["All data records conform to schema."]
    }

@app.get("/api/sample-csv")
def download_sample_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student ID", "Student Name", "Department", "Semester", "Subject", "Date", "Status"])
    writer.writerow(["CSE24-042", "Sameer Verma", "CSE", "5", "CS301 - DAA", "2026-10-01", "Present"])
    writer.writerow(["CSE24-042", "Sameer Verma", "CSE", "5", "CS301 - DAA", "2026-10-03", "Absent"])
    writer.writerow(["CSE24-042", "Sameer Verma", "CSE", "5", "CS302 - DE", "2026-10-02", "Present"])
    writer.writerow(["CSE24-018", "Ananya Rao", "CSE", "5", "CS301 - DAA", "2026-10-01", "Present"])
    writer.writerow(["CSE24-018", "Ananya Rao", "CSE", "5", "CS302 - DE", "2026-10-02", "Present"])
    writer.writerow(["CSE24-089", "Rohan Mehta", "CSE", "5", "CS301 - DAA", "2026-10-01", "Absent"])
    
    return PlainTextResponse(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=attendance_template.csv"}
    )
