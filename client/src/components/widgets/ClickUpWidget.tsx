/**
 * ClickUp Widget — Task Management Integration
 * Void Interface Design System
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle, Plus, RefreshCw, ExternalLink } from 'lucide-react';
import { useClickUp } from '@/hooks/useClickUp';

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#3b82f6',
  low: '#8b5cf6',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  'todo': <Circle className="w-4 h-4" />,
  'in progress': <RefreshCw className="w-4 h-4 animate-spin" />,
  'in review': <AlertCircle className="w-4 h-4" />,
  'done': <CheckCircle2 className="w-4 h-4" />,
};

export function ClickUpWidget() {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, createTask } = useClickUp();
  const [newTaskName, setNewTaskName] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);

  const handleCreateTask = () => {
    if (!newTaskName.trim()) return;
    createTask(newTaskName);
    setNewTaskName('');
    setShowNewTask(false);
  };

  const handleStatusChange = (taskId: string, currentStatus: string) => {
    const statusFlow: Record<string, string> = {
      'todo': 'in progress',
      'in progress': 'in review',
      'in review': 'done',
      'done': 'todo',
    };
    const newStatus = statusFlow[currentStatus] || 'todo';
    updateTaskStatus(taskId, newStatus);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    return (priorityOrder[a.priority || 'normal'] || 2) - (priorityOrder[b.priority || 'normal'] || 2);
  });

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg border border-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">✓</span>
          <span className="text-xs font-mono text-cyan-400">CLICKUP TASKS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTasks}
            disabled={isLoading}
            className="p-1 hover:bg-cyan-500/10 rounded transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowNewTask(!showNewTask)}
            className="p-1 hover:bg-cyan-500/10 rounded transition-colors"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* New Task Input */}
      {showNewTask && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 py-2 border-b border-cyan-500/10 bg-slate-900/30"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateTask();
              }}
              placeholder="New task..."
              className="flex-1 bg-slate-800 text-cyan-400 text-xs px-2 py-1 rounded border border-cyan-500/20 outline-none focus:border-cyan-500/50 placeholder-gray-600"
              autoFocus
            />
            <button
              onClick={handleCreateTask}
              className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30 transition-colors"
            >
              Add
            </button>
          </div>
        </motion.div>
      )}

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto">
        {sortedTasks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-xs">
            No tasks
          </div>
        ) : (
          <div className="space-y-1 p-3">
            {sortedTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex items-start gap-2 p-2 rounded hover:bg-cyan-500/10 transition-colors cursor-pointer"
                onClick={() => handleStatusChange(task.id, task.status)}
              >
                {/* Status Icon */}
                <div
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: PRIORITY_COLORS[task.priority || 'normal'] }}
                >
                  {STATUS_ICONS[task.status] || <Circle className="w-4 h-4" />}
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">{task.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: PRIORITY_COLORS[task.priority || 'normal'] + '20',
                        color: PRIORITY_COLORS[task.priority || 'normal'],
                      }}
                    >
                      {task.priority || 'normal'}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* External Link */}
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-cyan-500/10 bg-slate-900/50 text-xs text-gray-600">
        {tasks.length} tasks • Click to change status
      </div>
    </div>
  );
}
