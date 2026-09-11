import React, { useState } from 'react';
import { CATEGORY_VISUAL_REPORTS } from '../../../data/textileData';
import {
  Layers,
  Cog,
  Package,
  Factory,
  PieChart as PieChartIcon,
  TrendingUp,
  Percent,
  DollarSign,
  Zap,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const VisualCategoryReportTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'technology' | 'product' | 'department' | 'expense'>('technology');

  const { byTechnology, byProductCategory, byDepartmentAndShift, byExpensePool } = CATEGORY_VISUAL_REPORTS;

  // Chart data for Technology
  const techBarData = byTechnology.map((t) => ({
    name: t.technology.split(' ')[0] + ' ' + (t.technology.split(' ')[1] || ''),
    fullName: t.technology,
    meters: t.totalMetersProduced,
    revenue: t.totalRevenueInr / 100000, // Lakhs
    costPerMeter: t.avgCostPerMeterInr,
    oee: t.avgOeePct,
    powerKwh: t.totalPowerKwh,
  }));

  // Chart data for Product Category
  const productBarData = byProductCategory.map((p) => ({
    name: p.category.split(' ')[0],
    fullName: p.category,
    skus: p.skus,
    meters: p.metersProduced,
    revenue: p.realizedRevenueInr / 100000,
    cost: p.totalCostInr / 100000,
    marginPct: p.grossMarginPct,
    yieldPct: p.firstQualityYieldPct,
  }));

  // Chart data for Department & Shift
  const deptShiftData = byDepartmentAndShift.map((d) => ({
    name: d.department.split(' ')[0] + ' ' + (d.department.split(' ')[1] || ''),
    fullName: d.department,
    shiftA: d.shiftAOutput,
    shiftB: d.shiftBOutput,
    shiftC: d.shiftCOutput,
    total: d.shiftAOutput + d.shiftBOutput + d.shiftCOutput,
    scrapRate: d.scrapRatePct,
    laborCost: d.laborCostInr / 1000,
    powerCost: d.powerCostInr / 1000,
  }));

  // Expense Pool Colors
  const expenseColors = ['#6366f1', '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981'];
  const expensePieData = byExpensePool.map((e, index) => ({
    name: e.expenseCategory,
    value: e.monthlyAmountInr,
    sharePct: e.sharePct,
    costPerMeter: e.costPerMeterInr,
    color: expenseColors[index % expenseColors.length],
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Category Selection Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory('technology')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'technology'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cog className="w-3.5 h-3.5" />
            <span>By Machinery Technology</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('product')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'product'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>By Fabric & Product Category</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('department')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'department'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>By Department & Shift Operations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('expense')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'expense'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>By Expense Cost Center</span>
          </button>
        </div>

        <div className="text-2xs text-slate-500 font-medium px-2">
          Autonomous Categorical Synthesis
        </div>
      </div>

      {/* 1. BY MACHINERY TECHNOLOGY */}
      {activeCategory === 'technology' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {byTechnology.map((t) => (
              <div key={t.technology} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-2xs font-semibold uppercase tracking-wider text-purple-600">
                  {t.fleetCount} Units in Fleet
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{t.technology}</h4>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Monthly Output:</span>
                    <strong className="text-slate-900">{t.totalMetersProduced.toLocaleString()} m</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Average OEE:</span>
                    <strong className="text-emerald-700">{t.avgOeePct}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cost / Meter:</span>
                    <strong className="text-slate-900">₹{t.avgCostPerMeterInr.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Turnover:</span>
                    <strong className="text-purple-700">₹{(t.totalRevenueInr / 100000).toFixed(1)}L</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Production Output vs Equipment OEE by Loom Technology
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Airjet looms lead volume with 91,500m @ 91.2% OEE, while ring spinning frames achieve 94.6% continuous uptime.
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techBarData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k m`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(val: any, name: string) => [
                      name === 'meters' ? `${Number(val).toLocaleString()} meters` : `${val}% OEE`,
                      name === 'meters' ? 'Production Output' : 'Average OEE',
                    ]}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar yAxisId="left" dataKey="meters" name="Production Output (meters)" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="oee" name="Average OEE (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. BY FABRIC & PRODUCT CATEGORY */}
      {activeCategory === 'product' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {byProductCategory.map((p) => (
              <div key={p.category} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{p.category}</h4>
                  <span className="px-2 py-0.5 rounded-full text-3xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {p.grossMarginPct}% Margin
                  </span>
                </div>
                <p className="text-2xs text-slate-500 mt-0.5">{p.skus}</p>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Meters Produced:</span>
                    <strong className="text-slate-900">{p.metersProduced.toLocaleString()} m</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Realized Revenue:</span>
                    <strong className="text-purple-700">₹{(p.realizedRevenueInr / 100000).toFixed(2)}L</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>First-Quality (Grade A) Yield:</span>
                    <strong className="text-emerald-700">{p.firstQualityYieldPct}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Fabric Revenue vs Gross Margin Contribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Bottom-Weight Denim generates ₹88.92L revenue @ 32.8% margin, while Mulberry Silk delivers high-tier 42.0% margins.
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productBarData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}L`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(val: any, name: string) => [
                      name === 'revenue' ? `₹${val} Lakhs` : `${val}%`,
                      name === 'revenue' ? 'Realized Revenue' : 'Gross Margin',
                    ]}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar yAxisId="left" dataKey="revenue" name="Realized Revenue (₹ Lakhs)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="marginPct" name="Gross Margin (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. BY DEPARTMENT & SHIFT OPERATIONS */}
      {activeCategory === 'department' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Shift-Wise Production Distribution (Shift A vs B vs C)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Shift A (Morning) consistently leads with peak weave efficiency, while Shift C exhibits night latency.
              </p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptShiftData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k m`} />
                    <Tooltip
                      formatter={(val: any, name: string) => [`${Number(val).toLocaleString()} meters`, name]}
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="shiftA" name="Shift A (Morning)" fill="#10b981" stackId="a" />
                    <Bar dataKey="shiftB" name="Shift B (Evening)" fill="#3b82f6" stackId="a" />
                    <Bar dataKey="shiftC" name="Shift C (Night)" fill="#f59e0b" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Department Operational Cost Comparison
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Labor payroll vs direct power electricity by manufacturing facility
                </p>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptShiftData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}k`} />
                      <Tooltip
                        formatter={(val: any, name: string) => [`₹${val}k`, name]}
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="laborCost" name="Labor Payroll Cost (₹k)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="powerCost" name="Power Grid Cost (₹k)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BY EXPENSE COST CENTER */}
      {activeCategory === 'expense' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Textile Mill Manufacturing Cost Center Distribution (₹2.06 Cr Total)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Raw materials (yarn/fiber) represent 45.8% of mill outlays, followed by energy (18.5%) and labor payroll (16.2%).
              </p>
              <div className="space-y-3">
                {byExpensePool.map((e, index) => (
                  <div key={e.expenseCategory} className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: expenseColors[index % expenseColors.length] }}
                        />
                        <span>{e.expenseCategory}</span>
                        <span className="text-3xs font-medium px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          {e.nature}
                        </span>
                      </div>
                      <div className="text-right">
                        <span>₹{(e.monthlyAmountInr / 100000).toFixed(2)} Lakhs</span>
                        <span className="text-purple-700 ml-2 font-bold">({e.sharePct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${e.sharePct}%`,
                          backgroundColor: expenseColors[index % expenseColors.length],
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-3xs text-slate-500 mt-1">
                      <span>Impact per meter produced: ₹{e.costPerMeterInr.toFixed(2)} / linear meter</span>
                      <span>128,450 meters mill base</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Cost Center Share</h3>
                <p className="text-xs text-slate-500 mb-2">Visual proportion of mill expenditures</p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {expensePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => `₹${(Number(val) / 100000).toFixed(2)} Lakhs`}
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-xs text-purple-900 mt-2">
                <div className="font-semibold flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  Key Profitability Lever
                </div>
                <p className="text-2xs text-purple-800 leading-relaxed">
                  A 3% saving in yarn waste and loom warp breaks releases ₹3.25 Lakhs directly to monthly EBITDA.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
