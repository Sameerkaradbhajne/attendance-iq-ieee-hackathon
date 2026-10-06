import React, { useState, useEffect, useRef } from 'react';
import { ROLES_CONFIG, ROLE_KEYS } from '../config/roles';
import {
  GraduationCap,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Users,
  BarChart2,
  FileCheck,
  Heart
} from 'lucide-react';

// Role-specific icon map
const ROLE_ICONS = {
  student: GraduationCap,
  mentor: Users,
  hod: BarChart2,
  examCell: FileCheck,
  parent: Heart,
};

// Role-specific accent themes matching design specifications
const ROLE_ACCENTS = {
  student: {
    primary: '#2563eb',
    light: '#eef5fc',
    border: '#bfdbfe',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    ring: 'rgba(37, 99, 235, 0.15)',
    doodleStroke: '#3b82f6'
  },
  mentor: {
    primary: '#d97706',
    light: '#fbf4ea',
    border: '#fde68a',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    ring: 'rgba(217, 119, 6, 0.15)',
    doodleStroke: '#f59e0b'
  },
  hod: {
    primary: '#7c3aed',
    light: '#f2eff9',
    border: '#ddd6fe',
    badgeBg: '#ede9fe',
    badgeText: '#5b21b6',
    ring: 'rgba(124, 58, 237, 0.15)',
    doodleStroke: '#8b5cf6'
  },
  examCell: {
    primary: '#0d9488',
    light: '#e6f6f3',
    border: '#99f6e4',
    badgeBg: '#ccfbf1',
    badgeText: '#115e59',
    ring: 'rgba(13, 148, 136, 0.15)',
    doodleStroke: '#14b8a6'
  },
  parent: {
    primary: '#e11d48',
    light: '#faefed',
    border: '#fecdd3',
    badgeBg: '#ffe4e6',
    badgeText: '#9f1239',
    ring: 'rgba(225, 29, 72, 0.15)',
    doodleStroke: '#f43f5e'
  },
};

// Subtle hand-drawn academic doodle overlay for the illustration container
function RoleDoodles({ roleKey, strokeColor }) {
  if (roleKey === 'student') {
    return (
      <svg className="login-doodle-svg" viewBox="0 0 320 480" fill="none" aria-hidden="true">
        {/* Subtle study notes, stars, dashed circles */}
        <circle cx="270" cy="50" r="30" stroke={strokeColor} strokeWidth="1.8" strokeDasharray="5 4" opacity="0.35" />
        <path d="M260 45 L270 55 L285 40" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        <path d="M20 430 Q40 415 65 428 Q90 440 115 422" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        <rect x="22" y="100" width="18" height="24" rx="3" stroke={strokeColor} strokeWidth="1.5" opacity="0.3" />
        <rect x="28" y="96" width="18" height="24" rx="3" stroke={strokeColor} strokeWidth="1.5" opacity="0.4" />
        <circle cx="280" cy="410" r="12" stroke={strokeColor} strokeWidth="1.5" opacity="0.35" />
      </svg>
    );
  }
  if (roleKey === 'mentor') {
    return (
      <svg className="login-doodle-svg" viewBox="0 0 320 480" fill="none" aria-hidden="true">
        <path d="M250 45 L285 45 M250 56 L280 56 M250 67 L272 67" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <circle cx="45" cy="425" r="28" stroke={strokeColor} strokeWidth="1.6" strokeDasharray="4 3" opacity="0.35" />
        <path d="M25 110 Q40 95 55 105 Q70 115 85 100" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        <rect x="250" y="390" width="32" height="42" rx="4" stroke={strokeColor} strokeWidth="1.6" opacity="0.35" />
        <line x1="258" y1="405" x2="274" y2="405" stroke={strokeColor} strokeWidth="1.5" opacity="0.4" />
        <line x1="258" y1="416" x2="274" y2="416" stroke={strokeColor} strokeWidth="1.5" opacity="0.4" />
      </svg>
    );
  }
  if (roleKey === 'hod') {
    return (
      <svg className="login-doodle-svg" viewBox="0 0 320 480" fill="none" aria-hidden="true">
        <rect x="245" y="35" width="45" height="55" rx="5" stroke={strokeColor} strokeWidth="1.6" opacity="0.35" />
        <path d="M255 58 L280 58 M255 68 L274 68" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
        <path d="M25 170 L45 145 L65 160 L85 130 L105 150" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        <circle cx="45" cy="420" r="22" stroke={strokeColor} strokeWidth="1.6" strokeDasharray="5 3" opacity="0.35" />
        <circle cx="275" cy="425" r="14" stroke={strokeColor} strokeWidth="1.5" opacity="0.35" />
      </svg>
    );
  }
  if (roleKey === 'examCell') {
    return (
      <svg className="login-doodle-svg" viewBox="0 0 320 480" fill="none" aria-hidden="true">
        <rect x="245" y="40" width="46" height="60" rx="5" stroke={strokeColor} strokeWidth="1.6" opacity="0.35" />
        <path d="M253 58 L283 58 M253 68 L283 68 M253 78 L272 78" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M25 410 L45 410 L45 440 L25 440 Z" stroke={strokeColor} strokeWidth="1.5" opacity="0.3" />
        <path d="M50 415 L70 415 L70 445 L50 445 Z" stroke={strokeColor} strokeWidth="1.5" opacity="0.4" />
        <circle cx="45" cy="70" r="12" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
      </svg>
    );
  }
  // Parent
  return (
    <svg className="login-doodle-svg" viewBox="0 0 320 480" fill="none" aria-hidden="true">
      <path d="M260 52 Q272 38 284 52 Q290 60 272 75 Q254 60 260 52Z" stroke={strokeColor} strokeWidth="1.6" opacity="0.4" />
      <circle cx="45" cy="90" r="20" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35" />
      <path d="M25 420 Q45 398 65 415 Q85 432 105 410" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <circle cx="265" cy="420" r="14" stroke={strokeColor} strokeWidth="1.5" opacity="0.35" />
    </svg>
  );
}

