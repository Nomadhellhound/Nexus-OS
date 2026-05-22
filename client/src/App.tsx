/**
 * NEXUS OS — App Root
 * Void Interface Design System
 */

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/NotFound';
import { Route, Switch } from 'wouter';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { NexusProvider } from './contexts/NexusContext';
import Home from './pages/Home';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <NexusProvider>
          <TooltipProvider>
            <Toaster
              toastOptions={{
                style: {
                  background: 'oklch(0.10 0.018 265 / 0.95)',
                  border: '1px solid oklch(1 0 0 / 0.09)',
                  color: 'oklch(0.88 0.02 265)',
                  backdropFilter: 'blur(20px)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                },
              }}
            />
            <Router />
          </TooltipProvider>
        </NexusProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
