# Saha raporu — RediOS müşteri PWA (gayb-app), /app-hazirlik K5 turu, 6 Eyl 2026

uisight **0.31.0** · anonim: prod `redios.tr` (6 sayfa × iphone-15/pixel/desktop × light+dark) · oturumlu: `localhost:3125`
(worktree + Neon branch DB + OTP test-telefon, 9 sayfa) · keyboard-audit PASS · back-audit PASS · offline-audit FAIL (/me sonsuz iskelet).

## A. Ne bulundu (gerçek)
- Kontrast — sistemik: mercan `#e8503a` beyaz-metinli buton zemini ve beyaz üstünde link rengi 3.72:1; kök neden tek token
  (`globals.css --gayb-red`), 351 `text-gayb-red` + 185 `bg-gayb-red`. Ek: zinc-400 yardım metni 2.4–2.6 (109 kullanım),
  BottomNav etiketleri 9–10 px / 3.44, cüzdan kartı `#f16228` 3.24, kart-marka rozetleri 1.67–2.54. ~65 örnek / 15 sayfa → 4 token.
- Konsol hatası anonim her sayfada: `/api/v1/me/notifications-count` 401 (BottomNav/SideRail/QuickLinksGrid koşulsuz fetch).
- Dokunma hedefi <44 px sistematik: geri linkleri 20 px, "Çıkış yap"/"İptal et" 16 px, chip'ler 28–33 px, input 42 px.
- Rezervasyon "İptal et" onaysız DELETE + 40×16 hedef.
- /qr: `Permissions-Policy: camera=()` (K6 ile ortak; header definitif).

## B. Elenen yanlış-alarmlar (gerekçe)
- /discover 10 "covered control" + 4 "text behind control" = **kapalı akordiyon** (PNG'de yalnız MUTFAK açık).
- landing 5 "INVISIBLE TEXT 1.03:1" = **mercan gradient hero** (araç sayfa zeminini okuyor; PNG'de net beyaz metin).
- katlama çizgisinde sabit nav altındaki metinler (kaydırınca görünür; asıl ölçüm sayfa-sonu padding).
- "Hesabımı sil" (telefon yazarak onaylı) · "0" sayaçları · Next dev "N" göstergesi + `mixedLanguage` · sr-only "İçeriğe atla".
- /me "Apple ile giriş" 1.01:1 → disabled "Yakında" düğmesi (bilinçli).

## C. Düzeltilen
Fix partisi D (PR: hz/k5-uisight) — token kontrastı, nav etiketleri, dokunma hedefleri, anonim 401 kapısı, rezervasyon onayı, offline şeridi; aynı ölçüm tekrarı ile kapanış (bkz. gayb-app `docs/APP_HAZIRLIK_2026_09_06.md`).

## D. uisight'ın göremedikleri / bir sonraki kontrol adayları
1. **Kapalı akordiyon FP:** `display:none`/`height:0` içindeki kontroller "covered" sayılıyor → görünürlük (visibility/clip) kontrolü.
2. **Gradient zemin kontrast FP:** araç sayfa zeminini okuyor, gerçek arka plan görsel/gradient → bileşik zemin örnekleme.
3. **Sabit nav katlama-metni FP:** viewport dışına kayan metin "örtülü" değil → scroll-sonrası ikinci ölçüm ya da sayfa-sonu padding kontrolü.
4. **Dark tema piksel-aynı** → uygulama dark tema uygulamıyor; tek uyarı satırı ("iki tema aynı") yeterli, çift rapor değil.
5. **Dev-mode artefaktları** (Next "N" rozeti, mixedLanguage) → dev göstergelerini eleme listesi.
6. Panel `inspect`'te **konsol hatası yok** → konsolu `inspect` çıktısına ekle.
7. **signIn reçetesi** telefon+checkbox+OTP alanlarını dolduramıyor (yalnız email/code) → `phone`, `consentCheckbox`, `otp` alanları.
8. Git Bash `--path` ilk yolu sessiz düşürüyor; aynı dakikada aynı klasör adı → önceki rapor eziliyor (saniye ekle); `last-mobile.jpg` paneller arası ortak.
9. Headless'ta `BarcodeDetector` yok → kamera sayfaları her zaman fallback dalına düşer (gerçek cihaz gerekir; rapora "cihazda doğrula" etiketi).
10. **Kök-neden gruplaması:** aynı token'dan türeyen 65 ihlal tek satır olmalı ("`--gayb-red` 3.72:1 → 65 örnek") — fix maliyetini doğru gösterir.

## E. Karar — uisight oturumu, 14 Eyl 2026 (0.32.0)

Kural: iki projede tekrar eden kontrol olur; düz hata tekrar beklemez. Kontrol değişikliği gerçek sayfalarda
önce/sonra ölçülmeden girmez.

| # | Madde | Durum | Gerekçe / ölçüm |
|---|---|---|---|
| 1 | Kapalı akordiyon FP | BEKLİYOR | Tek proje, ikinci sayfada ölçülmedi |
| 2 | Gradient zemin FP | **YAPILDI** | Kök sebep gradient değil, metnin altındaki absolute kardeş / `::before` katmanı. Katman araması: 7 canlı sitede redios 5→0, noben 5→4, paladyn 4→4, dördü değişmedi. 14 "görünmez" bulgunun 6'sı yanlış alarmdı, 8'i gerçek |
| 3 | Sabit nav katlama-metni FP | BEKLİYOR | Tek proje |
| 4 | Dark tema piksel-aynı → tek satır | **YAPILDI** | Peyle'de tekrar etti (17 renk × 2 cihaz, değişen 0) |
| 5 | Dev-mode artefaktları (Next "N") | BEKLİYOR | Peyle dev sunucusunda rozet açıkken TEKRAR ETMEDİ |
| 6 | Panel `inspect`'te konsol yok | BEKLİYOR | Tek proje |
| 7 | signIn: telefon + onay kutusu + OTP | ADAY | Fiko'nun `tokenEndpoint` maddesiyle aynı aile ("reçete bu girişi yapamıyor") ama farklı alanlar — reçete genişletmesi olarak ayrı iş |
| 8 | Aynı dakika klasör ezme · `last-mobile.jpg` ortak · Git Bash `--path` | **YAPILDI** (düz hata) | Klasör saniye + atomik. Ortak dosya sandığımdan genişti: `inspect.json` ve **işaret klasörü** de ortakmış (bir projedeki not diğer projenin ajanına gidiyordu) — hepsi porta bağlandı. `--path` aslında konsola uyarı basıyordu ama rapora girmiyordu → artık raporda ölçülmemiş ekran |
| 9 | Headless'ta `BarcodeDetector` yok | BEKLİYOR | Tek proje |
| 10 | Kök-neden gruplaması (token başına tek satır) | BEKLİYOR | Tek proje; değeri yüksek |

**Yeni gözlem (aday):** kokart'ın dönen hero maketi — aynı motor, sayfanın hangi slaytta olduğuna göre 6 ya da 11
düşük kontrast buluyor. Animasyonlu içerikte ölçüm belirlenimci değil. Eski ve yeni motor aynı sayfa durumunda her
örnekte birebir aynı sonucu verdi, yani kod değişikliğiyle ilgisi yok.
