/**
 * NEXUS OS — Minimized Widgets Tray
 * Shows minimized widgets as small pills above the dock
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import { StickyNote, CheckSquare, Sparkles, FolderKanban, BarChart3, Music2, Rocket, GitBranch } from 'lucide-react';

const WIDGET_ICONS: Record<string, React.ReactNode> = {
  notes:    <StickyNote size={10} />,
  tasks:    <CheckSquare size={10} />,
  ai:       <Sparkles size={10} />,
  projects: <FolderKanban size={10} />,
  stats:    <BarChart3 size={10} />,
  music:    <Music2 size={10} />,
  launcher: <Rocket size={10} />,
  workflow: <GitBranch size={10} />,
};

const WIDGET_COLORS: Record<string, string> = {
  notes: '#fbbf24', tasks: '#34d399', ai: '#22d3ee', projects: '#a78bfa',
  stats: '#fb923c', music: '#f472b6', launcher: '#60a5fa', workflow: '#4ade80',
};

export default function MinimizedWidgets() {
  const { widgets, minimizeWidget } = useNexus();
  const minimized = widgets.filter(w => w.minimized);

  if (minimized.length === 0) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-1.5"
      style={{ bottom: 68, left: '50%', transform: 'translateX(-50%)' }}
    >
      <AnimatePresence>
        {minimized.map(w => (
          <motion.button
            key={w.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => minimizeWidget(w.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: `${WIDGET_COLORS[w.type]}12`,
              border: `1px solid ${WIDGET_COLORS[w.type]}30`,
              color: WIDGET_COLORS[w.type],
              fontSize: '10px',
              fontFamily: 'var(--font-body)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {WIDGET_ICONS[w.type]}
            <span style={{ fontSize: '10px' }}>{w.title}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
