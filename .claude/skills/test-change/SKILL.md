---
name: test-change
description: Verify a change using the smallest complete set of deterministic, integration, regression, and E2E checks required by its risk.
---

# Test Change

Run checks from fastest and most deterministic to broader verification.

- lint / format / typecheck
- unit tests
- integration / contract tests
- affected regression tests
- Playwright E2E for user-facing or integration-sensitive changes

On failure, collect the most diagnostic artifact available and report the failure without hiding it.
