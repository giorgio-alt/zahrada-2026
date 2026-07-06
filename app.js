(function () {
  const data = window.ZAHRADA_DASHBOARD;
  const checklistStorageKey = "zahrada-checklist-v1";

  const savedChecklist = readSavedChecklist();

  function text(value) {
    return String(value ?? "");
  }

  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function badge(label, tone) {
    const node = el("span", `badge ${tone || ""}`.trim(), label);
    return node;
  }

  function card(item) {
    const node = el("article", "card");
    node.append(badge(item.badge, item.tone));
    node.append(el("h3", "", item.title));
    if (item.amount) node.append(el("p", "amount", item.amount));
    if (item.body) node.append(paragraphs(item.body));
    return node;
  }

  function summaryCard(tuple) {
    const [label, tone, title, amount, body] = tuple;
    return card({ badge: label, tone, title, amount, body });
  }

  function paragraphs(value) {
    const wrapper = document.createDocumentFragment();
    text(value)
      .split("\n")
      .filter(Boolean)
      .forEach((line) => wrapper.append(el("p", "", line)));
    return wrapper;
  }

  function grid(items, renderItem) {
    const node = el("div", "grid");
    items.forEach((item) => node.append(renderItem(item)));
    return node;
  }

  function sectionTitle(section, title, intro) {
    section.replaceChildren();
    section.append(el("h2", "", title));
    if (intro) section.append(el("p", "section-intro", intro));
  }

  function table(headers, rows, total) {
    const wrap = el("div", "table-wrap");
    const tableEl = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach((header) => headerRow.append(el("th", "", header)));
    thead.append(headerRow);
    tableEl.append(thead);

    const tbody = document.createElement("tbody");
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => tr.append(el("td", "", cell)));
      tbody.append(tr);
    });

    if (total) {
      const tr = document.createElement("tr");
      tr.className = "total-row";
      total.forEach((cell) => tr.append(el("td", "", cell)));
      tbody.append(tr);
    }

    tableEl.append(tbody);
    wrap.append(tableEl);
    return wrap;
  }

  function formatMoney(value) {
    if (value === undefined || value === null || value === "") return "";
    if (typeof value === "number") return `${value.toLocaleString("cs-CZ")} Kč`;
    return value;
  }

  function worklogMarker(type) {
    return {
      own: "🟩",
      shared: "🟦",
      mixed: "🟧",
      payment: "💸",
      off: "⬜",
    }[type || "off"];
  }

  function worklogTone(type) {
    return {
      own: "good",
      shared: "split",
      mixed: "wait",
      payment: "good",
      off: "",
    }[type || "off"];
  }

  function renderNav() {
    const nav = document.querySelector("#mainNav");
    data.nav.forEach(([id, label]) => {
      const link = el("a", "", label);
      link.href = `#${id}`;
      nav.append(link);
    });
  }

  function renderOverview() {
    const section = document.querySelector("#overview");
    section.replaceChildren();
    const titleWrap = el("div", "hero-copy");
    titleWrap.append(el("p", "eyebrow", "Aktuální stav projektu"));
    titleWrap.append(el("h1", "", data.title));
    titleWrap.append(el("p", "hero-intro", data.intro));
    section.append(titleWrap);
    section.append(grid(data.overview, card));
  }

  function renderDocuments() {
    const section = document.querySelector("#docs");
    sectionTitle(section, "🔗 Rozcestník dokumentů a odkazů");
    section.append(
      grid(data.documents, (item) => {
        const node = el("article", "card");
        node.append(el("h3", "", item.title));
        if (item.body) node.append(el("p", "", item.body));
        if (item.href) {
          const link = el("a", "button", `${item.label} ↗`);
          link.href = item.href;
          link.target = "_blank";
          link.rel = "noreferrer";
          node.append(link);
        }
        return node;
      })
    );
  }

  function renderFinance() {
    const section = document.querySelector("#finance");
    sectionTitle(section, "💰 Finance", "Rychlý přehled klíčových finančních pohledů. Detail každé oblasti je sbalený níže.");
    section.append(financeOverviewGrid(data.finance.overview));

    section.append(
      financeDetail("💰 Detail celkové investice", [
        totalsGrid(data.budget.totals),
        table(["Položka", "Částka", "Stav"], data.budget.rows, data.budget.totals[0]),
      ])
    );

    section.append(
      financeDetail("💸 Detail cashflow", [
        table(data.finance.cashflow.headers, data.finance.cashflow.rows, data.finance.cashflow.total),
      ])
    );

    section.append(
      financeDetail("🤝 Detail vyúčtování s Löffelmanovými", [
        financeTupleMetrics(data.settlement.cards),
        table(data.settlement.headers, data.settlement.rows, data.settlement.total),
        financeTupleMetrics(data.settlement.breakdown),
      ])
    );

    section.append(
      financeDetail("👷 Detail Ivanovy party", [
        financeTupleMetrics(data.workCosts.cards),
        table(data.workCosts.headers, data.workCosts.rows, data.workCosts.total),
      ], data.workCosts.note)
    );
  }

  function financeOverviewGrid(items) {
    const node = el("div", "finance-overview-grid");
    items.forEach((item) => node.append(financeOverviewCard(item)));
    return node;
  }

  function financeOverviewCard(item) {
    const node = el("article", "finance-summary-card");
    node.append(badge(item.title.split(" ")[0], item.tone));
    node.append(el("h3", "", item.title));
    node.append(el("p", "finance-card-question", item.body));
    node.append(metricList(item.metrics));
    return node;
  }

  function metricList(metrics) {
    const list = el("dl", "metric-list");
    metrics.forEach(([label, value]) => {
      const group = el("div", "metric-row");
      group.append(el("dt", "", label), el("dd", "", value));
      list.append(group);
    });
    return list;
  }

  function totalsGrid(items) {
    const totals = el("div", "finance-metric-grid");
    items.forEach(([label, amount]) => {
      const item = el("div", "finance-metric-box");
      item.append(el("span", "", label));
      item.append(el("strong", "", amount));
      totals.append(item);
    });
    return totals;
  }

  function financeTupleMetrics(items) {
    const wrap = el("div", "finance-metric-grid");
    items.forEach(([label, tone, title, amount, body]) => {
      const item = el("div", "finance-metric-box");
      item.append(badge(label, tone));
      item.append(el("strong", "", title));
      if (amount) item.append(el("span", "finance-metric-amount", amount));
      if (body) item.append(paragraphs(body));
      wrap.append(item);
    });
    return wrap;
  }

  function financeDetail(label, children, intro) {
    const details = el("details", "finance-detail");
    details.append(el("summary", "", label));
    const body = el("div", "finance-detail-body");
    if (intro) body.append(el("p", "section-intro", intro));
    children.forEach((child) => body.append(child));
    details.append(body);
    return details;
  }

  function renderWorklog() {
    const section = document.querySelector("#worklog");
    const calendar = data.worklog;
    sectionTitle(section, "📒 Stavební kalendář");

    const layout = el("div", "calendar-layout");
    const panel = el("div", "calendar-panel");
    const header = el("div", "calendar-head");
    header.append(el("p", "eyebrow", "Měsíční přehled stavby"));
    header.append(el("h3", "", calendar.monthLabel));
    panel.append(header);

    const calendarGrid = el("div", "calendar-grid");
    calendar.weekdays.forEach((weekday) => calendarGrid.append(el("div", "calendar-weekday", weekday)));

    const detail = el("article", "calendar-detail");
    const days = calendar.days || [];
    const selectedDay = days.find((day) => day.selected) || days.find((day) => day.type !== "off") || days[0];

    function selectDay(day) {
      calendarGrid.querySelectorAll(".calendar-day").forEach((button) => {
        const isSelected = button.dataset.key === worklogDayKey(day);
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-expanded", String(isSelected));
      });
      renderWorklogDetail(detail, day);
    }

    days.forEach((day) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `calendar-day type-${day.type || "off"}`;
      button.dataset.key = worklogDayKey(day);
      button.title = day.tooltip || `${day.label || day.day}. ${day.title || "Nepracovalo se"}`;
      button.setAttribute("aria-expanded", "false");
      button.append(el("span", "calendar-date", day.label || day.day));
      button.append(el("span", "calendar-marker", worklogMarker(day.type)));
      if (day.short) button.append(el("span", "calendar-short", day.short));
      calendarGrid.append(button);
    });

    calendarGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".calendar-day");
      if (!button) return;
      const day = days.find((item) => worklogDayKey(item) === button.dataset.key);
      if (day) selectDay(day);
    });

    panel.append(calendarGrid);
    layout.append(panel);

    const legend = el("div", "calendar-legend");
    calendar.legend.forEach(([marker, label]) => {
      const item = el("span", "");
      item.append(el("span", "legend-marker", marker), el("span", "", label));
      legend.append(item);
    });
    layout.append(legend);
    layout.append(detail);
    section.append(layout);

    if (selectedDay) selectDay(selectedDay);
  }

  function renderWorklogDetail(container, day) {
    const detail = day.detail || {};
    const finance = detail.finance;
    container.replaceChildren();
    container.className = `calendar-detail type-${day.type || "off"}`;
    container.append(badge(`${worklogMarker(day.type)} ${day.title || "Nepracovalo se"}`, worklogTone(day.type)));
    container.append(el("h3", "", `📅 ${detail.date || `${day.day}. 6. 2026`}`));

    const detailGrid = el("div", "detail-grid");
    detailGrid.append(detailBlock("👷 Pracovali", listContent(detail.workers, "Nepracovalo se")));
    detailGrid.append(detailBlock("Hotovo", listContent(detail.done, day.title || "Nepracovalo se")));
    detailGrid.append(detailBlock("💰 Finance", financeContent(finance, day.type)));
    detailGrid.append(detailBlock("Dotčené projekty", listContent(detail.projects, "Bez vazby na aktivní projekt")));
    container.append(detailGrid);

    const notes = el("div", "detail-notes");
    notes.append(el("h4", "", "Poznámky"));
    notes.append(el("p", "", detail.notes || "Bez stavební aktivity."));
    container.append(notes);
  }

  function detailBlock(title, content) {
    const block = el("div", "detail-block");
    block.append(el("h4", "", title));
    block.append(content);
    return block;
  }

  function listContent(items, fallback) {
    const list = el("ul", "detail-list");
    const values = Array.isArray(items) && items.length ? items : [fallback];
    values.forEach((item) => list.append(el("li", "", item)));
    return list;
  }

  function financeContent(finance, type) {
    const wrap = el("div", "finance-list");
    if (!finance) {
      wrap.append(financeRow("Celkem", type === "off" ? "0 Kč" : "Doplnit"));
      return wrap;
    }

    wrap.append(financeRow("Celkem", formatMoney(finance.total)));
    if (finance.sharedPercent) wrap.append(financeRow("Společný projekt", `${finance.sharedPercent} % / ${formatMoney(finance.sharedAmount)}`));
    if (finance.ownPercent) wrap.append(financeRow("Náš projekt", `${finance.ownPercent} % / ${formatMoney(finance.ownAmount)}`));
    if (finance.ourSharedShare !== undefined) wrap.append(financeRow("Náš podíl ze společné části", formatMoney(finance.ourSharedShare)));
    if (finance.neighborSharedShare !== undefined) wrap.append(financeRow("Podíl Lofflemanových", formatMoney(finance.neighborSharedShare)));
    if (finance.ourCost !== undefined) wrap.append(financeRow("Náš reálný náklad", formatMoney(finance.ourCost)));
    if (Array.isArray(finance.extraRows)) {
      finance.extraRows.forEach(([label, value]) => wrap.append(financeRow(label, value)));
    }
    return wrap;
  }

  function financeRow(label, value) {
    const row = el("div", "finance-row");
    row.append(el("span", "", label), el("strong", "", value));
    return row;
  }

  function worklogDayKey(day) {
    return day.id || `${day.detail?.date || ""}-${day.day}`;
  }

  function renderProjects() {
    const section = document.querySelector("#projects");
    sectionTitle(section, "✅ Projektové sekce");
    section.append(
      grid(data.projects, (item) => {
        const node = el("article", "card");
        node.append(el("h3", "", item[0]));
        if (Array.isArray(item[1])) {
          const list = el("ul", "clean-list");
          item[1].forEach((line) => list.append(el("li", "", line)));
          node.append(list);
          node.append(badge(item[2], item[3]));
        } else {
          node.append(el("p", "", item[1]));
        }
        return node;
      })
    );
  }

  function renderPlan() {
    const section = document.querySelector("#plan");
    sectionTitle(section, "📋 Projektový plán a master checklist");

    const progress = el("div", "progress-panel");
    const copy = el("div", "");
    copy.append(el("h3", "", "📊 Celkový stav checklistu"));
    const track = el("div", "progress-track");
    track.append(el("div", "progress-fill"));
    copy.append(track);
    copy.append(el("p", "progress-text"));
    progress.append(copy);
    progress.append(el("p", "progress-number", "0 %"));
    section.append(progress);

    section.append(
      grid(data.plan, (group) => {
        const node = el("article", "card");
        node.append(el("h3", "", group.title));
        const list = el("ul", "checklist");
        group.items.forEach(([id, label, checked]) => {
          const item = el("li", "");
          const wrapper = el("label", "");
          const input = document.createElement("input");
          input.type = "checkbox";
          input.dataset.id = id;
          input.checked = savedChecklist[id] ?? checked;
          wrapper.append(input, el("span", "", label));
          item.append(wrapper);
          list.append(item);
        });
        node.append(list);
        return node;
      })
    );

    section.addEventListener("change", (event) => {
      if (!event.target.matches('input[type="checkbox"]')) return;
      saveChecklist();
      updateProgress();
    });

    updateProgress();
  }

  function renderElectricity() {
    const section = document.querySelector("#electricity");
    sectionTitle(section, "⚡ Elektřina a rozvod po zahradě");
    section.append(
      grid(data.electricity, ([label, tone, title, body]) =>
        card({ badge: label, tone, title, body })
      )
    );
  }

  function renderTimeline() {
    const section = document.querySelector("#timeline");
    sectionTitle(section, "📅 Projektová timeline");
    section.append(
      grid(data.timeline, ([label, tone, title, body]) =>
        card({ badge: label, tone, title, body })
      )
    );
  }

  function renderMissing() {
    const section = document.querySelector("#missing");
    sectionTitle(section, "⚠️ Co je potřeba doplnit");
    const list = el("ul", "missing-list");
    data.missing.forEach((item) => list.append(el("li", "", item)));
    section.append(list);
  }

  function updateProgress() {
    const plan = document.querySelector("#plan");
    const inputs = Array.from(plan.querySelectorAll('input[type="checkbox"]'));
    const checked = inputs.filter((input) => input.checked).length;
    const total = inputs.length;
    const pct = total ? Math.round((checked / total) * 100) : 0;

    plan.querySelector(".progress-fill").style.width = `${pct}%`;
    plan.querySelector(".progress-text").textContent = `${checked} / ${total} úkolů dokončeno`;
    plan.querySelector(".progress-number").textContent = `${pct} %`;
  }

  function readSavedChecklist() {
    try {
      return JSON.parse(localStorage.getItem(checklistStorageKey)) || {};
    } catch {
      return {};
    }
  }

  function saveChecklist() {
    const state = {};
    document.querySelectorAll('#plan input[type="checkbox"]').forEach((input) => {
      state[input.dataset.id] = input.checked;
    });
    localStorage.setItem(checklistStorageKey, JSON.stringify(state));
  }

  function render() {
    renderNav();
    renderOverview();
    renderDocuments();
    renderFinance();
    renderWorklog();
    renderProjects();
    renderPlan();
    renderElectricity();
    renderTimeline();
    renderMissing();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
