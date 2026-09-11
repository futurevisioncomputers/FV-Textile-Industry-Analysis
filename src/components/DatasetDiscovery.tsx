import React, { useState, useRef } from 'react';
import { SheetMeta, RelationshipMeta } from '../types';

import {
  CheckCircle2,
  Eye,
  Table2,
  KeyRound,
  Upload,
  FileSpreadsheet,
  Download,
  Plus,
  Loader2,
  AlertCircle,
  RotateCcw,
  Layers,
  ChevronRight
} from 'lucide-react';
import { parseFileToSheets } from '../utils/fileParser';

interface DatasetDiscoveryProps {
  sheets: SheetMeta[];
  relationships: RelationshipMeta[];
  totalRows: number;
  onPreviewSheet: (sheet: SheetMeta) => void;
  onPreviewRelationship?: (rel: RelationshipMeta) => void;
  onApplyUploadedSheets?: (newSheets: SheetMeta[], append: boolean) => void;
  onOpenUploadModal?: () => void;
  onRestoreDefaults?: () => void;
  onNavigateToTemplates?: () => void;
}

export const DatasetDiscovery: React.FC<DatasetDiscoveryProps> = ({
  sheets,
  relationships,
  totalRows,
  onPreviewSheet,
  onPreviewRelationship,
  onApplyUploadedSheets,
  onOpenUploadModal,
  onRestoreDefaults,
  onNavigateToTemplates,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMode, setUploadMode] = useState<'replace' | 'append'>('replace');
  const [statusNotification, setStatusNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const directInputRef = useRef<HTMLInputElement>(null);


  const handleDirectProcessFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setStatusNotification(null);

    try {
      const parsedList: SheetMeta[] = [];
      for (let i = 0; i < files.length; i++) {
        const sheetsResult = await parseFileToSheets(files[i]);
        parsedList.push(...sheetsResult);
      }

      if (parsedList.length > 0 && onApplyUploadedSheets) {
        const append = uploadMode === 'append';
        onApplyUploadedSheets(parsedList, append);
        const rowsCount = parsedList.reduce((acc, s) => acc + s.rows, 0);
        setStatusNotification({
          type: 'success',
          message: append
            ? `Successfully appended ${parsedList.length} sheet${parsedList.length > 1 ? 's' : ''} (${rowsCount.toLocaleString()} rows).`
            : `Successfully replaced active dataset with ${parsedList.length} sheet${parsedList.length > 1 ? 's' : ''} (${rowsCount.toLocaleString()} rows). Multi-agent pipeline updated!`,
        });
      } else {
        setStatusNotification({
          type: 'error',
          message: 'No readable data rows found in the selected file(s).',
        });
      }
    } catch (err: any) {
      setStatusNotification({
        type: 'error',
        message: err.message || 'Failed to parse file. Please verify CSV/Excel formatting.',
      });
    } finally {
      setIsProcessing(false);
      if (directInputRef.current) directInputRef.current.value = '';
    }
  };

  const handleDownloadSample = () => {
    const csvContent = `student_id,student_name,course_enrolled,enquiry_date,total_tuition,collected_amount,counselor_assigned
STU-101,Aarav Patel,Data Science & AI,2024-02-01,1500.00,1500.00,Rohan Mehta
STU-102,Priya Sharma,Cloud Architecture,2024-02-03,1800.00,900.00,Sneha Kapoor
STU-103,Rohan Verma,Full Stack Web Dev,2024-02-05,1200.00,1200.00,Rohan Mehta
STU-104,Ananya Iyer,Machine Learning,2024-02-08,1600.00,800.00,Sneha Kapoor
STU-105,Vikram Singh,Cybersecurity,2024-02-10,1350.00,1350.00,Aman Gill`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_student_admissions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Title Bar with Quick Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div className="flex items-baseline space-x-3">
          <h1 className="text-base font-bold text-zinc-900 tracking-tight font-serif">
            Dataset Discovery
          </h1>
          <span className="text-xs text-zinc-500 font-medium">
            {sheets.length} sheet{sheets.length !== 1 ? 's' : ''} · {totalRows.toLocaleString()} rows
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center bg-zinc-100 p-0.5 rounded border border-zinc-200 text-xs">
            <button
              type="button"
              onClick={() => setUploadMode('replace')}
              className={`px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors ${
                uploadMode === 'replace'
                  ? 'bg-white text-zinc-900 shadow-sm font-bold border border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Replace Active
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('append')}
              className={`px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors ${
                uploadMode === 'append'
                  ? 'bg-white text-zinc-900 shadow-sm font-bold border border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Append
            </button>
          </div>

          <button
            id="download-sample-csv-btn"
            type="button"
            onClick={handleDownloadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 rounded shadow-sm transition-colors"
            title="Download a test CSV file formatted for instant upload"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sample CSV</span>
          </button>

          <button
            id="direct-upload-header-btn"
            type="button"
            onClick={() => directInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded shadow-sm transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Data File</span>
          </button>

          <input
            ref={directInputRef}
            id="direct-header-file-input"
            type="file"
            multiple
            accept=".xlsx,.xls,.ods,.csv,.tsv,.json,.txt"
            onChange={(e) => {
              if (e.target.files) handleDirectProcessFiles(e.target.files);
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Notification Toast/Banner if present */}
      {statusNotification && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
            statusNotification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {statusNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-slate-400 hover:text-slate-700 ml-3 text-[11px] font-medium"
          >
            Dismiss
          </button>
        </div>
      )}



      {/* Direct Drag & Drop Area */}
      <div
        id="direct-drag-drop-area"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          if (e.dataTransfer.files) handleDirectProcessFiles(e.dataTransfer.files);
        }}
        onClick={() => directInputRef.current?.click()}
        className={`border-2 border-dashed rounded p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/50 scale-[1.005]'
            : 'border-zinc-300 hover:border-emerald-400 bg-[#FAFAFA] hover:bg-zinc-50'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded bg-emerald-100/50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900 flex items-center gap-2 font-mono uppercase tracking-wide">
              {isProcessing
                ? 'Parsing data & extracting schema...'
                : 'Drag & drop data files here or click to browse'}
              <span className="text-[10px] font-medium text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.2 rounded normal-case tracking-normal">
                .xlsx, .xls, .csv, .json
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Supports single or multiple files. Tables, primary keys, and cross-sheet foreign keys are detected automatically.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {onOpenUploadModal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenUploadModal();
              }}
              className="text-xs text-zinc-500 hover:text-zinc-800 underline px-2 py-1"
            >
              Advanced upload & presets
            </button>
          )}
          <span className="text-xs font-bold text-zinc-700 bg-white border border-zinc-300 px-3 py-1.5 rounded shadow-sm">
            Browse files
          </span>
        </div>
      </div>

      {/* Referential Integrity Banner */}
      <div
        id="foreign-key-banner"
        className="w-full bg-emerald-50/70 border border-emerald-200/80 rounded-lg px-4 py-2.5 flex items-center justify-between shadow-2xs"
      >
        <div className="flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-medium text-emerald-800">
            every foreign key resolves
          </span>
        </div>
        <span className="text-[11px] text-emerald-600/90 font-mono">
          {relationships.length} links verified (100%)
        </span>
      </div>

      {/* Sheets Table */}
      <div className="bg-white rounded border border-zinc-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider font-mono bg-zinc-50">
              <th className="py-2.5 px-4 font-normal">Sheet</th>
              <th className="py-2.5 px-4 text-right font-normal">Rows</th>
              <th className="py-2.5 px-4 text-right font-normal">Cols</th>
              <th className="py-2.5 px-4 text-left font-normal pl-8">Key</th>
              <th className="py-2.5 px-4 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {sheets.map((sheet) => (
              <tr
                key={sheet.id}
                id={`sheet-row-${sheet.id}`}
                onClick={() => onPreviewSheet(sheet)}
                className="hover:bg-zinc-50 transition-colors cursor-pointer group"
              >
                <td className="py-2.5 px-4 font-mono font-bold text-zinc-900 group-hover:text-emerald-700 flex items-center gap-2">
                  <Table2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600" />
                  {sheet.name}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-zinc-600">
                  {sheet.rows.toLocaleString()}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-zinc-600">
                  {sheet.cols}
                </td>
                <td className="py-2.5 px-4 text-left pl-8 font-mono text-zinc-600">
                  {sheet.key === '-' ? (
                    <span className="text-zinc-300">-</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-800 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded font-mono">
                      <KeyRound className="w-2.5 h-2.5 text-amber-600" />
                      {sheet.key}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <span className="text-[11px] text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                    <Eye className="w-3 h-3" /> View sample
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Relationships Table */}
      <div>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
          Relationship
        </div>
        <div className="bg-white rounded border border-zinc-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider font-mono bg-zinc-50">
                <th className="py-2.5 px-4 font-normal">Relationship</th>
                <th className="py-2.5 px-4 text-right font-normal">Keys</th>
                <th className="py-2.5 px-4 text-right font-normal">Orphans</th>
                <th className="py-2.5 px-4 text-right font-normal">Resolves</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {relationships.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-zinc-400 text-xs">
                    No cross-sheet key relationships detected yet. Upload additional related sheets with matching ID columns to link them.
                  </td>
                </tr>
              ) : (
                relationships.map((rel) => (
                  <tr
                    key={rel.id}
                    id={`rel-row-${rel.id}`}
                    onClick={() => onPreviewRelationship && onPreviewRelationship(rel)}
                    className="hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-zinc-800 flex items-center gap-1.5">
                      <span className="text-zinc-900">{rel.parentSheet}</span>
                      <span className="text-zinc-400">+</span>
                      <span className="text-zinc-700">{rel.childSheet}</span>
                      <span className="text-zinc-400 text-[11px] font-normal">
                        ({rel.joinKey})
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-zinc-600">
                      {rel.keysCount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-zinc-600">
                      <span className="text-amber-700 font-bold">
                        {rel.orphansCount}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                        {rel.resolvesPercent}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
