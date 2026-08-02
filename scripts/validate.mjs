import {readFile} from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
const sample = await readFile(new URL('../public/twelvecheck-sample-proof-pack.html', import.meta.url), 'utf8');
const checklist = await readFile(new URL('../public/saas-launch-checklist.html', import.meta.url), 'utf8');
const carousel = await readFile(new URL('../public/twelvecheck-launch-checklist-carousel.pdf', import.meta.url));
const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');

const requiredCopy = [
  'Catch the launch blockers your own eyes stopped seeing.',
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
if (carousel.length < 50000 || carousel.subarray(0, 4).toString() !== '%PDF') throw new Error('Downloadable carousel PDF is invalid');
if (!sitemap.includes('saas-launch-checklist.html')) throw new Error('Checklist missing from sitemap');
if (!index.includes('twelvecheck-mini') || !index.includes('"price": "39"')) throw new Error('Mini-review structured offer missing');

console.log('TwelveCheck validation passed: offer copy, scope, responsive UI, exact intake validation, private/public handoffs, checklist, downloadable carousel, and sitemap present.');
