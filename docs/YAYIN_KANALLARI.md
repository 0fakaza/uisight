# uisight — nerede yayında

Son güncelleme: 5 Eylül 2026

## Paketler ve mağazalar

| Kanal | Kimlik | Adres |
|---|---|---|
| npm (ana paket) | `uisight` | https://www.npmjs.com/package/uisight |
| npm (sarmalayıcı) | `uisight-mcp` | https://www.npmjs.com/package/uisight-mcp |
| npm (sarmalayıcı) | `uisight-panel` | https://www.npmjs.com/package/uisight-panel |
| npm (sarmalayıcı) | `uisight-audit` | https://www.npmjs.com/package/uisight-audit |
| MCP resmi kaydı | `io.github.yusufcemres/uisight` | https://registry.modelcontextprotocol.io |
| Open VSX (Antigravity, Cursor, VSCodium, Windsurf) | `sololabstr.uisight` | https://open-vsx.org/extension/sololabstr/uisight |
| VS Code Marketplace | `sololabstr.uisight` | https://marketplace.visualstudio.com/items?itemName=sololabstr.uisight |
| Kaynak | `sololabstr/uisight` (MIT) | https://github.com/sololabstr/uisight |

Uzantı kimliği iki mağazada da `sololabstr.uisight` — kurulum sayıları ve
yorumlar ayrışmıyor.

## Yayın komutları

npm oturumu arada düşüyor. Önce kontrol et; düşmüşse `npm login`'i **tek başına** çalıştır:

```powershell
npm whoami        # "sololabs" yazmalı; E401 ise önce: npm login
```

Yayın — **tek satır olarak** yapıştır:

```powershell
cd c:\dev\uisight; npm publish; if ($?) { .\.tools\mcp-publisher.exe login github; if ($?) { .\.tools\mcp-publisher.exe publish } }
```

