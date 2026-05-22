/**
 * NEXUS OS — Dock
 * Void Interface: macOS-style bottom dock with widget launchers
 */

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNexus, Widget } from '@/contexts/NexusContext';
import { useRef } from 'react';
import {
  StickyNote, CheckSquare, Sparkles, FolderKanban,
  BarChart3, Music2, Rocket, GitBranch, Command
} from 'lucide-react';

interface DockItem {
  type: Widget['type'];
  icon: React.ReactNode;
  label: string;
  color: string;
}

const DOCK_ITEMS: DockItem[] = [
  { type: 'notes',    icon: <StickyNote size={18} />,    label: 'Notes',       color: '#fbbf24' },
  { type: 'tasks',    icon: <CheckSquare size={18} />,   label: 'Tasks',       color: '#34d399' },
  { type: 'ai',       icon: <Sparkles size={18} />,      label: 'AI',          color: '#22d3ee' },
  { type: 'projects', icon: <FolderKanban size={18} />,  label: 'Projects',    color: '#a78bfa' },
  { type: 'stats',    icon: <BarChart3 size={18} />,     label: 'Stats',       color: '#fb923c' },
  { type: 'music',    icon: <Music2 size={18} />,        label: 'Music',       color: '#f472b6' },
  { type: 'launcher', icon: <Rocket size={18} />,        label: 'Launcher',    color: '#60a5fa' },
  { type: 'workflow', icon: <GitBranch size={18} />,     label: 'Workflow',    color: '#4ade80' },
];

function DockIcon({ item, mouseX }: { item: DockItem; mouseX: ReturnType<typeof useMotionValue<number>> }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { openWidget, widgets } = useNexus();
  const isOpen = widgets.some(w => w.type === item.type && !w.minimized);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return 999;
    return Math.abs(val - (bounds.left + bounds.width / 2));
  });

  const scale = useTransform(distance, [0, 80, 160], [1.5, 1.2, 1]);
  const springScale = useSpring(scale, { stiffness: 400, damping: 25 });

  return (
    <motion.div className="flex flex-col items-center gap-1 relative" style={{ scale: springScale }}>
      <motion.button
        ref={ref}
        onClick={() => openWidget(item.type)}
        whileTap={{ scale: 0.88 }}
        className="relative w-11 h-11 rounded-xl flex items-center justify-center group"
        style={{
          background: isOpen
            ? `linear-gradient(135deg, ${item.color}25, ${item.color}10)`
            : 'oklch(0.12 0.02 265 / 0.8)',
          border: `1px solid ${isOpen ? item.color + '35' : 'oklch(1 0 0 / 0.08)'}`,
          boxShadow: isOpen ? `0 0 16px ${item.color}30, 0 4px 12px oklch(0 0 0 / 0.3)` : '0 4px 12px oklch(0 0 0 / 0.3)',
          color: isOpen ? item.color : 'oklch(0.55 0.02 265)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transition: 'color 0.15s, border-color 0.15s, background 0.15s',
        }}
        title={item.label}
      >
        {item.icon}

        {/* Tooltip */}
        <div
          className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap"
          style={{
            background: 'oklch(0.14 0.02 265 / 0.95)',
            border: '1px solid oklch(1 0 0 / 0.1)',
            color: 'oklch(0.80 0.02 265)',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            transition: 'opacity 0.15s',
            backdropFilter: 'blur(8px)',
          }}
        >
          {item.label}
        </div>
      </motion.button>

      {/* Active dot */}
      {isOpen && (
        <motion.div
          layoutId={`dock-dot-${item.type}`}
          className="w-1 h-1 rounded-full"
          style={{ background: item.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.div>
  );
}

export default function Dock() {
  const mouseX = useMotionValue<number>(Infinity);
  const { setCommandPaletteOpen } = useNexus();

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-2 px-4 py-2.5 rounded-2xl"
        style={{
          background: 'oklch(0.09 0.018 265 / 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid oklch(1 0 0 / 0.09)',
          boxShadow: '0 8px 32px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(1 0 0 / 0.04)',
        }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.type} item={item} mouseX={mouseX} />
        ))}

        {/* Divider */}
        <div className="w-px h-8 mx-1 self-center" style={{ background: 'oklch(1 0 0 / 0.08)' }} />

        {/* Command palette button */}
        <motion.button
          onClick={() => setCommandPaletteOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: 'oklch(0.12 0.02 265 / 0.8)',
            border: '1px solid oklch(1 0 0 / 0.08)',
            color: 'oklch(0.55 0.02 265)',
            backdropFilter: 'blur(10px)',
          }}
          title="Command Palette (⌘K)"
        >
          <Command size={18} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
