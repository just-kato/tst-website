/**
 * Console Filter Utility
 * Controls what shows up in the console during development
 */

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
};

// Patterns to filter out (case-insensitive)
const NOISE_PATTERNS = [
  // Google Analytics / GTM noise (be VERY aggressive)
  'gtag',
  'google',
  'analytics',
  'dataLayer',
  'ga4',
  'measurement_id',
  'google tags',
  'googletagmanager',
  'tag assistant',
  'gtm',
  'goog',

  // Navigation noise
  'NavigationLoadingIndicator',
  'isNavigating',
  'pathname changed',

  // General noise
  '.well-known',
  'appspecific',
  'devtools.json',

  // Microsoft Clarity
  'clarity',
  'microsoft',

  // Development noise
  'HMR',
  'hot reload',
  'webpack',

  // ASCII art and promotional content (common patterns)
  '██',
  '▓▓',
  '▒▒',
  '░░',
  '▄▄',
  '▀▀',
  '│',
  '┌',
  '└',
  '┐',
  '┘',
  '─',
  '┴',
  '┬',
  'install',
  'upgrade',
  'version',
  'download',
  'extension',
  'chrome',
  'extension id',
];

// Check if debug mode is enabled
const isDebugMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug') === 'true') return true;

  // Check environment variables
  return process.env.DEBUG_ALL === 'true';
};

// Check if a message should be filtered
const shouldFilter = (messageString: string): boolean => {
  if (!messageString || typeof messageString !== 'string') return false;

  // Never filter in debug mode
  if (isDebugMode()) return false;

  const lowerMessage = messageString.toLowerCase();

  // Check against all noise patterns
  const hasNoise = NOISE_PATTERNS.some(pattern =>
    lowerMessage.includes(pattern.toLowerCase())
  );

  // Also filter multiline messages that look like ASCII art
  const isAsciiArt = messageString.includes('\n') && (
    messageString.includes('██') ||
    messageString.includes('▓') ||
    messageString.includes('░') ||
    messageString.includes('▒') ||
    messageString.includes('┌') ||
    messageString.includes('└') ||
    messageString.includes('│') ||
    messageString.includes('─')
  );

  // Filter anything that looks like promotional content
  const isPromotional = lowerMessage.includes('install') &&
                        lowerMessage.includes('extension');

  return hasNoise || isAsciiArt || isPromotional;
};

// Filter function for console methods
const createFilteredConsole = (originalMethod: Function, methodName: string) => {
  return (...args: any[]) => {
    // Always allow errors through
    if (methodName === 'error') {
      return originalMethod.apply(console, args);
    }

    // In production, keep analytics quiet
    if (process.env.NODE_ENV === 'production') {
      // Only show errors and important warnings
      if (methodName === 'warn' && args[0]?.includes('Analytics')) {
        return; // Filter out analytics warnings in production
      }
    }

    // In development, apply noise filtering
    const messageString = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    if (shouldFilter(messageString)) {
      // Only show if explicitly debugging this area
      const debugFlags = {
        analytics: process.env.DEBUG_ANALYTICS === 'true',
        navigation: process.env.DEBUG_NAVIGATION === 'true',
        botpoison: process.env.DEBUG_BOTPOISON === 'true',
        all: process.env.DEBUG_ALL === 'true',
      };

      if (!debugFlags.all && !Object.values(debugFlags).some(Boolean)) {
        return; // Filter out the noise
      }
    }

    // Allow everything else through
    return originalMethod.apply(args);
  };
};

/**
 * Initialize console filtering
 * Call this early in your app to clean up console output
 */
export const initConsoleFilter = () => {
  if (typeof window === 'undefined') return; // Server-side safe

  // Apply filtering in development (and be aggressive about it)
  if (process.env.NODE_ENV === 'development') {
    // Override all console methods aggressively
    console.log = createFilteredConsole(originalConsole.log, 'log');
    console.warn = createFilteredConsole(originalConsole.warn, 'warn');
    console.info = createFilteredConsole(originalConsole.info, 'info');
    console.debug = createFilteredConsole(originalConsole.info, 'info'); // Treat debug like info

    // Also override any global console if it exists
    if (typeof globalThis !== 'undefined' && globalThis.console) {
      globalThis.console.log = createFilteredConsole(originalConsole.log, 'log');
      globalThis.console.warn = createFilteredConsole(originalConsole.warn, 'warn');
      globalThis.console.info = createFilteredConsole(originalConsole.info, 'info');
    }

    // Don't filter errors - always show them
    console.log('🧹 Aggressive console filtering enabled - no more noise!');
  }
};

/**
 * Restore original console (for debugging)
 */
export const restoreConsole = () => {
  if (typeof window === 'undefined') return;

  Object.assign(console, originalConsole);
};

/**
 * Debug helper - temporarily enable all console output
 */
export const enableDebugMode = () => {
  if (typeof window !== 'undefined') {
    (window as any).DEBUG_ALL = 'true';
    console.log('🐛 Debug mode enabled - all console output will show');
  }
};

/**
 * Log important messages that should always show
 */
export const importantLog = (...args: any[]) => {
  originalConsole.log.apply(console, ['🔔', ...args]);
};

export default { initConsoleFilter, restoreConsole, enableDebugMode, importantLog };
