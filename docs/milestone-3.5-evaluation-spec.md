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

## Evaluation Results

### PR #14 — SQL Injection
**Seeded issues:** 3 HIGH
**Detected:** 3/3
**High-risk recall:** 100%
**Valid actionable findings:** 3
**Extra findings:** 1 INFO observation
**Severity accuracy:** 100%

**Problems observed:**
- Repeated same root issue three times instead of consolidating
- Claimed queries were exploitable when diff only constructs strings, does not execute them
- INFO finding partially corrected the earlier overstatement

**Verdict:** PASS for detection and severity. PARTIAL for technical accuracy and noise control.

### PR #15 — Missing Await
**Seeded issues:** fetchUser (CRITICAL — missing await on fetch + json), saveOrder (HIGH — missing await, status check on Promise)
**Clean function:** deleteUser (has correct await)
**Detected:** async bug pattern found ✅
**False positives:** 1 — deleteUser incorrectly accused of missing await ❌
**Severity accuracy:** HIGH reported instead of CRITICAL for fetchUser
**Technical accuracy:** 5/10 — pattern matched instead of reading actual code

**Problems observed:**
- Accused deleteUser of missing await when it correctly has await
- Severity under-calibrated — fetchUser returns a Promise silently, that is CRITICAL not HIGH
- Consolidation approach was good but applied incorrectly by including clean function

**Verdict:** PARTIAL — detection yes, precision no.

### PR #16 — Unhandled Rejection
**Seeded issues:** notifyUser (HIGH — discarded Promise), sendBulkEmails (HIGH — async forEach)
**Clean controls:** sendEmail, retryNotification
**Detected:** 2/2 seeded issue areas
**High-risk recall:** 100%
**Severity accuracy:** 1/2 — notifyUser reported MEDIUM instead of HIGH
**False/low-value findings:** 2 — type-annotation claim and retry error-message suggestion
**Technical accuracy:** 4/10

**Problems observed:**
- Correctly detected the async-forEach bug in sendBulkEmails as HIGH
- Identified notifyUser as problematic, but incorrectly described it as a synchronous call
- Failed to explain that notifyUser discards the returned Promise and cannot propagate failures
- Under-severitized notifyUser as MEDIUM instead of HIGH
- Claimed type annotations were needed even though the file already has explicit types
- Flagged retryNotification with a subjective error-message suggestion despite it being a clean control

**Verdict:** PARTIAL — full seeded-issue recall, but poor technical precision, severity calibration, and noise control.

### PR #18 — Hardcoded Credentials (clean fixture, replaces PR #17)
**Seeded issues:** 5 hardcoded secrets (DATABASE_CONFIG.password, API_KEYS.payments, API_KEYS.email, JWT_CONFIG.secret, ADMIN_CREDENTIALS.password) — all HIGH
**Detected:** 1 consolidated HIGH finding covering all secrets
**High-risk recall:** 100%
**Severity accuracy:** HIGH correct ✅
**False positives:** 0 ✅
**Technical accuracy:** 5/10

**Problems observed:**
- Summary stated secrets are "necessary for running with proper environment variables" — contradicts the finding
- Consolidated finding is vague — no specific impact per secret type, no mention of JWT token forgery risk
- No concrete recommendation (use environment variables, secret manager, rotate exposed values)

**Verdict:** PASS for detection and noise control. PARTIAL for technical accuracy and actionability.
