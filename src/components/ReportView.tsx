import React, { useState } from 'react';
import { BusinessInsightItem, AgentStage, SheetMeta } from '../types';
import { isTextileDataset } from '../utils/dynamicPipeline';
import { TextileOverviewTab } from './reports/textile/TextileOverviewTab';
import { MachineryReportTab } from './reports/textile/MachineryReportTab';
import { EmployeeProductionTab } from './reports/textile/EmployeeProductionTab';
import { ProductUnitsTab } from './reports/textile/ProductUnitsTab';
import { TimeReportsTab } from './reports/textile/TimeReportsTab';
import { ProductionVarianceTab } from './reports/textile/ProductionVarianceTab';
import { MachineExpensesTab } from './reports/textile/MachineExpensesTab';
import { EmployeeExpensesTab } from './reports/textile/EmployeeExpensesTab';
import { VisualCategoryReportTab } from './reports/textile/VisualCategoryReportTab';
import { DataCleaningAgentTab } from './reports/textile/DataCleaningAgentTab';
import {
  Sparkles,
  Copy,
  Send,
  Loader2,
  CheckCircle2,
  BarChart3,
  CreditCard,
  Target,
  Building2,
  Users,
  Calendar,
  LayoutDashboard,
  FileText,
  Factory,
  Cog,
  Package,
  AlertTriangle,
  DollarSign,
  UserX,
  Clock,
  ShieldAlert,
  Split,
  Ban,
} from 'lucide-react';

interface ReportViewProps {
  insights: BusinessInsightItem[];
  stages: AgentStage[];
  sheets: SheetMeta[];
  onAskAgent: (query: string) => Promise<string>;
  activeStudio?: 'education' | 'textile';
}

type ReportSubTab =
  | 'overview'
  | 'data_cleaning_edu'
  | 'attendance_churn'
  | 'course_pacing'
  | 'faculty_matrix'
  | 'disciplinary'
  | 'courses'
  | 'financials'
  | 'admissions'
  | 'branches'
  | 'faculty'
  | 'trends'
  | 'textile_overview'
  | 'machinery'
  | 'machine_expenses'
  | 'employee'
  | 'employee_expenses'
  | 'products'
  | 'time'
  | 'variance'
  | 'category_visuals'
  | 'data_cleaning';

