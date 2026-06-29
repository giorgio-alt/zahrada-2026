# Zahradní projekt - dashboard

Toto je rozložená a upravená verze původního souboru `zahradni_dashboard_master_v7_shared_costs.html`.

## Struktura

- `index.html` - kostra stránky a jednotlivé sekce dashboardu.
- `data.js` - veškerý obsah: rozpočet, odkazy, deník, vyúčtování, checklist a otevřené úkoly.
- `app.js` - vykreslení stránky, tabulek, karet a výpočet postupu checklistu.
- `styles.css` - vzhled stránky a responzivní chování.
- `build.mjs` - vygeneruje samostatné HTML a ZIP pro Cloudflare Pages.
- `DESIGN_SYSTEM.md` - pravidla vizuálního směru: Liquid Glass, barvy, spacing a budoucí rozšíření.
- `DATA_GOVERNANCE.md` - pravidla pro historickou evidenci, doklady, platby a korekce.
- `records/` - strukturovana historie praci, plateb, sdilenych nakladu a dokladu.
- `assets/receipts/` - budouci fotky uctenek a faktur.

## Jak pokračovat

Nejčastěji bude stačit upravit `data.js`:

- nové náklady přidej do `budget.rows` nebo `settlement.rows`,
- nové odkazy přidej do `documents`,
- nové úkoly přidej do `plan`,
- otevřené věci přidej do `missing`.

Checklist se ukládá v prohlížeči přes `localStorage`, takže ruční zaškrtnutí po obnově stránky nezmizí.

## Evidence plateb a dokladu

Protoze dashboard slouzi i jako podklad pro vyplaceni Ivanovy party a vyuctovani s Loffelmanovymi, financni data maji vlastni evidencni pravidla v `DATA_GOVERNANCE.md`.

Aktualni historicky zaklad je ve slozce `records/`:

- `records/work-days.json` - pracovni dny Ivanovy party.
- `records/shared-costs.json` - polozky delene s Loffelmanovymi.
- `records/payments.json` - platby, zavazky a vyrovnani.
- `records/receipts.json` - metadata k uctenkam a fakturam.

Fotky uctenek se ukladaji do `assets/receipts/` a propojuji se pres `receiptIds`.

## Exporty

Aktuálně vygenerované soubory jsou ve složce `dist`:

- `dist/zahradni-dashboard-standalone.html` - jeden samostatný HTML soubor.
- `dist/zahradni-dashboard-cloudflare.zip` - ZIP balíček pro Cloudflare Pages.

Po úpravách dat nebo vzhledu lze exporty znovu sestavit příkazem:

```bash
npm run build
```

## Cloudflare Pages

Pro automaticky deploy bez rucniho nahravani ZIPu pripoj GitHub repozitar `giorgio-alt/zahrada-2026` do Cloudflare Pages.

Nastaveni buildu:

- Framework preset: `None`
- Production branch: `main`
- Build command: `npm run build:cloudflare`
- Build output directory: `dist/cloudflare`

Po tomto nastaveni se kazdy `git push` do vetve `main` automaticky nasadi na Cloudflare Pages.
