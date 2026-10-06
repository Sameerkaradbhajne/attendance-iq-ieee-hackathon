import math
from typing import List, Dict, Any, Optional

def calculate_projection(
    conducted: int,
    attended: int,
    remaining: int,
    recent_history: List[int], # 1 for present, 0 for absent in recent sessions
    required_threshold: float = 75.0,
    warning_threshold: float = 78.0
) -> Dict[str, Any]:
    """
    Explainable projection engine combining cumulative attendance and recent trend momentum.
    """
    current_pct = round((attended / conducted) * 100, 1) if conducted > 0 else 0.0
    
    # Calculate recent trend rate (last 4 to 8 sessions)
    if recent_history:
        recent_attended = sum(recent_history)
        recent_conducted = len(recent_history)
        recent_rate = recent_attended / recent_conducted
    else:
        recent_rate = attended / conducted if conducted > 0 else 0.75
        
    # Projected future attended based on recent rate
    # Blended expected rate: 70% recent momentum + 30% baseline cumulative rate
    baseline_rate = attended / conducted if conducted > 0 else 0.75
    blended_future_rate = (0.70 * recent_rate) + (0.30 * baseline_rate)
    
    expected_future_attended = round(blended_future_rate * remaining)
    total_projected_attended = attended + expected_future_attended
    total_semester_classes = conducted + remaining
    
    projected_pct = round((total_projected_attended / total_semester_classes) * 100, 1) if total_semester_classes > 0 else 0.0
    
    # Trend classification
    trend_delta = round(projected_pct - current_pct, 1)
    if trend_delta > 0.5:
        trend = "improving"
        trend_label = "Improving ↗"
    elif trend_delta < -0.5:
        trend = "declining"
        trend_label = "Declining ↘"
    else:
        trend = "stable"
        trend_label = "Stable →"
        
    # Risk categorization (trend-sensitive)
    # Even if current is 76%, if projected is 72%, it's AT RISK!
    if projected_pct < required_threshold:
        if current_pct < (required_threshold - 5.0) or projected_pct < (required_threshold - 4.0):
            risk_level = "CRITICAL"
            risk_color = "red"
        else:
            risk_level = "AT RISK"
            risk_color = "orange"
    elif projected_pct < warning_threshold or (trend == "declining" and current_pct < (warning_threshold + 2)):
        risk_level = "WATCH"
        risk_color = "yellow"
    else:
        risk_level = "SAFE"
        risk_color = "green"

    # Calculate recovery requirements:
    # Need: (attended + x) / (conducted + remaining) >= required_threshold / 100
    # attended + x >= (required_threshold / 100) * total_classes
    # x >= (required_threshold / 100) * total_classes - attended
    target_attended_needed = math.ceil((required_threshold / 100.0) * total_semester_classes)
    classes_needed_to_recover = max(0, target_attended_needed - attended)
    
    is_recoverable = classes_needed_to_recover <= remaining
    max_possible_pct = round(((attended + remaining) / total_semester_classes) * 100, 1) if total_semester_classes > 0 else 0.0
    
    # Recovery difficulty
    if not is_recoverable:
        recovery_difficulty = "Not Recoverable"
        recovery_label = "Condonation Required"
    elif classes_needed_to_recover == 0:
        recovery_difficulty = "Already Safe"
        recovery_label = "Safe Zone"
    else:
        effort_ratio = classes_needed_to_recover / remaining
        if effort_ratio <= 0.60:
            recovery_difficulty = "Easy"
            recovery_label = f"Attend {classes_needed_to_recover} of next {remaining}"
        elif effort_ratio <= 0.80:
            recovery_difficulty = "Moderate"
            recovery_label = f"Attend {classes_needed_to_recover} of next {remaining}"
        elif effort_ratio <= 0.95:
            recovery_difficulty = "Hard"
            recovery_label = f"Attend {classes_needed_to_recover} of next {remaining}"
        else:
            recovery_difficulty = "Very Hard"
            recovery_label = f"Attend {classes_needed_to_recover} of next {remaining} (Strict)"
            
    # Freedom Buffer calculation (how many classes can be safely missed)
    # (attended + remaining - k) / total_classes >= required_threshold / 100
    # remaining - k >= target_attended_needed - attended
    # k <= remaining - (target_attended_needed - attended)
    if is_recoverable and current_pct >= required_threshold:
        max_allowed_absences = max(0, remaining - classes_needed_to_recover)
        # Cap by realistic window
        freedom_buffer = min(max_allowed_absences, math.floor(((current_pct - required_threshold) / 100.0) * total_semester_classes))
        freedom_buffer = max(0, freedom_buffer)
    else:
        freedom_buffer = 0

    # Shortage projection estimate
    if trend == "declining" and projected_pct < required_threshold:
        # Approximate weeks until shortage
        pct_drop_per_week = max(0.5, abs(recent_rate - baseline_rate) * 10)
        gap = max(0.1, current_pct - required_threshold)
        weeks_to_shortage = max(1, round(gap / pct_drop_per_week))
        shortage_warning = f"At your current trend, you may fall below {required_threshold}% in approximately {weeks_to_shortage} weeks."
    elif current_pct < required_threshold:
        shortage_warning = f"Current attendance is below the {required_threshold}% mandatory requirement."
    else:
        shortage_warning = "Attendance trajectory is within institutional safety parameters."

    return {
        "current_pct": current_pct,
        "projected_pct": projected_pct,
        "max_possible_pct": max_possible_pct,
        "trend": trend,
        "trend_label": trend_label,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "classes_conducted": conducted,
        "classes_attended": attended,
        "classes_remaining": remaining,
        "total_classes": total_semester_classes,
        "classes_needed_to_recover": classes_needed_to_recover,
        "is_recoverable": is_recoverable,
        "recovery_difficulty": recovery_difficulty,
        "recovery_label": recovery_label,
        "freedom_buffer": freedom_buffer,
        "shortage_warning": shortage_warning,
        "explanation": {
            "recent_rate_pct": round(recent_rate * 100, 1),
            "baseline_rate_pct": round(baseline_rate * 100, 1),
            "expected_future_attended": expected_future_attended,
            "required_threshold": required_threshold
        }
    }

