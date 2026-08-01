import {useEffect, useState} from 'react';

const CHECKOUT_URL = import.meta.env.VITE_CHECKOUT_URL || '';
const RESERVATION_URL = import.meta.env.VITE_RESERVATION_URL || 'https://github.com/mshafei721/twelvecheck/issues/new?template=launch-slot.yml&title=Launch+slot+request';

function buildPrefilledReservationUrl(form) {
  const requestUrl = new URL('https://github.com/mshafei721/twelvecheck/issues/new');
  let publicHost = 'public build';
  try { publicHost = new URL(form.url).hostname; } catch { /* browser validation handles malformed URLs */ }
  requestUrl.searchParams.set('title', `Launch slot request: ${publicHost}`);
  requestUrl.searchParams.set('body', [
    '## Public build URL',
    form.url,
    '',
    '## Planned launch time',
    form.launch,
    '',
    '## Three critical public journeys',
    form.journeys,
    '',
    '---',
    'I understand this request is public and TwelveCheck is normal-user observation, not security testing, certification, or a guarantee.',
  ].join('\n'));
  return requestUrl.toString();
}

const checkGroups = [
  {
    title: 'First contact',
    start: 1,
    items: [
      'Value is obvious in 5s',
      'Headline matches product',
      'Primary CTA is clear',
      'Mobile first screen holds',
    ],
  },
  {
    title: 'Core journey',
    start: 5,
    items: [
      'Sign up / log in works',
      'First key action succeeds',
      'Recovery path is clear',
      'Empty states guide forward',
    ],
  },
  {
    title: 'Launch truth',
    start: 9,
    items: [
      'Pricing path is consistent',
      'Launch promise matches product',
      'Confirmations explain next steps',
      'Obvious accessibility blockers',
    ],
  },
];

const issues = [
  {level: 'P0', title: 'Signup confirms nothing', time: '02 AUG 2026 08:45:11 UTC', body: 'After signup, users see the same page with no confirmation or next step.'},
  {level: 'P1', title: 'Mobile pricing CTA leaves the viewport', time: '02 AUG 2026 08:47:22 UTC', body: 'The primary CTA is cut off on a common mobile viewport, blocking the next action.'},
  {level: 'P2', title: 'Launch promise and onboarding disagree', time: '02 AUG 2026 08:50:03 UTC', body: 'The homepage promises “ship faster”; onboarding starts with “set up your profile”.'},
];

const timeline = [
  ['00:00', 'Intro'],
  ['00:10', 'Scope and approach'],
  ['00:28', 'Journey overview'],
  ['00:52', '[Issue P1] CTA cut off', true],
  ['01:24', 'Evidence: pricing on iPhone 14 Pro'],
  ['01:45', '[Issue P0] No confirmation', true],
  ['02:10', 'Evidence: signup flow'],
  ['02:30', '[Issue P2] Promise mismatch', true],
  ['02:50', 'What to fix next'],
  ['02:55', 'Wrap'],
];

const faqs = [
  ['What is public-build-only?', 'We review the same pages and flows a normal visitor can reach without credentials, admin access, source code, or private infrastructure.'],
  ['What do you not test?', 'No security testing, penetration testing, load testing, privileged access, certification, legal compliance review, or guarantee.'],
  ['What happens after I request a slot?', CHECKOUT_URL ? 'Send the public URL, launch time, and three critical journeys through the commission intake. We confirm scope, then deliver the evidence pack and walkthrough through Gumroad within 12 hours of acceptance.' : 'Your public request is checked against the scope. If accepted, you receive payment instructions; the 12-hour clock starts only after acceptance. No payment is taken by this website.'],
  ['Can you retest fixes?', 'Yes. One focused revision is included for fixes to issues found in the original review, if the public build remains accessible.'],
];

function SectionHeading({number, children}) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <h2>{children}</h2>
    </div>
  );
}

