# Product Requirements Document (PRD): The Roadblock Remover

**Version:** 1.0  
**Status:** Draft  
**Owner:** Vinny Carpenter  
**Tech Stack:** Next.js (Frontend) + Pocketbase (Backend) + AWS S3/CloudFront (Deployment)

---

## 1. Executive Summary
**The Roadblock Remover** is an internal engineering health tool designed to identify, visualize, and eliminate systemic friction in the software development lifecycle. By providing an anonymous, real-time channel for engineers to report hurdles, leadership can transition from reactive management to proactive servant leadership, backed by quantifiable data.

---

## 2. Goals & Objectives
* **Increase Developer Velocity:** Identify and resolve the "papercuts" that slow down daily work.
* **Foster Psychological Safety:** Provide a truly anonymous way to highlight institutional or technical failures without fear of attribution.
* **Quantify Friction:** Turn anecdotal complaints into measurable metrics (e.g., "Wasted Engineering Hours").
* **Close the Loop:** Ensure every reported issue is tracked to a resolution, maintaining and building team trust.

---

## 3. User Personas

### 3.1 The Contributor (Software Engineer)
* **Need:** Wants to report a specific frustration (e.g., "The staging environment is down again") quickly.
* **Constraint:** Requires total anonymity to feel safe reporting process or leadership-related friction.

### 3.2 The Resolver (Infrastructure/Platform Engineer or Lead)
* **Need:** A prioritized backlog of systemic issues to fix.
* **Constraint:** Needs enough context to reproduce the issue and a way to communicate progress to those affected.

### 3.3 The Servant Leader (VP/Director)
* **Need:** High-level visualization of where the organization is "bleeding" time.
* **Constraint:** Needs to justify infrastructure spend using data-driven ROI.

---

## 4. Functional Requirements

### 4.1 Anonymous Reporting
* **Submission Form:** Users can submit a "Roadblock" containing:
    * **Category:** (e.g., CI/CD, DX, Requirements, Tooling, Onboarding).
    * **Severity:** (Low, Medium, High, Critical).
    * **Estimated Waste:** Hours lost per person/week.
    * **Description:** Markdown-supported text field.
* **Anonymity Guardrail:** The system must not store `created_by` or any metadata (IP, User Agent) that links a specific user to a Roadblock record.

### 4.2 The "Heat Map" Dashboard
* **Visual Grid:** A real-time dashboard grouping active roadblocks by Category and Severity.
* **Live Updates:** Utilizing Pocketbase real-time subscriptions to update the map as new issues are logged or resolved.
* **Filtering:** Filter by "Status" or "Time Frame" to see if friction is trending down.

### 4.3 Resolution Workflow
* **Assignment:** Leaders can assign a "Resolver" (a specific user) to an item.
* **Status Management:** Roadblocks move through states: `Open` -> `In Progress` -> `Resolved` -> `Closed`.
* **Resolution Notes:** Upon closing, the Resolver must provide a short summary of the fix or the outcome.

### 4.4 Subscriptions & Notifications
* **Opt-in Updates:** Users can click "Follow" on a roadblock.
* **Notification Engine:** When a status changes or a resolution note is added, followers receive a notification via the Pocketbase real-time SDK or email.

---

## 5. Technical Requirements

### 5.1 Frontend (Next.js)
* **Architecture:** App Router for optimized routing.
* **Styling:** Tailwind CSS for a clean, professional "Enterprise-grade" look.
* **Deployment:** Static Export (`output: 'export'`) deployed to **AWS S3** and distributed via **CloudFront**.

### 5.2 Backend (Pocketbase)
* **Authentication:** Managed via Pocketbase (Email/Password or OAuth).
* **Database:** SQLite-backed collections.
* **Storage:** Pocketbase built-in file storage for any (optional) screenshots of roadblocks.

### 5.3 Anonymity Logic
* **The Decoupling:** Roadblocks are stored in a collection with "Create" access for all authenticated users, but no field exists to track the author. 
* **Follower Logic:** A separate `subscriptions` collection links `user_id` to `roadblock_id`. This allows for notifications while keeping the original report anonymous.

---

## 6. Data Schema (Proposed)

### Collection: `roadblocks`
| Field | Type | Options / Constraints |
| :--- | :--- | :--- |
| `id` | Record ID | Primary Key |
| `category` | Select | CI/CD, DX, Process, Tooling, Culture |
| `severity` | Select | Low, Med, High, Critical |
| `title` | Text | Max 100 chars |
| `description` | Markdown | Detailed context |
| `estimated_waste`| Number | Hours per week |
| `status` | Select | Open, In Progress, Resolved, Closed |
| `resolver_id` | Relation | Optional; links to `users` |
| `resolution_note`| Text | Optional; required on Close |

### Collection: `subscriptions`
| Field | Type | Options / Constraints |
| :--- | :--- | :--- |
| `user_id` | Relation | Link to `users` |
| `roadblock_id` | Relation | Link to `roadblocks` |

---

## 7. Success Metrics
1.  **Trust Score:** Volume of anonymous reports logged (indicates psychological safety).
2.  **Efficiency Reclaimed:** Total `estimated_waste` hours from all "Resolved" items.
3.  **MTTR:** Mean Time to Resolution for "Critical" severity roadblocks.
