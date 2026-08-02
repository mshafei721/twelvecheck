import {readFile} from 'node:fs/promises';

const workbook = await readFile(new URL('../products/evidence-kit/twelvecheck-evidence-workbook.html', import.meta.url), 'utf8');
const start = await readFile(new URL('../products/evidence-kit/START-HERE.md', import.meta.url), 'utf8');
const manifest = await readFile(new URL('../products/evidence-kit/MANIFEST.txt', import.meta.url), 'utf8');

const checks = [
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

const missingChecks = checks.filter((title) => !workbook.includes(title));
if (missingChecks.length) throw new Error(`Evidence Kit checks missing: ${missingChecks.join(', ')}`);
if (!workbook.includes("connect-src 'none'")) throw new Error('Evidence Kit network-blocking CSP missing');
if (!workbook.includes('localStorage.setItem')) throw new Error('Evidence Kit local persistence missing');
if (!workbook.includes('Export Markdown report') || !workbook.includes('Export CSV log') || !workbook.includes('Back up JSON')) {
  throw new Error('Evidence Kit exports missing');
}
if (/\bfetch\s*\(|XMLHttpRequest|<script[^>]+src=|<link[^>]+href=/i.test(workbook)) {
  throw new Error('Evidence Kit unexpectedly contains a network-capable dependency');
}
if (!start.includes('public URLs and safe test data only')) throw new Error('Evidence Kit safety boundary missing');

for (const file of ['START-HERE.md', 'twelvecheck-evidence-workbook.html', 'evidence-log.csv', 'finding-template.md', 'walkthrough-script.md', 'sample-project-backup.json', 'LICENSE.txt', 'VERSION.txt']) {
  if (!manifest.includes(file)) throw new Error(`Evidence Kit manifest missing ${file}`);
}

console.log('TwelveCheck Evidence Kit validation passed: 12 checks, local persistence, offline boundary, exports, safety copy, and bundle manifest are present.');
