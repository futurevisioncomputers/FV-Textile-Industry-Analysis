import { AgentStage } from '../types';

export const TEXTILE_AGENT_STAGES: AgentStage[] = [
  {
    id: 'stage_tex_machinery',
    stageNumber: '1',
    name: 'Loom Fleet & Machinery Telemetry Agent',
    subtitle: 'Airjet vs Rapier loom RPM, MTBF & machine utilization',
    role: 'Textile Machinery Telemetry & Asset Maintenance Engineer',
    objective: 'Audit machinery fleet in machinery_master. Profile rated vs actual RPM, Mean Time Between Failures (MTBF), kilowatt power load, and machine operating status across Weaving Sheds A and B.',
    status: 'completed',
    inputSheets: ['machinery_master'],
    toolsUsed: ['LoomSpeedProfiler', 'MtbfCalculator', 'PowerEfficiencyAuditor'],
    logs: [
      'Ingested machinery_master tracking 18 Airjet and Rapier production looms',
      'Profiled Airjet fleet: Tsudakoma ZAX9200i operating at 950 RPM; Toyota JAT810 operating at 900 RPM',
      'Profiled Rapier fleet: Picanol OptiMax-i operating at 620 RPM with heavy fabric denim capability',
      'Calculated fleet uptime: Weaving Shed A achieved 93.5% uptime; flagged LOOM-AJ-104 under preventative maintenance (MTBF 68 hrs)',
    ],
    outputSummary: 'Audited 18 weaving machines; Weaving Shed A achieved 93.5% uptime with 950 RPM on Tsudakoma airjet looms.',
    artifact: {
      title: 'Textile Machinery Fleet & Operating Telemetry Report',
      type: 'markdown',
      content: `# Textile Machinery Fleet & Operating Telemetry Report
*Domain: Industrial Textile Manufacturing & Weaving Looms*

## Machinery Fleet Performance
- **Primary Weaving Fleet**: **Tsudakoma ZAX9200i** Airjet Looms operating at **950 RPM** delivering **850 meters/shift**.
- **Heavy Weave Rapier Fleet**: **Picanol OptiMax-i** operating at **620 RPM** dedicated to 12.5 oz Denim bottom-wear.
- **Spinning Plant Fleet**: **Rieter G38** Ring Frame operating at **18,500 RPM** across 1,200 spindles.

### Fleet Telemetry Summary
| Machine ID | Machine Model | Type | Rated RPM | Ideal Shift Cap (m) | Uptime % | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **LOOM-AJ-101** | Tsudakoma ZAX9200i | Airjet Loom | 950 RPM | 850 m | **94.2%** | Operational |
| **LOOM-AJ-102** | Tsudakoma ZAX9200i | Airjet Loom | 950 RPM | 850 m | **92.8%** | Operational |
| **LOOM-AJ-104** | Toyota JAT810 | Airjet Loom | 900 RPM | 800 m | **82.5%** | Under Maintenance |
| **LOOM-RP-201** | Picanol OptiMax-i | Rapier Loom | 620 RPM | 620 m | **91.5%** | Operational |
| **SPIN-RF-301** | Rieter G38 (1200 Sp.) | Ring Spinning | 18,500 RPM | 1,200 kg | **96.1%** | Operational |`,
    },
  },
  {
    id: 'stage_tex_workforce',
    stageNumber: '2',
    name: 'Weaver Shifts & Technical Operator Matrix Agent',
    subtitle: 'Shift A/B/C allocations, Master Weavers & Grade-A yield',
    role: 'Mill Shift Superintendent & Workforce Productivity Auditor',
    objective: 'Audit mill technical personnel in employee_roster. Correlate weaver experience, shift timing (Shift A, B, C), and skill grades with machine operating efficiency and Grade-A fabric yield.',
    status: 'completed',
    inputSheets: ['employee_roster', 'machinery_master'],
    toolsUsed: ['ShiftYieldCorrelator', 'SkillGradeMatrixAuditor', 'OperatorEfficiencyScorer'],
    logs: [
      'Ingested employee_roster cataloging 24 weavers, technicians, and spin tenders',
      'Correlated skill grade to fabric yield: Grade A Master Weavers (Rajeshwar Solanki, Ghanshyam Patel) achieve 98.6% Grade-A yield',
      'Detected Shift C (Night Shift 22:00 - 06:00) variance: Yield drops to 91.4% under junior operators (Kailash Meghwal)',
      'Formulated shift pairing recommendation: Pair Senior Master Weavers with Junior tenders during night shifts',
    ],
    outputSummary: 'Master Weavers achieve 98.6% Grade-A yield; identified 7.2% efficiency gap between Shift A and Night Shift C.',
    artifact: {
      title: 'Weaver Workforce Productivity & Skill Matrix Audit',
      type: 'markdown',
      content: `# Weaver Workforce Productivity & Skill Matrix Audit
*Source: employee_roster (Linked to machinery_master via assigned_machine)*

### Key Operator Takeaways
1. **Master Weaver Impact**: Operators with >10 years experience (Rajeshwar Solanki, Ghanshyam Patel) achieve **97%+ efficiency** and **<1.5% fabric scrap**.
2. **Night Shift (Shift C) Bottleneck**: Shift C records higher downtime (84 min/shift) and lower efficiency (81.0%) due to unmonitored humidity changes and inexperienced warp handling.`,
    },
  },
  {
    id: 'stage_tex_product_catalog',
    stageNumber: '3',
    name: 'Yarn Specifications & Fabric Catalog Agent',
    subtitle: 'Cotton Poplin 40s, Denim 12.5oz, GSM, meters/shift & margin %',
    role: 'Textile Material Standards & Product Engineering Specialist',
    objective: 'Profile fabric constructions in product_catalog. Evaluate yarn count specifications, fabric GSM, standard weave patterns (Plain 1x1, Twill 3/1, Satin), ideal shift speeds, and gross profit margin percentages.',
    status: 'completed',
    inputSheets: ['product_catalog'],
    toolsUsed: ['YarnCountCalculator', 'FabricGsmAuditor', 'WeaveMarginAnalyzer'],
    logs: [
      'Ingested product_catalog covering 12 standard fabric qualities',
      'Classified high-margin products: Pure Mulberry Silk Chiffon (42.0% margin, ₹680/m) and Indigo Denim (31.8% margin, ₹285/m)',
      'Profiled high-volume flagship: 100% Combed Cotton Poplin 40s (118 GSM, Plain 1x1, 850 m/shift ideal capacity)',
      'Verified unit pricing consistency and standard production benchmarks',
    ],
    outputSummary: 'Cataloged 12 fabric qualities; flagged Cotton Poplin 40s as primary volume anchor and Indigo Denim as margin driver.',
    artifact: {
      title: 'Yarn Specifications & Fabric Construction Catalog',
      type: 'markdown',
      content: `# Yarn Specifications & Fabric Construction Catalog
*Master Table: product_catalog*

### Standard Fabric Constructions
| Product ID | Fabric Description | Yarn Count | GSM | Weave Pattern | Standard Rate | Shift Target | Gross Margin % |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PRD-COT-40** | 100% Combed Cotton Poplin | 40s Ne Combed | 118 | Plain 1x1 | ₹165.00 / m | 850 m | **26.5%** |
| **PRD-DNM-12** | Ring-Spun Indigo Denim | 7s x 9s Slub | 420 | Twill 3/1 | ₹285.00 / m | 620 m | **31.8%** |
| **PRD-PC-50** | Poly-Cotton Uniform Twill | 2/40s PC | 215 | Twill 2/1 | ₹145.00 / m | 750 m | **22.4%** |
| **PRD-SLK-16** | Mulberry Silk Satin Chiffon | 20/22D Raw Silk | 68 | Satin Crepe | ₹680.00 / m | 420 m | **42.0%** |
| **PRD-YRN-30** | Combed Hosiery Spun Yarn | 30s Ring Spun | 0 | Cones | ₹340.00 / kg | 1,200 kg | **18.2%** |`,
    },
  },
  {
    id: 'stage_tex_production',
    stageNumber: '4',
    name: 'Daily Shift Weaving Production & Variance Agent',
    subtitle: 'Actual output meters vs ideal target, variance units & downtime',
    role: 'Weaving Shed Production Controller & Variance Analyst',
    objective: 'Analyze shift-level production logs in production_daily_logs. Measure actual meters woven vs ideal shift targets, calculate variance %, categorize downtime reasons, and isolate root causes of output deficits.',
    status: 'completed',
    inputSheets: ['production_daily_logs', 'machinery_master', 'product_catalog'],
    toolsUsed: ['ProductionVarianceCalculator', 'DowntimeParetoClassifier', 'ShiftEfficiencyIndexer'],
    logs: [
      'Ingested 4,850 shift logs across 3 operational shifts (Shift A, Shift B, Shift C)',
      'Shift A performance: Average 98.1% efficiency with 13 minutes average downtime',
      'Shift B performance: Average 93.2% efficiency with 36 minutes downtime (weft feeder yarn breaks)',
      'Shift C performance: Average 81.0% efficiency with 84 minutes downtime (humidity drops below 55% RH triggering static warp breaks)',
      'Quantified daily production shortfall: ~240 meters per night shift on Weaving Shed A airjets',
    ],
    outputSummary: 'Shift A achieved 98.1% target efficiency; Shift C suffered 84 min downtime due to weaving shed humidity drops.',
    artifact: {
      title: 'Daily Shift Weaving Production & Variance Report',
      type: 'markdown',
      content: `# Daily Shift Weaving Production & Variance Report
*Source: production_daily_logs*

### Shift Production Efficiency Comparison
- **Shift A (Morning 06:00 - 14:00)**: **98.1% Efficiency** (Avg. 835 m / 850 m target)
- **Shift B (Evening 14:00 - 22:00)**: **93.2% Efficiency** (Avg. 792 m / 850 m target)
- **Shift C (Night 22:00 - 06:00)**: **81.0% Efficiency** (Avg. 648 m / 800 m target)

### Downtime Pareto Classification
1. **Environmental Humidity Fluctuation (<55% RH)**: Causes **62%** of total night-shift downtime.
2. **Weft Feeder Yarn Breaks**: Accounts for **24%** of downtime on high-speed airjets.
3. **Selvedge Cutter Blade Adjustments**: Accounts for **14%** of routine setup downtime.`,
    },
  },
  {
    id: 'stage_tex_defect_audit',
    stageNumber: '5',
    name: 'Fabric Defect & 4-Point System Quality Audit Agent',
    subtitle: 'Root-cause categorization, financial scrap loss in ₹ & corrective actions',
    role: 'Fabric Quality Assurance Lead & Defect Diagnostic Auditor',
    objective: 'Audit batch variance records in variance_and_quality_audit. Inspect fabric defect points (4-Point System), assess root-cause categories (environmental humidity, selvedge tension, slub irregularity), and compute net financial scrap loss.',
    status: 'completed',
    inputSheets: ['variance_and_quality_audit'],
    toolsUsed: ['FourPointDefectAuditor', 'ScrapLossCalculator', 'CorrectiveActionValidator'],
    logs: [
      'Audited 1,240 batch variance records and defect inspections',
      'Identified critical batch variance on BATCH-AJ40-101 (LOOM-AJ-104): -152 meters output deficit resulting in ₹25,080 financial loss',
      'Diagnosed root cause: Night-time relative humidity dropped to 52% causing brittle warp yarn and static discharge',
      'Audited Rapier Denim BATCH-RP12-204: -90 meters variance (₹25,650 loss) due to warp beam tension imbalance',
      'Validated engineering countermeasures: Calibrated automated mist atomizers and ultrasonic humidifiers in Shed A',
    ],
    outputSummary: 'Diagnosed ₹50,730 scrap loss across 2 batches rooted in humidity drops and beam tension; validated mist atomizer calibration.',
    artifact: {
      title: 'Fabric Defect & Quality Variance Audit',
      type: 'markdown',
      content: `# Fabric Defect & Quality Variance Audit
*Source: variance_and_quality_audit*

### Critical Batch Variance Audit
| Audit ID | Batch Number | Machine ID | Fabric | Variance (m) | Root Cause | Financial Loss (₹) | Corrective Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **VAR-2026-801** | BATCH-AJ40-101 | LOOM-AJ-104 | Cotton Poplin 40s | **-152 m** | Environmental Humidity Drop (<55% RH) | **₹25,080.00** | Calibrated mist atomizers & auto humidity sensors |
| **VAR-2026-802** | BATCH-RP12-204 | LOOM-RP-202 | Denim 12.5 oz | **-90 m** | Warp Beam Tension Imbalance | **₹25,650.00** | Adjusted electronic warp let-off tension brakes |
| **VAR-2026-803** | BATCH-CK30-301 | KNIT-CK-401 | Single Jersey Greige | **-42 kg** | Needle Latch Accumulation & Lint | **₹15,960.00** | Implemented compressed air blowers on circular frames |`,
    },
  },
  {
    id: 'stage_tex_oee_synthesis',
    stageNumber: '6',
    name: 'Mill OEE & Production Optimization Sentinel',
    subtitle: 'Overall Equipment Effectiveness (91.4%), warp break SLA & lean actions',
    role: 'Chief Operations Officer & Lean Textile Consultant',
    objective: 'Synthesize machine utilization, weaver efficiency, production logs, and defect audits into a unified Overall Equipment Effectiveness (OEE) score. Establish operational sentinel alerts for automated loom intervention.',
    status: 'completed',
    inputSheets: ['machinery_master', 'employee_roster', 'production_daily_logs', 'variance_and_quality_audit'],
    toolsUsed: ['OeeCalculator', 'WarpBreakSentinel', 'LeanActionOptimizer'],
    logs: [
      'Calculated mill-wide Overall Equipment Effectiveness: Availability (94.2%) × Performance (98.1%) × Quality (98.6%) = 91.4% OEE',
      'Established Warp Break Sentinel: Triggers alert when breaks exceed 2.5 per 10,000 picks',
      'Configured automated environmental humidity sentinel: Triggers mist atomizers whenever RH falls below 60%',
      'Projected financial upside: Eliminating night-shift humidity deficits recovers ₹1,85,000 in monthly production margin',
    ],
    outputSummary: 'Mill OEE achieved 91.4%; configured automated humidity and warp break sentinels to recover ₹1,85,000 monthly.',
    artifact: {
      title: 'Mill OEE & Production Optimization Charter',
      type: 'markdown',
      content: `# Mill OEE & Production Optimization Charter
*Comprehensive Multi-Agent Synthesis across Weaving Sheds A, B and Spinning Plant*

## Overall Equipment Effectiveness (OEE)
- **Machine Fleet Availability**: **94.2%** (Uptime factoring maintenance)
- **Production Performance Efficiency**: **98.1%** (Shift A/B operating speeds)
- **First-Quality Grade-A Yield**: **98.6%** (Minimal scrap and slub defects)
- **Composite Mill OEE**: **91.4%** (Exceeds world-class textile benchmark of 85%)

### Prioritized Lean Operational Initiatives
1. **P1 - Closed-Loop Humidity Automation**: Automate ultrasonic atomizers in Shed A to maintain 65% RH 24/7 (Saves ₹1,85,000/mo).
2. **P1 - Night Shift Senior Weaver Pairing**: Rotate Master Weavers onto Shift C to train junior tenders and curb selvedge adjustments.
3. **P2 - Electronic Let-Off Tension Tuning**: Implement digital load-cell tension sensors on Rapier Denim looms to prevent warp streak lines.`,
    },
  },
];
