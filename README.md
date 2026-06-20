# Bangsamoro Investment Roadmap (BIRD) 2026–2035 Module

This module integrates the **Bangsamoro Investment Roadmap Development (BIRD)** strategic framework into the Strat Planner Pro platform. It translates the static, multi-page HTML strategic documents into a fully interactive, data-driven React Single Page Application (SPA) featuring systems thinking visualizations, mathematically quantified SWOT analysis, and a real-time Monitoring, Evaluation, and Learning (MEL) dashboard.

The UI is built using the **Apple Liquid Glass** aesthetic, customized with the official BIRD branding (Deep Space Navy, Emerald, and Cyan accents).

---

## 📂 Project Structure

```text
src/
│   │
│   ├── components/                      # 🆕 BARMM-Specific UI Components (from HTMLs)
│   │   ├── panels/                      # Maps to dashboard.html Panels A-E
│   │   │   ├── ParetoKPIPanel.tsx       # 6 Critical KPIs (Pareto Principle)
│   │   │   ├── BSCViewPanel.tsx         # Balanced Scorecard mapped to Leverage Points
│   │   │   ├── ActionPlanPanel.tsx      # 2026 Priority Actions & Budget Allocation
│   │   │   ├── SystemsMELPanel.tsx      # Feedback Loop Health Monitor (R1, R2, B1, B2)
│   │   │   └── PhaseTrackerPanel.tsx    # 3-Phase Implementation Roadmap (2026-2035)
│   │   ├── data-viz/                    # Maps to roadmap.html / index.html
│   │   │   ├── CLDVisualizer.tsx        # Interactive Causal Loop Diagrams (R1, R2, B1, B2)
│   │   │   ├── ArchetypeCards.tsx       # Systems Archetypes (Limits to Growth, Fixes that Fail)
│   │   │   └── LeveragePoints.tsx       # LP1 to LP5 Strategic Grid & Pillars
│   │   └── tables/                      # Maps to action-plan.html / strategy-map.html
│   │       ├── QuantifiedSWOT.tsx       # Applies RI, Risk, VI mathematical formulas
│   │       └── PriorityActionsTable.tsx # Detailed PAPs & Resource Allocation
│   │
│   ├── layout/
│   │   ├── AppLayout.tsx                # Main authenticated shell
│   │   ├── Sidebar.tsx                  # Navigation & Module Switcher
│   │   └── Topbar.tsx                   # Global Search, Theme Toggle, Profile
│   └── ui/                              # shadcn/ui primitives (Button, Card, etc.)
│
├── data/
│   └── bird/                            # 🆕 Static data extracted from HTML tables
│       ├── kpis.ts                      # Pareto 6 KPIs, BSC targets, Baselines
│       ├── actions.ts                   # 2026 Action Plan items, budgets, lead units
│       ├── clds.ts                      # R1, R2, B1, B2 loop definitions & nodes
│       └── phases.ts                    # 2026-2035 Phase data, budgets, milestones
│
├── lib/
│   ├── formulas.ts                      # 🆕 RI, Risk, VI calculation logic
│   ├── utils.ts                         # General helper functions
│   └── templateData.ts                  # Contains the Bangsamoro BIRD template seed
│
├── pages/                               # 🆕 Public-facing SPA Routes (Replaces static HTMLs)
│   ├── PublicRoadmap.tsx                # Equivalent to index.html / roadmap.html
│   └── PublicDashboard.tsx              # Equivalent to dashboard.html
│
├── hooks/
│   ├── useStrategicPlan.ts              # Core state management for Strat Planner
│   └── useBIRDData.ts                   # 🆕 Hook to manage BARMM specific state & formulas
│
├── styles/
│   └── index.css                        # Apple Liquid Glass theme + BIRD Branding
├── App.tsx                              # React Router setup (Public vs Authenticated)
└── main.tsx                             # Application entry point
```

---

## 🗺️ HTML to React Component Mapping

The original static HTML files have been decomposed into reusable, state-aware React components:

