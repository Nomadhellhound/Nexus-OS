/**
 * NEXUS OS — Top Bar
 * Void Interface: OS-style status bar with workspace mode switcher
 */

import { motion } from 'framer-motion';
import { useNexus, WorkspaceMode } from '@/contexts/NexusContext';
import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Command, Layers, Zap, FlaskConical, Focus,
  ChevronDown, Wifi, Battery, Clock
} from 'lucide-react';

const MODES: { id: WorkspaceMode; label: string; icon: React.ReactNode; color: string; description: string }[] = [
  { id: 'canvas',  label: 'Canvas',  icon: <Layers size={12} />,      color: '#22d3ee', description: 'Infinite spatial canvas with all widgets' },
  { id: 'focus',   label: 'Focus',   icon: <Focus size={12} />,       color: '#a78bfa', description: 'Distraction-free mode - full screen focus' },
  { id: 'flow',    label: 'Flow',    icon: <Zap size={12} />,         color: '#34d399', description: 'Deep work state - optimized for flow' },
  { id: 'lab',     label: 'Lab',     icon: <FlaskConical size={12} />, color: '#fb923c', description: 'Experimental workspace - test new ideas' },
];

function Clock24() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

export default function TopBar() {
  const { workspaceMode, setWorkspaceMode, setCommandPaletteOpen, activeProjectId, projects } = useNexus();
  const activeProject = projects.find(p => p.id === activeProjectId);
  const currentMode = MODES.find(m => m.id === workspaceMode)!;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 h-10 flex items-center justify-between px-4 z-50"
      style={{
        background: 'oklch(0.08 0.018 265 / 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid oklch(1 0 0 / 0.06)',
      }}
    >
      {/* Left: Logo + Project */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, oklch(0.75 0.18 200), oklch(0.60 0.22 285))',
              fontFamily: 'var(--font-display)',
              color: 'oklch(0.06 0.015 265)',
              fontSize: '10px',
            }}
          >
            N
          </div>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.75 0.18 200)', letterSpacing: '0.12em', fontSize: '10px' }}
          >
            NEXUS
          </span>
        </div>

        <div className="w-px h-4" style={{ background: 'oklch(1 0 0 / 0.1)' }} />

        {activeProject && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ fontSize: '11px' }}>{activeProject.emoji}</span>
            <span className="text-xs" style={{ color: 'oklch(0.70 0.02 265)', fontFamily: 'var(--font-body)', fontSize: '11px' }}>
              {activeProject.name}
            </span>
          </div>
        )}
      </div>

      {/* Center: Workspace Mode Switcher */}
      <div
        className="flex items-center gap-0.5 rounded-full p-0.5"
        style={{ background: 'oklch(0.10 0.018 265 / 0.8)', border: '1px solid oklch(1 0 0 / 0.07)' }}
      >
        {MODES.map(mode => (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                key={mode.id}
                onClick={() => setWorkspaceMode(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: workspaceMode === mode.id ? 600 : 400,
                  color: workspaceMode === mode.id ? mode.color : 'oklch(0.55 0.02 265)',
                  background: workspaceMode === mode.id
                    ? `oklch(0.14 0.02 265 / 0.9)`
                    : 'transparent',
                  boxShadow: workspaceMode === mode.id
                    ? `0 0 12px ${mode.color}30, inset 0 0 0 1px ${mode.color}25`
                    : 'none',
                  transition: 'all 0.18s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                <span style={{ color: workspaceMode === mode.id ? mode.color : 'oklch(0.45 0.02 265)' }}>
                  {mode.icon}
                </span>
                {mode.label}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {mode.description}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Right: Status + Command */}
      <div className="flex items-center gap-3">
        {/* Command Palette trigger */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => setCommandPaletteOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs"
              style={{
                background: 'oklch(0.12 0.02 265 / 0.7)',
                border: '1px solid oklch(1 0 0 / 0.08)',
                color: 'oklch(0.55 0.02 265)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
              }}
            >
              <Command size={10} />
              <span>⌘K</span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Open command palette - search everything
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-4" style={{ background: 'oklch(1 0 0 / 0.1)' }} />

        {/* Status indicators */}
        <div className="flex items-center gap-2" style={{ color: 'oklch(0.50 0.02 265)', fontSize: '10px' }}>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: '#34d399' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'oklch(0.55 0.02 265)' }}>LIVE</span>
          </div>
          <Wifi size={10} style={{ color: 'oklch(0.45 0.02 265)' }} />
          <Battery size={10} style={{ color: 'oklch(0.45 0.02 265)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'oklch(0.55 0.02 265)', minWidth: 36 }}>
            <Clock24 />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
