# Garden Dashboard - Design System v7

Dashboard predstavuje dlouhodobou projektovou aplikaci pro spravu stavby zahrady.

Nejde o administraci ani ERP. Pocit z pouzivani ma pripominat Apple Glass UI, luxusni architektonicke studio, interierovy konfigurator a moderni stavebni denik.

Celkovy dojem: luxusni, klidny, prehledny.

## Barvy

Pozadi pouziva teple prirodni tony: svetle bezovou, piskovou, svetle drevo a jemne kremove odstiny. Nepouzivat ciste bile pozadi, tmavy dashboard ani agresivni kontrasty.

Primarni barva je tmava hneda. Pouziva se pro CTA, progress, badge a aktivni prvky.

Sekundarni barvy:

- zelena: dokonceno, uspech
- oranzova: ceka, rozpracovano
- cervena: riziko
- modroseda: sdilene naklady, informace, neutralni stav

## Liquid Glass

Kazda sekce je samostatna karta s backdrop blur, pruhlednosti, jemnym leskem, svetlymi okraji a velkymi radiusy.

Nepouzivat ostre hrany, klasicke boxy ani bootstrap cards.

## Karty

Kazda karta ma radius 24-32 px, jemny shadow, glass background a dostatek paddingu.

Poradi obsahu:

1. Badge
2. Nadpis
3. Obsah
4. CTA, pokud existuje

## Typografie a spacing

Nadpis stranky je velky, silny a vzdusny.

Sekce maji vyrazne nadpisy a velke mezery nad i pod nadpisem. Obsah ma byt citelny s line-height cca 1.5-1.7.

Dashboard musi dychat: vetsi spacing mezi kartami, nadpisy, textem, badge a sekcemi. Nepouzivat natesnane komponenty.

## Navigace

Sticky navbar s glass efektem a anchor scrollingem. Navigace obsahuje pouze emoji a nazev sekce.

## CTA

Kazdy externi odkaz pouziva vlastni tlacitko, napr. `Otevrit ↗`. Nepouzivat prosty hyperlink.

## Ikony

Pouzivat emoji jako identitu dashboardu. Nepouzivat ikonove knihovny.

## Layout

Max-width cca 1400-1500 px, centrovani a velke okraje.

Grid pouziva auto-fit, typicky `repeat(auto-fit, minmax(280px, 1fr))`.

## Tabulky

Tabulky pouzivat pouze pro rozpocty, praci a vyuctovani. Musi byt zaoblene, vzdusne a dobre citelne.

## Checklist a progress

Checklist pouziva checkboxy, automaticky progress a progress bar. Checkboxy nemaji pusobit jako male systemove prvky.

Progress pouziva glass track a hnedy gradient fill.

## Obsahove sekce

Rozpocty kombinuji prehledove karty a detailni tabulku.

Projektove sekce maji vlastni karty s budgetem, stavem, checklistem a poznamkami.

Stavebni denik je chronologicky a kazdy den je samostatna karta.

Sdilene naklady jsou samostatna sekce rozdelena na material, praci, otevrene polozky a souhrn.

## Animace

Pouze jemne animace: hover, glass highlight a progress animation. Nepouzivat bounce, zoom ani flashy efekty.

## Responsive

Desktop je primarni. Na mobilu se layout meni na jeden sloupec. Horizontalni scrollovani je povolene pouze u velkych tabulek.

## Budouci rozsireni

Design musi byt pripraven na Gantt diagram, grafy, cashflow, PDF export, XLSX export, formular stavebniho deniku, lokalni ukladani a editaci budgetu.
