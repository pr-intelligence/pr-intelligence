# Milestone 3.5 — Review Quality, Evaluation and Performance

## Goal
Make PR Intelligence produce reviews that developers can trust, not merely reviews that sound convincing.

## Completion Criteria
- At least 10 evaluation PRs with documented answer keys
- At least 80% of reported findings are genuinely valid (precision)
- At least 80% of seeded HIGH or CRITICAL issues are detected (recall)
- No demonstrably false technical claims in the final benchmark run
- Clean PRs receive no false HIGH or CRITICAL findings
- Severity correct or within one adjacent level for 80%+ of findings
- Small and medium PRs complete without parsing failures
- Large PR behaviour measured and documented

## Severity Rubric
| Severity | Definition |
|---|---|
| CRITICAL | Exploitable issue with severe immediate impact |
| HIGH | Security, data loss, authentication, or major correctness risk |
| MEDIUM | Real functional bug affecting expected behaviour |
| LOW | Limited edge case or maintainability risk |
| INFO | Useful observation, not a defect |

## What 3.5 Does NOT Include
- Deployment, queues, idempotency, billing, dashboards, inline comments

## Evaluation Set (10 PRs)
- [ ] Security: SQL injection
- [ ] Security: eval/code injection
- [ ] Async: missing await
- [ ] Error handling: unhandled rejection
- [ ] Correctness: division by zero / empty array
- [ ] Validation: weak input validation
- [ ] Authentication: hardcoded credentials
- [ ] Cross-file issue
- [ ] Clean PR — false positive test 1
- [ ] Clean PR — false positive test 2

## Performance Targets
| Size | Files | Target |
|---|---|---|
| Small | 1–3 | Under 15 seconds |
| Medium | 10–15 | Under 45 seconds |
| Large | 30+ | Measured and documented |