export const ReportView: React.FC<ReportViewProps> = ({
  insights,
  stages,
  sheets,
  onAskAgent,
  activeStudio,
}) => {
  const isTextile = true;
  const [activeSubTab, setActiveSubTab] = useState<string>('textile_overview');
  const [askQuery, setAskQuery] = useState('');
  const [askResponse, setAskResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync tab if dataset switched
  const isMockData = !sheets || sheets.length === 0 || sheets.some(s => s.name === 'loom_telemetry__production_daily');
  
  const allTabsIds = [
    'textile_overview',
    'machinery',
    'machine_expenses',
    'employee',
    'employee_expenses',
    'products',
    'time',
    'variance',
    'category_visuals',
    'data_cleaning',
  ];

  const customDataTabsIds = [
    'textile_overview',
    'machinery',
    'employee',
  ];

  const allowedTabs = isMockData ? allTabsIds : customDataTabsIds;

  const activeTabResolved = allowedTabs.includes(activeSubTab) ? activeSubTab : 'textile_overview';

  const completedStagesCount = stages.filter((s) => s.status === 'completed').length;
  const totalRows = sheets.reduce((acc, s) => acc + s.rows, 0);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim() || isAsking) return;

    setIsAsking(true);
    try {
      const reply = await onAskAgent(askQuery);
      setAskResponse(reply);
    } catch {
      setAskResponse('Unable to query agent intelligence at this time.');
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopyMarkdown = () => {
    let text = '';
    text = `# Surat Integrated Textile Complex — Executive Operations & Loom Intelligence Report
Unit: Unit 4 Surat | Processed Production Logs: 4,850 | Active Machines: 18 Looms & Frames | OEE: 88.4%

## 1. Executive Mill Summary & KPIs:
- Monthly Total Meters Produced: 128,450 linear meters (Ideal Rated Capacity: 141,200 m)
- Overall Mill Equipment OEE: 88.4% (Uptime Availability: 92.1%)
- First-Quality (Grade A) Yield: 96.8% (Scrap Rejection: 3.2% · 4,250m scrap)
- Monthly Gross Realized Turnover: ₹2.48 Crore across 12 fabric catalog SKUs
- Active Workforce: 24 master weavers, frame tenders, and maintenance technicians

## 2. Machinery Fleet Report:
- Total Fleet: 18 units (Airjet Looms: LOOM-AJ101 to LOOM-AJ104 @ 920 RPM, Rapier Looms: LOOM-RP201 to RP204 @ 560 RPM, Ring Frames: SPIN-RF301 to RF303 @ 18,500 RPM, Circular Knitting: KNIT-CK401 to CK402 @ 32 RPM)
- Top Loom Output: LOOM-AJ101 (8,200 m/day @ 92.4% OEE)
- Scheduled Servicing: LOOM-RP203 undergoing preventative rapier gripper overhaul

## 3. Employee-Wise Production:
- Top Performer: Rajeshwar Solanki (Master Weaver · Shift A) — 6,420 m output, 98.6% Grade A yield (+220m variance)
- Second Lead: Suresh Patel (Shift A) — 6,180 m output, 97.8% Grade A yield
- Shift Comparison: Shift A (98.0% Grade A) vs Shift B (95.8% Grade A) vs Shift C (91.4% Grade A)
- Training Dispatch: Shift C operators flagged for tension control and humidity deficit handling

## 4. Product-Wise Units Produced:
- Cotton Poplin 40s (SKU-CP40): 52,400 meters produced · ₹41.92L revenue · 24.5% margin
- Heavy Denim Indigo 12.5oz (SKU-DN12): 31,200 meters produced · ₹56.16L revenue · 32.8% margin (Margin Leader)
- Poly-Cotton Twill 65/35 (SKU-PC65): 24,800 meters produced · ₹26.04L revenue · 21.0% margin
- Combed Hosiery Spun Yarn 30s (SKU-SY30): 11,200 KG spooled · ₹39.20L revenue · 19.5% margin
- Mulberry Silk Chiffon (SKU-MS10): 3,850 meters produced · ₹36.57L revenue · 42.0% margin
- Single Jersey Greige (SKU-SJ24): 5,000 meters produced · ₹9.50L revenue · 22.0% margin

## 5. Daily, Monthly & Yearly Chronological Trajectory:
- Daily Cadence: 3-Shift continuous operation producing ~4,280 meters/day
- Monthly Scaling: Jan (114.2k m · 84.2% OEE) -> Mar (128.4k m · 88.4% OEE) -> Projected Jun (138.0k m · 91.5% OEE)
- Multi-Year Capacity Growth: 2023 (8 Looms · ₹14.2 Cr turnover) to 2026 (18 Looms · ₹32.5 Cr turnover)

## 6. Variance Between Every Production Run and Ideal Production:
- Mill-Wide Deficit: -12,750 meters (-9.03% vs theoretical 141,200 m capacity)
- Total Audited Losses: ₹4.82 Lakhs (unrecovered loom downtime and discarded yarn scrap)
- Root Cause Breakdown:
  1. Warp Yarn Snarl & Breakage: 38.4% (4,896 m lost)
  2. Mechanical Loom Feeder & Belt Jam: 24.2% (3,085 m lost)
  3. Beam Creel & Bobbin Changeover Latency: 16.8% (2,142 m lost)
  4. Environmental Humidity Drops in Shift C: 12.5% (1,594 m lost)
  5. Operator Handover & Routine Greasing: 8.1% (1,033 m lost)

## 7. Synthesized Multi-Agent Insights:
${insights.map((i) => `### ${i.title} (${i.category})\n${i.description}\n*Action*: ${i.recommendation}`).join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allTabs = [
    { id: 'textile_overview', label: 'Mill Overview & Insights', icon: Factory },
    { id: 'machinery', label: 'Machinery Report', icon: Cog },
    { id: 'machine_expenses', label: 'Machine & Overhead Expenses', icon: DollarSign },
    { id: 'employee', label: 'Employee Production', icon: Users },
    { id: 'employee_expenses', label: 'Employee-Wise Expenses', icon: CreditCard },
    { id: 'products', label: 'Product-Wise Units', icon: Package },
    { id: 'time', label: 'Daily / Monthly / Yearly', icon: Calendar },
    { id: 'variance', label: 'Production vs Ideal Variance', icon: AlertTriangle },
    { id: 'category_visuals', label: 'Visual Report by Category', icon: BarChart3 },
    { id: 'data_cleaning', label: 'Data Cleaning Agent', icon: Sparkles },
  ];

  const customDataTabs = [
    { id: 'textile_overview', label: 'Mill Overview & Insights', icon: Factory },
    { id: 'machinery', label: 'Machinery & Equipment Report', icon: Cog },
    { id: 'employee', label: 'Employee & Operator Production', icon: Users },
  ];

  const navTabs = isMockData ? allTabs : customDataTabs;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full animate-pulse bg-emerald-500`} />
            <h1 className="text-base font-semibold text-zinc-900 tracking-tight font-serif">
              Manufacturing Operations & Loom Intelligence
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {`Automated multi-agent synthesis across 18 high-speed looms, 24 weavers, and 4,850 production logs (${completedStagesCount}/${stages.length} stages completed)`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 px-3 py-1.5 rounded shadow-sm transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-500" />
            <span>{copied ? 'Copied Full Report!' : 'Export Full Brief'}</span>
          </button>
        </div>
      </div>

      {/* Advanced Multi-Tab Navigation Bar */}
      <div className="bg-[#FAFAFA] p-1.5 rounded border border-zinc-200 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabResolved === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200 font-bold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab Content Rendering */}
      <div>
        {/* TEXTILE REPORT VIEWS */}
        {activeTabResolved === 'textile_overview' && (
          <TextileOverviewTab onNavigateTab={(tabId) => setActiveSubTab(tabId)} sheets={sheets} />
        )}
        {activeTabResolved === 'machinery' && <MachineryReportTab sheets={sheets} />}
        {activeTabResolved === 'machine_expenses' && <MachineExpensesTab sheets={sheets} />}
        {activeTabResolved === 'employee' && <EmployeeProductionTab sheets={sheets} />}
        {activeTabResolved === 'employee_expenses' && <EmployeeExpensesTab sheets={sheets} />}
        {activeTabResolved === 'products' && <ProductUnitsTab sheets={sheets} />}
        {activeTabResolved === 'time' && <TimeReportsTab sheets={sheets} />}
        {activeTabResolved === 'variance' && <ProductionVarianceTab sheets={sheets} />}
        {activeTabResolved === 'category_visuals' && <VisualCategoryReportTab sheets={sheets} />}
        {activeTabResolved === 'data_cleaning' && <DataCleaningAgentTab sheets={sheets} />}
      </div>

      {/* Interactive AI Agent Briefing Q&A Box (Persistent at bottom for instant inquiry across tabs) */}
      <div className="bg-zinc-900 text-white rounded p-6 shadow-sm border border-zinc-800">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 font-mono">
            Ask Pipeline Intelligence
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-2xl mb-4 leading-relaxed">
          Query the autonomous mill engineering agent regarding machinery OEE, weaver yield ratings, product margins, daily/monthly variance, or shift downtime root causes.
        </p>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            placeholder={
              activeTabResolved === 'machinery'
                ? 'e.g., Which airjet loom has the highest downtime and why?'
                : activeTabResolved === 'employee'
                ? 'e.g., Compare Rajeshwar vs Suresh in Grade A first-quality yield.'
                : activeTabResolved === 'products'
                ? 'e.g., Which fabric SKU delivers the highest monthly gross margin?'
                : activeTabResolved === 'time'
                ? 'e.g., How does Shift C output compare with Shift A over the past 12 days?'
                : activeTabResolved === 'variance'
                ? 'e.g., What is our net variance against theoretical capacity and top 3 causes?'
                : 'e.g., Summarize our mill performance, OEE rate, and top scrap prevention measures.'
            }
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isAsking || !askQuery.trim()}
            className={`inline-flex items-center gap-1.5 text-zinc-900 text-xs font-bold px-4 py-2 rounded transition-colors disabled:opacity-50 bg-emerald-500 hover:bg-emerald-400`}
          >
            {isAsking ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </>
            )}
          </button>
        </form>

        {askResponse && (
          <div className="mt-4 p-4 rounded bg-zinc-800/80 border border-zinc-700 text-xs text-zinc-300 leading-relaxed animate-in fade-in duration-200">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pipeline Synthesis:
            </div>
            {askResponse}
          </div>
        )}
      </div>
    </div>
  );
};
