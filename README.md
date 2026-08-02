# TwelveCheck

TwelveCheck is a productized, human public-build launch review for SaaS founders launching within 72 hours. The offer is deliberately narrow: twelve normal-user checks, timestamped evidence, P0/P1/P2 findings, and a short walkthrough for $89.

**Live offer:** https://mshafei721.github.io/twelvecheck/

**Free 12-point SaaS launch checklist:** https://mshafei721.github.io/twelvecheck/saas-launch-checklist.html

**Commission checkout:** https://midoevanescence.gumroad.com/l/twelvecheck

The production site validates and saves the three-journey intake in the visitor's browser, then opens the Gumroad commission checkout. Gumroad collects a 50% deposit ($44.50); the balance is charged after completion. The 12-hour clock starts only after deposit confirmation and final scope acceptance.

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

`VITE_CHECKOUT_URL` is set for the GitHub Pages build in `.github/workflows/pages.yml`. For an unconnected local build, `VITE_RESERVATION_EMAIL` provides the private draft handoff and `VITE_RESERVATION_URL` provides the public GitHub alternative. The intake form is saved only in the visitor's local browser.

## Current operating contract

- Total commission: $89.
- Deposit: 50% ($44.50) after preliminary fit confirmation; it confirms final scope. Balance after delivery.
- Capacity: three active slots.
- Turnaround: 12 hours after both deposit confirmation and final scope acceptance.
- Inputs: public URL, launch time, and three critical user journeys.
- Deliverables: timestamped evidence, prioritized issue list, three-minute walkthrough, one scoped revision.
- Exclusions: security, penetration, load, privileged access, certification, legal/compliance review, and guarantees.

## Release gate

Do not claim revenue until a payment is confirmed. Do not call a founder's product insecure. Do not test anything not reachable through ordinary public use. Reject and refund an inaccessible or out-of-scope commission.
