import React, { useState, useMemo } from 'react';
import { MACHINERY_STATS, TEXTILE_KPI_SUMMARY } from '../../../data/textileData';
import { SheetMeta } from '../../../types';
import {
  Cog,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Layers,
  Wrench,
  Search,
  Filter
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

interface MachineryReportTabProps {
  sheets?: SheetMeta[];
}

export const MachineryReportTab: React.FC<MachineryReportTabProps> = ({ sheets }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 1. DYNAMIC DATA MAPPING
  // If the user uploaded a custom dataset, we attempt to find a machinery/loom sheet and parse it.
  const customData = useMemo(() => {
    if (!sheets || sheets.length === 0) return null;
    
    // Check if it's the default mock dataset
    const isMockData = sheets.some(s => s.name === 'loom_telemetry__production_daily');
    if (isMockData) return null; // Use standard hardcoded data if it's just the default

    // Find a likely machinery sheet, or just use the first sheet if we can't find a name match
    const machineSheet = sheets.find(s => 
      s.name.toLowerCase().includes('machin') || 
      s.name.toLowerCase().includes('loom') || 
      s.name.toLowerCase().includes('equip') ||
      s.name.toLowerCase().includes('spin')
    ) || sheets[0];

    if (!machineSheet || !machineSheet.sampleData || machineSheet.sampleData.length === 0) return null;

    // Identify column types to map to our chart
    const stringCols = machineSheet.sampleColumns.filter(c => c.type.includes('VARCHAR')).map(c => c.name);
    const numCols = machineSheet.sampleColumns.filter(c => c.type.includes('INT') || c.type.includes('DEC') || c.type.includes('FLOAT') || c.type.includes('NUMBER')).map(c => c.name);

    if (numCols.length === 0) return null; // Need at least one number column for the chart

    const nameCol = stringCols[0] || numCols[0]; // Fallback to a number if no strings
    const actualCol = numCols.find(c => c.toLowerCase().includes('actual') || c.toLowerCase().includes('output') || c.toLowerCase().includes('prod')) || numCols[0];
    const idealCol = numCols.find(c => c !== actualCol && (c.toLowerCase().includes('ideal') || c.toLowerCase().includes('target') || c.toLowerCase().includes('capa'))) || actualCol;
    const oeeCol = numCols.find(c => c.toLowerCase().includes('oee') || c.toLowerCase().includes('eff')) || numCols[0];

    const parsedMachines = machineSheet.sampleData.map((row, idx) => {
      const actualVal = Number(row[actualCol]) || 0;
      const idealVal = Number(row[idealCol]) || actualVal;
      const oeeVal = Number(row[oeeCol]) || Math.round((actualVal / (idealVal || 1)) * 100);

      return {
        id: `MCH-${idx + 1}`,
        name: String(row[nameCol] || `Machine ${idx + 1}`),
        type: 'Custom Equipment',
        shed: machineSheet.name,
        rpm: 0,
        idealDaily: idealVal,
        actualDaily: actualVal,
        uptime: oeeVal > 100 ? 100 : oeeVal,
        oee: oeeVal > 100 ? 100 : oeeVal,
        downtimeReason: 'Dynamic Entry',
        downtimeMins: 0,
        status: oeeVal > 80 ? 'Running' : 'Maintenance'
      };
    });

    return parsedMachines;
  }, [sheets]);

  // Use custom mapped data if available, otherwise fallback to the beautiful hardcoded demo data
  const isMock = !sheets || sheets.length === 0 || sheets.some(s => s.name === 'loom_telemetry__production_daily');
  const baseData = customData && customData.length > 0 ? customData : (isMock ? MACHINERY_STATS : []);

  const filteredMachines = baseData.filter((m) => {
    const matchesFilter = filterType === 'all' || m.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.shed.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIdealDaily = baseData.reduce((acc, m) => acc + m.idealDaily, 0);
  const totalActualDaily = baseData.reduce((acc, m) => acc + m.actualDaily, 0);
  const avgUptime = (baseData.reduce((acc, m) => acc + m.uptime, 0) / (baseData.length || 1)).toFixed(1);
  const avgOee = (baseData.reduce((acc, m) => acc + m.oee, 0) / (baseData.length || 1)).toFixed(1);

  const chartData = filteredMachines.map((m) => ({
    name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name.replace('LOOM-', '').replace('SPIN-', '').replace('KNIT-', ''),
    ideal: m.idealDaily,
    actual: m.actualDaily,
    oee: m.oee,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner & KPIs */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-xs border border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Cog className="w-5 h-5 text-blue-400 animate-spin-slow" />
              <h2 className="text-sm font-semibold tracking-wide uppercase text-blue-300">
                Textile Machinery &amp; Loom Floor Intelligence
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Real-time monitoring across 18 high-speed Airjet Looms, Rapier Sheds, Ring Spinning Frames, and Circular Knitting lines.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              17 Operational · 1 Scheduled Maint.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-700/60">
          <div>
            <div className="text-[11px] text-slate-400">Total Machinery Active</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{TEXTILE_KPI_SUMMARY.activeMachinesCount} Units</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Weaving, Spinning, Knitting</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Floor Availability Uptime</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{avgUptime}%</div>
            <div className="text-[10px] text-blue-300 mt-0.5">Target: 92.0%</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Overall Equipment OEE</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{avgOee}%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+2.4% vs last month</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Daily Loom Throughput</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{totalActualDaily.toLocaleString()} m</div>
            <div className="text-[10px] text-amber-300 mt-0.5">Capacity: {totalIdealDaily.toLocaleString()} m</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Machine Type:
          </span>
          {[
            { id: 'all', label: 'All Machines (18)' },
            { id: 'airjet', label: 'Airjet Looms' },
            { id: 'rapier', label: 'Rapier Looms' },
            { id: 'spinning', label: 'Ring Spinning' },
            { id: 'knitting', label: 'Circular Knitting' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
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
            placeholder="Search loom ID, model, shed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Machine Output Comparison Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              Daily Machine Output vs Ideal Target (Meters / Shift Day)
            </h3>
            <p className="text-[11px] text-slate-500">
              Blue bars indicate actual production output; amber outlines denote theoretical machine capacity.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-600" />
              <span className="text-slate-600 text-[11px]">Actual Output (m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-300" />
              <span className="text-slate-600 text-[11px]">Ideal Capacity</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg">
                        <div className="font-semibold text-blue-300">{data.name}</div>
                        <div className="mt-1">Actual: <span className="font-mono text-emerald-400">{data.actual.toLocaleString()} m</span></div>
                        <div>Ideal: <span className="font-mono text-slate-300">{data.ideal.toLocaleString()} m</span></div>
                        <div>OEE: <span className="font-mono text-amber-300">{data.oee}%</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="ideal" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#2563eb" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.oee < 80 ? '#ef4444' : entry.oee < 88 ? '#f59e0b' : '#2563eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Machinery Details Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-900">
            Machinery Fleet Operational Registry &amp; Telemetry
          </h3>
          <span className="text-[11px] text-slate-500">
            Showing {filteredMachines.length} of {MACHINERY_STATS.length} monitored assets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium text-[11px]">
                <th className="py-2.5 px-4">Machine ID &amp; Model</th>
                <th className="py-2.5 px-4">Type / Department</th>
                <th className="py-2.5 px-4 text-right">Rated RPM</th>
                <th className="py-2.5 px-4 text-right">Ideal Daily (m)</th>
                <th className="py-2.5 px-4 text-right">Actual Daily (m)</th>
                <th className="py-2.5 px-4 text-right">Uptime %</th>
                <th className="py-2.5 px-4 text-right">OEE %</th>
                <th className="py-2.5 px-4 text-left pl-6">Primary Downtime Cause</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMachines.map((m) => {
                const variance = m.actualDaily - m.idealDaily;
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{m.id}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{m.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{m.type}</div>
                      <div className="text-[11px] text-slate-400">{m.shed}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-700">
                      {m.rpm.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {m.idealDaily.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {m.actualDaily.toLocaleString()}
                      <span className={`block text-[10px] ${variance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {variance >= 0 ? `+${variance}` : `${variance}`} m
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        m.uptime >= 92 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {m.uptime}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        m.oee >= 90 ? 'bg-emerald-50 text-emerald-700' : m.oee >= 80 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {m.oee}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left pl-6">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{m.downtimeReason}</span>
                        <span className="text-slate-400 font-mono">({m.downtimeMins}m)</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        m.status === 'Running'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                      }`}>
                        {m.status === 'Running' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Wrench className="w-3 h-3" />
                        )}
                        {m.status}
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
