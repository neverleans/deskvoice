# Production Safety

- Production write operations require an explicit authorized workflow.
- Prefer read-only access for diagnosis.
- Prefer staging for write-path tests.
- Required CI checks must remain enforced.
- Define a rollback path before high-risk changes.
