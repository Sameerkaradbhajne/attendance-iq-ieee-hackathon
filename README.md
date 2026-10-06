# Attendance IQ

> **"Know your attendance. Predict your risk. Take control."**

Attendance IQ transforms traditional college attendance tracking into an intelligent, proactive platform that empowers **Students**, **Faculty Mentors**, **Exam Cells**, **Heads of Departments (HODs)**, and **Parents** in real time. 

Traditional university systems function as passive filing cabinets that simply display historical percentages when it is already too late. Attendance IQ re-engineers attendance into an active decision-support and recovery system:

- 📊 **Tracks attendance** in real time with high-precision metrics
- 🧠 **Calculates attendance intelligence** rather than static percentages
- 🔮 **Predicts risk** before detentions occur
- 🎓 **Calculates exam eligibility** and hall ticket clearance automatically
- 🔄 **Calculates recovery requirements** with mathematically exact formulas
- 🎯 **Provides a Freedom Meter** to know safe absence buffers
- 📚 **Provides subject-wise attendance intelligence** with animated circular progress rings
- 📱 **Supports QR-based attendance** with dynamic, fraud-resistant session tokens
- 💬 **Supports WhatsApp communication** for instant alerts and personalized recovery paths
- 👨‍🏫 **Provides mentor intervention** tools to support at-risk students early
- 👨‍👩‍👧 **Provides parent visibility** with plain-language status and verifiable session proofs
- 📑 **Generates reports** for university compliance and condonation audits
- 🌐 **Connects all roles** seamlessly through a single source of truth

---

