import React from 'react';
import { SheetMeta } from '../types';
import { X, Table2, KeyRound, Database, FileSpreadsheet } from 'lucide-react';

interface SheetPreviewModalProps {
  sheet: SheetMeta | null;
  onClose: () => void;
}

export const SheetPreviewModal: React.FC<SheetPreviewModalProps> = ({
  sheet,
  onClose,
}) => {
  if (!sheet) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-semibold font-mono text-slate-900">
                  {sheet.name}
                </h2>
                {sheet.key !== '-' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                    <KeyRound className="w-2.5 h-2.5" />
                    PK: {sheet.key}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {sheet.rows.toLocaleString()} rows · {sheet.cols} columns
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Description */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Description: </strong>
            {sheet.description}
          </div>

          {/* Schema Columns Table */}
          <div>
            <h3 className="text-xs font-semibold text-slate-800 mb-2">
              Schema Definition ({sheet.sampleColumns.length} fields)
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-normal border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Column Name</th>
                    <th className="py-2 px-3">Datatype</th>
                    <th className="py-2 px-3 text-right">Key Constraint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {sheet.sampleColumns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-50/60">
                      <td className="py-1.5 px-3 font-semibold text-slate-800">
                        {col.name}
                      </td>
                      <td className="py-1.5 px-3 text-slate-500">
                        {col.type}
                      </td>
                      <td className="py-1.5 px-3 text-right text-slate-600">
                        {col.isKey || col.name === sheet.key ? (
                          <span className="text-amber-700 font-medium">Primary Key</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sample Rows Table */}
          <div>
            <h3 className="text-xs font-semibold text-slate-800 mb-2">
              Sample Data Records (First {sheet.sampleData.length} records)
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-400 font-normal border-b border-slate-200 text-[11px]">
                  <tr>
                    {sheet.sampleColumns.map((c) => (
                      <th key={c.name} className="py-2 px-3 font-medium font-mono">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {sheet.sampleData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      {sheet.sampleColumns.map((c) => (
                        <td key={c.name} className="py-1.5 px-3 text-slate-700">
                          {row[c.name] !== undefined ? String(row[c.name]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
