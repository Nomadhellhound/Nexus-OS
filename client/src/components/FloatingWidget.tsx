/**
 * NEXUS OS — Floating Widget System
 * Void Interface: draggable, resizable glass windows
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useNexus, Widget } from '@/contexts/NexusContext';
import { useRef, useState, useCallback } from 'react';
import { X, Minus, Maximize2, GripHorizontal } from 'lucide-react';

interface FloatingWidgetProps {
  widget: Widget;
  children: React.ReactNode;
}

export function FloatingWidget({ widget, children }: FloatingWidgetProps) {
  const { closeWidget, minimizeWidget, bringToFront, updateWidgetPosition, updateWidgetSize } = useNexus();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, wx: 0, wy: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    bringToFront(widget.id);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, wx: widget.x, wy: widget.y };

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragStartRef.current.x;
      const dy = ev.clientY - dragStartRef.current.y;
      updateWidgetPosition(widget.id,
        Math.max(0, dragStartRef.current.wx + dx),
        Math.max(40, dragStartRef.current.wy + dy)
      );
    };
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [widget, bringToFront, updateWidgetPosition]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = { x: e.clientX, y: e.clientY, w: widget.width, h: widget.height };

    const onMove = (ev: MouseEvent) => {
      const dw = ev.clientX - resizeStartRef.current.x;
      const dh = ev.clientY - resizeStartRef.current.y;
      updateWidgetSize(widget.id,
        Math.max(240, resizeStartRef.current.w + dw),
        Math.max(160, resizeStartRef.current.h + dh)
      );
    };
    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [widget, updateWidgetSize]);

  return (
    <AnimatePresence>
      {!widget.minimized && (
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          onMouseDown={() => bringToFront(widget.id)}
          style={{
            position: 'fixed',
            left: widget.x,
            top: widget.y,
            width: widget.width,
            height: widget.height,
            zIndex: widget.zIndex,
            cursor: isDragging ? 'grabbing' : 'default',
          }}
        >
          <div
            className="w-full h-full rounded-xl flex flex-col overflow-hidden"
            style={{
              background: 'oklch(0.09 0.018 265 / 0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid oklch(1 0 0 / 0.09)',
              boxShadow: isDragging
                ? '0 24px 60px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.75 0.18 200 / 0.15)'
                : '0 8px 32px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(1 0 0 / 0.04)',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between px-3 py-2 flex-shrink-0 drag-handle select-none"
              onMouseDown={handleDragStart}
              style={{
                background: 'oklch(0.11 0.02 265 / 0.9)',
                borderBottom: '1px solid oklch(1 0 0 / 0.06)',
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            >
              <div className="flex items-center gap-2">
                <GripHorizontal size={12} style={{ color: 'oklch(0.35 0.02 265)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'oklch(0.75 0.02 265)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {widget.title}
                </span>
              </div>

              <div className="flex items-center gap-1" onMouseDown={e => e.stopPropagation()}>
                <WindowButton
                  onClick={() => minimizeWidget(widget.id)}
                  color="#fbbf24"
                  icon={<Minus size={8} />}
                />
                <WindowButton
                  onClick={() => {}}
                  color="#34d399"
                  icon={<Maximize2 size={8} />}
                />
                <WindowButton
                  onClick={() => closeWidget(widget.id)}
                  color="#f87171"
                  icon={<X size={8} />}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>

          {/* Resize handle */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4"
            style={{
              cursor: 'se-resize',
              background: 'transparent',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-1 right-1" style={{ opacity: 0.3 }}>
              <path d="M9 1L1 9M9 5L5 9M9 9" stroke="oklch(0.75 0.02 265)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WindowButton({ onClick, color, icon }: { onClick: () => void; color: string; icon: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.85 }}
      className="w-4 h-4 rounded-full flex items-center justify-center group"
      style={{ background: `${color}30`, border: `1px solid ${color}50` }}
    >
      <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
        {icon}
      </span>
    </motion.button>
  );
}
