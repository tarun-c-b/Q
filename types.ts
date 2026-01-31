export interface QueueState {
  l: (number | null)[];
  front: number;
  back: number;
  size: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'system';
}

export enum ActionType {
  ENQUEUE = 'ENQUEUE',
  DEQUEUE = 'DEQUEUE',
  DISPLAY = 'DISPLAY',
  LOC = 'LOC',
  INIT = 'INIT'
}