def simulate_scenario(
    conducted: int,
    attended: int,
    remaining: int,
    miss_next_n: int = 0,
    attend_remaining_pct: Optional[float] = None,
    required_threshold: float = 75.0
) -> Dict[str, Any]:
    """
    Simulate what happens if student misses next N classes or attends X% of remaining.
    """
    total_classes = conducted + remaining
    
    # Scenario: miss next N classes
    miss_n = min(remaining, max(0, miss_next_n))
    classes_left_after_miss = remaining - miss_n
    
    if attend_remaining_pct is not None:
        attend_rate = max(0.0, min(1.0, attend_remaining_pct / 100.0))
        future_attended = round(attend_rate * classes_left_after_miss)
    else:
        # Default assumption: attends at historical rate for the rest
        hist_rate = attended / conducted if conducted > 0 else 0.75
        future_attended = round(hist_rate * classes_left_after_miss)
        
    sim_attended = attended + future_attended
    sim_projected_pct = round((sim_attended / total_classes) * 100, 1)
    
    # Delta from current
    current_pct = round((attended / conducted) * 100, 1) if conducted > 0 else 0.0
    delta = round(sim_projected_pct - current_pct, 1)
    
    # Risk
    if sim_projected_pct < required_threshold:
        sim_risk = "CRITICAL" if sim_projected_pct < (required_threshold - 4) else "AT RISK"
    elif sim_projected_pct < (required_threshold + 3):
        sim_risk = "WATCH"
    else:
        sim_risk = "SAFE"
        
    # Recovery requirement from simulated point
    target_needed = math.ceil((required_threshold / 100.0) * total_classes)
    remaining_classes_from_now = remaining - miss_n
    sim_needed = max(0, target_needed - attended)
    sim_recoverable = sim_needed <= remaining_classes_from_now
    
    return {
        "miss_next_n": miss_n,
        "sim_projected_pct": sim_projected_pct,
        "delta": delta,
        "sim_risk": sim_risk,
        "sim_needed": sim_needed,
        "remaining_after_miss": remaining_classes_from_now,
        "is_recoverable": sim_recoverable,
        "summary": f"If you miss next {miss_n} classes, your projected attendance becomes {sim_projected_pct}% ({sim_risk})." + 
                   (f" You would need to attend {sim_needed} of the remaining {remaining_classes_from_now} classes." if sim_recoverable else " Recovery through normal attendance would become mathematically impossible.")
    }
