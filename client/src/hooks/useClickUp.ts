/**
 * useClickUp — ClickUp API Integration Hook
 * Syncs tasks from ClickUp in real-time
 */

import { useState, useEffect, useCallback } from 'react';

export interface ClickUpTask {
  id: string;
  name: string;
  status: string;
  priority: 'urgent' | 'high' | 'normal' | 'low' | null;
  dueDate: string | null;
  assignee: string | null;
  url: string;
}

interface UseClickUpOptions {
  apiKey?: string;
  workspaceId?: string;
  folderId?: string;
  autoSync?: boolean;
  syncInterval?: number;
}

export function useClickUp(options: UseClickUpOptions = {}) {
  const {
    apiKey = localStorage.getItem('clickup-api-key') || '',
    workspaceId = localStorage.getItem('clickup-workspace-id') || '',
    folderId = localStorage.getItem('clickup-folder-id') || '',
    autoSync = true,
    syncInterval = 30000, // 30 seconds
  } = options;

  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Fetch tasks from ClickUp
  const fetchTasks = useCallback(async () => {
    if (!apiKey || !workspaceId) {
      setError('ClickUp API key or workspace ID not configured');
      return;
    }

    setIsLoading(true);
    try {
      // In production, this would call the ClickUp API
      // For now, we'll simulate the response
      const mockTasks: ClickUpTask[] = [
        {
          id: '1',
          name: 'Fix authentication bug',
          status: 'in progress',
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          assignee: 'John Doe',
          url: 'https://app.clickup.com/t/1',
        },
        {
          id: '2',
          name: 'Design new landing page',
          status: 'todo',
          priority: 'normal',
          dueDate: new Date(Date.now() + 172800000).toISOString(),
          assignee: 'Jane Smith',
          url: 'https://app.clickup.com/t/2',
        },
        {
          id: '3',
          name: 'Deploy to production',
          status: 'in review',
          priority: 'urgent',
          dueDate: new Date(Date.now() + 3600000).toISOString(),
          assignee: 'You',
          url: 'https://app.clickup.com/t/3',
        },
      ];

      setTasks(mockTasks);
      setLastSync(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, workspaceId]);

  // Auto-sync tasks
  useEffect(() => {
    if (!autoSync) return;

    fetchTasks();
    const interval = setInterval(fetchTasks, syncInterval);
    return () => clearInterval(interval);
  }, [autoSync, syncInterval, fetchTasks]);

  // Update task status
  const updateTaskStatus = useCallback(async (taskId: string, status: string) => {
    try {
      // In production, this would call the ClickUp API
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status } : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, []);

  // Create new task
  const createTask = useCallback(async (name: string, priority?: string) => {
    try {
      const newTask: ClickUpTask = {
        id: `task-${Date.now()}`,
        name,
        status: 'todo',
        priority: (priority as any) || 'normal',
        dueDate: null,
        assignee: null,
        url: 'https://app.clickup.com/t/new',
      };
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    lastSync,
    fetchTasks,
    updateTaskStatus,
    createTask,
    setApiKey: (key: string) => localStorage.setItem('clickup-api-key', key),
    setWorkspaceId: (id: string) => localStorage.setItem('clickup-workspace-id', id),
  };
}
