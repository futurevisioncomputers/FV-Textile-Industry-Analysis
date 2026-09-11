import React, { useState, useRef } from 'react';
import {
  X,
  RotateCcw,
  Upload,
  FileSpreadsheet,
  Check,
  Loader2,
  Trash2,
  AlertCircle,
  FileCode,
  FolderOpen,
  Sparkles,
  CheckCircle2,
  Table,
  Plus
} from 'lucide-react';
import { SheetMeta } from '../types';
import { parseFileToSheets } from '../utils/fileParser';

interface NewRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetRun: () => void;
  onLoadAlternateDataset: (type: 'default' | 'saas' | 'ecommerce' | 'textile') => void;
  onApplyUploadedSheets: (newSheets: SheetMeta[], append: boolean) => void;
}

export const NewRunModal: React.FC<NewRunModalProps> = ({
  isOpen,
  onClose,
  onResetRun,
  onLoadAlternateDataset,
  onApplyUploadedSheets,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'builder' | 'presets'>('upload');
  const [selectedPreset, setSelectedPreset] = useState<'default' | 'saas' | 'ecommerce' | 'textile'>('default');

  // File upload state
  const [isParsing, setIsParsing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [parsedSheets, setParsedSheets] = useState<SheetMeta[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [appendMode, setAppendMode] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste state
  const [pastedName, setPastedName] = useState('campaign_performance');
  const [pastedText, setPastedText] = useState('');

  // Table Builder state
  const [builderTableName, setBuilderTableName] = useState('scholarship_awards');
  const [builderColumns, setBuilderColumns] = useState('student_id, scholarship_name, amount_usd, award_date, status');
  const [builderRows, setBuilderRows] = useState(
    `STU-101, Merit Excellence, 500.00, 2024-02-15, Approved\nSTU-102, Need-Based Aid, 800.00, 2024-02-18, Approved\nSTU-103, STEM Fellowship, 600.00, 2024-02-20, Pending`
  );

  if (!isOpen) return null;

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsParsing(true);
    setParseError(null);
    setUploadSuccessMessage(null);

    const newlyParsed: SheetMeta[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const sheets = await parseFileToSheets(file);
        if (sheets.length === 0) {
          errors.push(`"${file.name}": No readable data rows found.`);
        } else {
          newlyParsed.push(...sheets);
        }
      } catch (err: any) {
        errors.push(`"${file.name}": ${err.message || 'Parse error'}`);
      }
    }

    if (newlyParsed.length > 0) {
      setParsedSheets((prev) => [...prev, ...newlyParsed]);
      setUploadSuccessMessage(
        `Added ${newlyParsed.length} sheet${newlyParsed.length > 1 ? 's' : ''} (${newlyParsed
          .reduce((a, b) => a + b.rows, 0)
          .toLocaleString()} rows). Click "Apply to Pipeline" below to save.`
      );
    }

    if (errors.length > 0) {
      setParseError(errors.join(' | '));
    }

    setIsParsing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  // Quick 1-click sample sheets
  const handleAddQuickSample = (sampleType: 'placements' | 'scholarships' | 'marketing') => {
    let name = '';
    let csv = '';

    if (sampleType === 'placements') {
      name = 'campus_placements';
      csv = `student_id,company_name,job_role,package_lpa,offer_date,status
STU-101,Amazon Web Services,Cloud Support Engineer,14.5,2024-03-01,Accepted
STU-102,Microsoft,Software Engineer I,18.0,2024-03-05,Accepted
STU-103,Google Cloud,Solutions Architect Associate,16.2,2024-03-08,Accepted
STU-104,Deloitte Digital,Data Analyst,9.5,2024-03-10,Under Review
STU-105,Salesforce,Member Technical Staff,15.0,2024-03-12,Accepted`;
    } else if (sampleType === 'scholarships') {
      name = 'scholarship_grants';
      csv = `student_id,grant_type,amount_usd,sanctioned_date,donor_organization
STU-101,Merit Tuition Waiver,750.00,2024-01-15,Global Ed Foundation
STU-102,Women in Tech Grant,1200.00,2024-01-20,Ada Lovelace Trust
STU-103,First Generation Learner,500.00,2024-01-22,Civic Impact Fund
STU-104,Academic Excellence,900.00,2024-01-25,National Science Council
STU-105,Need-Based Assistance,650.00,2024-01-28,Community Outreach`;
    } else {
      name = 'marketing_campaigns';
      csv = `campaign_id,channel,budget_usd,leads_generated,admissions_closed,roas
CMP-201,Google Search Ads,3200.00,410,64,4.2
CMP-202,LinkedIn Sponsored InMail,2500.00,180,38,3.6
CMP-203,Meta Instagram Reels,1400.00,520,45,2.9
CMP-204,YouTube Tech Webinars,1800.00,340,52,4.8
CMP-205,Campus Partner Referrals,800.00,120,35,6.1`;
    }

    try {
      const file = new File([csv], `${name}.csv`, { type: 'text/csv' });
      parseFileToSheets(file).then((sheets) => {
        setParsedSheets((prev) => [...prev, ...sheets]);
        setUploadSuccessMessage(`Added sample table "${name}" (${sheets[0]?.rows} rows). Ready to apply!`);
      });
    } catch (err: any) {
      setParseError(err.message);
    }
  };

  const handleRemoveParsedSheet = (id: string) => {
    setParsedSheets((prev) => prev.filter((s) => s.id !== id));
  };

  const handleParsePastedText = async () => {
    if (!pastedText.trim()) return;
    setIsParsing(true);
    setParseError(null);
    setUploadSuccessMessage(null);

    try {
      const fileName = pastedName.trim() ? `${pastedName.trim()}.csv` : 'custom_data.csv';
      const file = new File([pastedText], fileName, { type: 'text/csv' });
      const sheets = await parseFileToSheets(file);
      setParsedSheets((prev) => [...prev, ...sheets]);
      setPastedText('');
      setUploadSuccessMessage(`Successfully parsed "${sheets[0]?.name}" (${sheets[0]?.rows} rows).`);
      setActiveTab('upload');
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse text. Please check CSV/JSON syntax.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleCreateFromBuilder = async () => {
    if (!builderTableName.trim() || !builderColumns.trim()) return;
    setIsParsing(true);
    setParseError(null);

    try {
      const csvContent = `${builderColumns.trim()}\n${builderRows.trim()}`;
      const file = new File([csvContent], `${builderTableName.trim()}.csv`, { type: 'text/csv' });
      const sheets = await parseFileToSheets(file);
      setParsedSheets((prev) => [...prev, ...sheets]);
      setUploadSuccessMessage(`Created table "${sheets[0]?.name}" (${sheets[0]?.rows} rows).`);
      setActiveTab('upload');
    } catch (err: any) {
      setParseError(err.message || 'Failed to build table.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleApply = () => {
    if (activeTab === 'presets') {
      onLoadAlternateDataset(selectedPreset);
      onClose();
      return;
    }

    if (parsedSheets.length > 0) {
      onApplyUploadedSheets(parsedSheets, appendMode);
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">
              Add Data Files & Configure Pipeline
            </h2>
          </div>
          <button
            id="close-run-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 flex space-x-3 text-xs font-medium bg-white overflow-x-auto">
          <button
            id="modal-tab-upload"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Files (.xlsx, .csv, .json)
            {parsedSheets.length > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {parsedSheets.length} ready
              </span>
            )}
          </button>

          <button
            id="modal-tab-paste"
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'paste'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Paste CSV / Text
          </button>

          <button
            id="modal-tab-builder"
            onClick={() => setActiveTab('builder')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'builder'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table Builder
          </button>

          <button
            id="modal-tab-presets"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'presets'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Benchmark Datasets
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {parseError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Error parsing data:</span>
                <span className="text-[11px] block">{parseError}</span>
              </div>
            </div>
          )}

          {uploadSuccessMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{uploadSuccessMessage}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4 select-none">
              <div>
                <label className="font-semibold text-slate-900 block text-xs mb-1">
                  Select Spreadsheet or Data File
                </label>
                <p className="text-slate-500 text-[11px] mb-3">
                  Upload Excel (<span className="font-mono text-slate-700">.xlsx, .xls</span>), CSV (<span className="font-mono text-slate-700">.csv, .tsv</span>), or JSON files.
                </p>

                {/* Direct Visible File Input for 100% Cross-Browser / Iframe Compatibility */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-xs">
                        Browse files directly:
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Supports single or multi-file selection
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex justify-end">
                    <input
                      ref={fileInputRef}
                      id="primary-file-input"
                      type="file"
                      multiple
                      accept=".xlsx,.xls,.ods,.csv,.tsv,.json,.txt"
                      onChange={handleFilesSelected}
                      disabled={isParsing}
                      className="text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                    />
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  id="file-drop-zone"
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
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      await processFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-3 border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all text-center ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50/90 scale-[1.01]'
                      : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50'
                  }`}
                >
                  {isParsing ? (
                    <div className="flex flex-col items-center py-2">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                      <span className="font-semibold text-slate-800 text-xs">
                        Parsing workbook & schema...
                      </span>
                    </div>
                  ) : (
                    <>
                      <FolderOpen className="w-6 h-6 text-slate-400 mb-1.5" />
                      <span className="font-semibold text-slate-800 text-xs">
                        Or drag and drop files anywhere inside this box
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        Multiple files will be parsed together and automatically linked by key
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 1-Click Instant Sample Datasets to Test Adding Data */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Need a test file? Add in 1-click:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddQuickSample('placements')}
                    className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors group"
                  >
                    <div className="font-medium text-slate-800 group-hover:text-blue-700 text-[11px]">
                      + Placements
                    </div>
                    <div className="text-[10px] text-slate-500">
                      5 offers · links student_id
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddQuickSample('scholarships')}
                    className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors group"
                  >
                    <div className="font-medium text-slate-800 group-hover:text-blue-700 text-[11px]">
                      + Scholarships
                    </div>
                    <div className="text-[10px] text-slate-500">
                      5 grants · links student_id
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddQuickSample('marketing')}
                    className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors group"
                  >
                    <div className="font-medium text-slate-800 group-hover:text-blue-700 text-[11px]">
                      + Campaigns
                    </div>
                    <div className="text-[10px] text-slate-500">
                      5 channels · ROAS spend
                    </div>
                  </button>
                </div>
              </div>

              {/* List of Parsed Sheets Ready to Apply */}
              {parsedSheets.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Sheets Ready to Apply ({parsedSheets.length})
                    </span>
                    <button
                      onClick={() => setParsedSheets([])}
                      className="text-slate-400 hover:text-red-600 text-[11px] transition-colors"
                    >
                      Clear list
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {parsedSheets.map((sheet) => (
                      <div
                        key={sheet.id}
                        className="flex items-center justify-between p-2 bg-emerald-50/50 border border-emerald-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-mono font-semibold text-slate-900 text-xs">
                              {sheet.name}
                            </span>
                            <span className="text-slate-500 text-[11px] ml-2">
                              {sheet.rows.toLocaleString()} rows · {sheet.cols} cols
                            </span>
                            {sheet.key !== '-' && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono ml-2">
                                Key: {sheet.key}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveParsedSheet(sheet.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Mode radio options */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="appendMode"
                        checked={!appendMode}
                        onChange={() => setAppendMode(false)}
                        className="text-blue-600"
                      />
                      <span className="text-slate-900 font-medium">Replace current pipeline sheets</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">Recommended</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="appendMode"
                        checked={appendMode}
                        onChange={() => setAppendMode(true)}
                        className="text-blue-600"
                      />
                      <span className="text-slate-600">Append as additional sheets</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PASTE RAW TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-semibold text-slate-900 block">
                    Paste Raw CSV or JSON
                  </label>
                  <p className="text-slate-500 text-[11px]">
                    Paste comma-separated rows or JSON records directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPastedName('campaign_performance');
                    setPastedText(`campaign_id,channel,cost_usd,leads,admissions
CMP-01,Google Search,1200.00,45,18
CMP-02,LinkedIn Sponsored,2100.00,72,24
CMP-03,Email Outreach,350.00,28,14`);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-[11px] underline"
                >
                  Fill Sample Text
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Sheet / Table Name:
                </label>
                <input
                  type="text"
                  value={pastedName}
                  onChange={(e) => setPastedName(e.target.value)}
                  placeholder="e.g. quarterly_marketing_spend"
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`student_id,name,gpa,major\nSTU-101,Aarav,3.8,Computer Science\nSTU-102,Priya,3.9,Data Science`}
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleParsePastedText}
                disabled={!pastedText.trim() || isParsing}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                Parse & Add to Ready List
              </button>
            </div>
          )}

          {/* TAB 3: TABLE BUILDER */}
          {activeTab === 'builder' && (
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-900 block">
                  Interactive Table Creator
                </label>
                <p className="text-slate-500 text-[11px]">
                  Specify column headers and rows to construct a new relational table instantly.
                </p>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Table Name:
                </label>
                <input
                  type="text"
                  value={builderTableName}
                  onChange={(e) => setBuilderTableName(e.target.value)}
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Columns (comma separated):
                </label>
                <input
                  type="text"
                  value={builderColumns}
                  onChange={(e) => setBuilderColumns(e.target.value)}
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Rows (one per line, comma separated values):
                </label>
                <textarea
                  rows={4}
                  value={builderRows}
                  onChange={(e) => setBuilderRows(e.target.value)}
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleCreateFromBuilder}
                disabled={!builderTableName.trim() || isParsing}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Build & Add Table
              </button>
            </div>
          )}

          {/* TAB 4: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-2.5">
              <label className="font-semibold text-slate-900 block mb-1">
                Select Pre-Configured Benchmark Datasets
              </label>

              <div
                onClick={() => setSelectedPreset('default')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                  selectedPreset === 'default'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    Institute Operations & Admissions (5 Sheets · 8,793 Rows)
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    fee_receipts, follow_up_calls, enquiries, students, certificates with 100% key resolution.
                  </p>
                </div>
                {selectedPreset === 'default' && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </div>

              <div
                onClick={() => setSelectedPreset('saas')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                  selectedPreset === 'saas'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                    B2B SaaS Analytics (5 Sheets · 11,420 Rows)
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    invoices, subscriptions, support_tickets, accounts, telemetry_events.
                  </p>
                </div>
                {selectedPreset === 'saas' && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </div>

              <div
                onClick={() => setSelectedPreset('ecommerce')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                  selectedPreset === 'ecommerce'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    E-Commerce & Logistics (4 Sheets · 6,850 Rows)
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    orders, line_items, customers, and shipments.
                  </p>
                </div>
                {selectedPreset === 'ecommerce' && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </div>

              <div
                onClick={() => setSelectedPreset('textile')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                  selectedPreset === 'textile'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
                    Textile Mill Manufacturing &amp; Looms (5 Sheets · 4,850 Rows)
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    machinery_master, employee_roster, product_catalog, production_daily_logs, variance_and_quality_audit.
                  </p>
                </div>
                {selectedPreset === 'textile' && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={() => {
              onResetRun();
              onClose();
            }}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded hover:bg-slate-200/50 transition-colors"
          >
            Reset Run State
          </button>

          <button
            id="modal-apply-btn"
            onClick={handleApply}
            className={`text-xs font-medium py-2 px-5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'presets' || parsedSheets.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer ring-2 ring-blue-500/30'
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700'
            }`}
          >
            {activeTab === 'presets' ? (
              'Apply Preset & Launch'
            ) : parsedSheets.length > 0 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Apply {parsedSheets.length} Sheet{parsedSheets.length > 1 ? 's' : ''} to Pipeline</span>
              </>
            ) : (
              'Done / Close'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
