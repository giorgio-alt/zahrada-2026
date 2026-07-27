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
- `partial` - castecne zaplaceno
- `unpaid` - vyslovne nezaplaceno
- `unallocated` - existuje souhrnna platba, ale neni urceno, ke kteremu dni patri

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
- pocet pracovniku / velikost party
- hruby naklad dne k uhrade Ivanove parte
- podil prace pro nas projekt
- podil sdilene prace
- castku pro nas projekt
- castku sdilenou s Loffelmanovymi
- stav zaplaceni prace
- pripadne konkretni prirazeni platby

Naklad prace a uhrada prace jsou dve oddelene veci. Pracovni den zvysuje naklad ve chvili, kdy je odpracovany. Platba Ivanovi je cashflow proti zavazku a nesmi znovu navysovat rozpocet.

Platby Ivanovi evidujeme samostatne. Pokud neni dolozeno, ktere konkretni dny platba pokryla, jednotlive pracovni dny musi zustat ve stavu `unallocated`. Dashboard potom muze pravdive ukazat celkem odpracovano, celkem zaplaceno a otevreny zavazek, ale nesmi tvrdit, ze konkretni den je proplaceny.

Material a uctenky hrazene Ivanem jsou treti vrstva evidence. Uctenka patri do materialovych nakladu podle projektu; jeji proplaceni Ivanovi je jen cashflow a nesmi se zapocitat jako nova prace.

## Vlastni, sdilene a sousedske naklady

- Vlastni naklad patri 100 % Trantinovym.
- Sdileny naklad 50 / 50 patri do spolecneho zakladu s Loffelmanovymi a deli se podle uvedeneho pomeru.
- Sousedsky naklad hrazeny Trantinovymi patri 100 % Loffelmanovym. Nevstupuje do naseho rozpoctu ani do spolecneho zakladu, ale zvysuje pohledavku za Loffelmanovymi.

## Zdroj pravdy

Aktualne je dashboard vykreslovan z `data.js`. Slozka `records/` je pripraveny evidencni zaklad pro dlouhodobou historii, doklady a budouci editacni funkce.

Jakmile pribude formular, import uctenek nebo export do PDF/XLSX, mela by se slozka `records/` stat hlavnim zdrojem pravdy a dashboard by se z ni mel generovat.
