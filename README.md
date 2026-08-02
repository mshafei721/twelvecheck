# TwelveCheck

TwelveCheck is a launch-evidence product ladder for SaaS founders: a reusable offline Evidence Kit for self-review, plus bounded human public-build reviews. Every tier centers on twelve normal-user checks, reproducible evidence, and P0/P1/P2 prioritization—not security or compliance claims.

**Live offer:** https://mshafei721.github.io/twelvecheck/

**Free 12-point SaaS launch checklist:** https://mshafei721.github.io/twelvecheck/saas-launch-checklist.html

**Downloadable 8-page field guide:** https://mshafei721.github.io/twelvecheck/twelvecheck-launch-checklist-carousel.pdf

**Free Gumroad field guide ($0+, $5 suggested):** https://midoevanescence.gumroad.com/l/twelvecheck-free-guide

**Instant Evidence Kit ($9):** https://midoevanescence.gumroad.com/l/twelvecheck-evidence-kit

**Commission checkout:** https://midoevanescence.gumroad.com/l/twelvecheck

**Mini review:** https://midoevanescence.gumroad.com/l/twelvecheck-mini

The self-serve Evidence Kit is a single offline HTML workbook plus reusable templates. It makes no network request and stores work only in the purchaser's browser. The production site also validates and saves the three-journey human-review intake in the visitor's browser, then opens the Gumroad commission checkout. Gumroad collects a 50% deposit ($44.50); the balance is charged after completion. The 12-hour clock starts only after deposit confirmation and final scope acceptance.

This folder is the operating source of truth for the business. It contains the public landing page, a clearly synthetic sample proof pack, the fulfillment checklist, research ledger, and demand-test operating notes.

## Run locally

```powershell
npm install
npm run dev
```

Production check:

```powershell
npm run check
```

`VITE_KIT_URL`, `VITE_MINI_CHECKOUT_URL`, and `VITE_CHECKOUT_URL` configure the three paid tiers. For an unconnected local human-review build, `VITE_RESERVATION_EMAIL` provides the private draft handoff and `VITE_RESERVATION_URL` provides the public GitHub alternative. The intake form is saved only in the visitor's local browser.

## Current operating contract

- Total commission: $89.
- Deposit: 50% ($44.50) after preliminary fit confirmation; it confirms final scope. Balance after delivery.
- Capacity: three active slots.
- Turnaround: 12 hours after both deposit confirmation and final scope acceptance.
- Inputs: public URL, launch time, and three critical user journeys.
- Deliverables: timestamped evidence, prioritized issue list, three-minute walkthrough, one scoped revision.
- Exclusions: security, penetration, load, privileged access, certification, legal/compliance review, and guarantees.

The controlled entry-tier experiment is TwelveCheck Mini: one public journey, four normal-user checks, timestamped evidence, a 90-second walkthrough, and one focused retest for $39 total ($19.50 deposit), with initial delivery within four hours after deposit confirmation and final scope acceptance. It is capped at three slots and does not replace or discount the full review.

## Release gate

Do not claim revenue until a payment is confirmed. Do not call a founder's product insecure. Do not test anything not reachable through ordinary public use. Reject and refund an inaccessible or out-of-scope commission.
