/**
 * NEXUS OS — Main Page
 * Void Interface: assembles the full OS shell
 */

import AmbientBackground from '@/components/AmbientBackground';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import Dock from '@/components/Dock';
import WorkspaceCanvas from '@/components/WorkspaceCanvas';
import WidgetLayer from '@/components/WidgetLayer';
import CommandPalette from '@/components/CommandPalette';
import Onboarding from '@/components/Onboarding';
import MinimizedWidgets from '@/components/MinimizedWidgets';

export default function Home() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* Layer 0: Ambient background */}
      <AmbientBackground />

      {/* Layer 1: OS Shell */}
      <TopBar />
      <Sidebar />
      <WorkspaceCanvas />
      <Dock />

      {/* Layer 2: Floating widgets */}
      <WidgetLayer />
      <MinimizedWidgets />

      {/* Layer 3: Overlays */}
      <CommandPalette />

      {/* Layer 4: Onboarding (highest z) */}
      <Onboarding />
    </div>
  );
}
