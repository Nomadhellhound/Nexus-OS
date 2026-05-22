/**
 * NEXUS OS — Interactive Onboarding
 * Void Interface: cinematic welcome sequence
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import { useState } from 'react';
import { ArrowRight, Layers, Command, Sparkles, Zap } from 'lucide-react';

const STEPS = [
  {
    id: 0,
    title: 'Welcome to NEXUS OS',
    subtitle: 'Your spatial operating system for creators, founders, and power users.',
    icon: null,
    visual: 'logo',
    cta: 'Begin',
  },
  {
    id: 1,
    title: 'Infinite Canvas',
    subtitle: 'A spatial workspace built on tldraw. Draw, map, plan — without limits.',
    icon: <Layers size={28} />,
    visual: 'canvas',
    color: '#22d3ee',
    cta: 'Next',
  },
  {
    id: 2,
    title: 'Command Everything',
    subtitle: 'Press ⌘K to open the command palette. Access any tool, any mode, any project instantly.',
    icon: <Command size={28} />,
    visual: 'command',
    color: '#a78bfa',
    cta: 'Next',
  },
  {
    id: 3,
    title: 'Floating Widgets',
    subtitle: 'Notes, tasks, AI assistant, stats — drag them anywhere. Your workspace, your rules.',
    icon: <Sparkles size={28} />,
    visual: 'widgets',
    color: '#34d399',
    cta: 'Next',
  },
  {
    id: 4,
    title: 'You\'re Ready',
    subtitle: 'NEXUS OS is your creative command center. Build something extraordinary.',
    icon: <Zap size={28} />,
    visual: 'ready',
    color: '#fb923c',
    cta: 'Enter NEXUS',
  },
];

export default function Onboarding() {
  const { onboardingComplete, setOnboardingComplete, openWidget } = useNexus();
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const current = STEPS[step];

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      setExiting(true);
      setTimeout(() => {
        setOnboardingComplete(true);
        openWidget('ai');
      }, 600);
    }
  };

  if (onboardingComplete) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ background: 'oklch(0.04 0.01 265 / 0.95)', backdropFilter: 'blur(8px)' }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663684699131/DzDpNpHrwpYNPLJadfzL73/nexus-onboarding-asXA2u5X58rXwAsdc6KnGc.webp)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Ambient glow */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 600, height: 600,
              background: 'radial-gradient(circle, oklch(0.75 0.18 200 / 0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-10 text-center"
              style={{ maxWidth: 480, padding: '0 24px' }}
            >
              {/* Logo / Icon */}
              {current.visual === 'logo' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="mb-8"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: 'linear-gradient(135deg, oklch(0.75 0.18 200 / 0.2), oklch(0.60 0.22 285 / 0.2))',
                      border: '1px solid oklch(0.75 0.18 200 / 0.3)',
                      boxShadow: '0 0 40px oklch(0.75 0.18 200 / 0.2)',
                    }}
                  >
                    <span style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'oklch(0.75 0.18 200)' }}>N</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', color: 'oklch(0.45 0.02 265)', textTransform: 'uppercase' }}>
                    NEXUS OS v1.0
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="mb-8"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                    style={{
                      background: `${current.color}15`,
                      border: `1px solid ${current.color}30`,
                      boxShadow: `0 0 30px ${current.color}20`,
                      color: current.color,
                    }}
                  >
                    {current.icon}
                  </div>
                </motion.div>
              )}

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: current.visual === 'logo' ? '44px' : '32px',
                  fontWeight: 800,
                  color: 'oklch(0.92 0.01 265)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  marginBottom: 16,
                }}
              >
                {current.title}
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  color: 'oklch(0.58 0.02 265)',
                  lineHeight: 1.65,
                  marginBottom: 40,
                }}
              >
                {current.subtitle}
              </p>

              {/* CTA */}
              <motion.button
                onClick={next}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px',
                  borderRadius: 10,
                  background: current.visual === 'logo'
                    ? 'linear-gradient(135deg, oklch(0.75 0.18 200 / 0.2), oklch(0.60 0.22 285 / 0.2))'
                    : `${current.color}18`,
                  border: `1px solid ${current.visual === 'logo' ? 'oklch(0.75 0.18 200 / 0.35)' : current.color + '35'}`,
                  color: current.visual === 'logo' ? 'oklch(0.75 0.18 200)' : current.color,
                  fontSize: '14px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: `0 0 20px ${current.visual === 'logo' ? 'oklch(0.75 0.18 200 / 0.15)' : current.color + '20'}`,
                }}
              >
                {current.cta}
                <ArrowRight size={14} />
              </motion.button>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === step ? 20 : 6,
                      background: i === step ? 'oklch(0.75 0.18 200)' : 'oklch(0.25 0.02 265)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ height: 6, borderRadius: 3 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Skip */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => { setExiting(true); setTimeout(() => setOnboardingComplete(true), 400); }}
            className="absolute bottom-8 right-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'oklch(0.38 0.02 265)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
