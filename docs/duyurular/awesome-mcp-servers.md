# awesome-mcp-servers PR taslağı

Hedef: `punkpeye/awesome-mcp-servers` · `README.md` · bölüm **📂 Browser Automation**
Yer: `- [softvoyagers/pageshot-api]` satırından hemen sonra, `- [SolveGate/solvegate-mcp]` satırından önce
(15 Eyl 2026'daki README'de satır 548 ile 549 arası). Akış: fork (`yusufcemres`) → dal `add-uisight` → tek satır ekle → PR.

## Eklenecek satır

```markdown
- [sololabstr/uisight](https://github.com/sololabstr/uisight) [![sololabstr/uisight MCP server](https://glama.ai/mcp/servers/sololabstr/uisight/badges/score.svg)](https://glama.ai/mcp/servers/sololabstr/uisight) 📇 🏠 - Measures UI instead of guessing from screenshots: opens a page in a local Playwright browser as a phone and a desktop at once and returns numbers, such as contrast against the real composited background, touch targets under 44px, covered controls, clipped text and overflow. It also taps, types and scrolls, and ships with a live side-by-side panel and a VS Code extension.
```

## PR başlığı

```text
Add sololabstr/uisight to Browser Automation 🤖🤖🤖
```

`🤖🤖🤖`: CONTRIBUTING, ajanın hazırladığı PR'lar için bu eki istiyor ve bunları hızlı birleştiriyor. Bu PR'ı ajan hazırlıyor, gönderim kullanıcının hesabından.

## PR açıklaması

```markdown
Adds [sololabstr/uisight](https://github.com/sololabstr/uisight) to **Browser Automation**, in alphabetical position between `softvoyagers/pageshot-api` and `SolveGate/solvegate-mcp`.

uisight is a local MCP server (Node, MIT) that opens a page in a real Playwright browser as a phone and a desktop at the same time, and returns measurements as text instead of screenshots: contrast against the actual composited background (gradients and layers under the text included), touch targets under 44px, controls covered by other elements, text clipped by its own container, horizontal overflow, and console/network errors on that screen. It can also tap, type and scroll. The same engine ships as a CLI and as a VS Code / Open VSX extension.

- npm: `uisight` · MCP registry: `io.github.yusufcemres/uisight`
- Glama: https://glama.ai/mcp/servers/sololabstr/uisight

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
