/**
 * NEXUS OS — Sidebar
 * Void Interface: project navigator + app launcher
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import {
  ChevronLeft, ChevronRight, Plus, Star, FolderOpen,
  LayoutGrid, Settings, User, Bell, Search, Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const {
    sidebarCollapsed, setSidebarCollapsed,
    projects, activeProjectId, setActiveProject,
    toggleProjectStar, openWidget,
  } = useNexus();

  const starred = projects.filter(p => p.starred);
  const recent = projects.filter(p => !p.starred).slice(0, 4);

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 52 : 220 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="fixed left-0 top-10 bottom-14 flex flex-col overflow-hidden z-40"
      style={{
        background: 'oklch(0.08 0.018 265 / 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid oklch(1 0 0 / 0.06)',
      }}
    >
      {/* Toggle button */}
      <div className="flex justify-end px-2 py-2">
        <motion.button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-6 h-6 rounded flex items-center justify-center"
          style={{
            background: 'oklch(0.14 0.02 265 / 0.8)',
            border: '1px solid oklch(1 0 0 / 0.08)',
            color: 'oklch(0.55 0.02 265)',
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </motion.button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-3 mb-3"
          >
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded"
              style={{
                background: 'oklch(0.12 0.02 265 / 0.6)',
                border: '1px solid oklch(1 0 0 / 0.07)',
              }}
            >
              <Search size={11} style={{ color: 'oklch(0.45 0.02 265)' }} />
              <span style={{ color: 'oklch(0.40 0.02 265)', fontSize: '11px', fontFamily: 'var(--font-body)' }}>
                Search projects...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 space-y-4">

        {/* Starred */}
        {!sidebarCollapsed && starred.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-1 mb-1.5">
              <Star size={9} style={{ color: 'oklch(0.78 0.15 65)' }} />
              <span style={{ color: 'oklch(0.45 0.02 265)', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Starred
              </span>
            </div>
            {starred.map(p => (
              <ProjectItem
                key={p.id}
                project={p}
                active={p.id === activeProjectId}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveProject(p.id)}
                onStar={() => toggleProjectStar(p.id)}
              />
            ))}
          </div>
        )}

        {/* Recent */}
        {!sidebarCollapsed && (
          <div>
            <div className="flex items-center gap-1.5 px-1 mb-1.5">
              <FolderOpen size={9} style={{ color: 'oklch(0.55 0.02 265)' }} />
              <span style={{ color: 'oklch(0.45 0.02 265)', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Recent
              </span>
            </div>
            {recent.map(p => (
              <ProjectItem
                key={p.id}
                project={p}
                active={p.id === activeProjectId}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveProject(p.id)}
                onStar={() => toggleProjectStar(p.id)}
              />
            ))}
          </div>
        )}

        {/* Collapsed: just icons */}
        {sidebarCollapsed && projects.slice(0, 6).map(p => (
          <motion.button
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto text-sm"
            style={{
              background: p.id === activeProjectId
                ? `${p.color}20`
                : 'oklch(0.12 0.02 265 / 0.5)',
              border: p.id === activeProjectId
                ? `1px solid ${p.color}40`
                : '1px solid oklch(1 0 0 / 0.06)',
              boxShadow: p.id === activeProjectId ? `0 0 12px ${p.color}30` : 'none',
            }}
          >
            {p.emoji}
          </motion.button>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="px-2 py-2 space-y-1" style={{ borderTop: '1px solid oklch(1 0 0 / 0.06)' }}>
        {!sidebarCollapsed ? (
          <>
            <SidebarAction icon={<Plus size={12} />} label="New Project" onClick={() => {}} />
            <SidebarAction icon={<Sparkles size={12} />} label="AI Assistant" onClick={() => openWidget('ai')} accent="#22d3ee" />
            <SidebarAction icon={<Settings size={12} />} label="Settings" onClick={() => {}} />
          </>
        ) : (
          <>
            <IconAction icon={<Plus size={12} />} onClick={() => {}} />
            <IconAction icon={<Sparkles size={12} />} onClick={() => openWidget('ai')} accent="#22d3ee" />
            <IconAction icon={<Settings size={12} />} onClick={() => {}} />
          </>
        )}
      </div>
    </motion.aside>
  );
}

function ProjectItem({ project, active, collapsed, onClick, onStar }: {
  project: { id: string; name: string; emoji: string; color: string; description: string; starred: boolean };
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  onStar: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 2 }}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left group"
      style={{
        background: active ? `${project.color}12` : 'transparent',
        border: active ? `1px solid ${project.color}25` : '1px solid transparent',
        boxShadow: active ? `0 0 12px ${project.color}15` : 'none',
        transition: 'all 0.15s ease',
      }}
    >
      <span className="text-sm flex-shrink-0">{project.emoji}</span>
      <span
        className="flex-1 truncate text-xs"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: active ? project.color : 'oklch(0.65 0.02 265)',
          fontWeight: active ? 500 : 400,
        }}
      >
        {project.name}
      </span>
      <motion.button
        onClick={(e) => { e.stopPropagation(); onStar(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Star
          size={9}
          style={{ color: project.starred ? 'oklch(0.78 0.15 65)' : 'oklch(0.40 0.02 265)' }}
          fill={project.starred ? 'oklch(0.78 0.15 65)' : 'none'}
        />
      </motion.button>
    </motion.button>
  );
}

function SidebarAction({ icon, label, onClick, accent }: {
  icon: React.ReactNode; label: string; onClick: () => void; accent?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left"
      style={{
        color: accent || 'oklch(0.55 0.02 265)',
        fontSize: '11px',
        fontFamily: 'var(--font-body)',
        transition: 'color 0.15s ease',
      }}
    >
      <span style={{ color: accent || 'oklch(0.45 0.02 265)' }}>{icon}</span>
      {label}
    </motion.button>
  );
}

function IconAction({ icon, onClick, accent }: {
  icon: React.ReactNode; onClick: () => void; accent?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-8 h-8 rounded flex items-center justify-center mx-auto"
      style={{ color: accent || 'oklch(0.45 0.02 265)' }}
    >
      {icon}
    </motion.button>
  );
}
