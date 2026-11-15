// Compare & rank: pick two or more Earth sites and a benchmark (the Moon, Mars, or a
// specific place on either), then rank the sites by how closely they match it.
// Every score comes from data shown elsewhere on the site: each site's dimension ticks (`dims`,
// from the research sheet), the benchmark weights in BENCHMARKS, and cited twin links (`twins`).
// A site the sheet does not list as an analog for the chosen world gets no score (null), not zero.
// app.js calls the hooks on window.Compare.
(function () {
  const DKEYS = DIMENSIONS.map(d => d.key);
  const dimLabel = (body, k) => DIMENSIONS.find(d => d.key === k).label;
  const LISTED_BONUS = 8;   // points added when the site is a cited twin of the chosen place
  const worldName = () => C.body === "moon" ? "the Moon" : "Mars";
  const EXAMPLE = ["atacama", "dryvalleys", "iceland", "deathvalley"];
  const STORE = "twin-compare";

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const site = id => findSite("earth", id);
  const short = s => s.name.split(/[,(:]/)[0].trim();

  const C = { open: false, body: "mars", bench: "overall", ids: [], w: null, custom: false, expanded: new Set() };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved) {
      C.body = saved.body === "moon" ? "moon" : "mars";
      C.bench = saved.bench === "overall" || BENCHMARKS[C.body].places[saved.bench] ? saved.bench : "overall";
      C.ids = (saved.ids || []).filter(id => findSite("earth", id));
    }
  } catch (e) { /* storage unavailable */ }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify({ body: C.body, bench: C.bench, ids: C.ids })); } catch (e) {} };

  function preset() {
    const b = BENCHMARKS[C.body];
    const w = C.bench === "overall" ? b.overall.w : b.places[C.bench];
    return Object.fromEntries(DKEYS.map(k => [k, w[k] ?? 0.5]));
  }
  C.w = preset();
  const benchSite = () => C.bench === "overall" ? null : findSite(C.body, C.bench);
  const benchName = () => C.bench === "overall" ? BENCHMARKS[C.body].overall.label : benchSite().name;

  function score(id) {
    const s = site(id);
    const parts = DKEYS.map(k => ({ k, on: s.dims.includes(k), w: C.w[k] }));
    // The sheet marks each site as an analog for the Moon, Mars or both. Outside that, there is no rating.
    const rated = s.analog === "Both" || s.analog.toLowerCase() === C.body;
    if (!rated) return { id, rated: false, base: null, total: null, listed: false, parts };
    let num = 0, den = 0;
    for (const p of parts) { num += p.on ? p.w : 0; den += p.w; }
    const base = den ? (num / den) * 100 : null;
    const bs = benchSite();
    const listed = !!(bs && bs.twins.includes(id));
    return { id, rated: true, base, listed, parts,
      total: base == null ? null : Math.min(100, Math.round(base + (listed ? LISTED_BONUS : 0))) };
  }

  function ranking() {
    const rows = C.ids.map(score).sort((a, b) => (b.rated - a.rated) || b.total - a.total || b.base - a.base || short(site(a.id)).localeCompare(short(site(b.id))));
    let prev = null;
    rows.forEach((row, i) => {
      if (!row.rated) { row.rank = null; return; }
      row.rank = prev && row.total === prev.total ? prev.rank : i + 1;
      prev = row;
    });
    return rows;
  }

  function verdict(row) {
    if (!row.rated) return `The research sheet lists this site as an analog for ${site(row.id).analog === "Moon" ? "the Moon" : "Mars"} only, so it is not scored against ${worldName()}.`;
    const counted = row.parts.filter(p => p.w > 0);
    if (!counted.length) return "";
    const name = p => dimLabel(C.body, p.k).toLowerCase();
    const hit = counted.filter(p => p.on).sort((a, b) => b.w - a.w).slice(0, 3);
    const miss = counted.filter(p => !p.on).sort((a, b) => b.w - a.w)[0];
    let out = hit.length ? `Matches ${hit.map(name).join(", ")}.` : "Matches none of the dimensions that count here.";
    if (miss && miss.w >= 2) out += ` No match on ${name(miss)}.`;
    return out;
  }

  // The actual parameters and weights behind the current ranking.
  function rankedBy() {
    const ws = DKEYS.filter(k => C.w[k] > 0).sort((a, b) => C.w[b] - C.w[a]).map(k => `${esc(dimLabel(C.body, k))} &times;${C.w[k]}`).join(" &middot; ");
    const bs = benchSite();
    return `<p class="cmp-rankedby"><strong>Ranked by:</strong> the weighted share of analog dimensions each site matches. ${ws || "No dimensions switched on"}${bs ? `; +${LISTED_BONUS} points for a cited twin of ${esc(short(bs))}` : ""}.</p>`;
  }

  // ---------- Rendering ----------
  function siteOptions() {
    const groups = {};
    for (const s of EARTH_SITES) if (!C.ids.includes(s.id)) (groups[s.group] = groups[s.group] || []).push(s);
    return Object.entries(groups).map(([g, arr]) => `<optgroup label="${esc(g)}">${arr.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</optgroup>`).join("");
  }

  function renderAll() {
    const panel = $("compare");
    const places = BODIES[C.body].sites;
    const bs = benchSite();
    const blurb = bs ? bs.summary : BENCHMARKS[C.body].overall.blurb;
    panel.innerHTML = `
      <header class="cmp-head">
        <div>
          <div class="cmp-eyebrow">Compare &amp; rank</div>
          <h2>Which Earth site is most like ${C.body === "moon" ? "the Moon" : "Mars"}?</h2>
        </div>
        <button class="card-close" data-act="close" aria-label="Close compare"><svg width="24" height="24" viewBox="0 0 24 24" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
      </header>

      <section class="cmp-step">
        <h3><span>1</span>Benchmark</h3>
        <div class="seg" role="group" aria-label="Compare against">
          <button data-body="moon" class="${C.body === "moon" ? "on" : ""}"><i style="background:radial-gradient(circle at 35% 35%,#fff,#888)"></i>Moon</button>
          <button data-body="mars" class="${C.body === "mars" ? "on" : ""}"><i style="background:radial-gradient(circle at 35% 35%,#ff9a6b,#a3301a)"></i>Mars</button>
        </div>
        <label class="cmp-field"><span class="sr">Benchmark</span>
          <select id="cmp-bench">
            <option value="overall" ${C.bench === "overall" ? "selected" : ""}>${esc(BENCHMARKS[C.body].overall.label)}</option>
            <optgroup label="A specific place on ${C.body === "moon" ? "the Moon" : "Mars"}">
              ${places.map(p => `<option value="${p.id}" ${C.bench === p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}
            </optgroup>
          </select>
        </label>
        <p class="cmp-blurb">${esc(blurb)}</p>
      </section>

      <section class="cmp-step">
        <h3><span>2</span>Locations on Earth <em class="cmp-n">${C.ids.length} chosen</em></h3>
        <div class="chips">
          ${C.ids.map(id => { const s = site(id); return `<span class="chip"><i class="dot" style="background:${ANALOG_COLORS[s.analog]}"></i>${esc(short(s))}<button data-remove="${id}" aria-label="Remove ${esc(short(s))}">×</button></span>`; }).join("")}
        </div>
        <div class="cmp-add">
          <label class="cmp-field grow"><span class="sr">Add a location</span>
            <select id="cmp-add" ${C.ids.length === EARTH_SITES.length ? "disabled" : ""}>
              <option value="">+ Add a location…</option>${siteOptions()}
            </select>
          </label>
          <button class="ghost" data-act="all">Add all ${EARTH_SITES.length}</button>
          ${C.ids.length ? `<button class="ghost" data-act="clear">Clear</button>` : `<button class="ghost" data-act="example">Try an example</button>`}
        </div>
        <p class="cmp-tip">Tip: while this panel is open, click points on the globe or names in the list to add or remove them.</p>
      </section>

      <details class="cmp-step cmp-weights" ${C.custom ? "open" : ""}>
        <summary><h3><span>3</span>What counts${C.custom ? ` <em class="cmp-n">custom</em>` : ""}</h3><span class="cmp-sum-hint">Adjust weights</span></summary>
        <p class="cmp-blurb">How much each dimension matters for this benchmark (0 = ignore, 5 = most important).</p>
        <div class="weights">
          ${DKEYS.map(k => `
            <label class="wrow"><span class="wl">${esc(dimLabel(C.body, k))}</span>
              <input type="range" min="0" max="5" step="0.5" value="${C.w[k]}" data-w="${k}">
              <output id="wv-${k}">${C.w[k]}</output></label>`).join("")}
        </div>
        <button class="ghost" data-act="reset-w" ${C.custom ? "" : "disabled"}>Reset to benchmark defaults</button>
      </details>

      <section class="cmp-step">
        <h3><span>4</span>Ranking</h3>
        <div id="cmp-results"></div>
      </section>

      <p class="cmp-method"><strong>How scores work.</strong> Each Earth site either matches or does not match each of the eight analog dimensions. Those ticks come from the team research sheet and are shown on every site page. A site's score is the weighted share of dimensions it matches, out of 100. The weights are TWIN's judgement of what matters for each benchmark, shown above and adjustable in step 3. A site with a cited twin link to the chosen place gets +${LISTED_BONUS}. Sites the sheet does not list as an analog for the chosen world are not scored. <a href="#references">References</a></p>`;
    renderResults();
  }

  function renderResults() {
    const box = $("cmp-results");
    if (!box) return;
    const rows = ranking();
    decoratePins(rows);
    if (C.ids.length < 2) {
      box.innerHTML = `<p class="cmp-empty">${C.ids.length ? "Add at least one more location" : "Add two or more locations"} to rank them against <strong>${esc(benchName())}</strong>.</p>`;
      return;
    }
    if (DKEYS.every(k => !C.w[k])) { box.innerHTML = `<p class="cmp-empty">Every dimension is set to 0. Turn at least one back on to see a ranking.</p>`; return; }
    const rated = rows.filter(r => r.rated);
    let headline;
    if (!rated.length) headline = `None of the chosen sites is listed as an analog for ${worldName()} in the research sheet.`;
    else if (rated.length === 1) headline = `<strong>${esc(short(site(rated[0].id)))}</strong> is the only chosen site listed as an analog for ${worldName()}.`;
    else {
      const top = rated[0], second = rated[1], gap = top.total - second.total;
      headline = top.rank === second.rank
        ? `<strong>${esc(short(site(top.id)))}</strong> and <strong>${esc(short(site(second.id)))}</strong> tie as the closest match to ${esc(benchName())}.`
        : `<strong>${esc(short(site(top.id)))}</strong> is the closest match to ${esc(benchName())}${gap >= 10 ? ", by a clear margin" : gap <= 3 ? ", but only just" : ""}.`;
    }
    box.innerHTML = `${rankedBy()}<p class="cmp-headline">${headline}</p><ol class="rank">${rows.map(row => {
      const s = site(row.id), open = C.expanded.has(row.id);
      return `<li class="${row.rank === 1 ? "first" : ""}${row.rated ? "" : " unrated"}">
        <div class="rk">${row.rated ? row.rank : "&ndash;"}</div>
        <div class="rmain">
          <div class="rtop">
            <div class="rname"><i class="dot" style="background:${ANALOG_COLORS[s.analog]}"></i><span>${esc(s.name)}</span></div>
            <div class="rscore">${row.rated ? `${row.total}<small>/100</small>` : `<small>not scored</small>`}</div>
          </div>
          ${row.rated ? `<div class="bar"><span style="width:${row.total}%;background:${C.body === "moon" ? "#bfbcb3" : "var(--mars)"}"></span></div>` : ""}
          <div class="rmeta">${esc(s.region)}${row.listed ? ` · <span class="listed">Cited twin of ${esc(short(benchSite()))} (+${LISTED_BONUS})</span>` : ""}</div>
          <p class="rwhy">${esc(verdict(row))}</p>
          <div class="ractions">
            ${row.rated ? `<button class="link" data-expand="${row.id}" aria-expanded="${open}">${open ? "Hide" : "Show"} breakdown</button>` : ""}
            <a class="link" href="#site-earth-${row.id}">Learn more →</a>
          </div>
          ${open && row.rated ? `<div class="breakdown">${row.parts.map(p => `
            <div class="brow ${p.w ? "" : "off"}"><span class="bl">${esc(dimLabel(C.body, p.k))}</span>
              <span class="bb"><span style="width:${p.on ? 100 : 0}%"></span></span><span class="bv">${p.on ? "Match" : "&ndash;"}</span>
              <span class="bw" title="Weight">×${p.w}</span></div>`).join("")}</div>` : ""}
        </div>
      </li>`;
    }).join("")}</ol>`;
  }

  // Number the chosen sites' pins on the globe with their current rank.
  function decoratePins(rows) {
    const ranks = Object.fromEntries((rows || ranking()).map(r => [r.id, r.rank]));
    const pins = window.TWIN_PINS ? window.TWIN_PINS() : {};
    for (const [id, el] of Object.entries(pins)) decoratePin(el, id, ranks);
  }
  function decoratePin(el, id, ranks) {
    const on = C.open && C.ids.includes(id);
    el.classList.toggle("in-cmp", on);
    el.classList.toggle("cmp-dim", C.open && !on);
    const rank = on && C.ids.length >= 2 ? (ranks || Object.fromEntries(ranking().map(r => [r.id, r.rank])))[id] : null;
    if (rank != null) el.dataset.rank = rank; else delete el.dataset.rank;
  }

  // ---------- Actions ----------
  function setBody(body) {
    if (body === C.body) return;
    C.body = body; C.bench = "overall"; C.w = preset(); C.custom = false; save(); renderAll();
  }
  function toggle(id) {
    C.ids = C.ids.includes(id) ? C.ids.filter(x => x !== id) : [...C.ids, id];
    save(); renderAll();
  }
  function open(addId) {
    if (addId && !C.ids.includes(addId)) { C.ids.push(addId); save(); }
    C.open = true;
    $("compare").hidden = false;
    $("mapwrap").classList.add("comparing");
    renderAll();
    $("compare").scrollTop = 0;
  }
  function close() {
    if (!C.open) return;
    C.open = false;
    $("compare").hidden = true;
    $("mapwrap").classList.remove("comparing");
    decoratePins([]);
  }

  function wire() {
    const panel = $("compare");
    panel.addEventListener("click", e => {
      const t = e.target.closest("button");
      if (!t) return;
      if (t.dataset.body) return setBody(t.dataset.body);
      if (t.dataset.remove) return toggle(t.dataset.remove);
      if (t.dataset.expand) {
        const id = t.dataset.expand;
        C.expanded.has(id) ? C.expanded.delete(id) : C.expanded.add(id);
        return renderResults();
      }
      switch (t.dataset.act) {
        case "close": return close();
        case "all": C.ids = EARTH_SITES.map(s => s.id); break;
        case "clear": C.ids = []; C.expanded.clear(); break;
        case "example": C.ids = [...EXAMPLE]; break;
        case "reset-w": C.w = preset(); C.custom = false; break;
        default: return;
      }
      save(); renderAll();
    });
    panel.addEventListener("change", e => {
      if (e.target.id === "cmp-bench") { C.bench = e.target.value; C.w = preset(); C.custom = false; save(); renderAll(); }
      if (e.target.id === "cmp-add" && e.target.value) toggle(e.target.value);
    });
    panel.addEventListener("input", e => {
      const k = e.target.dataset.w;
      if (!k) return;
      C.w[k] = Number(e.target.value);
      $("wv-" + k).textContent = C.w[k];
      if (!C.custom) {
        C.custom = true;
        const h = panel.querySelector(".cmp-weights h3");
        if (h && !h.querySelector(".cmp-n")) h.insertAdjacentHTML("beforeend", ` <em class="cmp-n">custom</em>`);
        const r = panel.querySelector('[data-act="reset-w"]');
        if (r) r.disabled = false;
      }
      renderResults();
    });
    $("cmp-open").addEventListener("click", () => C.open ? close() : open());
  }

  window.Compare = { open, close, toggle, isOpen: () => C.open, decoratePin: (el, id) => decoratePin(el, id) };
  wire();
})();
