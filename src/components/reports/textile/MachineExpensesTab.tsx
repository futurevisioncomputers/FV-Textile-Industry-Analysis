import React, { useState } from 'react';
import {
  MACHINE_EXPENSES_DATA,
  GENERAL_OVERHEAD_POOLS,
  MachineExpenseRecord,
} from '../../../data/textileData';
import {
  DollarSign,
  Zap,
  Maximize2,
  Tag,
  Layers,
  TrendingUp,
  Info,
  Sliders,
  CheckCircle2,
  PieChart as PieChartIcon,
  HelpCircle,
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

export const MachineExpensesTab: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [allocationFocus, setAllocationFocus] = useState<'all' | 'space' | 'asset' | 'power'>('all');
  const [sortBy, setSortBy] = useState<'totalExpense' | 'costPerMeter' | 'profitMargin'>('costPerMeter');

  const filteredMachines = MACHINE_EXPENSES_DATA.filter((m) => {
    if (filterType !== 'all' && m.machineType !== filterType) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'totalExpense') return b.totalMachineExpenseInr - a.totalMachineExpenseInr;
    if (sortBy === 'costPerMeter') return a.costPerMeterInr - b.costPerMeterInr; // Lower cost per meter first
    if (sortBy === 'profitMargin') return b.profitMarginPct - a.profitMarginPct;
    return 0;
  });

  const totalDirectExpense = MACHINE_EXPENSES_DATA.reduce((acc, m) => acc + m.totalDirectExpensesInr, 0);
  const totalAllocatedOverhead = MACHINE_EXPENSES_DATA.reduce((acc, m) => acc + m.totalAllocatedOverheadInr, 0);
  const totalCombinedExpense = totalDirectExpense + totalAllocatedOverhead;
  const totalMeters = MACHINE_EXPENSES_DATA.reduce((acc, m) => acc + m.monthlyMeters, 0);
  const avgCostPerMeter = totalCombinedExpense / totalMeters;

  // Chart data: Direct vs Allocated Overhead per Machine
  const machineExpenseBarData = filteredMachines.map((m) => ({
    name: m.machineId.replace('LOOM-', '').replace('SPIN-', '').replace('KNIT-', ''),
    fullName: m.machineName,
    directPower: m.directPowerInr,
    directMaint: m.directMaintenanceInr + m.directConsumablesInr + m.directDepreciationInr,
    spaceAlloc: m.allocatedSpaceExpenseInr,
    assetAlloc: m.allocatedAssetExpenseInr,
    powerAlloc: m.allocatedPowerExpenseInr,
    total: m.totalMachineExpenseInr,
    costPerMeter: m.costPerMeterInr,
  }));

  // Overhead Pool Share Data
  const overheadShareData = [
    { name: 'Asset Value Allocation (₹18.2L)', value: GENERAL_OVERHEAD_POOLS.assetPricePool.totalCostInr, color: '#8b5cf6' },
    { name: 'Factory Space Allocation (₹14.5L)', value: GENERAL_OVERHEAD_POOLS.spacePool.totalCostInr, color: '#3b82f6' },
    { name: 'Aux Power / Compressor (₹12.4L)', value: GENERAL_OVERHEAD_POOLS.powerConsumptionPool.totalCostInr, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Monthly Mill Expense</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{(totalCombinedExpense / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            Direct: ₹{(totalDirectExpense / 100000).toFixed(2)}L · Allocated: ₹{(totalAllocatedOverhead / 100000).toFixed(2)}L
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Average Cost Per Linear Meter</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight">
            ₹{avgCostPerMeter.toFixed(2)}/m
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            Across {totalMeters.toLocaleString()} fabric & yarn units produced
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">General Overhead Pool</span>
            <Sliders className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹45.10 Lakhs
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            Divided by Space (42k sq.ft), Asset Price (₹14.8Cr), & Power (168k kWh)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Top Low-Cost Machine</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700 tracking-tight">
            LOOM-AJ-101
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            ₹14.44/meter (91.2% net operational margin)
          </p>
        </div>
      </div>

      {/* General Overhead Division Methodology Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-sm border border-purple-800/40">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 text-2xs font-semibold uppercase tracking-wider border border-purple-400/30">
                Textile Cost Accounting Methodology
              </span>
              <span className="text-xs text-purple-200 font-medium">Activity-Based Costing (ABC)</span>
            </div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              How General Mill Overheads Are Divided Across Loom & Spinning Capabilities
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard flat overhead splitting distorts unit profitability. Our automated pipeline allocates the ₹45.10 Lakhs/month general mill expenditure across three objective machine capability vectors:
            </p>
          </div>
        </div>

        {/* 3 Capability Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
          <div
            onClick={() => setAllocationFocus('space')}
            className={`cursor-pointer p-3 rounded-lg transition-all ${
              allocationFocus === 'space' ? 'bg-white/20 border border-purple-400' : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 text-blue-300 font-medium text-xs mb-1">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>1. By Floor Space Footprint</span>
            </div>
            <p className="text-2xs text-slate-300">
              <strong className="text-white">₹34.52/sq.ft/mo</strong> allocated for shed lease, central mist humidification foggers, high-bay lighting, and lint extraction ducting.
            </p>
          </div>

          <div
            onClick={() => setAllocationFocus('asset')}
            className={`cursor-pointer p-3 rounded-lg transition-all ${
              allocationFocus === 'asset' ? 'bg-white/20 border border-purple-400' : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 text-purple-300 font-medium text-xs mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>2. By Machine Price / Asset Value</span>
            </div>
            <p className="text-2xs text-slate-300">
              <strong className="text-white">1.23%/mo of capital price</strong> allocated for machine insurance, capex equipment financing, property tax, and overhaul reserves.
            </p>
          </div>

          <div
            onClick={() => setAllocationFocus('power')}
            className={`cursor-pointer p-3 rounded-lg transition-all ${
              allocationFocus === 'power' ? 'bg-white/20 border border-purple-400' : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 text-amber-300 font-medium text-xs mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>3. By Units Consumed (kWh)</span>
            </div>
            <p className="text-2xs text-slate-300">
              <strong className="text-white">₹7.38/kWh consumed</strong> allocated for central screw air compressor station (airjet nozzles), 750 kVA standby DG fuel, and substation transformers.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts: Machine Cost Composition & Overhead Pool Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stacked Cost per Machine */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Machine-Wise Expense Composition (Direct vs Allocated Overheads)
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown of direct power, maintenance, and capability-allocated overheads per asset
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machineExpenseBarData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `₹${Number(val).toLocaleString()}`,
                    name === 'directPower'
                      ? 'Direct Electricity'
                      : name === 'directMaint'
                      ? 'Maintenance & Spares'
                      : name === 'spaceAlloc'
                      ? 'Allocated (Space sq.ft)'
                      : name === 'assetAlloc'
                      ? 'Allocated (Asset Price)'
                      : 'Allocated (Power/Air)',
                  ]}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="directPower" name="Direct Electricity" stackId="a" fill="#0284c7" />
                <Bar dataKey="directMaint" name="Maintenance & Spares" stackId="a" fill="#0d9488" />
                <Bar dataKey="spaceAlloc" name="Allocated Space (sq.ft)" stackId="a" fill="#3b82f6" />
                <Bar dataKey="assetAlloc" name="Allocated Asset Price" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="powerAlloc" name="Allocated Aux Air/DG" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overhead Pool Allocation Pie */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              General Overhead Pool (₹45.10 Lakhs)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Distribution of shared factory expenses divided by machine capability
            </p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overheadShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {overheadShareData.map((entry, index) => (
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

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Asset Value Pool (Insurance, Capex)</span>
              </span>
              <span className="font-semibold text-slate-900">₹18.20L (40.4%)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Space Pool (Shed Lease, Mist HVAC)</span>
              </span>
              <span className="font-semibold text-slate-900">₹14.50L (32.2%)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Aux Power (Compressor, DG Backup)</span>
              </span>
              <span className="font-semibold text-slate-900">₹12.40L (27.5%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Expense Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Machine-Wise Expense & Capability Allocation Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Complete cost accounting with direct power, maintenance, and capability-allocated general overheads
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter by Machine Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
            >
              <option value="all">All Machinery ({MACHINE_EXPENSES_DATA.length})</option>
              <option value="Airjet Loom">Airjet Looms</option>
              <option value="Rapier Loom">Rapier Looms</option>
              <option value="Ring Spinning">Ring Spinning Frames</option>
              <option value="Circular Knitting">Circular Knitting</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
            >
              <option value="costPerMeter">Sort: Lowest Cost / Meter</option>
              <option value="totalExpense">Sort: Highest Total Expense</option>
              <option value="profitMargin">Sort: Highest Margin %</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/75 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Machine & Fleet Specs</th>
                <th className="py-2.5 px-3">Capability Basis</th>
                <th className="py-2.5 px-3">Direct Expenses (Power + Maint)</th>
                <th className="py-2.5 px-3">Allocated Overheads (Space + Price + Unit)</th>
                <th className="py-2.5 px-3 text-right">Total Monthly Expense</th>
                <th className="py-2.5 px-3 text-right">Monthly Units</th>
                <th className="py-2.5 px-3 text-right">Cost / Meter</th>
                <th className="py-2.5 px-3 text-right">Net Loom Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMachines.map((m) => (
                <tr key={m.machineId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{m.machineId}</div>
                    <div className="text-2xs text-slate-500 truncate max-w-[180px]">{m.machineName}</div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 text-3xs font-medium rounded bg-purple-50 text-purple-700 border border-purple-100">
                      {m.machineType}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-2xs text-slate-700">
                      <span className="font-medium text-slate-900">{m.spaceSqFt} sq.ft</span> footprint
                    </div>
                    <div className="text-2xs text-slate-700">
                      <span className="font-medium text-slate-900">₹{(m.assetValueInr / 100000).toFixed(1)}L</span> asset value
                    </div>
                    <div className="text-2xs text-slate-700">
                      <span className="font-medium text-slate-900">{m.monthlyKwh.toLocaleString()} kWh</span> power
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">
                      ₹{(m.totalDirectExpensesInr / 1000).toFixed(1)}k
                    </div>
                    <div className="text-2xs text-slate-500">
                      Power: ₹{(m.directPowerInr / 1000).toFixed(1)}k · Maint: ₹{(m.directMaintenanceInr / 1000).toFixed(1)}k
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-purple-700">
                      ₹{(m.totalAllocatedOverheadInr / 1000).toFixed(1)}k
                    </div>
                    <div className="text-2xs text-slate-500">
                      Space: ₹{(m.allocatedSpaceExpenseInr / 1000).toFixed(1)}k · Asset: ₹{(m.allocatedAssetExpenseInr / 1000).toFixed(1)}k · Power: ₹{(m.allocatedPowerExpenseInr / 1000).toFixed(1)}k
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="font-bold text-slate-900">
                      ₹{(m.totalMachineExpenseInr / 1000).toFixed(1)}k
                    </div>
                    <div className="text-3xs text-slate-500">
                      {((m.totalDirectExpensesInr / m.totalMachineExpenseInr) * 100).toFixed(0)}% Direct / {((m.totalAllocatedOverheadInr / m.totalMachineExpenseInr) * 100).toFixed(0)}% Overhead
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-medium text-slate-800">
                    {m.monthlyMeters.toLocaleString()} m
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ₹{m.costPerMeterInr.toFixed(2)}/m
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="font-bold text-emerald-700">
                      ₹{(m.netOperatingProfitInr / 100000).toFixed(2)}L
                    </div>
                    <div className="text-2xs text-slate-500 font-medium">
                      {m.profitMarginPct}% margin
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
