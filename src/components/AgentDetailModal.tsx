import React, { useState } from 'react';
import { AgentStage, SheetMeta } from '../types';
import {
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Terminal,
  FileCode2,
  Layers,
  Wrench,
  Send,
  ExternalLink,
  TableProperties
} from 'lucide-react';

interface AgentDetailModalProps {
  stage: AgentStage;
  sheets: SheetMeta[];
  onClose: () => void;
  onExecuteAgent: (stageId: string, customPrompt?: string) => Promise<void>;
  isExecuting: boolean;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  stage,
  sheets,
  onClose,
  onExecuteAgent,
  isExecuting,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'artifact' | 'logs'>('overview');

  const handleRun = () => {
    onExecuteAgent(stage.id, customPrompt);
  };

  const getStatusBadge = () => {
    switch (stage.status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <Loader2 className="w-3 h-3 animate-spin" />
            Executing with AI...
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Stage Passed
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Execution Error
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Ready to execute
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono text-sm font-semibold flex items-center justify-center shadow-xs">
              {stage.stageNumber}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  {stage.name}
                </h2>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Role: <span className="font-medium text-slate-700">{stage.role}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-execute-stage-modal"
              onClick={handleRun}
              disabled={isExecuting}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>{stage.status === 'completed' ? 'Re-run Agent' : 'Run Agent'}</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-nav tabs */}
        <div className="px-6 border-b border-slate-200 flex space-x-6 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-2.5 border-b-2 transition-all ${
              activeSubTab === 'overview'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Inputs
          </button>
          <button
            onClick={() => setActiveSubTab('artifact')}
            className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'artifact'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode2 className="w-3 h-3" />
            Stage Artifact & Outputs
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'logs'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3 h-3" />
            Execution Trace ({stage.logs.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSubTab === 'overview' && (
            <div className="space-y-5">
              {/* Objective */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Agent Objective
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {stage.objective}
                </p>
              </div>

              {/* Input Sheets */}
              <div>
                <h4 className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Input Document Sheets Analyzed ({stage.inputSheets.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {stage.inputSheets.map((sheetId) => {
                    const sheet = sheets.find((s) => s.id === sheetId || s.name === sheetId);
                    return (
                      <div
                        key={sheetId}
                        className="bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-slate-900">
                            {sheet?.name || sheetId}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {sheet ? `${sheet.rows.toLocaleString()} rows` : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {sheet?.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tools Used */}
              <div>
                <h4 className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-slate-500" />
                  Agent Tools & Heuristics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {stage.toolsUsed.map((tool) => (
                    <span
                      key={tool}
                      className="text-[11px] font-mono text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom Guidance Prompt Input */}
              <div className="border-t border-slate-200 pt-4">
                <label
                  htmlFor="custom-agent-prompt"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Prompt Guidance for this Agent (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="custom-agent-prompt"
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., Focus specifically on leads from paid search ads..."
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                  <button
                    onClick={handleRun}
                    disabled={isExecuting}
                    className="text-xs font-medium bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white px-3.5 py-2 rounded-lg transition-colors inline-flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Guide Agent</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'artifact' && (
            <div className="space-y-4">
              {stage.artifact ? (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-900 font-mono">
                      {stage.artifact.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {stage.artifact.type}
                    </span>
                  </div>

                  {stage.artifact.type === 'markdown' && (
                    <div className="prose prose-xs max-w-none text-xs text-slate-700 space-y-2 whitespace-pre-wrap leading-relaxed font-sans">
                      {stage.artifact.content}
                    </div>
                  )}

                  {stage.artifact.type === 'json' && (
                    <pre className="text-[11px] font-mono bg-slate-900 text-slate-100 p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(stage.artifact.content, null, 2)}
                    </pre>
                  )}

                  {stage.artifact.type === 'metrics' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(stage.artifact.content).map(([key, val]) => (
                        <div key={key} className="bg-white p-3 rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium truncate">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </div>
                          <div className="text-base font-semibold text-slate-900 font-mono mt-1">
                            {String(val)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {stage.artifact.type === 'recommendations' && Array.isArray(stage.artifact.content) && (
                    <div className="space-y-2">
                      {stage.artifact.content.map((rec: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mr-2">
                              {rec.priority}
                            </span>
                            <span className="font-semibold text-slate-900">{rec.title}</span>
                            <div className="text-[11px] text-slate-500 mt-1">
                              Impact: {rec.impact} · Owner: {rec.owner} · Effort: {rec.effort}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {stage.artifact.type === 'chart' && (
                    <div className="text-xs text-slate-600 bg-white p-4 rounded border border-slate-200 text-center">
                      Charts compiled and accessible in the <strong className="text-blue-600">Report</strong> tab.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No artifact generated yet. Click "Run Agent" to execute this pipeline stage.
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'logs' && (
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-[11px] text-slate-200 space-y-1.5 max-h-80 overflow-y-auto border border-slate-800">
              <div className="text-slate-500 text-[10px] pb-1 border-b border-slate-800">
                [SYSTEM TRACE] Agent: {stage.name} (Stage {stage.stageNumber})
              </div>
              {stage.logs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-slate-600 select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-emerald-400 select-none">›</span>
                  <span className="text-slate-300">{log}</span>
                </div>
              ))}
              {stage.status === 'completed' && (
                <div className="text-emerald-400 font-semibold pt-1 border-t border-slate-800/80">
                  ✔ Stage execution finalized. All downstream contracts satisfied.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            {stage.outputSummary ? stage.outputSummary : 'Pending stage execution'}
          </span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium px-3 py-1 rounded hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
