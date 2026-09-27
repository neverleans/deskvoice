#!/usr/bin/env bash
set -euo pipefail

# Example order; adapt to the project.
npm run lint
npm run typecheck
npm test
npx playwright test