function CheckoutButton({className = '', children = 'Reserve my slot', onMissingCheckout}) {
  const handleClick = () => {
    if (CHECKOUT_URL) {
      window.open(CHECKOUT_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    onMissingCheckout?.();
    window.open(RESERVATION_URL, '_blank', 'noopener,noreferrer');
  };

  return <button type="button" className={`button button-primary ${className}`} onClick={handleClick}>{children}</button>;
}

export default function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({url: '', launch: '', journeys: ''});

  useEffect(() => {
    const saved = localStorage.getItem('twelvecheck-intake');
    if (saved) {
      try { setForm(JSON.parse(saved)); } catch { /* ignore malformed local data */ }
    }
  }, []);

  const scrollToIntake = () => document.querySelector('#intake')?.scrollIntoView({behavior: 'smooth'});

  const submitIntake = (event) => {
    event.preventDefault();
    const journeyCount = form.journeys.split(/\r?\n/).map(item => item.trim()).filter(Boolean).length;
    if (journeyCount < 3) {
      setStatus('Add three critical journeys, one per line, before checkout.');
      return;
    }
    localStorage.setItem('twelvecheck-intake', JSON.stringify(form));
    if (!CHECKOUT_URL) {
      setStatus('Intake validated. Opening a public GitHub slot request; include public information only. No payment is taken until scope acceptance.');
      window.open(buildPrefilledReservationUrl(form), '_blank', 'noopener,noreferrer');
      return;
    }
    setStatus('Intake saved on this device. Opening Gumroad commission checkout…');
    window.open(CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="TwelveCheck home">TwelveCheck</a>
        <nav aria-label="Primary navigation">
          <a href="#sample">Sample</a>
          <a href="#scope">Scope</a>
          <a href="#faq">FAQ</a>
          <button type="button" className="button button-primary nav-cta" onClick={scrollToIntake}>Reserve a slot</button>
        </nav>
      </header>

      <main id="top">
        <section className="hero page-pad" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">12-hour public-build preflight</p>
            <h1 id="hero-title">Catch the launch blockers your own eyes stopped seeing.</h1>
            <p className="lede">A human, public-build review for SaaS founders launching in the next 72 hours. Twelve normal-user checks. Evidence, not a score.</p>
            <button type="button" className="button button-primary hero-button" onClick={scrollToIntake}>Reserve a launch slot — $89</button>
            <a className="button button-secondary hero-button" href="#sample">See the sample proof pack</a>
            <p className="micro">12-hour turnaround <span>·</span> Public build only <span>·</span> No security claims</p>
          </div>

          <article className="report-card" aria-label="Synthetic TwelveCheck sample verdict">
            <div className="report-meta">
              <span>SAMPLE · TC-001 · 02 AUG 2026 · PUBLIC BUILD</span>
              <strong>SAMPLE</strong>
            </div>
            <h2>Verdict: <span>2 launch blockers</span></h2>
            <div className="report-table" role="table" aria-label="Sample findings">
              <div className="report-row report-head" role="row"><span>ID</span><span>SEVERITY</span><span>FINDING</span><span>STATUS</span></div>
              <div className="report-row report-alert" role="row"><span>01</span><span>P0</span><span>Signup confirms nothing</span><span>LAUNCH BLOCKER</span></div>
              <div className="report-row" role="row"><span>02</span><span>P1</span><span>Mobile pricing CTA leaves the viewport</span><span>SHOULD FIX</span></div>
              <div className="report-row" role="row"><span>03</span><span>P2</span><span>Launch promise and onboarding disagree</span><span>NICE TO FIX</span></div>
            </div>
            <div className="report-footer"><span>Generated: 02 AUG 2026 09:14 UTC by TwelveCheck</span><span>PUBLIC BUILD</span></div>
          </article>
        </section>

        <section id="scope" className="numbered-section page-pad">
          <SectionHeading number="01">Twelve checks. Three moments that matter.</SectionHeading>
          <div className="checks-grid">
            {checkGroups.map((group) => (
              <article className="check-group" key={group.title}>
                <h3>{group.title}</h3>
                <ol start={group.start}>{group.items.map(item => <li key={item}>{item}</li>)}</ol>
              </article>
            ))}
          </div>
          <p className="scope-note">Normal-user observation only. No security testing, load testing, privileged access, certification, or guarantee.</p>
        </section>

        <section id="sample" className="numbered-section page-pad">
          <SectionHeading number="02">A proof pack your team can fix from.</SectionHeading>
          <p className="sample-disclosure">Illustrative sample using a fictional product. It shows the deliverable format; it is not a customer result.</p>
          <div className="proof-grid">
            <article className="proof-column">
              <h3>Evidence (timestamped)</h3>
              <div className="evidence-frame">
                <div className="browser-line"><span>https://example.app/pricing</span><span>iPhone 14 Pro · 390×844</span></div>
                <div className="phone-shell" aria-label="Synthetic ExampleApp mobile pricing screen">
                  <div className="phone-notch">9:41</div>
                  <div className="phone-nav"><strong>ExampleApp</strong><span>☰</span></div>
                  <div className="phone-copy">
                    <h4>Simple pricing,<br/>serious value.</h4>
                    <p>Everything you need to ship faster and scale smarter.</p>
                  </div>
                  <div className="price-box">
                    <strong>Pro</strong>
                    <div><b>$19</b> / month</div>
                    <small>Billed monthly. Cancel anytime.</small>
                    <ul><li>Unlimited projects</li><li>Advanced analytics</li><li>Priority support</li></ul>
                    <button type="button" tabIndex="-1">Get started</button>
                  </div>
                  <div className="issue-outline" aria-hidden="true"></div>
                </div>
                <div className="evidence-stamp">02 AUG 2026 08:47:22 UTC · STEP 6 OF 12</div>
              </div>
            </article>

            <article className="proof-column issues-column">
              <h3>Issues found</h3>
              {issues.map(issue => (
                <div className="issue" key={issue.level}>
                  <span className={`severity ${issue.level.toLowerCase()}`}>{issue.level}</span>
                  <div><h4>{issue.title}</h4><time>{issue.time}</time><p>{issue.body}</p></div>
                </div>
              ))}
            </article>

            <article className="proof-column">
              <h3>3-minute walkthrough</h3>
              <ol className="timeline">
                {timeline.map(([time, label, alert]) => <li className={alert ? 'timeline-alert' : ''} key={time}><time>{time}</time><span>{label}</span></li>)}
              </ol>
              <a className="text-link" href={`${import.meta.env.BASE_URL}twelvecheck-sample-proof-pack.html`} target="_blank" rel="noreferrer">Open printable sample proof pack ↗</a>
            </article>
          </div>
        </section>

        <section id="intake" className="numbered-section page-pad">
          <SectionHeading number="03">Three slots. One revision. No scope drift.</SectionHeading>
          <div className="offer-grid">
            <article className="price-column">
              <p className="price">$89</p>
              <p><strong>Human review of your public build</strong></p>
              <p>{CHECKOUT_URL ? '50% Gumroad commission deposit ($44.50) collected at checkout.' : '50% commission deposit ($44.50) is due only after scope acceptance.'}</p>
              <h3>Includes</h3>
              <ul className="plain-list"><li>Twelve normal-user checks</li><li>Timestamped evidence</li><li>P0 / P1 / P2 issue list</li><li>3-minute walkthrough</li><li>One revision within scope</li></ul>
            </article>

            <form className="intake-form" onSubmit={submitIntake}>
              <h3>Intake details</h3>
              <label>Public URL <small>(must be accessible without login)</small>
                <input type="url" required placeholder="https://your-app.com" value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
              </label>
              <label>Launch time <small>(within 72 hours)</small>
                <input type="text" required placeholder="e.g. 04 Aug 2026 14:00 UTC" value={form.launch} onChange={e => setForm({...form, launch: e.target.value})} />
              </label>
              <label>Three critical journeys <small>(one per line)</small>
                <textarea required rows="5" placeholder={'1. Sign up → Create workspace\n2. Invite teammate\n3. Create first project'} value={form.journeys} onChange={e => setForm({...form, journeys: e.target.value})} aria-describedby="journey-hint"></textarea>
                <small id="journey-hint">Exactly three lines keeps the review bounded.</small>
              </label>
              <button className="button button-primary" type="submit">{CHECKOUT_URL ? 'Continue to checkout — $44.50 deposit' : 'Request a slot — no payment yet'}</button>
              {status && <p className="form-status" role="status">{status}</p>}
              {!CHECKOUT_URL && <p className="form-privacy">Fallback requests open as public GitHub issues. Include public-build information only—never credentials, private URLs, customer data, or secrets.</p>}
            </form>

            <article className="about-column">
              <h3>About the review</h3>
              <p>Human review of your live, public build. We follow twelve normal-user checks and capture evidence along the way.</p>
              <p>This is not a security audit, pen test, certification, or guarantee.</p>
              <CheckoutButton onMissingCheckout={() => setStatus('Opening the public slot-request form. No payment is taken until scope acceptance.')}>{CHECKOUT_URL ? 'Reserve my slot' : 'Request my slot'}</CheckoutButton>
              <p>{CHECKOUT_URL ? 'If the public build is inaccessible or outside scope, the commission is rejected and the deposit refunded.' : 'If the public build is inaccessible or outside scope, the request is declined. No payment is taken.'}</p>
            </article>
          </div>
        </section>

        <section id="faq" className="numbered-section page-pad faq-section">
          <SectionHeading number="04">FAQ</SectionHeading>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <article className="faq-item" key={question}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)}>
                    <span>{index + 1}. &nbsp;{question}</span><span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <p>{answer}</p>}
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer page-pad"><span>TwelveCheck</span><span>·</span><span>observed release evidence, not assurance.</span></footer>
    </>
  );
}
