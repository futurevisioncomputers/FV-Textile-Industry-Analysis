import React, { useState } from 'react';
import {
  EMPLOYEE_EXPENSES_DATA,
  EmployeeExpenseRecord,
} from '../../../data/textileData';
import {
  Users,
  DollarSign,
  Award,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const EmployeeExpensesTab: React.FC = () => {
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'costPerMeter' | 'efficiency' | 'totalCost'>('costPerMeter');

  const filteredEmployees = EMPLOYEE_EXPENSES_DATA.filter((emp) => {
    if (selectedShift !== 'all' && emp.shift !== selectedShift) return false;
    if (statusFilter !== 'all' && emp.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'costPerMeter') return a.laborCostPerMeterInr - b.laborCostPerMeterInr;
    if (sortBy === 'efficiency') return b.efficiencyIndexPct - a.efficiencyIndexPct;
    if (sortBy === 'totalCost') return b.totalMonthlyCostInr - a.totalMonthlyCostInr;
    return 0;
  });

  const totalPayrollCost = EMPLOYEE_EXPENSES_DATA.reduce((acc, e) => acc + e.totalMonthlyCostInr, 0);
  const totalBaseSalary = EMPLOYEE_EXPENSES_DATA.reduce((acc, e) => acc + e.baseSalaryInr, 0);
  const totalStatutoryBenefits = EMPLOYEE_EXPENSES_DATA.reduce((acc, e) => acc + e.statutoryBenefitsInr, 0);
  const totalOvertime = EMPLOYEE_EXPENSES_DATA.reduce((acc, e) => acc + e.overtimeInr, 0);
  const totalMeters = EMPLOYEE_EXPENSES_DATA.reduce((acc, e) => acc + e.monthlyOutputMeters, 0);
  const avgLaborCostPerMeter = totalPayrollCost / totalMeters;

  // Chart data: Compensation component stack per employee
  const payrollBarData = filteredEmployees.map((e) => ({
    name: e.name.split(' ')[0],
    fullName: e.name,
    role: e.role,
    base: e.baseSalaryInr,
    shift: e.shiftAllowanceInr,
    overtime: e.overtimeInr,
    statutory: e.statutoryBenefitsInr,
    trainingPpe: e.trainingAndPpeInr,
    total: e.totalMonthlyCostInr,
    costPerMeter: e.laborCostPerMeterInr,
    efficiency: e.efficiencyIndexPct,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Monthly Labor Cost</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{(totalPayrollCost / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            Across {EMPLOYEE_EXPENSES_DATA.length} audited master weavers, operators, and leads
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Labor Cost Per Meter</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight">
            ₹{avgLaborCostPerMeter.toFixed(2)}/meter
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            Industry standard: ₹7.50 - ₹12.00 per woven meter
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Statutory Benefits (PF/ESI/Bonus)</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{(totalStatutoryBenefits / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            {((totalStatutoryBenefits / totalPayrollCost) * 100).toFixed(1)}% of total labor cost (100% compliant)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Overtime Disbursed</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 tracking-tight">
            ₹{(totalOvertime / 1000).toFixed(1)}k
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            Shift C night shift contributes 46% of total overtime
          </p>
        </div>
      </div>

      {/* Textile Industry Labor Compensation Standard Guide */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 text-2xs font-semibold uppercase tracking-wider border border-purple-400/30">
                Textile Mill Labor Structure
              </span>
              <span className="text-xs text-purple-200 font-medium">Gujarat Textile Minimum Wages & Factory Act Compliance</span>
            </div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              Components of Workforce Expenditure in High-Speed Textile Manufacturing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Textile mill compensation consists of base monthly wages, night shift differentials (Shift C ₹4,500/mo), overtime for warp beam changeovers, and mandatory statutory provisions (PF 12%, ESI 3.25%, Gratuity 4.81%, Annual bonus 8.33%) plus dust respirators and safety shoes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-2xs uppercase tracking-wider">Base Salary Share</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {((totalBaseSalary / totalPayrollCost) * 100).toFixed(1)}% (₹{(totalBaseSalary / 100000).toFixed(2)}L)
            </div>
            <div className="text-3xs text-slate-400 mt-1">Core skill & tenure grade</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-2xs uppercase tracking-wider">Statutory Benefits</div>
            <div className="text-sm font-bold text-purple-400 mt-0.5">
              {((totalStatutoryBenefits / totalPayrollCost) * 100).toFixed(1)}% (₹{(totalStatutoryBenefits / 100000).toFixed(2)}L)
            </div>
            <div className="text-3xs text-slate-400 mt-1">PF, ESI, Gratuity, Bonus</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-2xs uppercase tracking-wider">Overtime Disbursal</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">
              {((totalOvertime / totalPayrollCost) * 100).toFixed(1)}% (₹{(totalOvertime / 1000).toFixed(1)}k)
            </div>
            <div className="text-3xs text-slate-400 mt-1">1.5x rate for extra shifts</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-2xs uppercase tracking-wider">Top Labor Efficiency</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              ₹7.52 / meter
            </div>
            <div className="text-3xs text-slate-400 mt-1">Suresh Patel (Shift A Airjet)</div>
          </div>
        </div>
      </div>

      {/* Visual Chart: Compensation Component Breakdown per Weaver/Operator */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Workforce Compensation Stack (Base, Benefits, Shift Allowance, Overtime)
            </h3>
            <p className="text-xs text-slate-500">
              Total monthly employer expenditure per weaver, spinning tender, and maintenance technician
            </p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payrollBarData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any, name: string) => [
                  `₹${Number(val).toLocaleString()}`,
                  name === 'base'
                    ? 'Base Salary'
                    : name === 'shift'
                    ? 'Shift Allowance'
                    : name === 'overtime'
                    ? 'Overtime Pay'
                    : name === 'statutory'
                    ? 'Statutory (PF/ESI/Bonus)'
                    : 'PPE & Training',
                ]}
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="base" name="Base Salary" stackId="a" fill="#6366f1" />
              <Bar dataKey="shift" name="Shift Allowance" stackId="a" fill="#3b82f6" />
              <Bar dataKey="overtime" name="Overtime" stackId="a" fill="#f59e0b" />
              <Bar dataKey="statutory" name="Statutory Benefits (PF/ESI)" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="trainingPpe" name="PPE & Training" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Payroll & Labor Cost Efficiency Ledger */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Employee-Wise Expense & Labor Efficiency Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown of salary, night differential, overtime, statutory benefits, and cost per linear meter
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Shift Filter */}
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
            >
              <option value="all">All Shifts ({EMPLOYEE_EXPENSES_DATA.length})</option>
              <option value="Shift A">Shift A (Morning)</option>
              <option value="Shift B">Shift B (Evening)</option>
              <option value="Shift C">Shift C (Night)</option>
              <option value="General">General Shift</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Top Efficiency">Top Efficiency</option>
              <option value="Optimal">Optimal</option>
              <option value="High Overtime Alert">High Overtime Alert</option>
              <option value="Skill Training Required">Skill Training Required</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
            >
              <option value="costPerMeter">Sort: Lowest Cost/Meter</option>
              <option value="efficiency">Sort: Highest Efficiency</option>
              <option value="totalCost">Sort: Highest Total Cost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/75 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Weaver / Specialist</th>
                <th className="py-2.5 px-3">Role & Dept</th>
                <th className="py-2.5 px-3">Shift & Exp</th>
                <th className="py-2.5 px-3 text-right">Base Wage</th>
                <th className="py-2.5 px-3 text-right">Shift / OT</th>
                <th className="py-2.5 px-3 text-right">Benefits (PF/ESI)</th>
                <th className="py-2.5 px-3 text-right">Total Employer Cost</th>
                <th className="py-2.5 px-3 text-right">Output</th>
                <th className="py-2.5 px-3 text-right">Labor Cost / Meter</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((e) => (
                <tr key={e.employeeId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div>{e.name}</div>
                    <div className="text-3xs text-slate-400 font-mono">{e.employeeId}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{e.role}</div>
                    <div className="text-3xs text-slate-500">{e.department}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-3xs font-medium rounded ${
                        e.shift === 'Shift A'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : e.shift === 'Shift B'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : e.shift === 'Shift C'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {e.shift}
                    </span>
                    <div className="text-3xs text-slate-400 mt-0.5">{e.experienceYears} yrs exp</div>
                  </td>

                  <td className="py-3 px-3 text-right font-medium text-slate-800">
                    ₹{e.baseSalaryInr.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right text-slate-700">
                    <div>₹{(e.shiftAllowanceInr + e.overtimeInr).toLocaleString()}</div>
                    <div className="text-3xs text-slate-400">
                      OT: ₹{e.overtimeInr.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right text-slate-700">
                    <div>₹{e.statutoryBenefitsInr.toLocaleString()}</div>
                    <div className="text-3xs text-slate-400">PF + ESI + Bonus</div>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    ₹{e.totalMonthlyCostInr.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-medium text-slate-800">
                    {e.monthlyOutputMeters.toLocaleString()} m
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      ₹{e.laborCostPerMeterInr.toFixed(2)}/m
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold ${
                        e.status === 'Top Efficiency'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : e.status === 'Optimal'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : e.status === 'High Overtime Alert'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {e.status === 'Top Efficiency' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                      {e.status === 'High Overtime Alert' && <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />}
                      {e.status}
                    </span>
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
