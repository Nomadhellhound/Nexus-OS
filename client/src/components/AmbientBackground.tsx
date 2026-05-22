/**
 * NEXUS OS — Ambient Background
 * Void Interface: animated light blobs, noise texture, subtle grid
 */

import { motion } from 'framer-motion';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'oklch(0.06 0.015 265)',
        }}
      />

      {/* Hero background image — very subtle */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663684699131/DzDpNpHrwpYNPLJadfzL73/nexus-hero-bg-dv6isFcQ3HFvTsS9hbx5YL.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

      {/* Ambient light blob 1 — cyan, top-left */}
      <motion.div
        className="absolute rounded-full animate-blob"
        style={{
          width: 600,
          height: 600,
          top: '-15%',
          left: '-10%',
          background: 'radial-gradient(circle, oklch(0.75 0.18 200 / 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Ambient light blob 2 — violet, bottom-right */}
      <motion.div
        className="absolute rounded-full animate-blob-delay-1"
        style={{
          width: 700,
          height: 700,
          bottom: '-20%',
          right: '-15%',
          background: 'radial-gradient(circle, oklch(0.60 0.22 285 / 0.10) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Ambient light blob 3 — cyan, center */}
      <motion.div
        className="absolute rounded-full animate-blob-delay-2"
        style={{
          width: 400,
          height: 400,
          top: '40%',
          left: '45%',
          background: 'radial-gradient(circle, oklch(0.75 0.18 200 / 0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, oklch(0.40 0.04 265 / 0.35) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, oklch(0.04 0.01 265 / 0.6) 100%)',
        }}
      />

      {/* Scanlines — very subtle */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0 0 0 / 0.012) 3px, oklch(0 0 0 / 0.012) 4px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
