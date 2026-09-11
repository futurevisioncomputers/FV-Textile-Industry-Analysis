import React from 'react';
import { ActiveTab, PipelineStats } from '../types';
import {
  Play,
  Database,
  RotateCcw,
  CheckCircle2,
  Factory,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  stats: PipelineStats;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onNewRun: () => void;
  onRunEverything?: () => void;
  isRunningAll?: boolean;
  onLoadDataset?: (type: 'default' | 'textile' | 'saas' | 'ecommerce') => void;
  activeDomain?: 'default' | 'textile' | 'saas' | 'ecommerce' | 'custom';
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  activeTab,
  onTabChange,
  onNewRun,
  onRunEverything,
  isRunningAll = false,
}) => {
  return (
    <header className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      {/* Brand & Stage Progress */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-sm bg-zinc-900 flex items-center justify-center text-white shadow-sm border border-zinc-950">
            <Factory className="w-4 h-4 text-zinc-50" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900 tracking-tight text-sm font-serif">
              TextileOS
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">Mill Intelligence</span>
          </div>
        </div>

        <div className="text-xs font-medium text-zinc-500 hidden sm:flex items-center space-x-1.5 ml-2">
          <span className={stats.completedStages > 0 ? 'text-zinc-900 font-semibold' : 'text-zinc-600'}>
            {stats.completedStages}/{stats.totalStages} stages
          </span>
          <span className="text-zinc-300">·</span>
          <span>{stats.totalSheets} sheets</span>
          {stats.completedStages === stats.totalStages && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm font-medium ml-1">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
          )}
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center bg-zinc-100 p-0.5 rounded border border-zinc-200 text-xs font-medium">
          <button
            id="tab-pipeline"
            onClick={() => onTabChange('pipeline')}
            className={`px-3.5 py-1.5 rounded-sm transition-all ${
              activeTab === 'pipeline'
                ? 'bg-white text-zinc-900 shadow-sm font-bold border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Pipeline
          </button>
          <button
            id="tab-datamodel"
            onClick={() => onTabChange('datamodel')}
            className={`px-3.5 py-1.5 rounded-sm transition-all ${
              activeTab === 'datamodel'
                ? 'bg-white text-zinc-900 shadow-sm font-bold border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Data model
          </button>
          <button
            id="tab-report"
            onClick={() => onTabChange('report')}
            className={`px-3.5 py-1.5 rounded-sm transition-all ${
              activeTab === 'report'
                ? 'bg-white text-zinc-900 shadow-sm font-bold border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Report
          </button>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
          {onRunEverything && (
            <button
              id="btn-header-run-everything"
              onClick={onRunEverything}
              disabled={isRunningAll}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white px-3 py-1.5 rounded shadow-sm transition-colors cursor-pointer"
              title="Execute all AI Agent analytical stages sequentially"
            >
              {isRunningAll ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isRunningAll ? 'Running...' : 'Run Everything'}</span>
            </button>
          )}

          <button
            id="btn-new-run"
            onClick={onNewRun}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 px-3 py-1.5 rounded shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Update Files</span>
          </button>
        </div>
      </div>
    </header>
  );
};
