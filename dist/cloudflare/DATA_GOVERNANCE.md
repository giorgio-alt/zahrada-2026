# Evidence a pravidla dat

Dashboard slouzi jako projektovy denik, rozpoctovy prehled a podklad pro realne platby. Proto se k datum chovame jako k evidenci, ne jen jako k textu na webu.

## Zakladni principy

1. Historii nemazat.
2. Opravy delat novym zaznamem nebo korekci, ne tichym prepisem minulosti.
3. Kazda financni polozka ma mit zdroj: uctenku, fakturu, fotku, poznamku nebo jasny textovy duvod.
4. Kazda sdilena polozka musi mit uvedene deleni a stranu, ktera ji zaplatila.
5. Kazda prace Ivanovy party musi mit datum, rozsah, denni sazbu a informaci, jestli jde o nas projekt, sdileny projekt, nebo kombinaci.
6. Stav platby rozlisujeme od vzniku nakladu. Naklad muze existovat driv, nez je zaplacen.

## Doporucene stavy

Financni polozky:

- `planned` - planovano
- `ordered` - objednano
- `paid` - zaplaceno
- `reimbursable` - ceka na vyrovnani
- `settled` - vyrovnano
- `cancelled` - zruseno

Doklady:

- `missing` - chybi
- `photo_uploaded` - fotka nahrana
- `verified` - zkontrolovano
- `rejected` - nepouzitelne nebo chybne

Prace:

- `logged` - zapsano
- `approved` - odsouhlaseno
- `paid` - zaplaceno

## Uctenky a obrazky

Fotky uctenek patri do `assets/receipts/`.

Doporuceny nazev souboru:

```text
YYYY-MM-DD_dodavatel_popis_castka.ext
```

Priklad:

```text
2026-06-25_roja_wpc-plot_37669.jpg
```

Kazda fotka ma mit odpovidajici zaznam v `records/receipts.json`.

## Sdilene naklady

U kazde sdilene polozky evidujeme:

- celkovou castku
- deleni, typicky 50 / 50
- nas podil
- podil Loffelmanovych
- kdo platil
- stav vyuctovani
- odkaz na doklad

## Prace Ivanovy party

U kazdeho dne evidujeme:

- datum
- denni sazbu
- podil prace pro nas projekt
- podil sdilene prace
- castku pro nas projekt
- castku sdilenou s Loffelmanovymi
- stav zaplaceni

## Zdroj pravdy

Aktualne je dashboard vykreslovan z `data.js`. Slozka `records/` je pripraveny evidencni zaklad pro dlouhodobou historii, doklady a budouci editacni funkce.

Jakmile pribude formular, import uctenek nebo export do PDF/XLSX, mela by se slozka `records/` stat hlavnim zdrojem pravdy a dashboard by se z ni mel generovat.
