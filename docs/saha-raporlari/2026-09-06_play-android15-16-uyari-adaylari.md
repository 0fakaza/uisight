# Saha notu — Play Console Android 15/16 uyarıları: uisight'ı ilgilendiren kısım (6 Eyl 2026)

**Kim:** c:\dev kök oturumu (/app-hazirlik komut seti kurulurken) · **Kaynak:** Play Console "Sürüm kontrol paneli",
Kokart 3 (1.0.2) — aynı 4 uyarı Noben ve FiKo'da da çıktı (üç proje → kural gereği "sıradaki kontrol adayı").

## Karar: 4 uyarının kendisi uisight'a GİRMEZ

| Play uyarısı | Katman | Nerede ölçülüyor |
|---|---|---|
| Uçtan uca ekran gösterilmeyebilir | Android pencere/insets | `app-hazirlik-kontrol.py` N16 + emülatörde göz |
| Deprecated `setStatusBarColor` vb. | Native kütüphane (androidbrowserhelper) | N16 (TWA'da kütüphane-içi, aksiyon yok) |
| Yön/yeniden-boyutlandırma kilidi | AndroidManifest / twa-manifest | N13 |
| R8 optimizasyonu | build.gradle | N14 + N15 (AGP) |

uisight web katmanını ölçer; gradle/manifest/native kütüphane onun işi değil. Zorlarsak araç kimliği bulanır.

## uisight'ta ZATEN olan (doğrulandı, `src/cli.mjs`)

- **"Under the notch / home indicator"** — `viewport-fit=cover` var ama `env(safe-area-inset-*)` hiç kullanılmamış → edge-to-edge'in
  WEB tarafındaki karşılığı bu; Android 15 zorunlu edge-to-edge ile daha da önem kazandı.
- `ipad` cihaz profili (tablet breakpoint).

## Sıradaki kontrol ADAYLARI (üç projede tekrar etti — uygulama kararı uisight oturumunda, 4+ gerçek sayfada ölçülmeden yayınlanmaz)

1. **Yatay / katlanabilir profil.** Play, yön kilidini kaldırtıyor → uygulamalar ilk kez landscape ve ~600-840dp
   (foldable açık, küçük tablet) görecek. Öneri: `--device fold` (ör. 673×841 dp, Pixel Fold açık) ve `--landscape`
   bayrağı; mevcut kontroller (taşma, 44px, örtme, alt çubuk) aynen koşar. Kokart/Noben/FiKo düzeni landscape'te hiç
   ölçülmedi — gerçek risk.
2. **Android sistem çubuğu insets simülasyonu.** iOS notch kontrolü var; Android'de durum çubuğu (24-48dp) + hareket
   çubuğu (gesture nav ~16-48dp) altına içerik giriyor mu? `--android-insets` ile üst/alt inset enjekte edip
   `safe-area-inset` kullanmayan sabit header/bottom-nav'ı işaretle. Bugün bu yalnız emülatörde gözle görülüyor.

Bu ikisi kabul görürse `/app-hazirlik` K5 ajanı `--device iphone-15,pixel,fold --landscape` ile koşar ve K1 N13
(yön kilidi kaldırıldı) ile K5 (yeni yönde düzen sağlam mı) birbirini kapatır.
