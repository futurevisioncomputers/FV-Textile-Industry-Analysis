import React, { useState, useMemo } from 'react';
import { EMPLOYEE_PRODUCTION_STATS } from '../../../data/textileData';
import { SheetMeta } from '../../../types';
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  ShieldCheck,
  Search
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface EmployeeProductionTabProps {
  sheets?: SheetMeta[];
}

export const EmployeeProductionTab: React.FC<EmployeeProductionTabProps> = ({ sheets }) => {
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. DYNAMIC DATA MAPPING
  const customData = useMemo(() => {
    if (!sheets || sheets.length === 0) return null;
    
    const isMockData = sheets.some(s => s.name === 'loom_telemetry__production_daily');
    if (isMockData) return null;

    const empSheet = sheets.find(s => 
      s.name.toLowerCase().includes('employ') || 
      s.name.toLowerCase().includes('worker') || 
      s.name.toLowerCase().includes('weaver') ||
      s.name.toLowerCase().includes('operator')
    ) || (sheets.length > 1 ? sheets[1] : sheets[0]);

    if (!empSheet || !empSheet.sampleData || empSheet.sampleData.length === 0) return null;

    const stringCols = empSheet.sampleColumns.filter(c => c.type.includes('VARCHAR')).map(c => c.name);
    const numCols = empSheet.sampleColumns.filter(c => c.type.includes('INT') || c.type.includes('DEC') || c.type.includes('FLOAT') || c.type.includes('NUMBER')).map(c => c.name);

    if (numCols.length === 0) return null;

    const nameCol = stringCols[0] || numCols[0];
    const roleCol = stringCols.find(c => c.toLowerCase().includes('role') || c.toLowerCase().includes('title') || c.toLowerCase().includes('job')) || stringCols[1] || nameCol;
    const shiftCol = stringCols.find(c => c.toLowerCase().includes('shift')) || stringCols[2];
    
    const actualCol = numCols.find(c => c.toLowerCase().includes('actual') || c.toLowerCase().includes('output') || c.toLowerCase().includes('prod')) || numCols[0];
    const idealCol = numCols.find(c => c !== actualCol && (c.toLowerCase().includes('ideal') || c.toLowerCase().includes('target') || c.toLowerCase().includes('capa'))) || actualCol;
    const yieldCol = numCols.find(c => c.toLowerCase().includes('yield') || c.toLowerCase().includes('qual') || c.toLowerCase().includes('grade')) || numCols[0];

    const parsedEmployees = empSheet.sampleData.map((row, idx) => {
      const actualVal = Number(row[actualCol]) || 0;
      const idealVal = Number(row[idealCol]) || actualVal;
      let yieldVal = Number(row[yieldCol]) || 0;
      if (yieldVal < 1) yieldVal = yieldVal * 100; // If represented as decimal
      if (yieldVal > 100) yieldVal = 100;

      const rating = yieldVal >= 98 ? 'Top Performer' : yieldVal >= 95 ? 'Consistent' : yieldVal >= 85 ? 'Requires Training' : 'Critical Attention';

      return {
        id: `EMP-${idx + 1000}`,
        name: String(row[nameCol] || `Operator ${idx + 1}`),
        role: String(row[roleCol] || 'Weaver'),
        shift: shiftCol && row[shiftCol] ? String(row[shiftCol]) : 'Dynamic Shift',
        shed: empSheet.name,
        machine: 'Dynamic Machine',
        idealOutputMeters: idealVal,
        actualOutputMeters: actualVal,
        gradeAYield: Math.round(yieldVal),
        rejectionMeters: Math.round(actualVal * ((100 - yieldVal) / 100)),
        rating
      };
    });

    return parsedEmployees;
  }, [sheets]);

  const isMock = !sheets || sheets.length === 0 || sheets.some(s => s.name === 'loom_telemetry__production_daily');
  const baseData = customData && customData.length > 0 ? customData : (isMock ? EMPLOYEE_PRODUCTION_STATS : []);

  const filteredEmployees = baseData.filter((emp) => {
    const matchesShift = selectedShift === 'all' || emp.shift.toLowerCase().includes(selectedShift.toLowerCase());
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.machine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.shed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesShift && matchesSearch;
  });

  let shiftSummary = isMock ? [
    { shift: 'Shift A (06:00 - 14:00)', weavers: 10, avgYield: 98.0, output: '58,400 m', efficiency: '96.5%' },
    { shift: 'Shift B (14:00 - 22:00)', weavers: 8, avgYield: 95.8, output: '44,200 m', efficiency: '92.4%' },
    { shift: 'Shift C (22:00 - 06:00)', weavers: 6, avgYield: 91.4, output: '25,850 m', efficiency: '83.2%' },
  ] : [];

  if (!isMock && baseData.length > 0) {
    const shiftGroups = baseData.reduce((acc, emp) => {
      const shift = emp.shift || 'Unknown Shift';
      if (!acc[shift]) acc[shift] = { weavers: 0, totalYield: 0, totalOutput: 0, totalIdeal: 0 };
      acc[shift].weavers += 1;
      acc[shift].totalYield += emp.gradeAYield;
      acc[shift].totalOutput += emp.actualOutputMeters;
      acc[shift].totalIdeal += emp.idealOutputMeters;
      return acc;
    }, {} as Record<string, { weavers: number, totalYield: number, totalOutput: number, totalIdeal: number }>);
    
    shiftSummary = Object.entries(shiftGroups).map(([shift, stats]: [string, any]) => {
      const avgYield = stats.weavers > 0 ? (stats.totalYield / stats.weavers) : 0;
      const efficiency = stats.totalIdeal > 0 ? (stats.totalOutput / stats.totalIdeal) * 100 : 0;
      return {
        shift,
        weavers: stats.weavers,
        avgYield: Number(avgYield.toFixed(1)),
        output: `${stats.totalOutput.toLocaleString()} m`,
        efficiency: `${efficiency.toFixed(1)}%`
      };
    });
  }

  const chartData = filteredEmployees.map((e) => ({
    name: e.name.split(' ')[0],
    actual: e.actualOutputMeters,
    ideal: e.idealOutputMeters,
    yield: e.gradeAYield,
    rating: e.rating,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-900 tracking-wide uppercase">
                Employee-Wise Production &amp; Weaver Performance Audit
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Individual technician metrics tracking total linear meters produced, Grade A first-quality yield, variance against shift quotas, and operator efficiency ratings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              {baseData.length} Active Mill Technicians
            </span>
          </div>
        </div>

        {/* 3-Shift Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          {shiftSummary.map((s, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs ${
                idx === 0
                  ? 'bg-emerald-50/50 border-emerald-200/70'
                  : idx === 1
                  ? 'bg-blue-50/50 border-blue-200/70'
                  : 'bg-amber-50/50 border-amber-200/70'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>{s.shift}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border font-mono">
                  {s.weavers} Technicians
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Output</span>
                  <span className="font-mono font-bold text-slate-900">{s.output}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Grade A %</span>
                  <span className="font-mono font-bold text-emerald-700">{s.avgYield}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Efficiency</span>
                  <span className="font-mono font-bold text-indigo-700">{s.efficiency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Shift Filter:
          </span>
          <button
            onClick={() => setSelectedShift('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              selectedShift === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Shifts
          </button>
          {shiftSummary.map((s) => (
            <button
              key={s.shift}
              onClick={() => setSelectedShift(s.shift.toLowerCase())}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedShift === s.shift.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s.shift}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee name, role, loom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Production by Operator Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              Monthly Output by Operator vs Quota Target (Linear Meters)
            </h3>
            <p className="text-[11px] text-slate-500">
              Indigo bars show actual meters woven; grey background marks target quota. Color tag highlights Grade A quality compliance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3" /> Grade A &gt; 97%
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg">
                        <div className="font-semibold text-indigo-300">{data.name}</div>
                        <div className="mt-1">Actual: <span className="font-mono text-emerald-400">{data.actual.toLocaleString()} m</span></div>
                        <div>Ideal Quota: <span className="font-mono text-slate-300">{data.ideal.toLocaleString()} m</span></div>
                        <div>Grade A Yield: <span className="font-mono text-amber-300">{data.yield}%</span></div>
                        <div>Status: <span className="font-semibold">{data.rating}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="ideal" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.yield >= 98 ? '#10b981' : entry.yield >= 95 ? '#4f46e5' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Employee Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-900">
            Employee Master Performance &amp; Production Variance Ledger
          </h3>
          <span className="text-[11px] text-slate-500">
            Showing {filteredEmployees.length} of {EMPLOYEE_PRODUCTION_STATS.length} weavers &amp; technicians
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium text-[11px]">
                <th className="py-2.5 px-4">Operator Name &amp; ID</th>
                <th className="py-2.5 px-4">Designation</th>
                <th className="py-2.5 px-4">Shift &amp; Assigned Shed</th>
                <th className="py-2.5 px-4">Assigned Machine</th>
                <th className="py-2.5 px-4 text-right">Ideal Quota (m)</th>
                <th className="py-2.5 px-4 text-right">Actual Produced (m)</th>
                <th className="py-2.5 px-4 text-right">Variance</th>
                <th className="py-2.5 px-4 text-right">Grade A Yield %</th>
                <th className="py-2.5 px-4 text-center">Performance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const variance = emp.actualOutputMeters - emp.idealOutputMeters;
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{emp.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{emp.id}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {emp.role}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{emp.shift}</div>
                      <div className="text-[11px] text-slate-400">{emp.shed}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">
                        {emp.machine}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {emp.idealOutputMeters.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {emp.actualOutputMeters.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        variance >= -500
                          ? 'bg-emerald-50 text-emerald-700'
                          : variance >= -1500
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {variance >= 0 ? `+${variance}` : `${variance}`} m
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      <span className={`text-[11px] ${
                        emp.gradeAYield >= 98
                          ? 'text-emerald-600 font-bold'
                          : emp.gradeAYield >= 95
                          ? 'text-indigo-600'
                          : 'text-red-500 font-bold'
                      }`}>
                        {emp.gradeAYield}%
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {emp.rejectionMeters}m scrap
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        emp.rating === 'Top Performer'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : emp.rating === 'Consistent'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : emp.rating === 'Requires Training'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                      }`}>
                        {emp.rating === 'Top Performer' && <Sparkles className="w-3 h-3 text-emerald-500" />}
                        {emp.rating === 'Critical Attention' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                        {emp.rating}
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
