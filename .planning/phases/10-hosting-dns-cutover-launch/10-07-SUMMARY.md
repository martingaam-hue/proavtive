---
plan: 07
phase: 10
status: human_action_pending
completed_at: 2026-04-25
executor: orchestrator
---

# Plan 10-07 — Post-Launch Operational Bootstrap — SUMMARY

## Outcome

All 4 tasks are HUMAN-ACTION — this plan executes after production launch (Plan 10-05 complete).
No automation possible. Documented as pending per orchestrator protocol.

**PRE-CONDITIONS before executing any task in this plan:**
- Plan 10-05 complete: production build live, smoke tests pass, GSC verified

## HUMAN-ACTION PENDING Items

### Task 1 — Record launch baselines and create Day 90 review calendar event

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Launch Baselines + Day 90 Calendar (T+24h)  ║
╚══════════════════════════════════════════════════════════════╝

Execute at T+24h (24 hours after production build went live).

1. GSC baselines:
   - Search Console → Performance → Search results → last 24-72h
   - Record: impressions, clicks, avg position for top 20 queries per market

2. GA4 baselines:
   - Real-time (first 24h) then Acquisition → Overview
   - Record: organic sessions, book-a-trial_submitted count, enquire_submitted count

3. GBP baselines (per location):
   - GBP Dashboard → each location → Performance
   - Record: impressions (search + maps), directions clicks, website clicks, call clicks
   - Record: current review count + average rating for each location

4. CWV baselines:
   - CrUX field data not available until 4 weeks after real traffic
   - Note: "CrUX baseline: available at Day 28 from launch"

5. Create calendar event "ProActiv Day 90 Review" (90 days from today):
   - Invite relevant client stakeholders
   - Paste all baselines recorded above into the description
   - Include: 20 priority queries per market (from strategy PART 7.4)
   - Add reminder 7 days before review date
──────────────────────────────────────────────────────────────
```

### Task 2 — Confirm GBP review acquisition email template is firing

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — GBP Review Acquisition Email Confirmation   ║
╚══════════════════════════════════════════════════════════════╝

Execute within first week post-launch.

1. Confirm with operations team: does booking platform have a post-trial
   follow-up email sequence configured?

2. Email template pattern (strategy PART 8.3):
   - Subject: "How did [Child's name]'s first [class type] go?"
   - Body: brief personal message + "We'd love to hear from you on Google"
          + direct link to GBP review page for that location
   - Timing: 24-48 hours after first trial class

3. Get direct review URLs (GBP Dashboard → each location → Get more reviews → Copy link):
   - Wan Chai: https://g.page/r/<place-id>/review
   - Cyberport: https://g.page/r/<place-id>/review
   - Katong Point: https://g.page/r/<place-id>/review

4. Test the email sequence: submit a test booking, confirm email fires with correct link

Day 90 target: 50+ reviews per location at ≥4.7 average (strategy PART 8.3).
──────────────────────────────────────────────────────────────
```

### Task 3 — Initiate Week 1-2 quick-win backlink outreach

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Week 1-2 Backlink Outreach                  ║
╚══════════════════════════════════════════════════════════════╝

Execute in Week 1-2 post-launch.

HK quick wins (submit to each):
1. Sassy Mama HK: sassymama.com/hongkong/ → Submit business / editorial@sassymama.com
2. Honeycombers HK: thehoneycombers.com/hk/ → directory or pitch editors
3. HK Gymnastics Association: hkga.com.hk → submit ProGym as member club (both venues)
4. Cyberport tenant directory: contact marketing to be listed as resident business
5. The Hennessy tenant directory: contact building management

SG quick wins:
6. Tickikids SG: tickikids.com/singapore/ → "Add listing" form (Katong Point, MultiBall)
7. Little Day Out SG: littledayout.com → activity listing form
8. IFS school parent network: confirm IFS website link is live

For each submission record:
- Date submitted
- Submission URL or contact email
- Expected turnaround (typically 2-4 weeks)
- Link live? (check after 4 weeks)
──────────────────────────────────────────────────────────────
```

### Task 4 — Verify middleware regression tests pass on production deploy

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Middleware Regression Tests + Routing Check  ║
╚══════════════════════════════════════════════════════════════╝

1. Run existing Vitest middleware test suite locally:
   pnpm test --run
   Expected: all tests pass (35+ test files, 189+ tests)
   The middleware tests cover D-02/D-04/D-07/D-16 invariants

2. Manual routing verification on production:
   - https://proactivsports.com/ → root group pages load (NOT HK or SG content)
   - https://hk.proactivsports.com/ → HK homepage loads (NOT root or SG content)
   - https://sg.proactivsports.com/ → SG homepage loads (NOT root or HK content)

3. If all tests pass and routing correct:
   Phase 10 is COMPLETE.
──────────────────────────────────────────────────────────────
```

## Files Modified

None (post-launch operations — no code changes).

## Acceptance Criteria Check

- [ ] Launch baselines recorded (GSC, GA4, GBP per location) — PENDING Task 1
- [ ] Day 90 review calendar event created with baselines — PENDING Task 1
- [ ] GBP review acquisition email confirmed firing — PENDING Task 2
- [ ] Review links verified for all three locations — PENDING Task 2
- [ ] Week 1-2 backlink outreach initiated (≥8 submissions) — PENDING Task 3
- [ ] pnpm test --run passes on production deploy — PENDING Task 4
- [ ] Manual routing verified on all three production domains — PENDING Task 4
