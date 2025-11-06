'use client';

import { useEffect } from 'react';
import { initConsoleFilter } from '@/lib/console-filter';

/**
 * Console Filter Component
 * Initializes console filtering to reduce noise in development
 */
const ConsoleFilter: React.FC = () => {
  useEffect(() => {
    // Nuclear option: Completely eliminate Google Tags and analytics noise
    if (typeof window !== 'undefined') {
      const originalConsole = {
        log: console.log,
        warn: console.warn,
        info: console.info,
        debug: console.debug,
        group: console.group,
        groupEnd: console.groupEnd,
      };

      // Super aggressive filter that blocks ALL noise
      const nuclearFilter = (originalMethod: any) => {
        return (...args: any[]) => {
          const messageString = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ');

          const lowerMessage = messageString.toLowerCase();

          // Block ANYTHING that contains these patterns
          const blockPatterns = [
            'google',
            'gtag',
            'analytics',
            'dataLayer',
            'measurement',
            'tag assistant',
            'gtm',
            'goog',
            'clarity',
            'microsoft',
            '██', '▓', '░', '▒', // ASCII art
            '┌', '└', '┐', '┘', '│', '─', // Box drawing
            'install', 'extension', 'chrome',
            'version', 'download', 'upgrade'
          ];

          const shouldBlock = blockPatterns.some(pattern =>
            lowerMessage.includes(pattern)
          );

          // Also block multi-line promotional content
          const isPromo = messageString.includes('\n') && messageString.length > 100;

          if (!shouldBlock && !isPromo) {
            return originalMethod.apply(console, args);
          }
          // Otherwise, completely silence it
        };
      };

      // Check if debug mode is enabled
      const urlParams = new URLSearchParams(window.location.search);
      const isDebugMode = urlParams.get('debug') === 'true';

      if (!isDebugMode) {
        // Apply nuclear filtering
        console.log = nuclearFilter(originalConsole.log);
        console.warn = nuclearFilter(originalConsole.warn);
        console.info = nuclearFilter(originalConsole.info);
        console.debug = nuclearFilter(originalConsole.debug);
        console.group = nuclearFilter(originalConsole.group);
        console.groupEnd = nuclearFilter(originalConsole.groupEnd);

        // Use original console for our message
        originalConsole.log('🚫 NUCLEAR console filtering enabled - all analytics noise blocked!');
        originalConsole.log('💡 Add ?debug=true to URL to see everything');
      } else {
        originalConsole.log('🐛 Debug mode - showing all console output');
      }

      // Add browser console controls
      (window as any).disableConsoleFilter = () => {
        window.location.search = '?debug=true';
        window.location.reload();
      };

      (window as any).enableConsoleFilter = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('debug');
        window.location.href = url.toString();
      };

      // Also initialize the regular filter as backup
      initConsoleFilter();
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default ConsoleFilter;