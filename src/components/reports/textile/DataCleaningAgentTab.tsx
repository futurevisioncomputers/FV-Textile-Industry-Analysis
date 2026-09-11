import React, { useState } from 'react';
import { DATA_CLEANING_AUDIT, DataCleaningItem } from '../../../data/textileData';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Filter,
  FileCheck,
  Layers,
  Database,
  Search,
  ArrowRight,
} from 'lucide-react';

export const DataCleaningAgentTab: React.FC = () => {
  const [selectedIssueType, setSelectedIssueType] = useState<string>('all');
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [cleaningComplete, setCleaningComplete] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    totalRawRecordsChecked,
    anomaliesIdentified,
    missingPickTimestampsImputed,
    sensorOutliersSmoothed,
    schemaTypeRepairs,
    rawDataHygieneScore,
    cleanedDataHygieneScore,
    auditItems,
  } = DATA_CLEANING_AUDIT;

  const handleSimulateClean = () => {
    setIsCleaning(true);
    setCleaningComplete(false);
    setTimeout(() => {
      setIsCleaning(false);
      setCleaningComplete(true);
    }, 1200);
  };

  const filteredItems = auditItems.filter((item) => {
    if (selectedIssueType !== 'all' && item.issueType !== selectedIssueType) return false;
    if (
      searchQuery &&
      !item.recordIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.columnName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.dirtyValue.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Agent Banner & Control */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-xl p-5 shadow-sm border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 text-2xs font-semibold uppercase tracking-wider border border-purple-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Autonomous Agent Module
              </span>
              <span className="text-xs text-purple-200 font-medium">Telemetry Cleaning & Normalization</span>
            </div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              AI Data Cleaning & Sensor Signal Reconciliation Agent
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-world loom telemetry suffers from optical pick-sensor dropouts, electrical jitter, and human shift log typos. This autonomous agent continuously monitors, filters, and imputes clean telemetry before calculating unit production variance.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSimulateClean}
            disabled={isCleaning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCleaning ? 'animate-spin' : ''}`} />
            <span>{isCleaning ? 'Sanitizing Telemetry...' : 'Execute Data Cleanse Pipeline'}</span>
          </button>
        </div>

        {/* Cleanliness Progression Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="text-slate-400 text-2xs uppercase tracking-wider">Raw Telemetry Records</div>
            <div className="text-base font-bold text-white mt-0.5">{totalRawRecordsChecked.toLocaleString()}</div>
            <div className="text-3xs text-slate-400">Continuous 3-shift logs</div>
          </div>

          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="text-slate-400 text-2xs uppercase tracking-wider">Anomalies Detected</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">{anomaliesIdentified} Items</div>
            <div className="text-3xs text-slate-400">1.73% of raw dataset flagged</div>
          </div>

          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="text-slate-400 text-2xs uppercase tracking-wider">Missing Picks Imputed</div>
            <div className="text-base font-bold text-purple-300 mt-0.5">{missingPickTimestampsImputed} Values</div>
            <div className="text-3xs text-slate-400">Reconstructed via RPM × Runtime</div>
          </div>

          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="text-slate-400 text-2xs uppercase tracking-wider">Post-Clean Hygiene Score</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span>{cleanedDataHygieneScore}%</span>
              <span className="text-2xs font-normal text-emerald-300">
                (+{(cleanedDataHygieneScore - rawDataHygieneScore).toFixed(1)}%)
              </span>
            </div>
            <div className="text-3xs text-slate-400">From {rawDataHygieneScore}% baseline</div>
          </div>
        </div>
      </div>

      {/* Suggested New Agents & Data Sources Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-purple-700 font-semibold text-xs mb-1.5">
            <Layers className="w-4 h-4" />
            <span>Suggested Agent: Warp Break Predictor</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Correlates yarn lot elongation testing against real-time loom shed humidity to predict warp stops 45 minutes before thread rupture.
          </p>
          <div className="mt-2 text-2xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block">
            Impact: -18% loom stop downtime
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1.5">
            <Database className="w-4 h-4" />
            <span>Suggested Data: Yarn Lot Dye-Affinity</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ingest spun yarn roving micronaire, trash content %, and moisture regain levels directly from spinning ginning certificates.
          </p>
          <div className="mt-2 text-2xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
            Impact: 100% shade consistency in dyeing
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Suggested Agent: Dynamic Energy Allocator</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Adjusts airjet compressor supply pressure (5.5 bar to 6.2 bar) dynamically based on weft yarn denier and picks per inch.
          </p>
          <div className="mt-2 text-2xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block">
            Impact: ₹1.45 Lakhs monthly power savings
          </div>
        </div>
      </div>

      {/* Anomaly Audit Trail Ledger */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Cleaned Telemetry & Anomaly Audit Trail ({filteredItems.length} Resolved Cases)
            </h3>
            <p className="text-xs text-slate-500">
              Complete before-and-after reconciliation ledger with imputation algorithms and mathematical bounds
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search identifier, column..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 bg-white text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Filter by Issue Type */}
            <select
              value={selectedIssueType}
              onChange={(e) => setSelectedIssueType(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
            >
              <option value="all">All Anomaly Types</option>
              <option value="Missing Pick Count">Missing Pick Counts</option>
              <option value="Sensor Spike Outlier">Sensor Spike Outliers</option>
              <option value="Unit Code Mismatch">Unit Code Mismatches</option>
              <option value="Negative Variance Artifact">Negative Variance Artifacts</option>
              <option value="Extreme RPM Drop">Extreme RPM Drops</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/75 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Audit ID & Target</th>
                <th className="py-2.5 px-3">Issue Classification</th>
                <th className="py-2.5 px-3">Raw Dirty Value (Pre-Clean)</th>
                <th className="py-2.5 px-3">Sanitized Cleaned Value</th>
                <th className="py-2.5 px-3">Reconciliation Algorithm</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{item.id}</div>
                    <div className="text-3xs text-purple-600 font-mono font-medium">{item.recordIdentifier}</div>
                    <div className="text-3xs text-slate-400">{item.sourceSheet} · {item.columnName}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-block px-1.5 py-0.5 text-3xs font-medium rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {item.issueType}
                    </span>
                    <div className="text-3xs text-slate-400 mt-0.5">Impact: {item.impact}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-mono text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-100 text-2xs max-w-[220px] truncate">
                      {item.dirtyValue}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-2xs font-medium max-w-[260px]">
                      {item.cleanedValue}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-700">
                    <div className="font-medium text-slate-800">{item.reconciliationMethod}</div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {item.status}
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
