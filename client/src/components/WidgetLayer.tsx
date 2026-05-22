/**
 * NEXUS OS — Widget Layer
 * Renders all floating widgets on top of the canvas
 */

import { useNexus, Widget } from '@/contexts/NexusContext';
import { FloatingWidget } from './FloatingWidget';
import {
  NotesWidget, TasksWidget, AIWidget, ProjectsWidget,
  StatsWidget, MusicWidget, LauncherWidget, WorkflowWidget,
} from './widgets/WidgetContents';
import { TerminalWidget } from './widgets/TerminalWidget';
import { WhatsAppWidget } from './widgets/WhatsAppWidget';
import { BrowserWidget } from './widgets/BrowserWidget';

function WidgetContent({ type }: { type: Widget['type'] }) {
  switch (type) {
    case 'notes':    return <NotesWidget />;
    case 'tasks':    return <TasksWidget />;
    case 'ai':       return <AIWidget />;
    case 'projects': return <ProjectsWidget />;
    case 'stats':    return <StatsWidget />;
    case 'music':    return <MusicWidget />;
    case 'launcher': return <LauncherWidget />;
    case 'workflow': return <WorkflowWidget />;
    case 'terminal': return <TerminalWidget />;
    case 'whatsapp': return <WhatsAppWidget />;
    case 'browser':  return <BrowserWidget />;
    default:         return null;
  }
}

export default function WidgetLayer() {
  const { widgets } = useNexus();

  return (
    <>
      {widgets.map(widget => (
        <FloatingWidget key={widget.id} widget={widget}>
          <WidgetContent type={widget.type} />
        </FloatingWidget>
      ))}
    </>
  );
}
