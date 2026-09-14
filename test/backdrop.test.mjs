/**
 * What is painted under a piece of text is often not its ancestors.
 *
 * The contrast checks walked only up the DOM. Heroes are rarely built that
 * way: the photo and its gradient sit in an absolutely positioned sibling, or
 * in a ::before on the section, and every ancestor of the copy is transparent
 * down to a near-white page.
 *
 * Ground truth, probed element by element on three live sites: of fourteen
 * "invisible text" findings, six were that — five on redios.tr (white copy over
 * a photograph, reported at 1.03:1) and a blue button on noben built from an
 * absolute layer. The other eight were real and must stay: 10% black watermark
 * numerals on paladyn, faint step digits on white on noben. One of those digits
 * was first mistaken for a false alarm — a text search found a different "1"
 * sitting over the dark hero; the one the engine reported is on a white card.
 *
 * The cases below are modelled on those, plus two that the first version of
 * this fix got wrong: an avatar initial on its own circle, and a glass badge.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { INSPECTION_SCRIPT, PERMISSION_HOOKS, PROFILES, deviceSettings } from '../src/cli.mjs';

let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser?.close(); });

async function olc(govde) {
  const ctx = await browser.newContext({ ...deviceSettings(PROFILES.pixel.pw) });
  const page = await ctx.newPage();
  await page.addInitScript(PERMISSION_HOOKS);
  try {
    await page.setContent(`<body style="margin:0;background:#fff;font-family:sans-serif">${govde}</body>`, { waitUntil: 'domcontentloaded' });
    return await page.evaluate(INSPECTION_SCRIPT, { mobile: true, theme: 'light' });
  } finally {
    await ctx.close();
  }
}

const bul = (d, metin) => ({
  gorunmez: (d.invisibleText || []).filter((x) => x.text === metin),
  dusuk: (d.lowContrast || []).filter((x) => x.text === metin),
});

const MERCAN = 'linear-gradient(135deg,#e8503a,#f16228)';
const GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

test('a photograph under the copy cannot be measured from CSS, so nothing is said', async () => {
  // redios.tr: five of these, each reported as invisible at 1.03:1.
  const d = await olc(`
    <section style="position:relative;height:320px">
      <img src="${GIF}" style="position:absolute;inset:0;width:100%;height:100%">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6),transparent)"></div>
      <div style="position:relative;padding:40px"><p style="color:#fff;font-size:16px">Şehrini keşfet</p></div>
    </section>`);
  const s = bul(d, 'Şehrini keşfet');
  assert.deepEqual(s.gorunmez, [], 'a photo underneath is not white');
  assert.deepEqual(s.dusuk, [], 'and it is not measurable either — silence, not a guess');
});

test('an absolute gradient sibling is measured, and the real ratio is reported', async () => {
  // Not silenced: white on this coral really is about 3.5:1, which fails for
  // 16px text. The finding changes from "invisible" to the true low contrast.
  const d = await olc(`
    <section style="position:relative">
      <div style="position:absolute;inset:0;background:${MERCAN}"></div>
      <div style="position:relative;padding:40px"><p style="color:#fff;font-size:16px">Mercan zemin</p></div>
    </section>`);
  const s = bul(d, 'Mercan zemin');
  assert.deepEqual(s.gorunmez, [], `white on coral is not invisible: ${JSON.stringify(s.gorunmez)}`);
  assert.equal(s.dusuk.length, 1, 'but at 16px it does fail, and must still be reported');
  assert.ok(s.dusuk[0].ratio > 3 && s.dusuk[0].ratio < 4, `measured against the coral, got ${s.dusuk[0].ratio}:1`);
});

test('a ::before gradient on the section is seen', async () => {
  const d = await olc(`
    <style>
      .hero { position:relative; isolation:isolate; padding:40px }
      .hero::before { content:""; position:absolute; inset:0; background:${MERCAN}; z-index:-1 }
    </style>
    <section class="hero"><p style="color:#fff;font-size:16px">Sozde zemin</p></section>`);
  const s = bul(d, 'Sozde zemin');
  assert.deepEqual(s.gorunmez, [], 'the pseudo-element is what the copy sits on');
  assert.equal(s.dusuk.length, 1);
  assert.ok(s.dusuk[0].ratio > 3 && s.dusuk[0].ratio < 4, `measured against the coral, got ${s.dusuk[0].ratio}:1`);
});

test('a layer the pointer cannot hit still paints', async () => {
  // noben: the dark hero layers are pointer-events:none, which is exactly why
  // this cannot be done with elementsFromPoint.
  const d = await olc(`
    <div style="position:relative">
      <div style="position:absolute;inset:0;background:#050914;pointer-events:none"></div>
      <div style="position:relative;padding:40px"><span style="color:#cad5e2;font-size:14px">1</span></div>
    </div>`);
  const s = bul(d, '1');
  assert.deepEqual(s.gorunmez, [], 'light grey on near-black is readable');
  assert.deepEqual(s.dusuk, []);
});

test('a button painted by a negative z-index layer is not white on white', async () => {
  // noben: "Pilot başvurusu", reported at 1:1.
  const d = await olc(`
    <div style="padding:20px">
      <button style="position:relative;isolation:isolate;background:transparent;border:0;color:#fff;font-size:16px;padding:12px 20px">
        <span style="position:absolute;inset:0;background:#1d5ad7;border-radius:8px;z-index:-1"></span>Pilot başvurusu
      </button>
    </div>`);
  const s = bul(d, 'Pilot başvurusu');
  assert.deepEqual(s.gorunmez, [], 'white on #1d5ad7 is about 6:1');
  assert.deepEqual(s.dusuk, []);
});

test('white copy on plain white, with nothing underneath, is still invisible', async () => {
  const d = await olc('<div style="padding:40px"><p style="color:#fff;font-size:16px">Kaybolan metin</p></div>');
  assert.equal(bul(d, 'Kaybolan metin').gorunmez.length, 1, 'the check must not go quiet on a real one');
});

test('a faint watermark numeral is still invisible', async () => {
  // paladyn: "01" to "04" at 10% black on white. Deliberate, and genuinely
  // near-invisible — whether that is acceptable is a design call, not ours.
  const d = await olc('<div style="padding:40px;background:#fff"><span style="color:rgba(0,0,0,.1);font-size:30px;font-weight:800">01</span></div>');
  assert.equal(bul(d, '01').gorunmez.length, 1);
});

test('a layer that comes after the copy covers it, and is not its backdrop', async () => {
  // A positioned element later in the DOM paints over static text. Treating it
  // as the background would turn a hidden line into a readable one.
  const d = await olc(`
    <div style="position:relative;padding:40px">
      <p style="color:#fff;font-size:16px">Ortulen metin</p>
      <div style="position:absolute;inset:0;background:#111"></div>
    </div>`);
  assert.equal(bul(d, 'Ortulen metin').gorunmez.length, 1, 'the covering layer is not what the text sits on');
});

test('text on its own opaque background is measured against it, whatever is layered further back', async () => {
  // paladyn: an avatar initial — a white "C" on its own amber circle, on a card
  // with a faint positioned decoration behind it. The first version of the
  // layer search reached past the circle to the decoration and the card, and
  // reported white on #e5e5e5 at 1.26:1. The circle hides everything behind it;
  // white on this amber is about 2:1 — the real number, and it still fails.
  const d = await olc(`
    <div style="position:relative;background:#fff;padding:40px">
      <span style="position:absolute;inset:0;background:rgba(0,0,0,.1)"></span>
      <div style="position:relative">
        <span style="display:flex;width:48px;height:48px;align-items:center;justify-content:center;background:#f5a623;color:#fff;font-size:20px;font-weight:700">C</span>
      </div>
    </div>`);
  const s = bul(d, 'C');
  assert.deepEqual(s.gorunmez, [], `the circle is not white: ${JSON.stringify(s.gorunmez)}`);
  assert.equal(s.dusuk.length, 1, 'white on amber does fail for large text, and must be reported');
  assert.ok(s.dusuk[0].ratio > 1.9 && s.dusuk[0].ratio < 2.2, `measured against the amber circle, got ${s.dusuk[0].ratio}:1`);
});

test('a translucent badge between the copy and the layer below still tints it', async () => {
  // Modelled on noben's frosted-glass badge over a near-black phone screen, with
  // the glass turned up to 12% so its effect is measurable: without the glass
  // in the composite this reads about 4.04:1, with it about 3.83:1. On noben
  // itself the glass is 1-8% white and moves the number by a hundredth; what
  // changed there was measuring the dark screen under the badge at all.
  const d = await olc(`
    <div style="position:relative;background:#162c6d;padding:80px">
      <div style="position:absolute;inset:7px;background:#050914"></div>
      <div style="position:absolute;left:20px;top:20px;background:rgba(255,255,255,.12);padding:8px;z-index:30">
        <p style="margin:0;color:rgba(191,219,254,.5);font-size:10px">Cam rozet</p>
      </div>
    </div>`);
  const s = bul(d, 'Cam rozet');
  assert.equal(s.dusuk.length, 1, `this copy fails at 10px either way: ${JSON.stringify(s)}`);
  assert.ok(s.dusuk[0].ratio > 3.6 && s.dusuk[0].ratio < 3.95, `the glass has to be in the composite, got ${s.dusuk[0].ratio}:1`);
});
