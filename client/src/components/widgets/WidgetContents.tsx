/**
 * NEXUS OS — Widget Contents
 * Void Interface: content for each widget type
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import {
  Plus, Check, Trash2, Sparkles, Send, ArrowRight,
  Play, Pause, SkipForward, Volume2, ExternalLink,
  TrendingUp, Users, Zap, Eye, Star, GitBranch,
  Terminal, Globe, Code2, Palette, Database, Layers
} from 'lucide-react';

/* ── Shared styles ── */
const scrollStyle: React.CSSProperties = {
  overflowY: 'auto',
  height: '100%',
  padding: '12px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'oklch(0.45 0.02 265)',
};

/* ─────────────── NOTES ─────────────── */
export function NotesWidget() {
  const [text, setText] = useState(`# Nexus OS — v0.1\n\nCore ideas:\n- Spatial canvas as primary workspace\n- Widgets as floating OS panels\n- Command palette for everything\n\nNext steps:\n→ Integrate AI layer\n→ Build project graph view\n→ Ship beta to waitlist`);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px 4px', ...labelStyle }}>Markdown • Auto-saved</div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '8px 12px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          lineHeight: 1.7,
          color: 'oklch(0.78 0.02 265)',
          caretColor: 'oklch(0.75 0.18 200)',
        }}
        spellCheck={false}
      />
    </div>
  );
}

/* ─────────────── TASKS ─────────────── */
interface Task { id: string; text: string; done: boolean; priority: 'high' | 'mid' | 'low' }
const PRIORITY_COLORS = { high: '#f87171', mid: '#fbbf24', low: '#34d399' };
const INITIAL_TASKS: Task[] = [
  { id: '1', text: 'Design command palette UX', done: false, priority: 'high' },
  { id: '2', text: 'Integrate tldraw canvas', done: true, priority: 'high' },
  { id: '3', text: 'Build widget system', done: true, priority: 'mid' },
  { id: '4', text: 'Write onboarding flow', done: false, priority: 'mid' },
  { id: '5', text: 'Add ambient animations', done: false, priority: 'low' },
  { id: '6', text: 'Ship to beta users', done: false, priority: 'low' },
];

