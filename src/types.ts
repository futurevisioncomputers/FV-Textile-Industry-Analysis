export type AgentStatus = 'pending' | 'running' | 'completed' | 'error';

export interface AgentStage {
  id: string;
  stageNumber: string; // e.g. '1', '2.5', '2', '2.7', '3', '4', '4.5', '5', '6', '6.5', '7', '8'
  name: string;
  subtitle?: string;
  optional?: boolean;
  role: string;
  objective: string;
  status: AgentStatus;
  inputSheets: string[];
  toolsUsed: string[];
  executionTimeMs?: number;
  logs: string[];
  outputSummary?: string;
  artifact?: {
    title: string;
    type: 'markdown' | 'json' | 'metrics' | 'chart' | 'recommendations';
    content: any;
  };
}

export interface SheetMeta {
  id: string;
  name: string;
  rows: number;
  cols: number;
  key: string;
  description: string;
  sampleColumns: { name: string; type: string; isKey?: boolean }[];
  sampleData: Record<string, any>[];
}

export interface RelationshipMeta {
  id: string;
  name: string; // e.g. "students + enquiries (ENQ_ID)"
  parentSheet: string;
  childSheet: string;
  joinKey: string;
  keysCount: number;
  orphansCount: number;
  resolvesPercent: number; // 100
}

export type ActiveTab = 'pipeline' | 'datamodel' | 'report' | 'concepts' | 'templates' | 'enquiry-link' | 'restructured-2026';

export interface PipelineStats {
  totalStages: number;
  completedStages: number;
  totalSheets: number;
  totalRows: number;
  foreignKeyStatus: 'all_resolved' | 'orphans_detected';
}

export interface BusinessInsightItem {
  id: string;
  title: string;
  category: 'Conversion' | 'Revenue' | 'Operations' | 'Retention' | 'Competitor Intelligence';
  metric: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
}
