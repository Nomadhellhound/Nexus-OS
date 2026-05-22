/**
 * NEXUS OS — Global State Context
 * Void Interface Design System
 * Manages: workspace modes, widgets, projects, command palette, onboarding
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type WorkspaceMode = 'canvas' | 'focus' | 'flow' | 'lab';

export interface Widget {
  id: string;
  type: 'notes' | 'tasks' | 'ai' | 'projects' | 'stats' | 'music' | 'launcher' | 'workflow';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  pinned: boolean;
  zIndex: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  lastModified: Date;
  tags: string[];
  starred: boolean;
}

export interface NexusState {
  workspaceMode: WorkspaceMode;
  widgets: Widget[];
  projects: Project[];
  activeProjectId: string | null;
  commandPaletteOpen: boolean;
  onboardingComplete: boolean;
  sidebarCollapsed: boolean;
  topWidgetZ: number;
  activeWidgetId: string | null;
}

interface NexusContextValue extends NexusState {
  setWorkspaceMode: (mode: WorkspaceMode) => void;
  openWidget: (type: Widget['type']) => void;
  closeWidget: (id: string) => void;
  minimizeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, x: number, y: number) => void;
  updateWidgetSize: (id: string, width: number, height: number) => void;
  bringToFront: (id: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setOnboardingComplete: (done: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveProject: (id: string | null) => void;
  addProject: (project: Omit<Project, 'id' | 'lastModified'>) => void;
  toggleProjectStar: (id: string) => void;
}

const WIDGET_DEFAULTS: Record<Widget['type'], Partial<Widget>> = {
  notes:    { title: 'Notes',         width: 320, height: 380 },
  tasks:    { title: 'Tasks',         width: 300, height: 420 },
  ai:       { title: 'AI Assistant',  width: 360, height: 480 },
  projects: { title: 'Projects',      width: 380, height: 440 },
  stats:    { title: 'Live Stats',    width: 280, height: 320 },
  music:    { title: 'Music',         width: 280, height: 160 },
  launcher: { title: 'Quick Launch',  width: 300, height: 360 },
  workflow: { title: 'Workflow',      width: 400, height: 460 },
};

const SAMPLE_PROJECTS: Project[] = [
  { id: 'p1', name: 'Nexus OS', description: 'The creator operating system', color: '#22d3ee', emoji: '⚡', lastModified: new Date(), tags: ['product', 'design'], starred: true },
  { id: 'p2', name: 'Brand Identity', description: 'Visual language system', color: '#a78bfa', emoji: '🎨', lastModified: new Date(Date.now() - 86400000), tags: ['design', 'branding'], starred: false },
  { id: 'p3', name: 'Growth Engine', description: 'Acquisition & retention', color: '#34d399', emoji: '🚀', lastModified: new Date(Date.now() - 172800000), tags: ['growth', 'analytics'], starred: true },
  { id: 'p4', name: 'API Layer', description: 'Backend infrastructure', color: '#fb923c', emoji: '🔧', lastModified: new Date(Date.now() - 259200000), tags: ['engineering'], starred: false },
  { id: 'p5', name: 'Content Studio', description: 'Media & publishing', color: '#f472b6', emoji: '✍️', lastModified: new Date(Date.now() - 345600000), tags: ['content', 'media'], starred: false },
];

const NexusContext = createContext<NexusContextValue | null>(null);

export function NexusProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NexusState>(() => ({
    workspaceMode: 'canvas',
    widgets: [],
    projects: SAMPLE_PROJECTS,
    activeProjectId: 'p1',
    commandPaletteOpen: false,
    onboardingComplete: localStorage.getItem('nexus-onboarding') === 'done',
    sidebarCollapsed: false,
    topWidgetZ: 100,
    activeWidgetId: null,
  }));

  const setWorkspaceMode = useCallback((mode: WorkspaceMode) => {
    setState(s => ({ ...s, workspaceMode: mode }));
  }, []);

  const openWidget = useCallback((type: Widget['type']) => {
    setState(s => {
      const existing = s.widgets.find(w => w.type === type);
      if (existing) {
        return {
          ...s,
          topWidgetZ: s.topWidgetZ + 1,
          activeWidgetId: existing.id,
          widgets: s.widgets.map(w =>
            w.id === existing.id
              ? { ...w, minimized: false, zIndex: s.topWidgetZ + 1 }
              : w
          ),
        };
      }
      const defaults = WIDGET_DEFAULTS[type];
      const newWidget: Widget = {
        id: `widget-${type}-${Date.now()}`,
        type,
        title: defaults.title!,
        x: 120 + Math.random() * 200,
        y: 80 + Math.random() * 100,
        width: defaults.width!,
        height: defaults.height!,
        minimized: false,
        pinned: false,
        zIndex: s.topWidgetZ + 1,
      };
      return {
        ...s,
        topWidgetZ: s.topWidgetZ + 1,
        activeWidgetId: newWidget.id,
        widgets: [...s.widgets, newWidget],
      };
    });
  }, []);

  const closeWidget = useCallback((id: string) => {
    setState(s => ({ ...s, widgets: s.widgets.filter(w => w.id !== id) }));
  }, []);

  const minimizeWidget = useCallback((id: string) => {
    setState(s => ({
      ...s,
      widgets: s.widgets.map(w => w.id === id ? { ...w, minimized: !w.minimized } : w),
    }));
  }, []);

  const updateWidgetPosition = useCallback((id: string, x: number, y: number) => {
    setState(s => ({
      ...s,
      widgets: s.widgets.map(w => w.id === id ? { ...w, x, y } : w),
    }));
  }, []);

  const updateWidgetSize = useCallback((id: string, width: number, height: number) => {
    setState(s => ({
      ...s,
      widgets: s.widgets.map(w => w.id === id ? { ...w, width, height } : w),
    }));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setState(s => ({
      ...s,
      topWidgetZ: s.topWidgetZ + 1,
      activeWidgetId: id,
      widgets: s.widgets.map(w => w.id === id ? { ...w, zIndex: s.topWidgetZ + 1 } : w),
    }));
  }, []);

  const setCommandPaletteOpen = useCallback((open: boolean) => {
    setState(s => ({ ...s, commandPaletteOpen: open }));
  }, []);

  const setOnboardingComplete = useCallback((done: boolean) => {
    if (done) localStorage.setItem('nexus-onboarding', 'done');
    setState(s => ({ ...s, onboardingComplete: done }));
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setState(s => ({ ...s, sidebarCollapsed: collapsed }));
  }, []);

  const setActiveProject = useCallback((id: string | null) => {
    setState(s => ({ ...s, activeProjectId: id }));
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id' | 'lastModified'>) => {
    const newProject: Project = {
      ...project,
      id: `p-${Date.now()}`,
      lastModified: new Date(),
    };
    setState(s => ({ ...s, projects: [newProject, ...s.projects] }));
  }, []);

  const toggleProjectStar = useCallback((id: string) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(p => p.id === id ? { ...p, starred: !p.starred } : p),
    }));
  }, []);

  return (
    <NexusContext.Provider value={{
      ...state,
      setWorkspaceMode,
      openWidget,
      closeWidget,
      minimizeWidget,
      updateWidgetPosition,
      updateWidgetSize,
      bringToFront,
      setCommandPaletteOpen,
      setOnboardingComplete,
      setSidebarCollapsed,
      setActiveProject,
      addProject,
      toggleProjectStar,
    }}>
      {children}
    </NexusContext.Provider>
  );
}

export function useNexus() {
  const ctx = useContext(NexusContext);
  if (!ctx) throw new Error('useNexus must be used within NexusProvider');
  return ctx;
}