export function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTask, setNewTask] = useState('');

  const toggle = (id: string) => setTasks(t => t.map(tk => tk.id === id ? { ...tk, done: !tk.done } : tk));
  const remove = (id: string) => setTasks(t => t.filter(tk => tk.id !== id));
  const add = () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, { id: Date.now().toString(), text: newTask.trim(), done: false, priority: 'mid' }]);
    setNewTask('');
  };

  const done = tasks.filter(t => t.done).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <div style={{ padding: '10px 12px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={labelStyle}>Tasks</span>
          <span style={{ ...labelStyle, color: 'oklch(0.75 0.18 200)' }}>{done}/{tasks.length}</span>
        </div>
        <div style={{ height: 2, background: 'oklch(0.18 0.02 265)', borderRadius: 1 }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, oklch(0.75 0.18 200), oklch(0.60 0.22 285))',
              borderRadius: 1,
            }}
            animate={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2 px-2 py-1.5 rounded group"
              style={{ marginBottom: 2 }}
            >
              <div
                onClick={() => toggle(task.id)}
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer"
                style={{
                  border: `1px solid ${task.done ? PRIORITY_COLORS[task.priority] : 'oklch(0.30 0.02 265)'}`,
                  background: task.done ? `${PRIORITY_COLORS[task.priority]}20` : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                {task.done && <Check size={9} style={{ color: PRIORITY_COLORS[task.priority] }} />}
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: '12px',
                  fontFamily: 'var(--font-body)',
                  color: task.done ? 'oklch(0.40 0.02 265)' : 'oklch(0.75 0.02 265)',
                  textDecoration: task.done ? 'line-through' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {task.text}
              </span>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: PRIORITY_COLORS[task.priority], opacity: 0.7 }}
              />
              <button
                onClick={() => remove(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={10} style={{ color: 'oklch(0.45 0.02 265)' }} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add task */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Add task..."
            style={{
              flex: 1,
              background: 'oklch(0.12 0.02 265 / 0.6)',
              border: '1px solid oklch(1 0 0 / 0.07)',
              borderRadius: 6,
              padding: '5px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-body)',
              color: 'oklch(0.80 0.02 265)',
              outline: 'none',
            }}
          />
          <button
            onClick={add}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'oklch(0.75 0.18 200 / 0.15)',
              border: '1px solid oklch(0.75 0.18 200 / 0.3)',
              color: 'oklch(0.75 0.18 200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── AI ASSISTANT ─────────────── */
interface Message { role: 'user' | 'ai'; text: string }
const INITIAL_MESSAGES: Message[] = [
  { role: 'ai', text: 'Hello, creator. I\'m your NEXUS AI assistant. How can I help you build today?' },
];
const AI_RESPONSES = [
  'Great idea! I can help you structure that into a project workflow.',
  'Based on your current projects, I\'d suggest prioritizing the canvas integration first.',
  'I\'ve analyzed your workflow. Here are 3 optimizations: batch similar tasks, automate status updates, and set focus blocks.',
  'Your growth metrics look strong. The 23% week-over-week increase suggests product-market fit signals.',
  'I can generate a full project brief for that. Want me to start with the technical spec or the design system?',
];

export function AIWidget() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        role: 'ai',
        text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
      };
      setMessages(m => [...m, aiMsg]);
      setTyping(false);
    }, 1200);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            {msg.role === 'ai' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: 'linear-gradient(135deg, oklch(0.75 0.18 200), oklch(0.60 0.22 285))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={7} style={{ color: 'oklch(0.06 0.015 265)' }} />
                </div>
                <span style={{ ...labelStyle, fontSize: '8px' }}>NEXUS AI</span>
              </div>
            )}
            <div
              style={{
                padding: '7px 10px',
                borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '2px 10px 10px 10px',
                background: msg.role === 'user'
                  ? 'oklch(0.75 0.18 200 / 0.15)'
                  : 'oklch(0.12 0.02 265 / 0.8)',
                border: `1px solid ${msg.role === 'user' ? 'oklch(0.75 0.18 200 / 0.25)' : 'oklch(1 0 0 / 0.07)'}`,
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                color: 'oklch(0.82 0.02 265)',
                lineHeight: 1.5,
              }}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start' }}>
            <div style={{
              padding: '7px 12px',
              borderRadius: '2px 10px 10px 10px',
              background: 'oklch(0.12 0.02 265 / 0.8)',
              border: '1px solid oklch(1 0 0 / 0.07)',
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  style={{ width: 4, height: 4, borderRadius: '50%', background: 'oklch(0.75 0.18 200)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: '8px 12px', borderTop: '1px solid oklch(1 0 0 / 0.06)', display: 'flex', gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask NEXUS AI..."
          style={{
            flex: 1,
            background: 'oklch(0.12 0.02 265 / 0.6)',
            border: '1px solid oklch(1 0 0 / 0.07)',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            color: 'oklch(0.82 0.02 265)',
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, oklch(0.75 0.18 200 / 0.2), oklch(0.60 0.22 285 / 0.2))',
            border: '1px solid oklch(0.75 0.18 200 / 0.3)',
            color: 'oklch(0.75 0.18 200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────── STATS ─────────────── */
const STATS = [
  { label: 'Active Users', value: '2,847', delta: '+12%', icon: <Users size={12} />, color: '#22d3ee' },
  { label: 'Revenue', value: '$18.4k', delta: '+23%', icon: <TrendingUp size={12} />, color: '#34d399' },
  { label: 'Velocity', value: '94 pts', delta: '+8%', icon: <Zap size={12} />, color: '#a78bfa' },
  { label: 'Pageviews', value: '142k', delta: '+31%', icon: <Eye size={12} />, color: '#fb923c' },
];

export function StatsWidget() {
  return (
    <div style={scrollStyle}>
      <div style={{ ...labelStyle, marginBottom: 10 }}>Live Metrics</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {STATS.map(stat => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '10px',
              borderRadius: 8,
              background: `${stat.color}0D`,
              border: `1px solid ${stat.color}20`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: stat.color, opacity: 0.8 }}>{stat.icon}</span>
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#34d399' }}>{stat.delta}</span>
            </div>
            <div style={{ fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'oklch(0.88 0.02 265)', letterSpacing: '-0.02em' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'oklch(0.50 0.02 265)', marginTop: 2 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sparkline placeholder */}
      <div style={{ marginTop: 12, padding: '10px', borderRadius: 8, background: 'oklch(0.11 0.02 265 / 0.6)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div style={{ ...labelStyle, marginBottom: 8 }}>7-day trend</div>
        <svg width="100%" height="40" viewBox="0 0 240 40">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.75 0.18 200)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="oklch(0.75 0.18 200)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 35 L34 28 L68 30 L102 18 L136 22 L170 10 L204 14 L240 5" fill="none" stroke="oklch(0.75 0.18 200)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 35 L34 28 L68 30 L102 18 L136 22 L170 10 L204 14 L240 5 L240 40 L0 40Z" fill="url(#sparkGrad)" />
        </svg>
      </div>
    </div>
  );
}

/* ─────────────── MUSIC ─────────────── */
const TRACKS = [
  { title: 'Blade Runner Blues', artist: 'Ambient · Focus', duration: '4:32' },
  { title: 'Neural Drift', artist: 'Electronic · Deep', duration: '3:58' },
  { title: 'Void Protocol', artist: 'Synthwave · Dark', duration: '5:14' },
];

export function MusicWidget() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [progress, setProgress] = useState(35);

  return (
    <div style={{ padding: '12px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ ...labelStyle, marginBottom: 8 }}>Now Playing</div>
        <div style={{ fontSize: '13px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'oklch(0.88 0.02 265)', marginBottom: 2 }}>
          {TRACKS[track].title}
        </div>
        <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'oklch(0.50 0.02 265)', marginBottom: 10 }}>
          {TRACKS[track].artist}
        </div>

        {/* Progress */}
        <div
          style={{ height: 3, background: 'oklch(0.18 0.02 265)', borderRadius: 2, cursor: 'pointer', marginBottom: 10 }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
          }}
        >
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, oklch(0.75 0.18 200), oklch(0.60 0.22 285))', borderRadius: 2 }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <button onClick={() => setTrack(t => (t - 1 + TRACKS.length) % TRACKS.length)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(0.50 0.02 265)', transform: 'scaleX(-1)' }}>
          <SkipForward size={14} />
        </button>
        <motion.button
          onClick={() => setPlaying(!playing)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, oklch(0.75 0.18 200 / 0.2), oklch(0.60 0.22 285 / 0.2))',
            border: '1px solid oklch(0.75 0.18 200 / 0.35)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'oklch(0.75 0.18 200)',
          }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </motion.button>
        <button onClick={() => setTrack(t => (t + 1) % TRACKS.length)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(0.50 0.02 265)' }}>
          <SkipForward size={14} />
        </button>
        <Volume2 size={12} style={{ color: 'oklch(0.40 0.02 265)', marginLeft: 4 }} />
      </div>
    </div>
  );
}

/* ─────────────── LAUNCHER ─────────────── */
const APPS = [
  { icon: <Globe size={16} />, label: 'Browser', color: '#60a5fa' },
  { icon: <Terminal size={16} />, label: 'Terminal', color: '#34d399' },
  { icon: <Code2 size={16} />, label: 'Code', color: '#a78bfa' },
  { icon: <Palette size={16} />, label: 'Design', color: '#f472b6' },
  { icon: <Database size={16} />, label: 'Data', color: '#fb923c' },
  { icon: <Layers size={16} />, label: 'Canvas', color: '#22d3ee' },
  { icon: <GitBranch size={16} />, label: 'Git', color: '#fbbf24' },
  { icon: <Sparkles size={16} />, label: 'AI', color: '#e879f9' },
];

export function LauncherWidget() {
  return (
    <div style={scrollStyle}>
      <div style={{ ...labelStyle, marginBottom: 10 }}>Quick Launch</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {APPS.map(app => (
          <motion.button
            key={app.label}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => {}}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              padding: '10px 4px', borderRadius: 10,
              background: `${app.color}0D`,
              border: `1px solid ${app.color}20`,
              cursor: 'pointer',
              transition: 'box-shadow 0.15s',
            }}
          >
            <span style={{ color: app.color }}>{app.icon}</span>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-body)', color: 'oklch(0.60 0.02 265)' }}>
              {app.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── PROJECTS ─────────────── */
export function ProjectsWidget() {
  const { projects, activeProjectId, setActiveProject, toggleProjectStar } = useNexus();

  return (
    <div style={scrollStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={labelStyle}>Projects</span>
        <span style={{ ...labelStyle, color: 'oklch(0.75 0.18 200)' }}>{projects.length} total</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {projects.map(p => (
          <motion.div
            key={p.id}
            whileHover={{ x: 3 }}
            onClick={() => setActiveProject(p.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
              background: p.id === activeProjectId ? `${p.color}10` : 'oklch(0.11 0.02 265 / 0.5)',
              border: `1px solid ${p.id === activeProjectId ? p.color + '30' : 'oklch(1 0 0 / 0.06)'}`,
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '16px' }}>{p.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 500, color: p.id === activeProjectId ? p.color : 'oklch(0.78 0.02 265)', marginBottom: 1 }}>
                {p.name}
              </div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'oklch(0.45 0.02 265)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.description}
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); toggleProjectStar(p.id); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Star size={11} style={{ color: p.starred ? 'oklch(0.78 0.15 65)' : 'oklch(0.35 0.02 265)' }} fill={p.starred ? 'oklch(0.78 0.15 65)' : 'none'} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── WORKFLOW ─────────────── */
const WORKFLOW_STAGES = [
  { id: 'backlog', label: 'Backlog', color: '#64748b', items: ['Research competitors', 'Define v2 scope'] },
  { id: 'active', label: 'In Progress', color: '#22d3ee', items: ['Canvas integration', 'Widget system'] },
  { id: 'review', label: 'Review', color: '#fbbf24', items: ['Onboarding flow'] },
  { id: 'done', label: 'Done', color: '#34d399', items: ['Design system', 'Project structure'] },
];

export function WorkflowWidget() {
  return (
    <div style={{ height: '100%', overflowX: 'auto', overflowY: 'hidden', padding: '10px 12px' }}>
      <div style={{ ...labelStyle, marginBottom: 10 }}>Kanban Board</div>
      <div style={{ display: 'flex', gap: 8, height: 'calc(100% - 30px)' }}>
        {WORKFLOW_STAGES.map(stage => (
          <div
            key={stage.id}
            style={{
              minWidth: 140, flex: '0 0 140px',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <div style={{ width: 6
, height: 6, borderRadius: '50%', background: stage.color, flexShrink: 0 }} />
              <span style={{ ...labelStyle, color: stage.color, fontSize: '9px' }}>{stage.label}</span>
              <span style={{ ...labelStyle, marginLeft: 'auto', fontSize: '9px' }}>{stage.items.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
              {stage.items.map(item => (
                <motion.div
                  key={item}
                  whileHover={{ x: 2 }}
                  style={{
                    padding: '6px 8px', borderRadius: 6,
                    background: `${stage.color}0A`,
                    border: `1px solid ${stage.color}18`,
                    fontSize: '10px',
                    fontFamily: 'var(--font-body)',
                    color: 'oklch(0.70 0.02 265)',
                    lineHeight: 1.4,
                    cursor: 'default',
                  }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
