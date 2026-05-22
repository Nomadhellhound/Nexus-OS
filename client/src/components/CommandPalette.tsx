/**
 * NEXUS OS — Command Palette
 * Void Interface: Raycast-inspired command center
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useNexus, WorkspaceMode, Widget } from '@/contexts/NexusContext';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, Layers, Focus, Zap, FlaskConical,
  StickyNote, CheckSquare, Sparkles, FolderKanban,
  BarChart3, Music2, Rocket, GitBranch,
  ArrowRight, Hash, Keyboard, Star, FolderOpen
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  category: string;
  shortcut?: string;
  action: () => void;
  color?: string;
}

export default function CommandPalette() {
  const {
    commandPaletteOpen, setCommandPaletteOpen,
    setWorkspaceMode, openWidget, projects, setActiveProject,
  } = useNexus();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build commands
  const allCommands: Command[] = useMemo(() => [
    // Workspace modes
    { id: 'mode-canvas',  label: 'Switch to Canvas',  description: 'Infinite spatial canvas', icon: <Layers size={14} />,       category: 'Workspace', shortcut: '⌘1', color: '#22d3ee', action: () => { setWorkspaceMode('canvas'); setCommandPaletteOpen(false); } },
    { id: 'mode-focus',   label: 'Switch to Focus',   description: 'Distraction-free mode',   icon: <Focus size={14} />,        category: 'Workspace', shortcut: '⌘2', color: '#a78bfa', action: () => { setWorkspaceMode('focus'); setCommandPaletteOpen(false); } },
    { id: 'mode-flow',    label: 'Switch to Flow',    description: 'Deep work state',          icon: <Zap size={14} />,          category: 'Workspace', shortcut: '⌘3', color: '#34d399', action: () => { setWorkspaceMode('flow'); setCommandPaletteOpen(false); } },
    { id: 'mode-lab',     label: 'Switch to Lab',     description: 'Experimental workspace',   icon: <FlaskConical size={14} />, category: 'Workspace', shortcut: '⌘4', color: '#fb923c', action: () => { setWorkspaceMode('lab'); setCommandPaletteOpen(false); } },
    // Widgets
    { id: 'w-notes',    label: 'Open Notes',         description: 'Quick markdown notes',     icon: <StickyNote size={14} />,   category: 'Widgets', color: '#fbbf24', action: () => { openWidget('notes');    setCommandPaletteOpen(false); } },
    { id: 'w-tasks',    label: 'Open Tasks',         description: 'Task manager',             icon: <CheckSquare size={14} />, category: 'Widgets', color: '#34d399', action: () => { openWidget('tasks');    setCommandPaletteOpen(false); } },
    { id: 'w-ai',       label: 'Open AI Assistant', description: 'NEXUS AI chat',            icon: <Sparkles size={14} />,    category: 'Widgets', color: '#22d3ee', action: () => { openWidget('ai');       setCommandPaletteOpen(false); } },
    { id: 'w-projects', label: 'Open Projects',     description: 'Project overview',         icon: <FolderKanban size={14} />, category: 'Widgets', color: '#a78bfa', action: () => { openWidget('projects'); setCommandPaletteOpen(false); } },
    { id: 'w-stats',    label: 'Open Stats',        description: 'Live metrics dashboard',   icon: <BarChart3 size={14} />,   category: 'Widgets', color: '#fb923c', action: () => { openWidget('stats');    setCommandPaletteOpen(false); } },
    { id: 'w-music',    label: 'Open Music',        description: 'Focus music player',       icon: <Music2 size={14} />,      category: 'Widgets', color: '#f472b6', action: () => { openWidget('music');    setCommandPaletteOpen(false); } },
    { id: 'w-launcher', label: 'Open Launcher',     description: 'Quick app launcher',       icon: <Rocket size={14} />,      category: 'Widgets', color: '#60a5fa', action: () => { openWidget('launcher'); setCommandPaletteOpen(false); } },
    { id: 'w-workflow', label: 'Open Workflow',     description: 'Kanban board',             icon: <GitBranch size={14} />,   category: 'Widgets', color: '#4ade80', action: () => { openWidget('workflow'); setCommandPaletteOpen(false); } },
    // Projects
    ...projects.map(p => ({
      id: `proj-${p.id}`,
      label: `Open ${p.name}`,
      description: p.description,
      icon: <span style={{ fontSize: '14px' }}>{p.emoji}</span>,
      category: 'Projects',
      color: p.color,
      action: () => { setActiveProject(p.id); setCommandPaletteOpen(false); },
    })),
  ], [projects, setWorkspaceMode, openWidget, setActiveProject, setCommandPaletteOpen]);

  // Filter
  const filtered = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [query, allCommands]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    filtered.forEach(cmd => {
      if (!map.has(cmd.category)) map.set(cmd.category, []);
      map.get(cmd.category)!.push(cmd);
    });
    return map;
  }, [filtered]);

  // Keyboard navigation
  useEffect(() => {
    if (!commandPaletteOpen) return;
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (!commandPaletteOpen) return;
      if (e.key === 'Escape') setCommandPaletteOpen(false);
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); filtered[selectedIndex]?.action(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, filtered, selectedIndex, setCommandPaletteOpen]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  let flatIndex = 0;

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 z-[200]"
            style={{ background: 'oklch(0 0 0 / 0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="fixed z-[201] left-1/2 -translate-x-1/2"
            style={{ top: '15vh', width: 560, maxWidth: 'calc(100vw - 32px)' }}
          >
            <div
              style={{
                background: 'oklch(0.09 0.018 265 / 0.95)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid oklch(1 0 0 / 0.10)',
                borderRadius: 14,
                boxShadow: '0 24px 60px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.75 0.18 200 / 0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Search input */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 16px',
                  borderBottom: '1px solid oklch(1 0 0 / 0.07)',
                }}
              >
                <Search size={16} style={{ color: 'oklch(0.55 0.02 265)', flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                  placeholder="Search commands, widgets, projects..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontFamily: 'var(--font-body)',
                    color: 'oklch(0.88 0.02 265)',
                    caretColor: 'oklch(0.75 0.18 200)',
                  }}
                />
                <kbd
                  style={{
                    padding: '2px 6px', borderRadius: 4,
                    background: 'oklch(0.14 0.02 265)',
                    border: '1px solid oklch(1 0 0 / 0.10)',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'oklch(0.45 0.02 265)',
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                style={{ maxHeight: 400, overflowY: 'auto', padding: '6px 0' }}
              >
                {filtered.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'oklch(0.45 0.02 265)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
                    No results for "{query}"
                  </div>
                ) : (
                  Array.from(grouped.entries()).map(([category, cmds]) => (
                    <div key={category}>
                      <div
                        style={{
                          padding: '8px 16px 4px',
                          fontSize: '9px',
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'oklch(0.40 0.02 265)',
                        }}
                      >
                        {category}
                      </div>
                      {cmds.map(cmd => {
                        const idx = flatIndex++;
                        const isSelected = idx === selectedIndex;
                        return (
                          <motion.button
                            key={cmd.id}
                            data-index={idx}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              width: '100%',
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '8px 16px',
                              background: isSelected ? 'oklch(0.13 0.02 265 / 0.8)' : 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'background 0.1s',
                            }}
                          >
                            <div
                              style={{
                                width: 28, height: 28, borderRadius: 7,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: cmd.color ? `${cmd.color}15` : 'oklch(0.14 0.02 265)',
                                border: `1px solid ${cmd.color ? cmd.color + '25' : 'oklch(1 0 0 / 0.07)'}`,
                                color: cmd.color || 'oklch(0.55 0.02 265)',
                                flexShrink: 0,
                              }}
                            >
                              {cmd.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'oklch(0.85 0.02 265)' }}>
                                {cmd.label}
                              </div>
                              {cmd.description && (
                                <div style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'oklch(0.48 0.02 265)', marginTop: 1 }}>
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                            {cmd.shortcut && (
                              <kbd style={{
                                padding: '2px 6px', borderRadius: 4,
                                background: 'oklch(0.14 0.02 265)',
                                border: '1px solid oklch(1 0 0 / 0.08)',
                                fontSize: '10px', fontFamily: 'var(--font-mono)',
                                color: 'oklch(0.45 0.02 265)',
                                flexShrink: 0,
                              }}>
                                {cmd.shortcut}
                              </kbd>
                            )}
                            {isSelected && <ArrowRight size={12} style={{ color: 'oklch(0.55 0.02 265)', flexShrink: 0 }} />}
                          </motion.button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '8px 16px',
                  borderTop: '1px solid oklch(1 0 0 / 0.06)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                {[
                  ['↑↓', 'Navigate'],
                  ['↵', 'Select'],
                  ['ESC', 'Close'],
                ].map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <kbd style={{
                      padding: '1px 5px', borderRadius: 3,
                      background: 'oklch(0.13 0.02 265)',
                      border: '1px solid oklch(1 0 0 / 0.08)',
                      fontSize: '9px', fontFamily: 'var(--font-mono)',
                      color: 'oklch(0.45 0.02 265)',
                    }}>
                      {key}
                    </kbd>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'oklch(0.38 0.02 265)' }}>
                      {label}
                    </span>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'oklch(0.35 0.02 265)' }}>
                  {filtered.length} results
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
