export interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  localTime: string;
  timezone: string;
  retryCount: number;
  maxRetries: number;
}

export interface ActionQueue {
  actions: QueuedAction[];
  maxSize: number;
}

class ActionQueueManager {
  private queue: QueuedAction[] = [];
  private readonly maxSize = 100; 
  private readonly storageKey = 'actionQueue';
  private readonly maxRetries = 3;

  constructor() {
    this.loadFromStorage();
  }

  addAction(type: string, payload: any, timezone?: string): string {
    const id = this.generateId();
    const now = new Date();
    
    const action: QueuedAction = {
      id,
      type,
      payload,
      timestamp: Math.floor(now.getTime() / 1000),
      localTime: now.toISOString(),
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      retryCount: 0,
      maxRetries: this.maxRetries
    };

    
    if (this.queue.length >= this.maxSize) {
      this.queue.shift();
    }

    this.queue.push(action);
    this.saveToStorage();
    
    return id;
  }

  getActions(): QueuedAction[] {
    return [...this.queue];
  }

  removeAction(id: string): boolean {
    const index = this.queue.findIndex(action => action.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  clearQueue(): void {
    this.queue = [];
    this.saveToStorage();
  }

  incrementRetryCount(id: string): boolean {
    const action = this.queue.find(a => a.id === id);
    if (action && action.retryCount < action.maxRetries) {
      action.retryCount++;
      this.saveToStorage();
      return true;
    }
    return false;
  }


  hasActions(): boolean {
    return this.queue.length > 0;
  }

  getQueueSize(): number {
    return this.queue.length;
  }

 
  getActionsByType(type: string): QueuedAction[] {
    return this.queue.filter(action => action.type === type);
  }

 
  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
      }
    } catch (error) {
      console.error('Failed to save action queue to storage:', error);
    }
  }


  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.queue = JSON.parse(stored);
          
          const weekAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
          this.queue = this.queue.filter(action => action.timestamp > weekAgo);
        }
      }
    } catch (error) {
      console.error('Failed to load action queue from storage:', error);
      this.queue = [];
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}


export const actionQueueManager = new ActionQueueManager();

export const useActionQueue = () => {
  const addToQueue = (type: string, payload: any, timezone?: string) => {
    return actionQueueManager.addAction(type, payload, timezone);
  };

  const getQueue = () => actionQueueManager.getActions();
  const clearQueue = () => actionQueueManager.clearQueue();
  const hasActions = () => actionQueueManager.hasActions();
  const getQueueSize = () => actionQueueManager.getQueueSize();

  return {
    addToQueue,
    getQueue,
    clearQueue,
    hasActions,
    getQueueSize
  };
}; 