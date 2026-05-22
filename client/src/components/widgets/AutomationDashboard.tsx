/**
 * Automation Dashboard — Real-time Automation Status
 * Void Interface Design System
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, AlertCircle, Clock, TrendingUp, RefreshCw } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'webhook' | 'api' | 'scheduled';
  status: 'active' | 'idle' | 'error' | 'running';
  lastRun: Date;
  nextRun?: Date;
  successCount: number;
  errorCount: number;
  avgDuration: number; // ms
}

const SAMPLE_AUTOMATIONS: Automation[] = [
  {
    id: '1',
    name: 'WhatsApp Lead Notifications',
    type: 'whatsapp',
    status: 'active',
    lastRun: new Date(Date.now() - 300000),
    nextRun: new Date(Date.now() + 3600000),
    successCount: 1247,
    errorCount: 3,
    avgDuration: 245,
  },
  {
    id: '2',
    name: 'Email Campaign Scheduler',
    type: 'email',
    status: 'active',
    lastRun: new Date(Date.now() - 600000),
    nextRun: new Date(Date.now() + 1800000),
    successCount: 892,
    errorCount: 12,
    avgDuration: 1230,
  },
  {
    id: '3',
    name: 'Webhook Data Sync',
    type: 'webhook',
    status: 'running',
    lastRun: new Date(Date.now() - 30000),
    successCount: 5634,
    errorCount: 8,
    avgDuration: 450,
  },
  {
    id: '4',
    name: 'Daily Report Generator',
    type: 'scheduled',
    status: 'idle',
    lastRun: new Date(Date.now() - 86400000),
    nextRun: new Date(Date.now() + 3600000),
    successCount: 365,
    errorCount: 0,
    avgDuration: 2100,
  },
  {
    id: '5',
    name: 'API Integration Check',
    type: 'api',
    status: 'error',
    lastRun: new Date(Date.now() - 120000),
    successCount: 4521,
    errorCount: 42,
    avgDuration: 890,
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  active: { bg: '#10b98120', text: '#10b981', icon: <CheckCircle2 className="w-3 h-3" /> },
  idle: { bg: '#6b728020', text: '#9ca3af', icon: <Clock className="w-3 h-3" /> },
  error: { bg: '#ef444420', text: '#ef4444', icon: <AlertCircle className="w-3 h-3" /> },
  running: { bg: '#3b82f620', text: '#3b82f6', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
};

const TYPE_COLORS: Record<string, string> = {
  whatsapp: '#25d366',
  email: '#ec4899',
  webhook: '#06b6d4',
  api: '#8b5cf6',
  scheduled: '#f59e0b',
};

export function AutomationDashboard() {
  const [automations, setAutomations] = useState<Automation[]>(SAMPLE_AUTOMATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAutomations(prev =>
      prev.map(a => ({
        ...a,
        lastRun: new Date(),
        status: Math.random() > 0.1 ? a.status : 'error',
      }))
    );
    setRefreshing(false);
  };

  const totalRuns = automations.reduce((sum, a) => sum + a.successCount + a.errorCount, 0);
  const totalErrors = automations.reduce((sum, a) => sum + a.errorCount, 0);
  const successRate = totalRuns > 0 ? ((totalRuns - totalErrors) / totalRuns * 100).toFixed(1) : '0';

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg border border-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">AUTOMATION DASHBOARD</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-1 hover:bg-cyan-500/10 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-3 py-2 border-b border-cyan-500/10 bg-slate-900/30">
        <div className="text-center">
          <p className="text-xs text-gray-500">Total Runs</p>
          <p className="text-sm font-mono text-cyan-400">{totalRuns.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Success Rate</p>
          <p className="text-sm font-mono text-green-400">{successRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Errors</p>
          <p className="text-sm font-mono text-red-400">{totalErrors}</p>
        </div>
      </div>

      {/* Automations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {automations.map((automation, idx) => {
            const statusColor = STATUS_COLORS[automation.status];
            return (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-2 rounded border border-cyan-500/10 hover:border-cyan-500/20 transition-colors"
                style={{ background: 'oklch(0.12 0.02 265 / 0.5)' }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: TYPE_COLORS[automation.type] }}
                    />
                    <p className="text-xs text-gray-300 truncate font-medium">
                      {automation.name}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs flex-shrink-0"
                    style={{ background: statusColor.bg, color: statusColor.text }}
                  >
                    {statusColor.icon}
                    <span className="capitalize">{automation.status}</span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>✓ {automation.successCount}</span>
                    <span className="text-red-400">✕ {automation.errorCount}</span>
                    <span>⏱ {automation.avgDuration}ms</span>
                  </div>
                  <span className="text-gray-600">
                    {Math.round((Date.now() - automation.lastRun.getTime()) / 60000)}m ago
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-cyan-500/10 bg-slate-900/50 text-xs text-gray-600">
        {automations.filter(a => a.status === 'active' || a.status === 'running').length} active • Last updated now
      </div>
    </div>
  );
}