export default function RoleLoginPage({
  initialRole = 'student',
  onLoginSuccess,
  onBackToLanding
}) {
  const [activeRoleKey, setActiveRoleKey] = useState(initialRole);
  const [roleId, setRoleId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [transitionState, setTransitionState] = useState('idle'); // 'idle' | 'fading-out' | 'fading-in'

  const idInputRef = useRef(null);

  // Sync role if initialRole changes externally
  useEffect(() => {
    if (initialRole && ROLES_CONFIG[initialRole] && initialRole !== activeRoleKey) {
      handleSwitchRole(initialRole);
    }
  }, [initialRole]);

  // Focus ID input on role switch
  useEffect(() => {
    if (idInputRef.current) {
      idInputRef.current.focus();
    }
  }, [activeRoleKey]);

  const currentRole = ROLES_CONFIG[activeRoleKey] || ROLES_CONFIG.student;
  const accent = ROLE_ACCENTS[activeRoleKey] || ROLE_ACCENTS.student;
  const ActiveIcon = ROLE_ICONS[activeRoleKey] || GraduationCap;

  // Smooth role transition without page reload
  const handleSwitchRole = (newKey) => {
    if (newKey === activeRoleKey || transitionState !== 'idle') return;

    setTransitionState('fading-out');
    setErrorMessage('');
    setIsSuccess(false);

    setTimeout(() => {
      setActiveRoleKey(newKey);
      setRoleId('');
      setPassword('');
      setTransitionState('fading-in');

      setTimeout(() => {
        setTransitionState('idle');
      }, 250);
    }, 200);
  };

  // Demo autofill for judges & fast hackathon evaluation
  const handleUseDemo = () => {
    setRoleId(currentRole.defaultId);
    setPassword('demo@apex2026');
    setErrorMessage('');
  };

  // Form submission with validation
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!roleId.trim()) {
      setErrorMessage(`Please enter your ${currentRole.idLabel}.`);
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      setIsSuccess(true);

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({
            role: currentRole.dashboardRole,
            roleKey: activeRoleKey,
            id: roleId,
            name: currentRole.defaultName
          });
        }
      }, 600);
    }, 700);
  };

  return (
    <div className="login-experience-wrapper">
      {/* Top Navigation & Utility Bar */}
      <div className="login-top-bar">
        <button
          type="button"
          className="back-home-btn"
          onClick={onBackToLanding}
          aria-label="Return to landing page"
        >
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          className="demo-autofill-btn"
          onClick={handleUseDemo}
          title={`Auto-fill verified demo credentials for ${currentRole.label}`}
        >
          <Sparkles size={13} color="#b45309" />
          <span>Demo: {currentRole.label} ({currentRole.defaultName.split(' ')[0]})</span>
        </button>
      </div>

      {/* Main Centered Split-Screen Login Card */}
      <div className="login-split-card">
        {/* ============================================================
            LEFT SIDE: ROLE-SPECIFIC HAND-DRAWN ILLUSTRATION AREA
            ============================================================ */}
        <div
          className="login-illustration-column"
          style={{ backgroundColor: accent.light }}
        >
          {/* Subtle hand-drawn academic doodles */}
          <RoleDoodles roleKey={activeRoleKey} strokeColor={accent.doodleStroke} />

          <div className={`illustration-wrapper ${transitionState !== 'idle' ? 'illus-transitioning' : ''}`}>
            {/* Hand-drawn character image */}
            <div className="illustration-img-box">
              <img
                src={currentRole.illustration}
                alt={`${currentRole.label} campus workspace`}
                className="role-illustration-img"
              />
            </div>

            {/* Role indicator pill badge */}
            <div
              className="illustration-role-badge"
              style={{
                backgroundColor: accent.badgeBg,
                color: accent.badgeText,
                borderColor: accent.border
              }}
            >
              <ActiveIcon size={13} />
              <span>{currentRole.label} Workspace</span>
            </div>

            {/* Handwritten doodle tag with curved sketch line */}
            <div className="handwritten-doodle-tag">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'inline', marginRight: '6px' }} aria-hidden="true">
                <path d="M2 13 Q5 7 8 11 Q11 15 14 6" stroke={accent.primary} strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 4 L14 6 L11 7" stroke={accent.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{currentRole.doodleNote}</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT SIDE: UNIFIED ATTENDANCE IQ LOGIN FORM AREA
            ============================================================ */}
        <div className={`login-form-column ${transitionState !== 'idle' ? 'form-transitioning' : ''}`}>
          {/* Attendance IQ Brand Header */}
          <div className="login-brand-header">
            <div className="brand-logo-combo">
              <div className="brand-icon-box">
                <GraduationCap size={20} color="#ffffff" />
              </div>
              <div className="brand-text-block">
                <span className="brand-primary-name">Attendance IQ</span>
                <span className="brand-primary-tagline">Know where your attendance is going.</span>
              </div>
            </div>

            {/* Subtle decorative pencil doodle squiggle */}
            <svg className="decorative-squiggle" width="44" height="28" viewBox="0 0 44 28" fill="none" aria-hidden="true">
              <path
                d="M4 14C10 4 16 24 24 10C30 0 36 22 41 14"
                stroke="#cbd5e1"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Welcome Heading & Dynamic Role Microcopy */}
          <div className="login-headings-block">
            <h2 className="login-main-title">Welcome Back</h2>
            <p className="login-main-subtitle">
              {currentRole.subtitle}
            </p>
          </div>

          {/* Refined Segmented Role Selector */}
          <div className="segmented-role-bar" role="tablist" aria-label="Select your role">
            {ROLE_KEYS.map((key) => {
              const r = ROLES_CONFIG[key];
              const isActive = key === activeRoleKey;
              const roleAccent = ROLE_ACCENTS[key];

              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`segmented-role-pill ${isActive ? 'active' : ''}`}
                  style={
                    isActive
                      ? {
                          backgroundColor: '#1e293b',
                          color: '#ffffff',
                          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.25)',
                        }
                      : {}
                  }
                  onClick={() => handleSwitchRole(key)}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="login-error-banner" role="alert">
              <span className="error-bullet" aria-hidden="true">•</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="login-success-banner" role="status">
              <CheckCircle2 size={16} />
              <span>Authenticated! Launching {currentRole.label} dashboard...</span>
            </div>
          )}

          {/* Unified Login Form */}
          <form onSubmit={handleFormSubmit} className="login-actual-form" noValidate>
            {/* Dynamic Role ID Input */}
            <div className="auth-field-group">
              <label className="auth-field-label" htmlFor="role-input-id">
                {currentRole.idLabel}
              </label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-field-icon" aria-hidden="true" />
                <input
                  id="role-input-id"
                  ref={idInputRef}
                  type="text"
                  className="auth-text-input"
                  placeholder={currentRole.idPlaceholder}
                  value={roleId}
                  onChange={(e) => {
                    setRoleId(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Input with Toggle */}
            <div className="auth-field-group">
              <label className="auth-field-label" htmlFor="role-input-password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-field-icon" aria-hidden="true" />
                <input
                  id="role-input-password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-text-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="auth-meta-row">
              <label className="remember-me-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="custom-checkbox"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() =>
                  alert('Password reset instructions have been forwarded to your registered institutional administrator.')
                }
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button with Dynamic Label & Loading / Success State */}
            <button
              type="submit"
              className="login-primary-submit-btn"
              disabled={isSuccess || isLoggingIn}
              style={
                isSuccess
                  ? { backgroundColor: '#059669' }
                  : {}
              }
            >
              {isLoggingIn ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  <span>Verifying credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Launching Workspace</span>
                </>
              ) : (
                <>
                  <span>{currentRole.buttonLabel}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Institutional Contact Message */}
          <div className="login-footer-institution">
            <span>Don't have an account? </span>
            <button
              type="button"
              className="contact-institution-link"
              onClick={() =>
                alert('Please visit the Academic Administration or Dean of Academic Affairs office to receive your role credentials.')
              }
            >
              Contact your institution
            </button>
          </div>

          {/* Subtle Institutional Branding Subtext */}
          <div className="login-subtle-institution-badge">
            <BookOpen size={11} color="#94a3b8" />
            <span>Apex Institute of Technology & Engineering · Academic Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
