// NUCLEAR CONSOLE KILL SWITCH
// Run this in browser console to completely silence ALL console output except errors

(function() {
  const original = {
    log: console.log,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
    group: console.group,
    groupEnd: console.groupEnd,
    groupCollapsed: console.groupCollapsed,
  };

  // Store original on window for recovery
  window.__originalConsole = original;

  // Nuclear option: block EVERYTHING except errors and our specific messages
  const nuclearFilter = (originalMethod, methodName) => {
    return function(...args) {
      const messageString = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');

      // ONLY allow these specific patterns through
      const allowPatterns = [
        '🚫', '🧹', '💡', // Our console filter messages
        'botpoison', 'security', 'admin notification', // Important app logs
        'submitted successfully', 'form submission', // App functionality
      ];

      const isAllowed = allowPatterns.some(pattern =>
        messageString.toLowerCase().includes(pattern.toLowerCase())
      );

      // Always allow if it's our debug message or a short, simple message
      const isSimple = messageString.length < 50 &&
                      !messageString.includes('react') &&
                      !messageString.includes('orchestration') &&
                      !messageString.includes('chunk-');

      if (isAllowed || isSimple) {
        return originalMethod.apply(console, args);
      }
      // Otherwise, completely silence it
    };
  };

  // Apply nuclear filtering
  console.log = nuclearFilter(original.log, 'log');
  console.warn = nuclearFilter(original.warn, 'warn');
  console.info = nuclearFilter(original.info, 'info');
  console.debug = nuclearFilter(original.debug, 'debug');
  console.group = nuclearFilter(original.group, 'group');
  console.groupEnd = nuclearFilter(original.groupEnd, 'groupEnd');
  console.groupCollapsed = nuclearFilter(original.groupCollapsed, 'groupCollapsed');

  // Use original to announce
  original.log('☢️ NUCLEAR console filter activated - only essential logs will show');
  original.log('💡 Run window.__originalConsole.log("test") to use unfiltered console');
  original.log('💡 Run location.reload() to restore normal filtering');

})();