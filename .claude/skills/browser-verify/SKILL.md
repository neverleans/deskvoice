---
name: browser-verify
description: Verify a running web application through Playwright MCP as a real user, including UI behavior and relevant API/data state.
---

# Browser Verification

1. Identify the user journey affected by the change.
2. Use the real application URL for the intended environment.
3. Exercise the flow through visible user behavior.
4. Verify important states, errors, permissions, and navigation.
5. When appropriate, correlate the UI result with API/database state.
6. Capture a trace when the flow fails.
7. Report exact observed evidence.
