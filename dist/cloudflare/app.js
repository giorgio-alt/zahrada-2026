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

  function renderBudget() {
    const section = document.querySelector("#budget");
    sectionTitle(section, "💰 Rozpočet a známé náklady");
    section.append(grid(data.budget.cards, summaryCard));
    section.append(table(["Položka", "Částka", "Stav"], data.budget.rows, data.budget.totals[0]));

    const totals = el("div", "totals");
    data.budget.totals.forEach(([label, amount]) => {
      const item = el("div", "total-box");
      item.append(el("span", "", label));
      item.append(el("strong", "", amount));
      totals.append(item);
    });
    section.append(totals);
  }

  function renderWorkCosts() {
    const section = document.querySelector("#work-costs");
    sectionTitle(section, "👷 Kompletní výpočet práce Ivanovy party", data.workCosts.note);
    section.append(grid(data.workCosts.cards, summaryCard));
    section.append(table(data.workCosts.headers, data.workCosts.rows, data.workCosts.total));
  }

  function renderWorklog() {
    const section = document.querySelector("#worklog");
    sectionTitle(section, "📒 Stavební deník");
    section.append(
      grid(data.worklog, ([label, tone, title, body]) =>
        card({ badge: label, tone, title, body })
      )
    );
  }

  function renderSettlement() {
    const section = document.querySelector("#settlement");
    sectionTitle(section, "🤝 Společné náklady s Lofflemanovými", data.settlement.intro);
    section.append(grid(data.settlement.cards, summaryCard));
    section.append(table(data.settlement.headers, data.settlement.rows, data.settlement.total));
    section.append(grid(data.settlement.breakdown, summaryCard));
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
    renderBudget();
    renderWorkCosts();
    renderWorklog();
    renderSettlement();
    renderProjects();
    renderPlan();
    renderElectricity();
    renderTimeline();
    renderMissing();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
