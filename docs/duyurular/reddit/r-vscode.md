I build mostly mobile-first web apps, and I kept checking the phone layout last, on a real phone, after I thought I was done. So I made a panel that keeps both in view while I edit.

>>> [GÖRSEL 1: live-panel.png — bu satırı sil, görseli buraya yükle] <<<

**What it does**

- Opens your page (localhost works) as a phone and a desktop at the same time, live. Click a screen to tap, use the wheel to scroll, click first to type.
- **Inspect** measures every screen: contrast against the actual background, touch targets under 44px, text under 12px, controls something is painting over, text clipped by its container. Findings come back per device.
- Devices: iPhone (WebKit engine), Pixel, Galaxy, a landscape phone, a foldable, and desktop, in light and dark theme.
- The pin button drops a note plus the current frame into a queue your AI agent can read over MCP.

**Three shapes, same engine**

| Shape | Good for | Get it |
|---|---|---|
| Editor panel | watching phone and desktop while you code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=sololabstr.uisight) · [Open VSX](https://open-vsx.org/extension/sololabstr/uisight) (Cursor, Windsurf, VSCodium) |
| MCP server | letting an agent measure instead of guess | `npx -y -p uisight@latest uisight-mcp` |
| CLI | a one-shot audit of every device and theme | `npx uisight https://yourapp.com --theme both` |

**Three UI bugs I shipped in a UI-checking tool**

Someone using it reported each of these, and all three were embarrassing in the same way:

1. **"The mobile screen looks wrong."** The phone frame stretched to fill the side bar: a 412px phone drawn at 792px, so a 44px target looked like 85px. It's capped at the device width now.
2. **"The refresh button reopens the old site."** I had put a refresh icon on the panel switcher, a few pixels above the page's own refresh button. Two identical icons, two different actions. Exactly what the tool flags on other people's interfaces.
3. **"There's nowhere to choose."** I hid the panel switcher when only one panel was running. The only way to discover a second panel was a button on that hidden bar.

>>> [GÖRSEL 2: frame-scale.png — bu satırı sil, görseli buraya yükle] <<<

Two of those three were me hiding a control to keep things tidy and removing the only way back along with it. It's a written rule in the project now: before hiding a control, ask how you get back to that state without it.

MIT, runs locally, no account, nothing leaves your machine.

GitHub: https://github.com/sololabstr/uisight