Üç tuzak (14 Eyl 2026'da üçüne de düşüldü):

- **Komutları alt alta ayrı satırlar hâlinde yapıştırma.** `npm login` / `npm publish` "Press ENTER" diye
  beklerken yapıştırılan bir sonraki satır o soruya cevap olarak gidiyor: npm `cd c:\dev\uisight` satırını
  kullanıcı adı sanıp girişi iptal etti, ardından `whoami` 401, `publish` 404 zincirleme geldi. Tek satırda
  `;` ile zincirlenince arada basılan ENTER doğrudan npm'e gider, `if ($?)` de npm başarısızsa MCP'yi atlar.
- **MCP adımı 400 "version '0.x.y' was not found" verirse kod hatası değil.** Kayıt npm'i yayından hemen sonra
  doğruluyor, npm ise "birkaç dakika sürebilir" diyor. Bir dakika bekleyip yalnız
  `.\.tools\mcp-publisher.exe publish` yeterli — giriş token'ı yerinde, yeniden `login` gerekmez.
- **MCP token'ı bir saat kadar sonra düşüyor;** uzun aradan sonra `login` komutun içinde olmalı, yoksa 401.

Ajan kabuğundan: `npm publish` yapılamıyor — 2FA bağlantısı araç çıktısında `***` olarak gizleniyor ve npm,
etkileşimsiz kabukta onay beklemeden EOTP ile çıkıyor. MCP `publish` ise kullanıcı `login` olduktan sonra
ajan kabuğundan çalışıyor (token makinede).

Open VSX (bu makineden yapılabiliyor, token dosyada):

```bash
cd /c/dev/uisight/extension
npx @vscode/vsce package --no-dependencies --allow-missing-repository
export OVSX_PAT=$(cat /c/dev/AGENTS/.credentials/tokens/ovsx.txt)
npx ovsx publish uisight-<sürüm>.vsix
```

Yayından sonra kayıtta görünmesi ~2 dakika sürüyor; o aralıkta yeniden
yayımlamak "already published, but currently isn't active" diyor — kalıcı hata
değil, beklemek yeter.

VS Code Marketplace: **elle yükleme**. `vsce package` ile `.vsix` üret,
https://marketplace.visualstudio.com/manage/publishers/sololabstr adresinde
"New extension → Visual Studio Code" ile yükle. Doğrulama ~5 dakika. Otomatik
yayın için Personal Access Token gerekiyor ama bu makinede Azure DevOps
organizasyonu açılamadı, ve PAT'lar 1 Aralık 2026'da emekli oluyor — yerine
gelen Entra ID yolu CI için tasarlanmış. Elle yükleme resmi belgede geçerli bir
yol olarak sayılıyor.

## Henüz kayıtlı olmadığımız yerler

- **mcp.so** — gönderildi 5 Eyl: https://github.com/chatmcp/mcpso/issues/3955
  (şablon yok, serbest biçim; kabul görmüş bir gönderi örnek alındı). 14 Eyl
  itibarıyla hâlâ AÇIK, yorum yok.
- **Smithery** — güncel belgelerde `smithery.yaml` HİÇ geçmiyor; üç yayın türü
  var: hosted, external (URL) ve stdio için **MCPB paketi**. Depodaki dosya eski
  `startCommand` biçiminde, çalışıp çalışmadığı doğrulanmadı — silinmedi ama
  içine bu not yazıldı.
- 🔑 **MCPB paketi — asıl fırsat, ayrı iş.** `.mcpb` artık resmi MCP paket biçimi
  (modelcontextprotocol/mcpb). Yerel sunucuyu ZIP + manifest.json olarak
  paketliyor ve Claude Desktop / Claude Code / MCP for Windows'ta **tek tıkla
  kurulum** veriyor — yani her yeni kullanıcının JSON düzenleme adımı kalkıyor.
  Smithery'nin stdio kaydı da bunu istiyor. Üretim bağımlılıkları ~31 MB
  (playwright-core 14M + zod 5.9M + sdk 5.7M + playwright 5M), sıkıştırılmış
  paket 12-15 MB civarı beklenir; tarayıcılar dahil değil, ilk çalıştırma
  indirmesi yine geçerli. Tahmini yarım gün: manifest, `mcpb` CLI ile paketleme,
  gerçek bir kurulum denemesi, sürümde üreten CI adımı.
- **glama.ai/mcp** ve `punkpeye/awesome-mcp-servers` (PR) — düşük maliyetli iki
  vitrin daha, henüz yapılmadı.

## Kapananlar

- ✅ **Open VSX doğrulama rozeti** — namespace `sololabstr` artık `verified:true`; talep
  [#13032](https://github.com/EclipseFdn/open-vsx.org/issues/13032) KAPANDI (14 Eyl'de görüldü). Option 1
  kanıtıyla açılmıştı: Marketplace yayıncısı ve `package.json`'ın işaret ettiği depo aynı organizasyonda.
  Şablonun "talep eden hesapta 12 ay kamuya açık geçmiş" kutusu işaretlenmemişti (`yusufcemres` 25 Mart 2026
  açılışlı); gerekçe issue'da açıkça yazılmıştı ve engel olmadı.

## Sayılar

14 Eylül 2026 — sürümler: npm + MCP kaydı **0.32.0**, Open VSX + VS Code Marketplace **1.7.2**.

| Kanal | 14 Eyl | 5 Eyl |
|---|---|---|
| npm `uisight` | haftalık 1.134 · aylık 4.097 | haftalık 168 |
| npm sarmalayıcılar (aylık) | mcp 177 · panel 153 · audit 129 | — |
| Open VSX | 1.674 indirme · yorum 0 | 1.130 |
| VS Code Marketplace | 7 kurulum · 1 puan (5★) | — |
| GitHub | 127 yıldız · 10 fork · 0 açık issue | 102 yıldız |
| dev.to yazısı | 0 tepki · 0 yorum | — |

🔴 npm sayısını dış kullanım sanma: `/app-hazirlik` her projede `npx uisight` koşuyor ve sarmalayıcı kurulumları
ana paketi ikinci kez sayıyor. Dış kullanımın daha temiz sinyali Open VSX indirmesi ile GitHub yıldızı.
