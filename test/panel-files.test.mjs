/**
 * Everything a panel writes to disk is keyed by its port.
 *
 * The token file always was. The last frame, the inspect dump and the marks
 * queue were not: every panel on the machine shared one folder for them. With
 * two projects open, a note a person pinned on one reached the agent working
 * on the other, and the "last-mobile.jpg" an agent was told to read belonged to
 * whichever panel had drawn a frame most recently. Reported from a field round
 * that ran several panels side by side.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const server = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'server.mjs'), 'utf8');

test('no panel file is shared between panels', () => {
  assert.ok(!server.includes("join(LIVE_DIR, 'inspect.json')"), 'the inspect dump is shared across panels');
  assert.ok(!server.includes("join(LIVE_DIR, 'marks')"), 'the marks queue is shared across panels');
  assert.ok(!server.includes('last-${o.id}.jpg'), 'the frame file is shared across panels');
});

test('each of them carries the port', () => {
  assert.ok(server.includes('marks-${PORT}'), 'marks queue');
  assert.ok(server.includes('last-${PORT}-${o.id}.jpg'), 'frame file');
  assert.ok(server.includes('inspect-${PORT}.json'), 'inspect dump');
});

test('the marks folder is defined after the port it depends on', () => {
  // It used to be defined near the top of the file, before PORT exists. Moving
  // the port into its name without moving the line would throw at load.
  const port = server.indexOf('const PORT =');
  const marks = server.indexOf('const MARKS_DIR =');
  assert.ok(port > 0 && marks > port, 'MARKS_DIR uses PORT, so it has to come after it');
});
