import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  Play,
  TrendingUp,
  ShieldCheck,
  Heart,
  ChevronRight,
  BookOpen,
  Users,
  BarChart2,
  FileCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileText,
  Building,
  School,
  Calendar,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { ROLES_CONFIG, ROLE_KEYS } from '../config/roles';

export default function LandingPage({
  onSelectRoleLogin,
  onExploreDashboard
}) {
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [collegeFormSubmitted, setCollegeFormSubmitted] = useState(false);

  // Smooth scroll helper for navbar links
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCollegeFormSubmit = (e) => {
    e.preventDefault();
    setCollegeFormSubmitted(true);
    setTimeout(() => {
      setCollegeFormSubmitted(false);
      setShowCollegeModal(false);
    }, 2000);
  };

  return (
    <div className="landing-visual-page" id="home">
      {/* ============================================================
          TOP NAVIGATION BAR
          ============================================================ */}
      <nav className="landing-navbar">
        <div className="landing-brand-col">
          <div className="landing-brand-logo">
            <GraduationCap size={22} color="#ffffff" />
          </div>
          <div>
            <span className="landing-brand-title">Attendance IQ</span>
            <span className="landing-brand-badge">Intelligent Recovery</span>
          </div>
        </div>

        <div className="landing-nav-links">
          <a href="#home" className="landing-nav-item active" onClick={(e) => scrollToSection(e, 'home')}>
            Home
          </a>
          <a href="#features" className="landing-nav-item" onClick={(e) => scrollToSection(e, 'features')}>
            Features
          </a>
          <a href="#how-it-works" className="landing-nav-item" onClick={(e) => scrollToSection(e, 'how-it-works')}>
            How It Works
          </a>
          <a href="#for-colleges" className="landing-nav-item" onClick={(e) => scrollToSection(e, 'for-colleges')}>
            For Colleges
          </a>
        </div>

        <button
          className="landing-nav-cta-btn"
          onClick={onExploreDashboard}
        >
          <span>Go to Dashboard</span>
          <ArrowRight size={15} />
        </button>
      </nav>

      {/* ============================================================
          EXACTLY ONE HERO SECTION (NO DUPLICATES)
          Left: Copy & CTAs · Right: Student + Beside Health Card
          ============================================================ */}
      <section className="landing-hero-container">
        <div className="landing-hero-grid">
          {/* Left Column: Headlines & CTAs */}
          <div className="landing-hero-left">
            <div className="landing-ai-eyebrow">
              <Sparkles size={14} color="#d97706" />
              <span>AI ATTENDANCE INTELLIGENCE</span>
              <svg width="60" height="6" viewBox="0 0 60 6" fill="none" style={{ display: 'inline', marginLeft: '6px' }}>
                <path d="M1 4.5C15 1.5 45 1.5 59 4.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <h1 className="landing-hero-title">
              Know where your attendance is going.<br />
              <span className="landing-title-italic-accent">Before it's too late.</span>
            </h1>

            <p className="landing-hero-description">
              Track today's attendance, understand tomorrow's risk, and know exactly what to do before exam eligibility becomes a problem.
            </p>

            <div className="landing-hero-cta-group">
              <button
                className="hero-btn-primary"
                onClick={onExploreDashboard}
              >
                <span>Explore Dashboard</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="hero-btn-secondary"
                onClick={() => onSelectRoleLogin('student')}
              >
                <div className="play-icon-circle">
                  <Play size={12} fill="#102A43" color="#102A43" />
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            {/* Value Check Pillars */}
            <div className="landing-value-pillars-row">
              <div className="value-pillar-item">
                <div className="pillar-icon-box" style={{ background: '#ecfdf5', color: '#168447' }}>
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="pillar-bold">Predict</div>
                  <div className="pillar-sub">Future 4-week risk</div>
                </div>
              </div>

              <div className="value-pillar-item">
                <div className="pillar-icon-box" style={{ background: '#eef5fc', color: '#2563eb' }}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="pillar-bold">Recover</div>
                  <div className="pillar-sub">Clear action plans</div>
                </div>
              </div>

              <div className="value-pillar-item">
                <div className="pillar-icon-box" style={{ background: '#faefed', color: '#e11d48' }}>
                  <Compass size={16} />
                </div>
                <div>
                  <div className="pillar-bold">Freedom</div>
                  <div className="pillar-sub">Know safe buffer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hand-Drawn Student Beside Attendance Health Card */}
          <div className="landing-hero-right">
            <div className="hero-illustration-composite">
              {/* Illustrated campus student character */}
              <div className="hero-student-wrapper">
                <img
                  src="/assets/illustrations/landing_hero_student.jpg"
                  alt="Student standing on campus"
                  className="hero-campus-student-img"
                />
              </div>

              {/* Attendance Health Card sitting BESIDE the student */}
              <div className="beside-health-card">
                <div className="card-top-row">
                  <div className="card-label-block">
                    <span className="card-bars-icon">📶</span>
                    <span className="card-heading-text">Attendance Health</span>
                  </div>
                  <span className="card-safe-tag">SAFE</span>
                </div>

                <div className="card-stat-row">
                  <span className="card-big-pct">84.6%</span>
                  <span className="card-delta-tag">+9.6% over line</span>
                </div>

                {/* Mini SVG Trend Line */}
                <svg width="150" height="32" viewBox="0 0 150 32" fill="none" style={{ margin: '8px 0' }} aria-hidden="true">
                  <path
                    d="M4 24L32 20L65 24L95 14L122 16L144 8"
                    stroke="#168447"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="144" cy="8" r="3.5" fill="#168447" />
                </svg>

                <div className="card-mini-metrics-grid">
                  <div className="mini-metric-item">
                    <span className="mini-lbl">Projected</span>
                    <span className="mini-val">82.9%</span>
                  </div>
                  <div className="mini-metric-item">
                    <span className="mini-lbl">Trend</span>
                    <span className="mini-val" style={{ color: '#168447' }}>Stable ↗</span>
                  </div>
                  <div className="mini-metric-item">
                    <span className="mini-lbl">Freedom</span>
                    <span className="mini-val" style={{ color: '#2563eb' }}>4 classes</span>
                  </div>
                </div>

                {/* Hand-drawn annotation arrow & doodle */}
                <div className="beside-card-doodle">
                  <svg width="46" height="24" viewBox="0 0 46 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 18 C16 4 30 18 42 6"
                      stroke="#168447"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M36 4 L42 6 L40 12"
                      stroke="#168447"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="beside-doodle-text">Smarter Attendance. Brighter Future. :)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5 ROLE CARDS SECTION
          Student · Mentor · HOD · Exam Cell · Parent
          ============================================================ */}
      <section className="landing-roles-section">
        <div className="section-title-wrap">
          <span className="section-eyebrow">CHOOSE YOUR PORTAL</span>
          <h2 className="section-headline">One Platform. Every Stakeholder Connected.</h2>
          <p className="section-subheadline">
            Click your role below to experience the personalized Attendance IQ workspace designed for you.
          </p>
        </div>

        <div className="role-cards-grid">
          {ROLE_KEYS.map((key) => {
            const role = ROLES_CONFIG[key];
            return (
              <div
                key={key}
                className="role-interactive-card"
                style={{ backgroundColor: role.accentBg }}
                onClick={() => onSelectRoleLogin(key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectRoleLogin(key); }}
              >
                {/* Top Role Icon Badge */}
                <div
                  className="role-card-badge-circle"
                  style={{ backgroundColor: role.accentColor }}
                >
                  {key === 'student' && <GraduationCap size={15} color="#ffffff" />}
                  {key === 'mentor' && <Users size={15} color="#ffffff" />}
                  {key === 'hod' && <BarChart2 size={15} color="#ffffff" />}
                  {key === 'examCell' && <FileCheck size={15} color="#ffffff" />}
                  {key === 'parent' && <Heart size={15} color="#ffffff" />}
                </div>

                {/* Character Illustration */}
                <div className="role-card-image-box">
                  <img
                    src={role.cardImage || role.illustration}
                    alt={role.label}
                    className="role-card-illustration"
                  />
                </div>

                {/* Role Titles & Action Arrow */}
                <div className="role-card-footer-info">
                  <div>
                    <h3 className="role-card-name">{role.label}</h3>
                    <p className="role-card-tagline">{role.cardTagline}</p>
                  </div>
                  <div className="role-card-arrow-circle">
                    <ArrowRight size={13} color="#ffffff" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          SECTION 8: FEATURES (WORKING SECTION)
          "Attendance isn't just a number."
          ============================================================ */}
      <section className="landing-section-container" id="features">
        <div className="section-title-wrap">
          <span className="section-eyebrow">INTELLIGENT SUITE</span>
          <h2 className="section-headline">Attendance isn't just a number.</h2>
          <p className="section-subheadline">
            Attendance IQ turns static attendance data into predictive decisions, clear recovery roadmaps, and student peace of mind.
          </p>
        </div>

        <div className="features-grid">
          {/* 01 Attendance Health */}
          <div className="feature-card">
            <div className="feature-num-badge">01</div>
            <div className="feature-icon-circle" style={{ background: '#ecfdf5', color: '#168447' }}>
              <TrendingUp size={22} />
            </div>
            <h3 className="feature-title">Attendance Health</h3>
            <p className="feature-desc">
              Know your cumulative attendance, recent momentum, and projected final semester percentage with instant visual indicators.
            </p>
            <div className="feature-footer-pill">
              <CheckCircle2 size={12} color="#168447" />
              <span>Real-time tracking</span>
            </div>
          </div>

          {/* 02 Risk Prediction */}
          <div className="feature-card">
            <div className="feature-num-badge">02</div>
            <div className="feature-icon-circle" style={{ background: '#fff7ed', color: '#c2410c' }}>
              <AlertTriangle size={22} />
            </div>
            <h3 className="feature-title">Risk Prediction</h3>
            <p className="feature-desc">
              Trend-sensitive forecasting projects where your attendance will land 4 weeks before exams so you never get caught off guard.
            </p>
            <div className="feature-footer-pill">
              <Sparkles size={12} color="#c2410c" />
              <span>Proactive early warning</span>
            </div>
          </div>

          {/* 03 Recovery Planner */}
          <div className="feature-card">
            <div className="feature-num-badge">03</div>
            <div className="feature-icon-circle" style={{ background: '#eef5fc', color: '#2563eb' }}>
              <CheckCircle2 size={22} />
            </div>
            <h3 className="feature-title">Recovery Planner</h3>
            <p className="feature-desc">
              Know exactly how many upcoming lectures you need to attend in each subject to safely cross the mandatory 75% threshold.
            </p>
            <div className="feature-footer-pill">
              <ArrowRight size={12} color="#2563eb" />
              <span>Step-by-step targets</span>
            </div>
          </div>

          {/* 04 Freedom Meter */}
          <div className="feature-card feature-card-highlight">
            <div className="feature-num-badge" style={{ color: '#168447' }}>04</div>
            <div className="feature-icon-circle" style={{ background: '#dcfce7', color: '#15803d' }}>
              <Compass size={22} />
            </div>
            <h3 className="feature-title">Freedom Meter ⭐</h3>
            <p className="feature-desc">
              Our signature feature: safely calculates allowable classes you can take off without dropping below the 75% institutional line.
            </p>
            <div className="feature-footer-pill" style={{ background: '#dcfce7', color: '#15803d' }}>
              <span>"Go touch some grass 🌿"</span>
            </div>
          </div>

          {/* 05 What-If Simulator */}
          <div className="feature-card">
            <div className="feature-num-badge">05</div>
            <div className="feature-icon-circle" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Sliders size={22} />
            </div>
            <h3 className="feature-title">What-If Simulator</h3>
            <p className="feature-desc">
              Test hypothetical decisions live: "What happens if I miss 3 classes?" and see the exact mathematical impact on exam eligibility.
            </p>
            <div className="feature-footer-pill">
              <Sliders size={12} color="#7c3aed" />
              <span>Interactive controls</span>
            </div>
          </div>

          {/* 06 Exam Eligibility */}
          <div className="feature-card">
            <div className="feature-num-badge">06</div>
            <div className="feature-icon-circle" style={{ background: '#f0fdfa', color: '#0d9488' }}>
              <FileCheck size={22} />
            </div>
            <h3 className="feature-title">Exam Eligibility</h3>
            <p className="feature-desc">
              Institution-grade verification ensures students, mentors, and the Exam Cell stay completely aligned on hall ticket clearance.
            </p>
            <div className="feature-footer-pill">
              <FileCheck size={12} color="#0d9488" />
              <span>Zero exam day surprises</span>
            </div>
          </div>

          {/* 07 Smart Alerts */}
          <div className="feature-card">
            <div className="feature-num-badge">07</div>
            <div className="feature-icon-circle" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Sparkles size={22} />
            </div>
            <h3 className="feature-title">Smart Alerts</h3>
            <p className="feature-desc">
              Gentle notifications notify students 3 weeks before dangerous shortage lines so corrective action happens comfortably early.
            </p>
            <div className="feature-footer-pill">
              <span>Timely nudges</span>
            </div>
          </div>

          {/* 08 Condonation Workflow */}
          <div className="feature-card">
            <div className="feature-num-badge">08</div>
            <div className="feature-icon-circle" style={{ background: '#faefed', color: '#e11d48' }}>
              <FileText size={22} />
            </div>
            <h3 className="feature-title">Condonation & Claims</h3>
            <p className="feature-desc">
              Medical certificates and university extenuating claims routed through an auditable multi-tier approval workflow.
            </p>
            <div className="feature-footer-pill">
              <span>Auditable paperwork</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: HOW IT WORKS (WORKING 4-STEP VISUAL TIMELINE)
          ============================================================ */}
      <section className="landing-section-container" id="how-it-works">
        <div className="section-title-wrap">
          <span className="section-eyebrow">INTELLIGENCE PIPELINE</span>
          <h2 className="section-headline">How Attendance IQ Works</h2>
          <p className="section-subheadline">
            From daily biometric attendance records to clear student recovery roadmaps in 4 intelligent steps.
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline-grid">
            {/* Step 1 */}
            <div className="timeline-step-card">
              <div className="timeline-step-number">01</div>
              <div className="timeline-icon-box" style={{ background: '#eef5fc', color: '#2563eb' }}>
                <Layers size={22} />
              </div>
              <h3 className="timeline-step-title">Attendance Data</h3>
              <p className="timeline-step-desc">
                Daily classroom sessions and biometric logs are synchronized automatically.
              </p>
              <div className="timeline-example-pill">
                "You're at 74.2% across 130 classes"
              </div>
            </div>

            {/* Step 2 */}
            <div className="timeline-step-card">
              <div className="timeline-step-number">02</div>
              <div className="timeline-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Sparkles size={22} />
              </div>
              <h3 className="timeline-step-title">Pattern Analysis</h3>
              <p className="timeline-step-desc">
                The engine evaluates recent 4-week momentum versus baseline institutional standards.
              </p>
              <div className="timeline-example-pill" style={{ color: '#c2410c', background: '#fff7ed' }}>
                "Recent trend: Declining ↘ (58% rate)"
              </div>
            </div>

            {/* Step 3 */}
            <div className="timeline-step-card">
              <div className="timeline-step-number">03</div>
              <div className="timeline-icon-box" style={{ background: '#fff7ed', color: '#c2410c' }}>
                <AlertTriangle size={22} />
              </div>
              <h3 className="timeline-step-title">Risk & Forecast</h3>
              <p className="timeline-step-desc">
                Future trajectories calculate whether you'll finish above or below the 75% exam barrier.
              </p>
              <div className="timeline-example-pill" style={{ color: '#b91c1c', background: '#fef2f2' }}>
                "Projected finish: 72.8% (Shortage risk)"
              </div>
            </div>

            {/* Step 4 */}
            <div className="timeline-step-card timeline-card-success">
              <div className="timeline-step-number" style={{ color: '#168447' }}>04</div>
              <div className="timeline-icon-box" style={{ background: '#ecfdf5', color: '#168447' }}>
                <CheckCircle2 size={22} />
              </div>
              <h3 className="timeline-step-title">Clear Action</h3>
              <p className="timeline-step-desc">
                You receive an actionable target: exactly how many classes to attend to be safe.
              </p>
              <div className="timeline-example-pill" style={{ color: '#047857', background: '#ecfdf5', fontWeight: 700 }}>
                "Attend 21 of next 24 classes ✓"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 10: FOR COLLEGES (CONNECTED STAKEHOLDER NETWORK)
          ============================================================ */}
      <section className="landing-section-container" id="for-colleges">
        <div className="colleges-banner-card">
          <div className="colleges-content-left">
            <span className="colleges-eyebrow">INSTITUTIONAL GRADE PLATFORM</span>
            <h2 className="colleges-headline">
              One attendance system.<br />
              Every stakeholder informed.
            </h2>
            <p className="colleges-description">
              Attendance IQ replaces fragmented spreadsheets with an integrated, proactive platform connecting Students, Mentors, HODs, Exam Cell, and Parents under customizable institutional compliance policies.
            </p>

            <div className="colleges-features-list">
              <div className="colleges-feature-row">
                <CheckCircle2 size={18} color="#168447" />
                <span>Institution-wide 75% compliance visibility and live auditing</span>
              </div>
              <div className="colleges-feature-row">
                <CheckCircle2 size={18} color="#168447" />
                <span>Automated early-warning notifications 3-4 weeks prior to exam lockouts</span>
              </div>
              <div className="colleges-feature-row">
                <CheckCircle2 size={18} color="#168447" />
                <span>Auditable medical condonation and university extenuating claims routing</span>
              </div>
              <div className="colleges-feature-row">
                <CheckCircle2 size={18} color="#168447" />
                <span>Parent communication portal keeping guardians informed without panic</span>
              </div>
            </div>

            <div className="colleges-cta-row">
              <button
                className="hero-btn-primary"
                onClick={() => setShowCollegeModal(true)}
              >
                <span>Bring Attendance IQ to your college →</span>
              </button>
              <button
                className="hero-btn-secondary"
                onClick={onExploreDashboard}
              >
                <span>Explore Live Demo</span>
              </button>
            </div>
          </div>

          <div className="colleges-visual-right">
            <div className="stakeholders-network-box">
              <div className="network-center-circle">
                <GraduationCap size={24} color="#ffffff" />
                <span>ATTENDANCE IQ</span>
              </div>

              <div className="network-nodes-grid">
                <div className="network-node-item" style={{ borderLeft: '3px solid #2563eb' }}>
                  <strong>Students</strong>
                  <span>Track · Predict · Recover</span>
                </div>
                <div className="network-node-item" style={{ borderLeft: '3px solid #d97706' }}>
                  <strong>Mentors</strong>
                  <span>Intervene early with data</span>
                </div>
                <div className="network-node-item" style={{ borderLeft: '3px solid #7c3aed' }}>
                  <strong>HODs</strong>
                  <span>Department analytics</span>
                </div>
                <div className="network-node-item" style={{ borderLeft: '3px solid #0d9488' }}>
                  <strong>Exam Cell</strong>
                  <span>Clearance & Hall Tickets</span>
                </div>
                <div className="network-node-item" style={{ borderLeft: '3px solid #e11d48' }}>
                  <strong>Parents</strong>
                  <span>Transparent peace of mind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          LANDING FOOTER
          ============================================================ */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-brand-col">
            <div className="landing-brand-col">
              <div className="landing-brand-logo">
                <GraduationCap size={20} color="#ffffff" />
              </div>
              <span className="landing-brand-title">Attendance IQ</span>
            </div>
            <p className="footer-tagline">
              Attendance Intelligence & Recovery Platform for Higher Education.
            </p>
            <div className="footer-handwritten-note">
              <span>Smarter Attendance · Brighter Future :)</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Platform</h4>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>How It Works</a>
            <a href="#for-colleges" onClick={(e) => scrollToSection(e, 'for-colleges')}>For Colleges</a>
            <button className="footer-link-btn" onClick={onExploreDashboard}>Live Dashboards</button>
          </div>

          <div className="footer-links-col">
            <h4>Role Portals</h4>
            <button className="footer-link-btn" onClick={() => onSelectRoleLogin('student')}>Student Portal</button>
            <button className="footer-link-btn" onClick={() => onSelectRoleLogin('mentor')}>Mentor Portal</button>
            <button className="footer-link-btn" onClick={() => onSelectRoleLogin('hod')}>HOD Analytics</button>
            <button className="footer-link-btn" onClick={() => onSelectRoleLogin('examCell')}>Exam Cell Portal</button>
            <button className="footer-link-btn" onClick={() => onSelectRoleLogin('parent')}>Parent Portal</button>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 Attendance IQ Platform · Apex Institute of Technology & Engineering</span>
          <span>Designed with care for academic excellence.</span>
        </div>
      </footer>

      {/* ============================================================
          COLLEGE INQUIRY MODAL
          ============================================================ */}
      {showCollegeModal && (
        <div className="modal-overlay" onClick={() => setShowCollegeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">INSTITUTIONAL PARTNERSHIP</span>
                <h3 className="modal-title">Bring Attendance IQ to your College</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowCollegeModal(false)}>
                <X size={18} />
              </button>
            </div>

            {collegeFormSubmitted ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <CheckCircle2 size={48} color="#168447" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#102A43' }}>Request Received!</h4>
                <p style={{ fontSize: '14px', color: '#575c66', marginTop: '6px' }}>
                  Our academic implementation team will reach out with pilot deployment credentials within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCollegeFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                <div>
                  <label className="auth-field-label">College / University Name</label>
                  <input
                    type="text"
                    className="auth-text-input"
                    placeholder="e.g. Apex Institute of Engineering & Technology"
                    required
                  />
                </div>
                <div>
                  <label className="auth-field-label">Official Email</label>
                  <input
                    type="email"
                    className="auth-text-input"
                    placeholder="dean.academics@apex.edu"
                    required
                  />
                </div>
                <div>
                  <label className="auth-field-label">Student Body Size</label>
                  <select className="auth-text-input" defaultValue="1000-5000">
                    <option value="under-1000">Under 1,000 students</option>
                    <option value="1000-5000">1,000 – 5,000 students</option>
                    <option value="5000+">5,000+ students</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowCollegeModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <span>Submit Inquiry →</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
