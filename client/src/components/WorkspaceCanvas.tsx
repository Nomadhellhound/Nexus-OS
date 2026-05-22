/**
 * NEXUS OS — Workspace Canvas
 * Void Interface: tldraw canvas with mode overlays
 * Modes: canvas (tldraw), focus (minimal), flow (ambient), lab (experimental)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { Zap, Focus, FlaskConical, Layers, Sparkles } from 'lucide-react';

/* ── Canvas mode: tldraw ── */
function CanvasMode() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* tldraw custom styles */}
      <style>{`
        /* Make canvas transparent to show OS background */
        .tl-background { background: transparent !important; }
        .tl-canvas { background: transparent !important; }
        .tl-container { background: transparent !important; }
        .tl-container > div { background: transparent !important; }
        .tl-grid { opacity: 0.12 !important; stroke: oklch(0.75 0.18 200) !important; }
        .tl-watermark { display: none !important; }
        /* Hide license banner */
        [data-testid="license-banner"] { display: none !important; }
        .tlui-license-dialog { display: none !important; }
        /* Toolbar glass */
        .tlui-toolbar {
          background: oklch(0.09 0.018 265 / 0.85) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid oklch(1 0 0 / 0.08) !important;
          border-radius: 12px !important;
        }
        .tlui-toolbar__inner {
          background: transparent !important;
        }
        /* Style panel */
        .tlui-style-panel {
          background: oklch(0.09 0.018 265 / 0.90) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid oklch(1 0 0 / 0.08) !important;
          border-radius: 12px !important;
        }
        /* Buttons */
        .tlui-button {
          color: oklch(0.70 0.02 265) !important;
        }
        .tlui-button:hover {
          background: oklch(0.14 0.02 265 / 0.8) !important;
          color: oklch(0.88 0.02 265) !important;
        }
        .tlui-button[data-state="active"] {
          background: oklch(0.75 0.18 200 / 0.15) !important;
          color: oklch(0.75 0.18 200) !important;
        }
        /* Menu */
        .tlui-menu,
        .tlui-popover__content,
        .tlui-dropdown-menu__content {
          background: oklch(0.10 0.018 265 / 0.95) !important;
          backdrop-filter: blur(24px) !important;
          border: 1px solid oklch(1 0 0 / 0.10) !important;
          border-radius: 10px !important;
        }
        /* Navigation */
        .tlui-navigation-zone {
          background: oklch(0.09 0.018 265 / 0.85) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid oklch(1 0 0 / 0.07) !important;
          border-radius: 10px !important;
        }
        /* Help menu */
        .tlui-help-menu {
          display: none !important;
        }
        /* Main menu */
        .tlui-main-menu {
          background: oklch(0.09 0.018 265 / 0.85) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid oklch(1 0 0 / 0.07) !important;
          border-radius: 8px !important;
        }
        /* Scrollbar */
        .tl-container ::-webkit-scrollbar { width: 4px; }
        .tl-container ::-webkit-scrollbar-thumb { background: oklch(0.25 0.02 265); border-radius: 2px; }
      `}</style>
      <Tldraw />
    </div>
  );
}

/* ── Focus mode ── */
function FocusMode() {
  const { activeProjectId, projects } = useNexus();
  const project = projects.find(p => p.id === activeProjectId);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-lg"
      >
        <div className="mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl"
            style={{
              background: 'oklch(0.60 0.22 285 / 0.15)',
              border: '1px solid oklch(0.60 0.22 285 / 0.25)',
              boxShadow: '0 0 40px oklch(0.60 0.22 285 / 0.15)',
            }}
          >
            {project?.emoji || '🎯'}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 700,
              color: 'oklch(0.92 0.01 265)',
              letterSpacing: '-0.03em',
              marginBottom: 8,
            }}
          >
            {project?.name || 'Focus Mode'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'oklch(0.55 0.02 265)', lineHeight: 1.6 }}>
            {project?.description || 'Deep work. No distractions. Just you and your work.'}
          </p>
        </div>

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'oklch(0.60 0.22 285 / 0.12)',
            border: '1px solid oklch(0.60 0.22 285 / 0.25)',
          }}
        >
          <Focus size={12} style={{ color: 'oklch(0.60 0.22 285)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'oklch(0.60 0.22 285)' }}>
            FOCUS MODE ACTIVE
          </span>
        </div>
      </motion.div>

      {/* Ambient ring */}
      <div
        className="absolute w-96 h-96 rounded-full animate-pulse-glow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.60 0.22 285 / 0.06) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}

/* ── Flow mode ── */
function FlowMode() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 0deg, oklch(0.75 0.18 200 / 0.3), oklch(0.60 0.22 285 / 0.3), oklch(0.75 0.18 200 / 0.3))',
            border: '1px solid oklch(0.75 0.18 200 / 0.2)',
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'oklch(0.06 0.015 265)' }}
          >
            <Zap size={28} style={{ color: 'oklch(0.75 0.18 200)' }} />
          </div>
        </motion.div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'oklch(0.88 0.02 265)', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Flow State
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'oklch(0.50 0.02 265)' }}>
          Ambient workspace. Let ideas emerge.
        </p>
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? 'oklch(0.75 0.18 200)' : 'oklch(0.60 0.22 285)',
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

/* ── Lab mode ── */
function LabMode() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'oklch(0.78 0.15 65 / 0.12)',
            border: '1px solid oklch(0.78 0.15 65 / 0.25)',
          }}
        >
          <FlaskConical size={28} style={{ color: 'oklch(0.78 0.15 65)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'oklch(0.88 0.02 265)', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Lab Mode
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'oklch(0.50 0.02 265)', lineHeight: 1.6 }}>
          Experimental workspace. Break things. Build things. Ship things.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {['Prototype', 'Experiment', 'Iterate'].map(label => (
            <div
              key={label}
              style={{
                padding: '10px',
                borderRadius: 8,
                background: 'oklch(0.78 0.15 65 / 0.08)',
                border: '1px solid oklch(0.78 0.15 65 / 0.15)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'oklch(0.78 0.15 65)',
                textAlign: 'center',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main component ── */
export default function WorkspaceCanvas() {
  const { workspaceMode, sidebarCollapsed } = useNexus();
  const sidebarWidth = sidebarCollapsed ? 52 : 220;

  return (
    <div
      style={{
        position: 'fixed',
        top: 40,
        left: sidebarWidth,
        right: 0,
        bottom: 56,
        transition: 'left 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={workspaceMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {workspaceMode === 'canvas' && <CanvasMode />}
          {workspaceMode === 'focus'  && <FocusMode />}
          {workspaceMode === 'flow'   && <FlowMode />}
          {workspaceMode === 'lab'    && <LabMode />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
