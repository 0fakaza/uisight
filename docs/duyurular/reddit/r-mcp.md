My agent kept looking at a screenshot, saying "fixed", and the page was still broken on a phone. A model can see a screenshot but it can't measure one. It doesn't know a contrast ratio or how big a button is. It guesses.

So I built **uisight**: an MCP server that opens your page in a real browser as a phone and a desktop at the same time, and hands the agent numbers instead of pixels.

>>> [GÖRSEL 1: live-panel.png — bu satırı sil, görseli buraya yükle] <<<

**What the agent gets back**

| Check | Instead of | It returns |
|---|---|---|
| Contrast | "looks readable" | `3.47:1`, measured against the real background behind the text, gradients and layers included |
| Touch targets | "buttons seem fine" | `23x36 (<44px)`, with the element named |
| Covered controls | nothing | the button something else is painting over |
| Clipped text | nothing | text cut off by its own container |
| Layout | "it's responsive" | horizontal overflow, text under 12px, notch and Android edge-to-edge insets |
| Runtime | nothing | console errors and failed requests on that screen |

It can also act on the page: tap, type, scroll, switch device. So the loop is change the code, look, measure, repeat, without me pasting screenshots.

**Tool cost**, since this is r/mcp: schemas go out with every request whether the tools get called or not. The full set is 9 tools at roughly 1,000 tokens. `UISIGHT_TOOLS=core` keeps 4 of them (goto, inspect, see_screen, status) for less than half of that. Frames are captured below 1:1 on purpose, because an image stays in the context and is re-sent on every later turn.

**The first seven bugs it found were its own**

I pointed it at three sites it had never seen. The report said `Records with automated findings: 8/4`. Eight out of four. After that: two copies of the same label logic that disagreed, an icon font's ligature name (`light_mode`) showing up as a button label, and the README's headline install command naming an npm *bin* instead of a package. Every new user got a 404 on step one, and the name it pointed at was unowned, so anyone could have published something there. The names are registered now.

142 tests passed through all of it. Every function agreed with itself; the bugs lived between them.

>>> [GÖRSEL 2: gallery.png — bu satırı sil, görseli buraya yükle] <<<

That's the CLI version: every device and both themes in one pass, each card with its own findings.

**Install**

Claude Code:

    claude mcp add --scope user uisight -- npx -y -p uisight@latest uisight-mcp

Any other client (Cursor, Windsurf, Claude Desktop), under `mcpServers`:

    "uisight": { "command": "npx", "args": ["-y", "-p", "uisight@latest", "uisight-mcp"] }

MIT, runs entirely on your machine, no account. The first run offers to download the browser engine.

GitHub: https://github.com/sololabstr/uisight

Write-up of the seven bugs: https://dev.to/yusufcemres/i-pointed-my-ui-auditing-tool-at-three-sites-it-had-never-seen-all-seven-bugs-it-found-were-its-12cb

If a check fires where it shouldn't, bottom nav bars especially, that's the report I want most.
