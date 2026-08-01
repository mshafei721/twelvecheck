# TwelveCheck

TwelveCheck is a productized, human public-build launch review for SaaS founders launching within 72 hours. The offer is deliberately narrow: twelve normal-user checks, timestamped evidence, P0/P1/P2 findings, and a short walkthrough for $89.

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

Set `VITE_CHECKOUT_URL` to the published Gumroad commission URL before deploying. The intake form is saved only in the visitor's local browser; payment and commission delivery happen through Gumroad.

## Current operating contract

- Total commission: $89.
- Checkout deposit: 50% ($44.50); balance after delivery.
- Capacity: three active slots.
- Turnaround: 12 hours after scope acceptance.
- Inputs: public URL, launch time, and three critical user journeys.
- Deliverables: timestamped evidence, prioritized issue list, three-minute walkthrough, one scoped revision.
- Exclusions: security, penetration, load, privileged access, certification, legal/compliance review, and guarantees.

## Release gate

Do not claim revenue until a payment is confirmed. Do not call a founder's product insecure. Do not test anything not reachable through ordinary public use. Reject and refund an inaccessible or out-of-scope commission.
