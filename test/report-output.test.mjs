/**
 * What the report says about a run, as opposed to what the page contains.
 *
 * Three from one field round (RediOS customer PWA, 6 September), all of them
 * places where the report was quietly less than the truth:
 *
 *  - the output folder was named to the minute, so a second run in the same
 *    minute wrote into the first one's folder and replaced its report;
 *  - a path Git Bash had rewritten was skipped with a console line that
 *    scrolled away, and the report simply had one screen fewer than asked for;
 *  - a page with no dark theme at all printed the same frozen elements once for
 *    every device, which reads as a pile of defects when it is one decision.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, readdirSync, rmSync, mkdtempSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(root, 'src', 'cli.mjs');
let server;
let port;
let kok;

// Fixed colours everywhere, and no prefers-color-scheme rule anywhere: this
// page does not have a dark theme.
const TEMASIZ = `<!doctype html><html><head><meta name="viewport" content="width=device-width"><title>tema yok</title></head>
<body style="margin:0;background:#fafafa;color:#111;font:16px sans-serif">
<header style="background:#1d5ad7;color:#fff;padding:12px">Başlık</header>
<nav style="background:#e5e7eb;color:#111;padding:8px">Menü</nav>
<main style="background:#ffffff;padding:16px">
  <h1 style="color:#111">Karanlık tema yok</h1>
  <p style="color:#374151">Bu sayfa karanlık temaya hiç tepki vermez.</p>
  <button style="background:#15803d;color:#fff;border:0;padding:12px 20px;min-height:48px">Kaydet</button>
</main>
<footer style="background:#111827;color:#f9fafb;padding:12px">Alt bilgi</footer>
</body></html>`;

before(async () => {
  server = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(TEMASIZ);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  port = server.address().port;
  kok = mkdtempSync(join(tmpdir(), 'uisight-rapor-'));
});

after(async () => {
  await new Promise((r) => server.close(r));
  try { rmSync(kok, { recursive: true, force: true }); } catch { /* windows tutuyor olabilir */ }
});

const cli = (cwd, ...args) => run(process.execPath, [CLI, `http://127.0.0.1:${port}/`, '--no-open', ...args], {
  cwd, env: { ...process.env, NO_UPDATE_NOTIFIER: '1' }, timeout: 180000,
});
const raporlar = (cwd) => {
  const d = join(cwd, 'uisight-outputs');
  return existsSync(d) ? readdirSync(d).map((x) => join(d, x)) : [];
};

test('two runs started together write two reports', async () => {
  const cwd = mkdtempSync(join(kok, 'ikiz-'));
  await Promise.all([
    cli(cwd, '--device', 'pixel', '--theme', 'light'),
    cli(cwd, '--device', 'pixel', '--theme', 'light'),
  ]);
  const klasorler = raporlar(cwd);
  assert.equal(klasorler.length, 2, `each run needs its own folder, got ${JSON.stringify(klasorler)}`);
  for (const k of klasorler) assert.ok(existsSync(join(k, 'REPORT.md')), `${k} has no report`);
});

test('a page with no dark theme gets one line, not a list per device', async () => {
  const cwd = mkdtempSync(join(kok, 'tema-'));
  await cli(cwd, '--device', 'pixel,galaxy', '--theme', 'both');
  const [klasor] = raporlar(cwd);
  const rapor = readFileSync(join(klasor, 'REPORT.md'), 'utf8');
  const satirlar = rapor.split('\n').filter((s) => s.includes('Dark theme is not wired up'));
  assert.equal(satirlar.length, 1, 'one decision, one line');
  assert.ok(satirlar[0].includes('pixel') && satirlar[0].includes('galaxy'), `both devices named on that line: ${satirlar[0]}`);
  assert.ok(!rapor.includes('IDENTICAL in both themes'), 'the per-element list is exactly what this replaces');
});

test('a path Git Bash rewrote is in the report, not only on the console', async () => {
  // Git Bash turns "/menu" into "C:/Program Files/Git/menu" before node ever
  // sees it. execFile passes the rewritten form straight through, which is the
  // same thing the tool receives.
  const cwd = mkdtempSync(join(kok, 'msys-'));
  await cli(cwd, '--path', 'C:/Program Files/Git/menu', '--device', 'pixel', '--theme', 'light');
  const [klasor] = raporlar(cwd);
  const rapor = readFileSync(join(klasor, 'REPORT.md'), 'utf8');
  assert.ok(rapor.includes('Git Bash rewrote'), 'the skipped screen has to be visible where people read results');
  assert.ok(rapor.includes('MSYS_NO_PATHCONV=1'), 'and say how to get it measured');
});
