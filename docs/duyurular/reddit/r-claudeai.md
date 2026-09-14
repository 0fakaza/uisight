Every UI session went the same way. I'd send Claude a screenshot, it would say "fixed", I'd open the page on my phone and it was still broken.

That's not Claude being careless. A model can *see* a screenshot, but it can't *measure* one. Is that text readable? Is that button big enough for a thumb? From pixels it can only guess, and it guesses confidently.

So I built uisight with Claude Code, and now Claude uses it over MCP to check its own work.

>>> [GÖRSEL 1: live-panel.png — bu satırı sil, görseli buraya yükle] <<<

**Screenshot vs measurement**

| | From a screenshot | From uisight |
|---|---|---|
| Contrast | "the text looks readable" | `3.47:1`, threshold 4.5 |
| Button size | "buttons look fine" | `23x36`, under the 44px minimum |
| Phone and desktop | one at a time, if you remember | side by side, live |
| A button something covers | invisible in a still image | flagged, with the element named |
| Cost | an image re-sent every turn | a few lines of text |

The loop becomes: Claude edits, uisight measures the phone and the desktop, Claude reads the numbers, repeat. I stopped pasting screenshots.

**The bug no test caught**

Halfway through, I opened the live panel myself and the phone looked wrong. It was: the panel was drawing a 412px phone at 792px, nearly twice its real size. A 44px button looked like 85px. The one view whose whole purpose is judging a phone layout was lying about it.

>>> [GÖRSEL 2: frame-scale.png — bu satırı sil, görseli buraya yükle] <<<

No test caught it. My eyes did. That turned out to be the lesson of the whole project: measurement alone isn't enough, and eyes alone aren't either. The tool now puts both on one screen, the numbers next to the live picture.

**How Claude was involved:** built with Claude Code, and the MCP server is made for Claude Code first. It works with other MCP clients too.

**Try it**

    claude mcp add --scope user uisight -- npx -y -p uisight@latest uisight-mcp

Then ask Claude to inspect your page on a phone and a desktop. Free, MIT, runs locally, no account.

GitHub: https://github.com/sololabstr/uisight
