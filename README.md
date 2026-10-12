# Sundanese — Canva App

Aplikasi Canva yang mengonversi teks Latin ⇄ Aksara Sunda (Baku) dan
menambahkannya ke desain sebagai teks yang dapat diedit.

## Fitur
- **Dua arah**: Latin → Aksara Sunda dan Aksara Sunda → Latin
- **Font picker**: pilih font Sunda dari library Canva (Noto Sans Sundanese)
- **Tambah ke desain**: hasil konversi menjadi text element yang dapat diedit
- **Preset styling**: pilih gaya teks (No style / Invitation title / Body text / Small caption)
- **Aturan transliterasi**: panduan singkat aturan dasar (collapsible)
- **Error handling**: konversi, pemilihan font, dan tambah ke desain aman dari kegagalan
- **100% client-side**: tanpa backend, tanpa server, tanpa akun tambahan
- **App UI Kit**: tema light/dark otomatis, terjemahan UI via react-intl

> **Catatan i18n**: `defaultMessage` ditulis dalam **bahasa Inggris** (base language).
> Saat submit, Developer Portal hanya menerima `dist/messages_en.json`. Canva yang
> menerjemahkan ke bahasa lain (termasuk Indonesia) secara gratis setelah app
> disetujui — developer tidak bisa menyediakan terjemahan sendiri.
>
> Nama listing di Marketplace: **Sundanese** (aturan Canva: < 10 karakter).

## Teknologi
- React 19 + TypeScript (strict)
- Canva Apps SDK (`@canva/design`, `@canva/asset`, `@canva/app-ui-kit`)
- [sunda.js](https://github.com/masnormen/sunda.js) — library transliterasi
  Latin ⇄ Aksara Sunda Baku (MIT, ~2ms per kalimat)

## Pengembangan
```bash
npm install
npm start          # dev server di http://localhost:8080
npm run build      # production build ke dist/
npm run lint:check # eslint + tsc
npm test           # jest
```

## Preview di Canva
1. Login Canva CLI: `canva login`
2. Buat app: `canva apps create "Sundanese" --distribution=public`
3. Isi `CANVA_APP_ID` dan `CANVA_APP_ORIGIN` di `.env`
4. `npm start` lalu klik "Preview" di Developer Portal

## Struktur
```
src/
├── index.tsx                        # prepareDesignEditor()
└── intents/design_editor/
    ├── index.tsx                    # render() + provider
    ├── app.tsx                      # UI utama (konversi + font + add)
    └── __tests__/app.test.tsx       # test
```

## Aturan Transliterasi (sunda.js)
- Aksara Ngalagéna (konsonan dasar)
- Aksara Swara (vokal berdiri)
- Rarangkén (tanda vokal: i, u, e, é, eu, o)
- Pamaéh (᮪) untuk konsonan mati
- Angka otomatis dibungkus pipe (|᮱᮷|)
- Suara asing: f, q, v, x, z, kh, sy

## Lisensi
MIT (mengikuti sunda.js)
