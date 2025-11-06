# Botpoison Testing Guide

## ✅ Automated Test Results

The automated test script confirmed that botpoison is working correctly:

- **Bot submissions without tokens**: ❌ Blocked (400 error)
- **Invalid/fake tokens**: ❌ Blocked (400 error)
- **Rapid fire submissions**: ❌ All blocked (5/5)
- **Normal form submissions**: ✅ Allowed (with valid token)

## 🧪 Testing Methods

### 1. Automated Script Testing
```bash
node test-bot-protection.js
```

### 2. Manual API Testing with curl
```bash
# Test without botpoison token (should fail)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bot",
    "email": "bot@example.com",
    "phone": "555-123-4567",
    "variant": "contact"
  }'

# Test with fake token (should fail)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fake Token",
    "email": "fake@example.com",
    "phone": "555-123-4567",
    "variant": "contact",
    "botpoison": "fake-token-123"
  }'
```

### 3. Browser DevTools Testing

1. **Disable JavaScript** in browser DevTools:
   - Open DevTools (F12)
   - Go to Settings (gear icon)
   - Check "Disable JavaScript"
   - Try submitting form → Should fail

2. **Block Botpoison Requests**:
   - Open DevTools → Network tab
   - Right-click any request → Block request domain
   - Add `api.botpoison.com` to blocked domains
   - Try submitting form → Should fail

3. **Simulate Network Errors**:
   - DevTools → Network tab → Throttling
   - Set to "Offline"
   - Try submitting form → Should fail gracefully

### 4. Automated Browser Testing (Headless)

Create a headless browser test that simulates bot behavior:

```javascript
// Example with Puppeteer
const puppeteer = require('puppeteer');

async function testBotBehavior() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Block botpoison API
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.url().includes('api.botpoison.com')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto('http://localhost:3000/book/trauma');
  // Fill form and submit - should fail
}
```

## 🛠️ Development Testing Features

### Development Bypass (Optional)

To make testing easier during development, you can add a bypass:

1. Add to `.env.local`:
```
BOTPOISON_DEV_BYPASS=true
```

2. In API route, add bypass logic for development.

### Testing Different Bot Patterns

- **High-frequency submissions**: Use the rapid submission test
- **Missing User-Agent**: Test with custom headers
- **Suspicious patterns**: Multiple emails, phone numbers, etc.
- **Headless browser detection**: Use tools like Selenium/Puppeteer

## 📊 What to Monitor in Production

1. **False Positives**: Legitimate users being blocked
2. **Performance Impact**: Time added to form submissions
3. **Bot Attempts**: Check logs for blocked attempts
4. **Success Rate**: Ratio of successful vs blocked submissions

## 🚨 Common Issues

1. **Network Timeouts**: Botpoison API unreachable
2. **API Rate Limits**: Too many verification requests
3. **Client-side Errors**: JavaScript disabled/blocked
4. **Mobile Issues**: Different behavior on mobile browsers

## 📈 Success Metrics

- ✅ Blocks headless browser submissions
- ✅ Blocks rapid-fire bot attacks
- ✅ Blocks submissions without valid tokens
- ✅ Allows legitimate user submissions
- ✅ Graceful error handling for edge cases