## 📌 Project Overview & Badges

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![Design System](https://img.shields.io/badge/Design-Warm%20Ivory%20%7C%20Deep%20Navy-102A43)
![WhatsApp Business API](https://img.shields.io/badge/WhatsApp%20Cloud%20API-Ready-25D366?logo=whatsapp&logoColor=white)
![QR Auth](https://img.shields.io/badge/QR%20Auth-SHA--256%20Rotating-0D9488)
![Dataset](https://img.shields.io/badge/Dataset-105%2B%20Students%20%7C%2015%2B%20Subjects-orange)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 🚨 The Problem

In colleges and engineering institutions worldwide, attendance management is broken:

- **Late Shortage Discovery**: Students routinely discover attendance shortages weeks before semester end when detention lists are pinned to department notice boards.
- **Percentages Without Direction**: A screen showing `68.4%` tells students they are in trouble, but gives zero direction on how to fix it.
- **Zero Visibility on Safety Buffers**: Students do not know how many classes they can safely miss for genuine reasons (hackathons, illness, interviews) without dropping below the mandatory 75% threshold.
- **Unknown Recovery Trajectories**: Students have no idea how many consecutive lectures they must attend to cross the safety line.
- **Manual Mentor Overhead**: Faculty mentors spend hours sifting through static spreadsheets to manually find at-risk mentees.
- **Delayed Parent Visibility**: Parents only learn about attendance crises when warning letters arrive or exam hall tickets are denied.
- **Manual Exam Cell Scrutiny**: The exam cell manually cross-references medical certificates and condonation quotas against raw attendance rolls.
- **Fragmented Communication**: Critical attendance warnings are scattered across notice boards, student portals, and unread institutional emails.
- **Time-Consuming Manual Marking**: Calling out names eats up 10–15 minutes of each lecture.
- **Disconnected Data**: Raw attendance records are isolated from the exam eligibility pipeline until the last minute.

> **"Most attendance systems tell students what their attendance is. Attendance IQ tells them what they should do next."**

---

## 💡 Our Solution

Attendance IQ unifies all stakeholders into an automated, real-time feedback loop. Every action taken—from marking a session in class to approving a condonation form—propagates across the entire institutional system:

```text
               ┌────────────────────────────────────────────────────────┐
               │              1. Attendance Recorded                    │
               │        (Rotating Session QR / Faculty Terminal)        │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │             2. Attendance Calculated                   │
               │        (Weighted Subject & Aggregate Metrics)          │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                3. Risk Detected                        │
               │     (Stratified: SAFE · WATCH · AT RISK · CRITICAL)    │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │              4. Recovery Predicted                     │
               │        (Solves exact classes needed formula)           │
               └───────────────────────────┬────────────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
         ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
         │ 5. Student Notified│ │ 6. Mentor Informed │ │ 7. Parent Updated  │
         │ Actionable Roadmap │ │ Dossier & Advisory │ │ Plain-English Stat │
         │   via WhatsApp     │ │ 1-Click Outreach   │ │ Cryptographic Proof│
         └──────────┬─────────┘ └──────────┬─────────┘ └──────────┬─────────┘
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │         8. Exam Eligibility Recalculated               │
               │      (Live Hall Ticket Clearance & Condonation)        │
               └────────────────────────────────────────────────────────┘
```

Because every role accesses the same real-time intelligence engine, discrepancies, surprise detentions, and administrative overhead are completely eliminated.

---

## ⭐ What Makes Attendance IQ Different?

### 1. Attendance Intelligence
We replace static percentages with predictive trajectory modeling. The system shows where attendance will stand by semester end under current habits.

### 2. Freedom Meter
Students can instantly see their **Attendance Buffer**—the exact number of classes they can miss without falling below the institutional 75% requirement.

### 3. Recovery Intelligence
When attendance slips, Attendance IQ mathematically calculates the exact number of consecutive sessions needed to regain safe status.

### 4. Subject-Level Intelligence
Aggregates often hide critical course shortages. Attendance IQ tracks individual subject health with dedicated animated circular SVG progress meters and interactive forecasts.

### 5. Smart QR Attendance
Fast, secure, session-based attendance marking with dynamic rotating tokens, client timestamp validation, and anti-proxy verification.

### 6. Smart Risk Detection
Continuously stratifies students into four actionable tiers:
- 🟢 **Safe** ($\ge 80\%$): Full exam clearance + positive freedom cushion.
- 🟡 **Watch** ($75\% - 79.9\%$): Approaching borderline; caution advised.
- 🟠 **At Risk** ($65\% - 74.9\%$): Ineligible without recovery; mentor notified.
- 🔴 **Critical** ($< 65\%$): Severe shortage; requires condonation + parent advisory.

### 7. WhatsApp Recovery Assistant
Integrated WhatsApp Business notification service delivering automated recovery plans, milestone check-ins, and eligibility alerts straight to student mobile devices.

### 8. Exam Eligibility Intelligence
Attendance directly feeds the exam clearance matrix. Students and exam cell officers see hall ticket eligibility status in real time.

### 9. Multi-Role Platform
Dedicated, customized experiences for **Students**, **Faculty Mentors**, **Exam Cells**, **HODs**, and **Parents**.

### 10. Connected System
Changes in attendance instantly update recovery targets, mentor triage lists, parent summaries, and exam clearance rosters.

---

## 🚀 Main Features

### 1. Student Dashboard

Designed as the personal academic command center, answering the questions students actually care about:
- *"Am I safe?"*
- *"Which subject needs attention?"*
- *"How many classes can I miss?"*
- *"How many classes do I need to attend to recover?"*
- *"Can I take a break?"*
- *"Am I eligible for exams?"*

**Key Components:**
- **Hero Attendance Ring**: Animated SVG circular meter ($0 \to \text{percentage}$) with custom easing and dynamic color glow.
- **Subject-Wise Meters**: Individual course cards showing percentage, faculty name, and attendance health.
- **Live Risk Status Badge**: Instant feedback (`SAFE`, `WATCH`, `AT RISK`, `CRITICAL`).
- **Exam Eligibility Indicator**: Real-time hall ticket clearance status.
- **Interactive QR Scanner**: Camera scanner with viewfinder targeting brackets to mark in-class presence.
- **Recovery Action Center**: Personalized tasks and recovery milestones.

---

### 2. 🎯 Freedom Meter (Flagship Feature)

The Freedom Meter answers the universal student question: *"Can I miss this class?"*

It calculates how many future classes a student can miss while remaining strictly above the required threshold (default: 75%).

#### Example Calculation:
A student has attended **42 out of 51 conducted classes** ($82.4\%$):
- **Current Attendance**: $82.4\%$ (Safe)
- **Required Threshold**: $75.0\%$
- **Freedom Cushion**: **5 classes available to miss**

As the student considers taking time off, Attendance IQ projects the exact impact:
| Scenario | Formula | Projected Attendance | Status |
| :--- | :--- | :--- | :--- |
| **Current** | $42 / 51$ | **82.4%** | 🟢 Safe |
| **After 1 missed class** | $42 / 52$ | **80.8%** | 🟢 Safe |
| **After 2 missed classes** | $42 / 53$ | **79.2%** | 🟡 Watch |
| **After 3 missed classes** | $42 / 54$ | **77.8%** | 🟡 Watch |
| **After 4 missed classes** | $42 / 55$ | **76.4%** | 🟡 Watch |
| **After 5 missed classes** | $42 / 56$ | **75.0%** | 🟡 Borderline |
| **After 6 missed classes** | $42 / 57$ | **73.7%** | 🟠 At Risk |

The dashboard includes an interactive **"Can I Take a Day Off?" Holiday Calculator** with quick-select buttons (+1, +2, +3, +4, +5, +10 classes) providing responsible guidance.

---

### 3. 📚 Subject Attendance Intelligence

Every subject maintains its own autonomous intelligence dossier:
- **Attendance Percentage** & Total Conducted / Attended sessions
- **Animated SVG Circular Meter** with status-matched color themes
- **Faculty Details & Class Schedule**
- **Subject Risk Level** (`Safe`, `Watch`, `At Risk`, `Critical`)
- **Required Minimum Attendance**
- **Classes That Can Be Missed** (Individual subject freedom buffer)
- **Classes Needed for Recovery** (Specific to that course)
- **Audited Session Timeline**: Session dates, room numbers, topics covered, and QR verification status
- **Interactive Forecast Simulator**: Click **+1**, **+3**, **+5**, or **+10** upcoming sessions to simulate future attendance outcomes

---

### 4. 🔄 Smart Recovery Calculator

When a student falls below the target threshold, Attendance IQ calculates the exact number of consecutive classes $X$ they must attend to regain clearance:

$$\frac{A + X}{C + X} \ge T$$

Where:
- $A$ = Number of classes currently attended
- $C$ = Number of classes conducted to date
- $T$ = Target attendance percentage threshold ($0.75$ for 75%)
- $X$ = Minimum upcoming classes to attend consecutively without absence

Solving algebraically for $X$:

$$A + X \ge T \cdot (C + X)$$
$$A + X \ge T \cdot C + T \cdot X$$
$$X - T \cdot X \ge T \cdot C - A$$
$$X \cdot (1 - T) \ge T \cdot C - A$$

$$X = \left\lceil \frac{T \cdot C - A}{1 - T} \right\rceil$$

#### Real-World Example:
A student has attended **82 out of 120 classes** ($68.3\%$, At Risk):
$$X = \left\lceil \frac{0.75 \times 120 - 82}{1 - 0.75} \right\rceil = \left\lceil \frac{90 - 82}{0.25} \right\rceil = \left\lceil \frac{8}{0.25} \right\rceil = 32 \text{ classes}$$

Attendance IQ breaks down this 32-class requirement into an actionable, weekly schedule instead of an insurmountable hurdle.

---

### 5. 📱 Smart QR Attendance System

- **Mentor Terminal**: Generates rotating session QR codes containing course code, division, lecturer ID, and cryptographically hashed timestamp.
- **Dynamic Session Expiry**: Codes refresh every 15 seconds to prevent sharing or unauthorized screenshot distribution.
- **Live Headcount**: Faculty screen updates dynamically as students scan ($23 \to 24 \text{ Present}$).
- **Student Scanner**: Built-in camera viewport with scan guides and audible/visual confirmation.
- **Cryptographic Audit Proof**: Generates a verifiable SHA-256 session hash recorded in the student's and parent's history logs.

---

### 6. 💬 WhatsApp Attendance Recovery Assistant

Attendance IQ features an enterprise-grade notification architecture with ready support for the **Meta WhatsApp Business Cloud API**:
- **Automatic Case Generation**: Triggers when attendance dips below 75%.
- **8 Pre-Configured Official Message Templates**:
  1. Low Attendance Alert
  2. Critical Shortfall Warning
  3. Daily Recovery Reminder
  4. Personalized Recovery Roadmap
  5. Exam Eligibility Warning
  6. Attendance Improvement Notice
  7. Exam Clearance Restored
  8. Faculty Mentor Escalation Advisory
- **Interactive Hackathon Preview Bar**: Easily simulate attendance drops, dispatch messages, and review realistic chat bubble previews.
- **Privacy First**: Student and guardian contact numbers are masked (`+91 98•••••421`) across dashboards.

---

### 7. 🎓 Multi-Role Institutional Workspaces

| Role | Core Capabilities |
| :--- | :--- |
| **Student** | Overall & subject meters, Freedom Meter, holiday calculator, QR scanner, recovery checklist |
| **Faculty Mentor** | Cohort triage, early-warning filters, mentee directory (105+ students), 1-click WhatsApp outreach, subject management |
| **Exam Cell** | Hall ticket eligibility matrix, condonation approval workflows (medical allowance up to 10%), CSV compliance exports |
| **Head of Dept (HOD)** | Department-wide comparative analytics, defalcation statistics, faculty syllabus completion tracking |
| **Guardian / Parent** | Plain-English status ("On Track", "Attention Needed"), live verified QR audit card, direct faculty contacts |

---

## 🏛️ Comprehensive College Dataset

Attendance IQ comes pre-populated with a dataset of **105+ Indian engineering students** across 7 university departments:

- **Departments**: Computer Science & Engineering, Information Technology, AI & Data Science, Electronics & Telecommunication, Mechanical Engineering, Civil Engineering, Electronics Engineering
- **15+ Engineering Subjects**: Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks, Full Stack Web Development, Artificial Intelligence, Machine Learning, Cloud Computing, Cyber Security, Discrete Mathematics, Software Engineering, etc.
- **Data Attributes**: Student PRN, Roll Numbers, Department, Year, Division, Attendance Records, WhatsApp Status, Parent Mobile, Mentor Allocations, and Audit History.

---

## 💻 Tech Stack & Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Attendance IQ Frontend               │
│          React 18  ·  Vite 5  ·  Vanilla CSS           │
└────────────┬──────────────────────────────┬────────────┘
             │                              │
             ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│   Design System Core    │    │  Mathematical Engine    │
│  - Warm Ivory (#FAF8F3) │    │  - SVG Circular Rings   │
│  - Deep Navy (#102A43)  │    │  - Freedom Meter Calc   │
│  - Pastel Status Badges │    │  - Algebraic Recovery   │
└─────────────────────────┘    └─────────────────────────┘
             │                              │
             ▼                              ▼
┌────────────────────────────────────────────────────────┐
│              Reactive College Data Store               │
│       In-Memory & LocalStorage Multi-Role State        │
└────────────┬──────────────────────────────┬────────────┘
             │                              │
             ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│     QR Security Core    │    │   WhatsApp Notification │
│  - Camera Stream WebRTC │    │  - Meta Cloud API Ready │
│  - Rotating SHA Tokens  │    │  - Mock Provider Engine │
└─────────────────────────┘    └─────────────────────────┘
```

- **Frontend Core**: React 18, Vite 5, JavaScript (ESNext)
- **Styling & Aesthetics**: Handcrafted Vanilla CSS, CSS Grid/Flexbox, Custom SVG Circular Meter Engine (zero Tailwind dependency)
- **Icons**: Lucide React
- **State Management**: Reactive custom store with event listeners (`collegeDataStore.js`)
- **Camera & Hardware**: HTML5 WebRTC MediaStream API for QR scanning

---

## 🛠️ Quick Start & Installation

### Prerequisites
- Node.js (version 18.x or higher)
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sameerkaradbhajne/attendance-iq-ieee-hackathon.git
   cd attendance-iq-ieee-hackathon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional for Live WhatsApp API):**
   Create a `.env` file in the root directory:
   ```env
   VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   VITE_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   VITE_WHATSAPP_ACCESS_TOKEN=your_meta_system_user_token
   ```
   *(Note: Attendance IQ includes an interactive Mock Provider by default if credentials are not supplied).*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🎬 2-Minute Hackathon Demo Script for Judges

To showcase the complete Attendance IQ loop to judges:

1. **Top Persona Switcher**:
   - Start in **Student View** (Sameer Patil). Point out the **Animated Circular Meter** ($82.4\%$) and the **Freedom Meter** displaying *5 safe classes available*.
   - Click the **"Can I Take a Day Off?"** buttons (+1, +2, +3 classes) to show real-time percentage adjustments.
2. **Interactive Drop & Recovery**:
   - Open the floating **WhatsApp Demo Trigger** on the bottom-right.
   - Click **Simulate Attendance Drop** $\to$ Attendance plunges to $68.4\%$ (`CRITICAL`).
   - Notice the Freedom Meter updates to `0`, and the **Smart Recovery Calculator** indicates: *8 classes needed consecutively*.
   - Click **Send WhatsApp Alert** $\to$ Renders an authentic WhatsApp chat bubble preview with the personalized recovery link.
   - Click **Simulate 8 Classes Attended** $\to$ Attendance restores to $75.2\%$, triggering **Exam Clearance Restored**.
3. **Smart QR Attendance**:
   - Switch to **Mentor View** $\to$ click **+ Start QR Attendance** to generate a dynamic classroom token.
   - Switch back to **Student View** $\to$ click **Scan QR** to verify how instantaneous mobile check-in works.
4. **Subject Management & 105+ Student Directory**:
   - In **Mentor View**, navigate to **Subjects** to view curriculum health or click **+ Add Subject**.
   - Navigate to **Students** to filter through all 105 engineering students across 7 departments.
5. **Parent & Exam Cell Verification**:
   - Switch to **Parent View** to view the cryptographically verified classroom attendance card.
   - Switch to **Exam Cell** to review the live hall ticket eligibility roster and condonation approval flow.

---

## 🔒 Security, Privacy & Compliance

- **Zero Secret Leakage**: No Meta API access tokens or backend keys are packaged into the client bundle.
- **Guardian & Student Privacy**: Phone numbers are masked (`+91 98•••••421`) across public and staff interfaces.
- **Explicit Consent Tracking**: Compliant with institutional communication policies; students must opt in before receiving automated alerts.
- **Cryptographic Anti-Proxy Verification**: Rotating session nonces prevent classroom check-in fraud.

---

## 📄 License & Attribution

Developed for the **IEEE Hackathon**.  
Licensed under the [MIT License](LICENSE).

*"Know your attendance. Predict your risk. Take control."* 🌿
