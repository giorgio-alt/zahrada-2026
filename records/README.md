# Evidence

Tato slozka drzi dlouhodobou historii projektu v datove podobe.

Soubory:

- `work-days.json` - pracovni dny Ivanovy party a rozdeleni prace.
- `shared-costs.json` - naklady delene s Loffelmanovymi.
- `payments.json` - zaplacene castky, zavazky a vyrovnani.
- `receipts.json` - metadata k uctenkam, fakturam a fotkam dokladu.

Fotky uctenek patri do `../assets/receipts/`.

Dashboard se zatim vykresluje z `data.js`. Tyto soubory jsou pripraveny jako historicky a auditovatelny zaklad pro dalsi rozsireni.

## Platby Ivanove parte

Pracovni den a platba jsou oddelene zaznamy. `work-days.json` eviduje vznik nakladu prace, `payments.json` eviduje skutecne cashflow. Pokud neni znama vazba mezi platbou a konkretnim pracovnim dnem, pouziva se `paymentStatus: "unallocated"` a `paymentAllocation: null`.

Souhrnna platba nesmi automaticky oznacit jednotlive dny jako proplacene. Konkretni den muze byt `paid` nebo `partial` az ve chvili, kdy ma explicitni `paymentAllocation`.
