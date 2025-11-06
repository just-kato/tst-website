/**
 * Early Console Interceptor
 * This must be loaded BEFORE any other scripts to catch all console output
 */

// Immediately override console methods at script load time
if (typeof window !== 'undefined' && typeof console !== 'undefined') {
  // Store the original methods
  const originalMethods = {
    log: console.log,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
    group: console.group,
    groupEnd: console.groupEnd,
    groupCollapsed: console.groupCollapsed,
  };

  // Aggressive blocking patterns
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
    '┌', '└', '┐', '┘', '│', '─', '┼', '┤', '├', // Box drawing
    'install', 'extension', 'chrome',
    'version', 'download', 'upgrade',
    'tag manager', 'google-analytics',
    'ga4', 'universal analytics',
    'firebase', 'recaptcha'
  ];

  // Super aggressive interceptor
  const createInterceptor = (originalMethod: any, methodName: string) => {
    return function(...args: any[]) {
      // Check if debug mode is enabled
      const isDebugMode = typeof window !== 'undefined' &&
        window.location.search.includes('debug=true');

      if (isDebugMode) {
        return originalMethod.apply(console, args);
      }

      // Convert all arguments to string for analysis
      const messageString = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      const lowerMessage = messageString.toLowerCase();

      // Check if this message should be blocked
      const shouldBlock = blockPatterns.some(pattern =>
        lowerMessage.includes(pattern.toLowerCase())
      ) ||
      // Block any multi-line content that looks like ASCII art or promotional
      (messageString.includes('\n') && messageString.length > 50);

      if (shouldBlock) {
        // Completely silence it - don't call original method
        return;
      }

      // Allow legitimate messages through
      return originalMethod.apply(console, args);
    };
  };

  // Override ALL console methods immediately
  console.log = createInterceptor(originalMethods.log, 'log');
  console.warn = createInterceptor(originalMethods.warn, 'warn');
  console.info = createInterceptor(originalMethods.info, 'info');
  console.debug = createInterceptor(originalMethods.debug, 'debug');
  console.group = createInterceptor(originalMethods.group, 'group');
  console.groupEnd = createInterceptor(originalMethods.groupEnd, 'groupEnd');
  console.groupCollapsed = createInterceptor(originalMethods.groupCollapsed, 'groupCollapsed');

  // Also store original methods on window for debugging
  (window as any).__originalConsole = originalMethods;

  // Immediately log that filtering is active (using original method)
  originalMethods.log('🚫 EARLY console interception active - blocking analytics noise');
}

export default {};