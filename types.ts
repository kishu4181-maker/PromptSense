
export interface ChecklistItem {
  label: string;
  status: boolean;
  feedback: string;
}

export interface GroupedChecklist {
  context: ChecklistItem[];
  structure: ChecklistItem[];
  uxDetails: ChecklistItem[];
}

export interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  checklist: GroupedChecklist;
  prioritizedActions: string[];
  refinedPrompt: string;
  whatsChanged: string[];
}

export interface IterationAdvice {
  misunderstanding: string;
  rootCause: string;
  fix: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type AppMode = 'ANALYZE' | 'DEBUG';
