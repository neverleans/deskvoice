---
name: create-regression-from-incident
description: Turn a production bug or incident into a permanent reproducible regression case.
---

# Create Regression From Incident

1. Record the symptom and affected user journey.
2. Identify minimal reproduction conditions.
3. Reproduce in an isolated environment.
4. Encode the failure as the narrowest durable test possible.
5. Fix the underlying cause.
6. Run the new regression plus the broader affected suite.
7. Store the case with incident/source metadata.
8. Note any missing harness/tooling that allowed the bug to escape.