| Source HTML File | Target React Components | Key Features Implemented |
| :--- | :--- | :--- |
| **`dashboard.html`** | `panels/ParetoKPIPanel.tsx`, `BSCViewPanel.tsx`, `ActionPlanPanel.tsx`, `SystemsMELPanel.tsx`, `PhaseTrackerPanel.tsx` | Live MEL Dashboard, Pareto 80/20 KPI tracking, Feedback loop health monitor. |
| **`roadmap.html`** | `data-viz/CLDVisualizer.tsx`, `ArchetypeCards.tsx`, `PhaseTrackerPanel.tsx` | Interactive Causal Loop Diagrams (R1/R2/B1/B2), 3-Phase timeline (Foundation, Acceleration, Consolidation). |
| **`action-plan.html`** | `tables/PriorityActionsTable.tsx` | 2026 Priority Actions, Budget Allocation (₱1.3B), Lead Units, and Systems Thinking rationale. |
| **`strategy-map.html`** | `tables/QuantifiedSWOT.tsx` | Mathematically scored SWOT matrix with provincial focus and formula-driven sorting. |
| **`index.html`** | `data-viz/LeveragePoints.tsx` | Strategic Pillars, 4 Critical Leverage Points (LP1-LP4), and BEIE Framework overview. |

---

## 🧮 Mathematical Formulas (`src/lib/formulas.ts`)

To ensure analytical rigor, the SWOT analysis does not use arbitrary scoring. It applies the specific mathematical formulations defined in the BIRD 2026-2035 framework:

| SWOT Category | Formula | Scale | Purpose |
| :--- | :--- | :--- | :--- |
| **Strengths** | `RI = (Impact × Likelihood) / 5` | 1.0 – 5.0 | Measures internal resilience and structural advantage. |
| **Opportunities** | `RI = √(Impact × Likelihood)` | 1.0 – 5.0 | Square root moderates extreme values, balancing attractiveness with feasibility. |
| **Weaknesses** | `Risk = Impact × Likelihood` | 1.0 – 25.0 | Quantifies exposure to internal deficits requiring immediate mitigation. |
| **Threats** | `VI = (Impact² × Likelihood) / 25` | 1.0 – 5.0 | Emphasizes catastrophic potential; scores 4.0+ indicate systemic risk. |

---

## 🎨 Styling & Theming (`src/styles/index.css`)

The BIRD module utilizes a specialized subset of the Strat Planner Pro design system, tailored to reflect the official BARMM branding:

*   **Aesthetic:** Apple Liquid Glass (Frosted glass surfaces, backdrop-blur, subtle borders).
*   **Dark Mode Palette (Default):** Deep Space Navy (`#0B1426` / `hsl(218 48% 7%)`).
*   **Primary Accent:** Emerald (`#10b981` / `hsl(160 84% 45%)`) representing growth, halal integrity, and green economy.
*   **Secondary Accent:** Cyan (`#06b6d4`) representing digital transformation, connectivity, and BIMP-EAGA integration.
*   **Typography:** `Montserrat` (Headings), `Poppins` (Body), `JetBrains Mono` (Data/Financial figures).
*   **Custom Classes:** `.bird-panel`, `.gradient-text-emerald`, `.badge-emerald`, `.phase-line`.

---

## 🚀 Routing & Public Access

The BIRD roadmap is designed to be accessible to external stakeholders (investors, LGUs, international partners) without requiring a Strat Planner Pro login. 

In `src/App.tsx`, public routes are defined:
```tsx
// Public Facing Pages (Replaces static HTMLs)
<Route path="/bird/roadmap" element={<PublicRoadmap />} />
<Route path="/bird/dashboard" element={<PublicDashboard />} />

// Authenticated Strat Planner Pro App
<Route path="/*" element={<AppLayout />} />
```

---

## 📊 Data Layer (`src/data/bird/`)

Static data extracted directly from the BIRD V2.1 PDF and HTML documents is centralized in the `data/bird/` directory. This ensures that the UI components remain purely presentational and that updating a KPI baseline or budget allocation only requires editing a single TypeScript file.

*   **`kpis.ts`**: Contains the 6 Pareto KPIs (e.g., *Annual Investment Approvals: ₱5.1B → ₱15B*), BSC targets, and MEL status indicators.
*   **`actions.ts`**: The 2026 One-Year Action Plan, including budget allocations (e.g., *BHB Operationalization: ₱200M*), lead units, and linked Leverage Points.
*   **`clds.ts`**: Node and edge definitions for the R1 (Investment-Development), R2 (Governance-Confidence), B1 (Growth-Resource), and B2 (Security-Investment) loops.
*   **`phases.ts`**: The 3-Phase Architecture (Foundation, Acceleration, Consolidation) with budget envelopes (₱15B, ₱20B, ₱20B).

---

## 🛠️ Development & Usage

### Prerequisites
*   Node.js 20+
*   npm 10+

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
*   **Public Dashboard:** `http://localhost:5173/bird/dashboard`
*   **Public Roadmap:** `http://localhost:5173/bird/roadmap`
*   **Authenticated App:** `http://localhost:5173/` (Select the "Bangsamoro Investment Roadmap" template).

### Build for Production
```bash
npm run build
