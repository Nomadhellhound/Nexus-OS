/**
 * Terminal Widget — Claude Code Integration
 * Void Interface Design System
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, Copy, Trash2 } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  timestamp: Date;
}

export function TerminalWidget() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'info',
      content: 'NEXUS Terminal v1.0 — Claude Code Integration',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'info',
      content: 'Type commands or paste Claude Code snippets',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleExecute = () => {
    if (!input.trim()) return;

    const newLine: TerminalLine = {
      id: `input-${Date.now()}`,
      type: 'input',
      content: `$ ${input}`,
      timestamp: new Date(),
    };

    setLines(prev => [...prev, newLine]);

    // Simulate command execution
    setTimeout(() => {
      const outputLine: TerminalLine = {
        id: `output-${Date.now()}`,
        type: 'output',
        content: `Executed: ${input}`,
        timestamp: new Date(),
      };
      setLines(prev => [...prev, outputLine]);
    }, 300);

    setInput('');
  };

  const handleClear = () => {
    setLines([
      {
        id: `${Date.now()}`,
        type: 'info',
        content: 'Terminal cleared',
        timestamp: new Date(),
      },
    ]);
  };

  const handleCopy = () => {
    const content = lines.map(l => l.content).join('\n');
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg border border-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">TERMINAL</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-cyan-500/10 rounded transition-colors"
            title="Copy output"
          >
            <Copy className="w-3 h-3 text-cyan-400" />
          </button>
          <button
            onClick={handleClear}
            className="p-1 hover:bg-red-500/10 rounded transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1 font-mono text-xs"
      >
        {lines.map((line, idx) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            className={`${
              line.type === 'input'
                ? 'text-cyan-400'
                : line.type === 'error'
                ? 'text-red-400'
                : line.type === 'info'
                ? 'text-gray-500'
                : 'text-green-400'
            }`}
          >
            {line.content}
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-cyan-500/10 bg-slate-900/50 p-3">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-xs">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecute();
            }}
            placeholder="Enter command or paste Claude Code..."
            className="flex-1 bg-transparent text-cyan-400 font-mono text-xs outline-none placeholder-gray-600"
          />
          <button
            onClick={handleExecute}
            className="p-1 hover:bg-cyan-500/20 rounded transition-colors"
          >
            <Send className="w-3 h-3 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
