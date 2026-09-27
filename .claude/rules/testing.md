---
paths:
  - "src/**"
  - "app/**"
  - "tests/**"
---

# Testing Rules

- Prefer tests of user-visible behavior and public contracts.
- Keep tests isolated and reproducible.
- Add a permanent regression test for important production bugs.
- Do not replace deterministic coverage with an LLM judgment when a deterministic assertion is possible.
