'use client';

import { useEffect } from 'react';
import { initConsoleFilter } from '@/lib/console-filter';

/**
 * Console Filter Component
 * Initializes console filtering to reduce noise in development
 */
const ConsoleFilter: React.FC = () => {
  useEffect(() => {
    // Initialize console filtering on mount
    initConsoleFilter();

    // Add a clean way to disable filtering from browser console
    if (typeof window !== 'undefined') {
      (window as any).disableConsoleFilter = () => {
        window.location.search = '?debug=true';
        window.location.reload();
      };

      (window as any).enableConsoleFilter = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('debug');
        window.location.href = url.toString();
      };

      // Check if debug mode is enabled via URL
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true') {
        console.log('🐛 Console debug mode enabled via URL parameter');
        console.log('💡 Run window.enableConsoleFilter() to disable debug mode');
      } else {
        console.log('🧹 Console filtering active - less noise, more signal!');
        console.log('💡 Run window.disableConsoleFilter() to see all console output');
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default ConsoleFilter;