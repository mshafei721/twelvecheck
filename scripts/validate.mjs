import {readFile} from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
const sample = await readFile(new URL('../public/twelvecheck-sample-proof-pack.html', import.meta.url), 'utf8');
const checklist = await readFile(new URL('../public/saas-launch-checklist.html', import.meta.url), 'utf8');
const carousel = await readFile(new URL('../public/twelvecheck-launch-checklist-carousel.pdf', import.meta.url));
const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const evidenceWorkbook = await readFile(new URL('../products/evidence-kit/twelvecheck-evidence-workbook.html', import.meta.url), 'utf8');
const evidenceStart = await readFile(new URL('../products/evidence-kit/START-HERE.md', import.meta.url), 'utf8');
const evidenceManifest = await readFile(new URL('../products/evidence-kit/MANIFEST.txt', import.meta.url), 'utf8');
const evidenceCover = await readFile(new URL('../public/evidence-kit-cover.png', import.meta.url));
const evidenceThumbnail = await readFile(new URL('../public/evidence-kit-thumbnail.png', import.meta.url));

const requiredCopy = [
  'Catch launch blockers before your buyers do.',
  'Twelve normal-user checks',
  'No security testing',
  '$44.50 deposit',
  'One journey. Four checks. Four hours.',
  'Illustrative sample using a fictional product',
];

const missing = requiredCopy.filter((text) => !app.includes(text) && !sample.includes(text));
if (missing.length) throw new Error(`Missing required copy: ${missing.join(', ')}`);
if (!css.includes('@media (max-width: 720px)')) throw new Error('Mobile breakpoint missing');
if (!app.includes('aria-expanded')) throw new Error('FAQ accessibility state missing');
if (!app.includes('localStorage.setItem')) throw new Error('Intake persistence missing');
if (!app.includes('buildPrefilledReservationUrl')) throw new Error('Prefilled reservation handoff missing');
if (!app.includes('buildEmailReservationUrl')) throw new Error('Private email reservation handoff missing');
if (!app.includes('journeyCount !== 3')) throw new Error('Exact three-journey validation missing');
if (!app.includes('deposit confirms final scope and starts the 12-hour clock')) throw new Error('Payment and delivery-clock boundary missing');
if (!app.includes('VITE_MINI_CHECKOUT_URL')) throw new Error('Mini-review checkout configuration missing');
if (!checklist.includes('A 12-point SaaS launch checklist.')) throw new Error('Indexable launch checklist missing');
if (!checklist.includes('twelvecheck-launch-checklist-carousel.pdf')) throw new Error('Downloadable carousel link missing');
if (!index.includes('twelvecheck-free-guide') || !checklist.includes('twelvecheck-free-guide')) throw new Error('Free Gumroad guide conversion path missing');
if (carousel.length < 50000 || carousel.subarray(0, 4).toString() !== '%PDF') throw new Error('Downloadable carousel PDF is invalid');
if (!sitemap.includes('saas-launch-checklist.html')) throw new Error('Checklist missing from sitemap');
if (!index.includes('twelvecheck-mini') || !index.includes('"price": "39"')) throw new Error('Mini-review structured offer missing');
if (!app.includes('VITE_KIT_URL') || !app.includes('Get the instant Evidence Kit — $9')) throw new Error('Evidence Kit purchase path missing');
if (!index.includes('twelvecheck-evidence-kit') || !index.includes('"price": "9"')) throw new Error('Evidence Kit structured offer missing');
if (!checklist.includes('twelvecheck-evidence-kit')) throw new Error('Evidence Kit checklist conversion path missing');

const evidenceChecks = [
  'Value is obvious in five seconds',
  'Headline matches the product',
  'Primary action is unambiguous',
  'Mobile first screen holds',
  'Sign up or log in works',
  'First key action succeeds',
  'Recovery path is clear',
  'Empty states guide forward',
  'Pricing path is consistent',
  'Launch promise matches the build',
  'Confirmations explain next steps',
  'Obvious accessibility blockers are absent',
];
const missingEvidenceChecks = evidenceChecks.filter((title) => !evidenceWorkbook.includes(title));
if (missingEvidenceChecks.length) throw new Error(`Evidence Kit checks missing: ${missingEvidenceChecks.join(', ')}`);
if (!evidenceWorkbook.includes("connect-src 'none'")) throw new Error('Evidence Kit network-blocking CSP missing');
if (!evidenceWorkbook.includes('localStorage.setItem')) throw new Error('Evidence Kit local persistence missing');
if (!evidenceWorkbook.includes('Export Markdown report') || !evidenceWorkbook.includes('Export CSV log') || !evidenceWorkbook.includes('Back up JSON')) {
  throw new Error('Evidence Kit exports missing');
}
if (/\bfetch\s*\(|XMLHttpRequest|<script[^>]+src=|<link[^>]+href=/i.test(evidenceWorkbook)) {
  throw new Error('Evidence Kit unexpectedly contains a network-capable dependency');
}
if (!evidenceStart.includes('public URLs and safe test data only')) throw new Error('Evidence Kit safety boundary missing');
for (const file of ['START-HERE.md', 'twelvecheck-evidence-workbook.html', 'evidence-log.csv', 'finding-template.md', 'walkthrough-script.md', 'sample-project-backup.json', 'LICENSE.txt', 'VERSION.txt']) {
  if (!evidenceManifest.includes(file)) throw new Error(`Evidence Kit manifest missing ${file}`);
}
if (evidenceCover.length < 100000 || evidenceThumbnail.length < 100000) throw new Error('Evidence Kit product artwork is unexpectedly small');

console.log('TwelveCheck validation passed: offer copy, scope, responsive UI, handoffs, checklist, free guide, carousel, sitemap, and offline Evidence Kit are present.');
