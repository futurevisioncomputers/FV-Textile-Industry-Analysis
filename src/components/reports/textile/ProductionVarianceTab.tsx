import React, { useState } from 'react';
import {
  BATCH_VARIANCE_LEDGER,
  VARIANCE_ROOT_CAUSES,
  TEXTILE_KPI_SUMMARY
} from '../../../data/textileData';
import {
  AlertTriangle,
  TrendingDown,
  Percent,
  Layers,
  Wrench,
  CheckCircle2,
  DollarSign,
  Filter,
  Search,
  SlidersHorizontal,
  ArrowDownRight,
  ShieldAlert,
  Sparkles
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
  Legend
} from 'recharts';

export const ProductionVarianceTab: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredBatches = BATCH_VARIANCE_LEDGER.filter((batch) => {
    const matchesSeverity =
      selectedSeverity === 'all' ||
      batch.status.toLowerCase().includes(selectedSeverity.toLowerCase());
    const matchesSearch =
      batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.rootCause.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const totalIdealMeters = BATCH_VARIANCE_LEDGER.reduce((acc, b) => acc + b.idealMeters, 0);
  const totalActualMeters = BATCH_VARIANCE_LEDGER.reduce((acc, b) => acc + b.actualMeters, 0);
  const totalVarianceMeters = totalActualMeters - totalIdealMeters;
  const totalScrapLoss = BATCH_VARIANCE_LEDGER.reduce((acc, b) => acc + b.scrapLossInr, 0);

  const waterfallData = VARIANCE_ROOT_CAUSES.map((r) => ({
    name: r.cause.split(' ')[0] + ' ' + (r.cause.split(' ')[1] || ''),
    lostMeters: r.lostMeters,
    percentage: r.percentage,
    color: r.color,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner & High-Level Variance Impact */}
      <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-900 text-white p-5 rounded-xl border border-red-900/40 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-sm font-semibold tracking-wide uppercase text-red-300">
                Production vs. Ideal Capacity Variance Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Run-by-run audit comparing theoretical loom capacity against realized output, root-cause attribution, financial loss quantification, and engineering remediations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              -9.03% Mill-Wide Variance Gap
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div>
            <div className="text-[11px] text-slate-400">Ideal Quota Target</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {TEXTILE_KPI_SUMMARY.idealCapacityMonthly.toLocaleString()} m
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Rated Machinery Capacity</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Actual Realized Output</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {TEXTILE_KPI_SUMMARY.totalMetersProducedMonthly.toLocaleString()} m
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Grade A Yield: 96.8%</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Net Production Deficit</div>
            <div className="text-xl font-bold font-mono text-red-400 mt-0.5">
              {TEXTILE_KPI_SUMMARY.millOverallVarianceMeters.toLocaleString()} m
            </div>
            <div className="text-[10px] text-red-300 mt-0.5">12,750 Meters Lost</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Total Scrap &amp; Idle Loss</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
              ₹{(totalScrapLoss / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-amber-200 mt-0.5">Audited Batches Sample</div>
          </div>
        </div>
      </div>

      {/* Root Causes Waterfall Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waterfall Root Cause Losses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              Variance Attribution by Root Cause (Meters Lost)
            </h3>
            <p className="text-[11px] text-slate-500">
              Primary operational drivers responsible for the monthly 12,750 meter output deficit.
            </p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg space-y-1">
                          <div className="font-semibold text-red-300">{d.name}</div>
                          <div>Meters Lost: <span className="font-mono text-red-400">-{d.lostMeters.toLocaleString()} m</span></div>
                          <div>Share of Variance: <span className="font-mono text-amber-300">{d.percentage}%</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="lostMeters" radius={[4, 4, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Root Cause Percentage Share */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              Root Cause Variance Distribution (%)
            </h3>
            <p className="text-[11px] text-slate-500">
              Warp breaks and loom mechanical stops comprise &gt;62% of all lost production.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            {VARIANCE_ROOT_CAUSES.map((rc) => (
              <div key={rc.cause} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{rc.cause}</span>
                  <span className="font-mono font-bold text-slate-900">
                    {rc.percentage}% <span className="text-slate-400 font-normal">(-{rc.lostMeters} m)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${rc.percentage}%`, backgroundColor: rc.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Deficit Severity:
          </span>
          {[
            { id: 'all', label: 'All Batches' },
            { id: 'critical', label: 'Critical Deficit (>15%)' },
            { id: 'moderate', label: 'Moderate Deficit (10-15%)' },
            { id: 'minor', label: 'Minor Deficit (<10%)' },
            { id: 'on target', label: 'On Target' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSeverity(tab.id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedSeverity === tab.id
                  ? 'bg-red-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batch, loom, operator, cause..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Granular Run-by-Run Production vs Ideal Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              Run-by-Run Production vs. Ideal Standard Variance Audit
            </h3>
            <p className="text-[11px] text-slate-500">
              Audited production runs comparing ideal capacity against actual yield, diagnosed causes, and corrective actions.
            </p>
          </div>
          <span className="text-[11px] text-slate-500">
            {filteredBatches.length} of {BATCH_VARIANCE_LEDGER.length} audit logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium text-[11px]">
                <th className="py-2.5 px-4">Batch ID &amp; Date</th>
                <th className="py-2.5 px-4">Loom &amp; Shift</th>
                <th className="py-2.5 px-4">Operator</th>
                <th className="py-2.5 px-4">Fabric SKU</th>
                <th className="py-2.5 px-4 text-right">Ideal Capacity (m)</th>
                <th className="py-2.5 px-4 text-right">Actual Realized (m)</th>
                <th className="py-2.5 px-4 text-right">Variance</th>
                <th className="py-2.5 px-4 text-left pl-6">Root Cause &amp; Remediation</th>
                <th className="py-2.5 px-4 text-right">Loss (₹)</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((batch) => {
                return (
                  <tr key={batch.batchId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 font-mono">{batch.batchId}</div>
                      <div className="text-[10px] text-slate-400">{batch.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{batch.machineId}</div>
                      <div className="text-[11px] text-slate-500">{batch.shift}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {batch.operator}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 max-w-[140px] truncate">
                      {batch.product}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {batch.idealMeters.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {batch.actualMeters.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        batch.variancePct >= -3
                          ? 'bg-emerald-50 text-emerald-700'
                          : batch.variancePct >= -10
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {batch.varianceMeters} m ({batch.variancePct}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left pl-6 max-w-xs">
                      <div className="text-slate-900 font-medium truncate">{batch.rootCause}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                      ₹{batch.scrapLossInr.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        batch.status === 'On Target'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : batch.status === 'Minor Deficit'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : batch.status === 'Moderate Deficit'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
