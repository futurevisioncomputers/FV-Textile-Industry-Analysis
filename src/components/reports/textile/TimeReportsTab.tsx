import React, { useState } from 'react';
import {
  DAILY_PRODUCTION_TIMELINE,
  MONTHLY_PRODUCTION_SERIES,
  YEARLY_PRODUCTION_SERIES,
  TEXTILE_KPI_SUMMARY
} from '../../../data/textileData';
import {
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  Layers,
  CheckCircle2,
  CalendarDays,
  History,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const TimeReportsTab: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  return (
    <div className="space-y-6">
      {/* Top Banner & Timeframe Switcher */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h2 className="text-sm font-semibold text-slate-900 tracking-wide uppercase">
                Temporal Production Intelligence — Daily, Monthly &amp; Yearly Reports
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Chronological production analysis tracking daily 3-shift cadence, monthly seasonal capacity targets, and multi-year manufacturing scaling.
            </p>
          </div>

          <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTimeframe('daily')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTimeframe === 'daily'
                  ? 'bg-white text-purple-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Report</span>
            </button>
            <button
              onClick={() => setActiveTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTimeframe === 'monthly'
                  ? 'bg-white text-purple-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Monthly Report</span>
            </button>
            <button
              onClick={() => setActiveTimeframe('yearly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTimeframe === 'yearly'
                  ? 'bg-white text-purple-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Yearly Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* DAILY VIEW */}
      {activeTimeframe === 'daily' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Daily Shift Area Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Daily Production Volume by Shift (March 2026)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Stacked production contribution across Shift A (Morning), Shift B (Evening), and Shift C (Night).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500" /> Shift A
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <span className="w-3 h-3 rounded-xs bg-blue-500" /> Shift B
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <span className="w-3 h-3 rounded-xs bg-purple-500" /> Shift C
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DAILY_PRODUCTION_TIMELINE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                            <div className="font-semibold text-purple-300">Date: {label}</div>
                            <div className="text-emerald-400">Shift A: {d.shiftA} m</div>
                            <div className="text-blue-400">Shift B: {d.shiftB} m</div>
                            <div className="text-purple-400">Shift C: {d.shiftC} m</div>
                            <div className="font-bold border-t border-slate-700 pt-1 mt-1 text-white">
                              Total: {d.total} m (Ideal: {d.idealTarget} m)
                            </div>
                            <div className={d.variance >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                              Variance: {d.variance >= 0 ? `+${d.variance}` : d.variance} m
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="shiftC" stackId="1" stroke="#a855f7" fill="#c084fc" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="shiftB" stackId="1" stroke="#3b82f6" fill="#60a5fa" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="shiftA" stackId="1" stroke="#10b981" fill="#34d399" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-900">
                Daily Shift Production &amp; Mill Quota Ledger
              </h3>
              <span className="text-[11px] text-slate-500">
                Showing March 1 - March 12, 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium text-[11px]">
                    <th className="py-2.5 px-4">Production Date</th>
                    <th className="py-2.5 px-4 text-right">Shift A (06-14)</th>
                    <th className="py-2.5 px-4 text-right">Shift B (14-22)</th>
                    <th className="py-2.5 px-4 text-right">Shift C (22-06)</th>
                    <th className="py-2.5 px-4 text-right">Daily Total (m)</th>
                    <th className="py-2.5 px-4 text-right">Ideal Target (m)</th>
                    <th className="py-2.5 px-4 text-right">Daily Variance</th>
                    <th className="py-2.5 px-4 text-center">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DAILY_PRODUCTION_TIMELINE.map((row) => (
                    <tr key={row.date} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.date}/2026</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-medium">{row.shiftA.toLocaleString()} m</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-700 font-medium">{row.shiftB.toLocaleString()} m</td>
                      <td className="py-3 px-4 text-right font-mono text-purple-700 font-medium">{row.shiftC.toLocaleString()} m</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{row.total.toLocaleString()} m</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">{row.idealTarget.toLocaleString()} m</td>
                      <td className="py-3 px-4 text-right font-mono">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          row.variance >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {row.variance >= 0 ? `+${row.variance}` : row.variance} m
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.variance >= 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {row.variance >= 0 ? 'Target Achieved' : 'Minor Gap'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY VIEW */}
      {activeTimeframe === 'monthly' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Monthly Bar Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Monthly Production Trajectory &amp; Mill Capacity Gap (2026)
              </h3>
              <p className="text-[11px] text-slate-500">
                Tracking monthly progress against capacity targets with progressive OEE improvements.
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_PRODUCTION_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                            <div className="font-semibold text-purple-300">{d.month}</div>
                            <div>Actual: <span className="font-mono text-emerald-400">{d.actualMeters.toLocaleString()} m</span></div>
                            <div>Capacity Target: <span className="font-mono text-slate-300">{d.idealTarget.toLocaleString()} m</span></div>
                            <div>OEE: <span className="font-mono text-blue-300">{d.oeePct}%</span></div>
                            <div>Scrap Rejection: <span className="font-mono text-red-300">{d.scrapPct}%</span></div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="idealTarget" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Capacity Target" />
                  <Bar dataKey="actualMeters" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Actual Output" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-900">
                2026 Monthly Mill Production Summary
              </h3>
              <span className="text-[11px] text-slate-500">6-Month Rolling Schedule</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium text-[11px]">
                    <th className="py-2.5 px-4">Month</th>
                    <th className="py-2.5 px-4 text-right">Actual Output (m)</th>
                    <th className="py-2.5 px-4 text-right">Capacity Target (m)</th>
                    <th className="py-2.5 px-4 text-right">Variance</th>
                    <th className="py-2.5 px-4 text-right">OEE Efficiency %</th>
                    <th className="py-2.5 px-4 text-right">Scrap Rejection %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MONTHLY_PRODUCTION_SERIES.map((m) => (
                    <tr key={m.month} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{m.month}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-purple-700">{m.actualMeters.toLocaleString()} m</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">{m.idealTarget.toLocaleString()} m</td>
                      <td className="py-3 px-4 text-right font-mono text-red-500 font-medium">{m.variance.toLocaleString()} m</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">{m.oeePct}%</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">{m.scrapPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* YEARLY VIEW */}
      {activeTimeframe === 'yearly' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Multi-Year Mill Capacity Scaling (2023 - 2026 YTD)
              </h3>
              <p className="text-[11px] text-slate-500">
                Mill expansion from 8 looms producing 8.4 Lakh meters to 18 modern high-speed machines yielding 15.8 Lakh meters.
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={YEARLY_PRODUCTION_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                            <div className="font-semibold text-purple-300">Year: {d.year}</div>
                            <div>Output: <span className="font-mono text-emerald-400">{(d.totalMeters / 100000).toFixed(1)} Lakh m</span></div>
                            <div>Capacity: <span className="font-mono text-slate-300">{(d.capacityMeters / 100000).toFixed(1)} Lakh m</span></div>
                            <div>Active Fleet: <span className="font-mono text-blue-300">{d.activeLooms} Looms</span></div>
                            <div>Turnover: <span className="font-mono text-amber-300">₹{d.turnoverInrLakhs} Lakhs</span></div>
                            <div>OEE: <span className="font-mono text-emerald-300">{d.oeePct}%</span></div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="capacityMeters" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Installed Capacity" />
                  <Bar dataKey="totalMeters" fill="#6366f1" radius={[4, 4, 0, 0]} name="Actual Output" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {YEARLY_PRODUCTION_SERIES.map((y) => (
              <div key={y.year} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-mono">{y.year}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                    {y.activeLooms} Looms Active
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {(y.totalMeters / 100000).toFixed(2)}L Meters
                </div>
                <div className="text-[11px] text-slate-500">
                  Turnover: <span className="font-semibold text-slate-800">₹{(y.turnoverInrLakhs / 100).toFixed(2)} Cr</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  OEE: {y.oeePct}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
