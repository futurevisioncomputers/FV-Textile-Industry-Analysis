import React from 'react';
import { AgentStage } from '../types';
import { Play, StepForward, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface SidebarProps {
  stages: AgentStage[];
  selectedStageId: string | null;
  onSelectStage: (stageId: string) => void;
  onRunEverything: () => void;
  onRunNext: () => void;
  isRunningAll: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stages,
  selectedStageId,
  onSelectStage,
  onRunEverything,
  onRunNext,
  isRunningAll,
}) => {
  // Determine next pending agent
  const nextPendingStage = stages.find((s) => s.status === 'pending');

  const getStatusBadge = (status: AgentStage['status'], optional?: boolean) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            running
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-700 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
            <Check className="w-2.5 h-2.5" />
            done
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
            <AlertCircle className="w-2.5 h-2.5" />
            error
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="text-[11px] font-medium text-zinc-400">
            pending
          </span>
        );
    }
  };

  return (
    <aside className="w-72 bg-[#FAFAFA] border-r border-zinc-200 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto shrink-0 select-none">
      {/* Run Section */}
      <div className="p-4 border-b border-zinc-200">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 font-mono">
          Operations
        </h3>
        <div className="space-y-2">
          <button
            id="btn-run-everything"
            onClick={onRunEverything}
            disabled={isRunningAll}
            className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs py-2 px-3.5 rounded shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            {isRunningAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run everything</span>
              </>
            )}
          </button>

          <button
            id="btn-run-next"
            onClick={onRunNext}
            disabled={isRunningAll || !nextPendingStage}
            className="w-full bg-white hover:bg-zinc-50 disabled:opacity-50 text-zinc-700 border border-zinc-300 font-medium text-xs py-1.5 px-3.5 rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <StepForward className="w-3.5 h-3.5 text-zinc-500" />
            <span>
              {nextPendingStage
                ? `Next: ${nextPendingStage.name.toLowerCase().split(' ')[0]}`
                : 'All stages complete'}
            </span>
          </button>
        </div>
      </div>

      {/* Agent Pipeline Section */}
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
            Pipeline
          </h3>
          <span className="text-[10px] text-zinc-400 font-mono">Select</span>
        </div>

        <div className="space-y-1">
          {stages.map((stage) => {
            const isSelected = selectedStageId === stage.id;
            return (
              <div
                key={stage.id}
                id={`agent-stage-${stage.id}`}
                onClick={() => onSelectStage(stage.id)}
                className={`w-full group text-left px-2.5 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-zinc-100 border border-zinc-300 shadow-sm'
                    : 'hover:bg-zinc-50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  <span
                    className={`w-5 text-center font-mono text-xs font-semibold shrink-0 ${
                      isSelected ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'
                    }`}
                  >
                    {stage.stageNumber}
                  </span>
                  <div className="truncate">
                    <div
                      className={`text-xs font-medium truncate ${
                        isSelected ? 'text-zinc-900 font-semibold' : 'text-zinc-600'
                      }`}
                    >
                      {stage.name}
                      {stage.optional && (
                        <span className="text-[10px] text-zinc-400 font-normal ml-1">
                          · optional
                        </span>
                      )}
                    </div>
                    {stage.id === 'stage_analyst' && (
                      <div className="text-[10px] text-zinc-400 truncate">
                        contains Statistic...
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {getStatusBadge(stage.status, stage.optional)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
