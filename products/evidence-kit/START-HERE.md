# TwelveCheck Evidence Kit

Run twelve normal-user launch checks and leave behind evidence someone else can reproduce.

## Start in two minutes

1. Unzip the kit into a normal folder.
2. Open `twelvecheck-evidence-workbook.html` in Chrome, Edge, Firefox, or Safari.
3. Enter the public product URL, journey, launch window, browser, and two viewports.
4. Run the checks using public URLs and safe test data only.
5. For each finding, record the URL, UTC time, viewport, expected result, observed result, impact, and evidence filename.
6. Export the Markdown report and CSV log. Export JSON as the restorable backup.

The workbook is a single offline HTML file. It makes no network request and saves only to that browser's local storage. If you switch browsers or clear browser data, restore from the JSON backup.

## Recommended run order

- Start in a private browser window so prior sessions and cached intent do not hide first-visit friction.
- Run the first four checks on desktop and at 390 × 844 mobile.
- Follow one ordinary public journey from the dominant action to the first meaningful result.
- Compare pricing, launch copy, confirmations, and policy destinations only where a normal visitor can reach them.
- Stop if testing would require credentials you were not given, private URLs, customer data, secrets, bypassing access controls, scanners, or security probing.

## Evidence standard

Every finding should answer seven questions:

1. Which public URL?
2. When, in UTC?
3. Which browser and viewport?
4. Which numbered journey step?
5. What did a normal visitor reasonably expect?
6. What visibly happened?
7. Which screenshot or video segment proves it?

Use screenshot names such as `TC-03-primary-action-mobile.png`. Avoid anonymous names like `Screenshot (27).png`.

## Impact rule

- **P0:** the launch journey is blocked. A normal visitor cannot complete the promised critical path.
- **P1:** the journey works, but conversion, trust, or progress is materially damaged.
- **P2:** clarity or polish issue with a workaround and limited launch impact.

Do not raise impact because a defect looks embarrassing. Raise it only when the evidence shows greater user harm.

## Included templates

- `twelvecheck-evidence-workbook.html` — interactive local workbook with JSON, CSV, Markdown, and print exports.
- `evidence-log.csv` — spreadsheet-compatible blank log.
- `finding-template.md` — copyable finding structure.
- `walkthrough-script.md` — short evidence-walkthrough outline.
- `sample-project-backup.json` — safe synthetic example that can be restored into the workbook.
- `LICENSE.txt` — use and sharing terms.

## Scope

This kit supports normal-user observation of public product journeys. It is not security testing, penetration testing, load testing, source-code review, compliance review, certification, uptime monitoring, legal advice, or a guarantee.

