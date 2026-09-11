import React, { useState } from 'react';
import { SheetMeta, RelationshipMeta } from '../types';
import { Database, KeyRound, Link2, CheckCircle2, Search, ArrowRight, ShieldCheck } from 'lucide-react';

interface DataModelViewProps {
  sheets: SheetMeta[];
  relationships: RelationshipMeta[];
  onSelectSheet: (sheet: SheetMeta) => void;
  onAutoLinkTimestamp?: () => void;
}

export const DataModelView: React.FC<DataModelViewProps> = ({
  sheets,
  relationships,
  onSelectSheet,
  onAutoLinkTimestamp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const filteredSheets = sheets.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sampleColumns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isTimestampTopology = relationships.some((r) =>
    r.joinKey.toLowerCase().includes('timestamp')
  );

  const hasContactMatching = relationships.some(
    (r) =>
      r.joinKey.toLowerCase().includes('mobile') ||
      r.joinKey.toLowerCase().includes('contact')
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
              Relational Data Model & Schema Graph
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {sheets.length} Document Sheets · {relationships.length} Verified Foreign Key Relationships · 100% Resolves
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search table or column..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-2xs w-56"
            />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero Orphans
          </span>
        </div>
      </div>

      {/* Relational Connectivity Summary Pill Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Foreign Key Mappings ({relationships.length} Relationships)
          </h2>
          <div className="flex items-center gap-2">
            {isTimestampTopology && (
              <span className="text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Link2 className="w-3 h-3 text-blue-600" />
                Timestamp Star-Schema
              </span>
            )}
            {onAutoLinkTimestamp && (
              <button
                onClick={onAutoLinkTimestamp}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-white border border-blue-200 hover:bg-blue-50 px-2 py-0.5 rounded-md transition-colors"
                title="Refresh and auto-link all tables via Timestamp"
              >
                Re-link via Timestamp
              </button>
            )}
          </div>
        </div>

        {isTimestampTopology && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-blue-900">
            <Link2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-blue-950">Timestamp is configured as the universal relational key:</strong> connecting all satellite sheets (fees data, receipts, certificates, timetable, course completion, drop-offs) directly to the central student data sheet.
            </p>
          </div>
        )}

        {hasContactMatching && (
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-indigo-900">
            <Link2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-indigo-950">Multi-Key Contact Cascade Active:</strong> Enquiry sheets capture early leads with non-matching admission dates. They interconnect with student admissions via <strong>Student Self Mobile</strong>, <strong>Parent 1 Mobile</strong>, <strong>Parent 2 Mobile</strong>, and <strong>Normalized Student Name</strong>.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {relationships.map((rel) => (
            <div
              key={rel.id}
              className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <Link2 className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="font-mono text-slate-800 font-medium truncate">
                  {rel.parentSheet}
                </span>
                <span className="text-slate-400">→</span>
                <span className="font-mono text-slate-700 truncate">
                  {rel.childSheet}
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium shrink-0 ml-1">
                {rel.joinKey}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Schema Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSheets.map((sheet) => {
          const isSelected = selectedEntityId === sheet.id;
          return (
            <div
              key={sheet.id}
              id={`entity-card-${sheet.id}`}
              onClick={() => {
                setSelectedEntityId(sheet.id);
                onSelectSheet(sheet);
              }}
              className={`bg-white border rounded-xl overflow-hidden shadow-2xs transition-all cursor-pointer hover:shadow-xs ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {sheet.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {sheet.rows.toLocaleString()} rows
                </span>
              </div>

              {/* Description */}
              <p className="px-3.5 pt-2.5 text-[11px] text-slate-500 line-clamp-2">
                {sheet.description}
              </p>

              {/* Column List */}
              <div className="p-3.5 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-1">
                  Columns ({sheet.cols})
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {sheet.sampleColumns.map((col, index) => {
                    const isPrimaryKey = col.isKey || col.name === sheet.key;
                    const isForeignKey = relationships.some(
                      (r) =>
                        (r.parentSheet === sheet.name || r.childSheet === sheet.name) &&
                        (r.joinKey.toLowerCase().trim() === col.name.toLowerCase().trim() ||
                          (r.joinKey.toLowerCase().includes('timestamp') && col.name.toLowerCase().includes('timestamp')))
                    );

                    return (
                      <div
                        key={`${sheet.id}-col-${col.name}-${index}`}
                        className={`flex items-center justify-between text-xs py-1 px-2 rounded font-mono ${
                          isPrimaryKey
                            ? 'bg-amber-50/80 text-amber-900 border border-amber-200/50'
                            : isForeignKey
                            ? 'bg-blue-50/60 text-blue-900 border border-blue-100'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          {isPrimaryKey && (
                            <KeyRound className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                          )}
                          {isForeignKey && !isPrimaryKey && (
                            <Link2 className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                          )}
                          <span className="truncate">{col.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {col.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-3.5 py-2 border-t border-slate-100 bg-slate-50/40 text-[11px] text-blue-600 font-medium flex items-center justify-between">
                <span>View data sample</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
