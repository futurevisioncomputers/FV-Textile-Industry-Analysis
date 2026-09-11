import React, { useState } from 'react';
import { PRODUCT_WISE_PRODUCTION, TEXTILE_KPI_SUMMARY } from '../../../data/textileData';
import {
  Layers,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Package,
  Scissors,
  BarChart3,
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#2563eb', '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export const ProductUnitsTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = PRODUCT_WISE_PRODUCTION.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalActualUnits = PRODUCT_WISE_PRODUCTION.reduce((acc, p) => acc + p.actualUnits, 0);
  const totalRevenue = PRODUCT_WISE_PRODUCTION.reduce((acc, p) => acc + p.revenueInr, 0);
  const avgMargin = (
    PRODUCT_WISE_PRODUCTION.reduce((acc, p) => acc + p.marginPct * p.revenueInr, 0) / totalRevenue
  ).toFixed(1);

  const pieData = PRODUCT_WISE_PRODUCTION.map((p) => ({
    name: p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] || ''),
    value: p.actualUnits,
  }));

  const revenueBarData = PRODUCT_WISE_PRODUCTION.map((p) => ({
    name: p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] || ''),
    revenueLakhs: parseFloat((p.revenueInr / 100000).toFixed(2)),
    margin: p.marginPct,
  }));

  return (
    <div className="space-y-6">
      {/* Product Overview Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900 tracking-wide uppercase">
                Product-Wise Units Produced &amp; Commercial Yield
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Breakdown of manufactured units by fabric catalog SKU across linear meters, spooled yarn (KG), GSM specifications, unit realizations, and commercial margins.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold">
              <Scissors className="w-3.5 h-3.5" />
              12 Active Fabric SKUs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-[11px] text-slate-400">Total Units Produced</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{totalActualUnits.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Meters &amp; KG Combined</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Gross Output Value</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">₹{(totalRevenue / 10000000).toFixed(2)} Cr</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Monthly Realized</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Weighted Gross Margin</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{avgMargin}%</div>
            <div className="text-[10px] text-blue-600 mt-0.5">Denim &amp; Silk Lead</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Volume Leader</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">Cotton 40s</div>
            <div className="text-[10px] text-slate-500 mt-0.5">40.8% Total Volume</div>
          </div>
        </div>
      </div>

      {/* Visual Charts: Production Volume Share & Revenue Value */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Contribution by SKU */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              Commercial Revenue Yield by Fabric SKU (₹ Lakhs)
            </h3>
            <p className="text-[11px] text-slate-500">
              Total monthly gross revenue realized across fabric and yarn lines.
            </p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg">
                          <div className="font-semibold text-blue-300">{d.name}</div>
                          <div className="mt-1">Revenue: <span className="font-mono text-emerald-400">₹{d.revenueLakhs} Lakhs</span></div>
                          <div>Margin: <span className="font-mono text-amber-300">{d.margin}%</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenueLakhs" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  {revenueBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Share Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              Manufactured Units Volume Distribution (% Share)
            </h3>
            <p className="text-[11px] text-slate-500">
              Relative production output across product categories.
            </p>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString()} Units`, 'Units']}
                />
                <Legend
                  formatter={(value) => <span className="text-[11px] text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {[
            { id: 'all', label: 'All Products' },
            { id: 'shirting', label: 'Shirting' },
            { id: 'denim', label: 'Denim' },
            { id: 'workwear', label: 'Workwear' },
            { id: 'spun yarn', label: 'Spun Yarn' },
            { id: 'knits', label: 'Knits' },
            { id: 'luxury silk', label: 'Luxury Silk' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedCategory === tab.id
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
            placeholder="Search product, SKU ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Detailed Product Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-900">
            Product Catalog Manufacturing Ledger
          </h3>
          <span className="text-[11px] text-slate-500">
            {filteredProducts.length} products listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium text-[11px]">
                <th className="py-2.5 px-4">SKU ID &amp; Fabric Product</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-center">GSM</th>
                <th className="py-2.5 px-4 text-center">Unit</th>
                <th className="py-2.5 px-4 text-right">Standard Rate</th>
                <th className="py-2.5 px-4 text-right">Ideal Units</th>
                <th className="py-2.5 px-4 text-right">Actual Units</th>
                <th className="py-2.5 px-4 text-right">Variance %</th>
                <th className="py-2.5 px-4 text-right">Gross Revenue (₹)</th>
                <th className="py-2.5 px-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {p.category}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700">
                      {p.gsm > 0 ? `${p.gsm}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-800">
                      ₹{p.ratePerUnit.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {p.idealUnits.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {p.actualUnits.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.variancePct >= -5
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.variancePct >= -10
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {p.variancePct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{(p.revenueInr / 100000).toFixed(2)}L
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        p.marginPct >= 30 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {p.marginPct}%
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
