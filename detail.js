// "Learn more" detail view, rendered into #detail for #site-<world>-<id>.
let _miniMap = null;

function renderDetail(body, id) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const s = findSite(body, id);
  const label = BODIES[body].label;
  const fmt = (lat, lng) => `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? "E" : "W"}`;
  const row = (k, v) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  const dotStyle = c => `background:${c};${c === ANALOG_COLORS.Moon ? "box-shadow:0 0 0 1px #777;" : ""}`;
  const photo = (b, sid) => PHOTOS[`${b}-${sid}`];
  document.title = `${s.name} · TWIN`;

  // Hero
  let eyebrow, lede, tags;
  if (body === "earth") {
    eyebrow = `Earth analog for ${s.analog === "Both" ? "the Moon and Mars" : (s.analog === "Moon" ? "the Moon" : "Mars")} · ${esc(s.region)}`;
    lede = "Stands in for: " + s.counterpart + ".";
    tags = `<span class="pill ${s.analog}">${s.analog === "Both" ? "Moon &amp; Mars analog" : s.analog + " analog"}</span>
            <span class="pill ghost">${esc(s.category)}</span>
            <span class="pill ghost">${s.dims.length} of 8 dimensions</span>`;
  } else {
    eyebrow = `${label} · ${esc(s.type)}`;
    lede = s.summary;
    tags = `<span class="pill" style="background:${PLANET_STATUS[s.status].color}">${PLANET_STATUS[s.status].label}</span>
            <span class="pill ghost">${s.twins.length ? `${s.twins.length} Earth twin${s.twins.length > 1 ? "s" : ""}` : "Twin citation pending"}</span>`;
  }
  const ph = photo(body, s.id);
  const heroBg = ph ? `background-image:url('${ph.src}')` : (body === "mars" ? "background:linear-gradient(135deg,#5a1c10,#1a0805)" : "background:linear-gradient(135deg,#333,#0b0b0b)");

  // Link cards
  const linkCard = (b, site, text) => {
    const color = b === "earth" ? ANALOG_COLORS[site.analog] : PLANET_STATUS[site.status].color;
    const badge = b === "earth" ? `Earth · ${site.region}` : BODIES[b].label;
    const p = photo(b, site.id);
    return `<a class="linkcard" href="#site-${b}-${site.id}">
      <div class="thumb" ${p ? `style="background-image:url('${p.src}')"` : ""}><span class="badge"><i class="dot" style="${dotStyle(color)}"></i>${esc(badge)}</span></div>
      <div class="lc-body"><h4>${esc(site.name)}</h4><p>${esc(text)}</p></div></a>`;
  };

  // Twins: cited pairings only. Older suggested pairings without a citation are listed as pending.
  const shortName = x => x.name.split(/[,(&:]/)[0].trim();
  const twinSites = s.twins.map(findAny).filter(Boolean);
  const pendingLinks = list => list.map(c => `<a href="#site-${c.body}-${c.site.id}">${esc(shortName(c.site))}</a>`).join(", ");

  // Article
  let html = "";
  if (body === "earth") {
    html += `<section><h2>Why it's an analog</h2><p>${esc(s.why)}</p></section>`;
    const blocks = [];
    if (s.moon) blocks.push(["Moon", s.moon]);
    if (s.mars) blocks.push(["Mars", s.mars]);
    html += `<section><h2>How it compares to ${s.analog === "Both" ? "the Moon and Mars" : (s.analog === "Moon" ? "the Moon" : "Mars")}</h2><div class="compare">
      ${blocks.map(([w, t]) => `<div class="compare-block" style="--c:${w === "Moon" ? "#b9b4a8" : ANALOG_COLORS.Mars}">
        <h3><i class="dot" style="${dotStyle(ANALOG_COLORS[w])}"></i>${w === "Moon" ? "The Moon" : "Mars"}</h3><p>${esc(t)}</p></div>`).join("")}
    </div></section>`;
    html += `<section><h2>What it copies well</h2><div class="dims">
      ${DIMENSIONS.map(d => { const on = s.dims.includes(d.key); return `<div class="dimtile ${on ? "" : "off"}"><span class="mark">${on ? "&#10003;" : ""}</span>${esc(d.label)}</div>`; }).join("")}
    </div></section>`;
    const pending = counterpartsFor(s.id).filter(c => !s.twins.includes(c.site.id));
    html += `<section class="twins"><h2>Twin of &rarr; ${twinSites.length ? twinSites.map(t => esc(shortName(t.site))).join(", ") : "citation pending"}</h2>
      ${twinSites.length
        ? `<p>${esc(s.twinReason)}</p><div class="links">${twinSites.map(t => linkCard(t.body, t.site, t.site.summary)).join("")}</div>`
        : `<p class="note">No twin on the Moon or Mars has a citation yet.</p>`}
      ${pending.length ? `<p class="note">Also suggested, citation pending: ${pendingLinks(pending)}.</p>` : ""}</section>`;
    html += `<section><h2>Missions and programs</h2><p>${esc(s.usedBy)}.</p></section>`;
    html += `<section><h2>Where the analogy breaks down</h2>
      <div class="callout"><span class="k">At this site</span>${esc(s.limits)}.</div>
      <p>No place on Earth can copy everything. These limits apply to every Earth analog:</p>
      <ul class="limits">${EARTH_LIMITS.map(([k, v]) => `<li><b>${esc(k)}.</b> ${esc(v)}</li>`).join("")}</ul></section>`;
  } else {
    html += `<section><h2>About this place</h2><p>${esc(s.summary)}</p><p>${esc(s.details)}</p></section>`;
    const pending = s.earthAnalogs.filter(eid => !s.twins.includes(eid)).map(eid => ({ body: "earth", site: findSite("earth", eid) }));
    html += `<section class="twins"><h2>Earth twins</h2>
      ${twinSites.length
        ? `<p>${esc(s.twinReason)}</p><div class="links">${twinSites.map(t => linkCard(t.body, t.site, (body === "moon" ? t.site.moon : t.site.mars) || t.site.why)).join("")}</div>`
        : `<p class="note">No Earth twin has a citation yet.</p>`}
      ${pending.length ? `<p class="note">Also suggested, citation pending: ${pendingLinks(pending)}.</p>` : ""}
      ${s.otherAnalogs ? `<p class="note">Elsewhere on Earth: ${esc(s.otherAnalogs)}</p>` : ""}</section>`;
    const relevant = body === "moon" ? EARTH_LIMITS.filter(([k]) => !/Martian/.test(k)) : EARTH_LIMITS.filter(([k]) => !/shadowed|Regolith/.test(k));
    html += `<section><h2>What Earth can't copy</h2>
      <ul class="limits">${relevant.map(([k, v]) => `<li><b>${esc(k)}.</b> ${esc(v)}</li>`).join("")}</ul></section>`;
  }

  // At a glance
  const glance = body === "earth"
    ? row("Location", esc(s.region)) + row("Type", esc(s.category)) +
      row("Analog for", `<span class="pill ${s.analog}" style="font-size:14px">${s.analog === "Both" ? "Moon &amp; Mars" : s.analog}</span>`) +
      row("Matches", `${s.dims.length} of 8`) + row("Coordinates", fmt(s.lat, s.lng))
    : row("World", label) + row("Feature", esc(s.type)) + row("Explored by", esc(s.explored)) +
      row("Status", `<span class="pill" style="font-size:14px;background:${PLANET_STATUS[s.status].color}">${PLANET_STATUS[s.status].label}</span>`) +
      row("Coordinates", fmt(s.lat, s.lng));

  const list = BODIES[body].sites, i = list.indexOf(s);
  const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
  const c = body === "earth" ? ANALOG_COLORS[s.analog] : PLANET_STATUS[s.status].color;

  document.getElementById("detail").innerHTML = `
    <div class="topbar">
      <a href="#${body}-${s.id}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>Back to ${body === "earth" ? "map" : "globe"}</a>
      <nav class="topbar-tabs"><a href="#earth">Earth</a><a href="#moon">Moon</a><a href="#mars">Mars</a></nav>
    </div>
    <header class="hero" style="${heroBg}">
      <div class="hero-inner">
        <div class="eyebrow">${eyebrow}</div>
        <h1>${esc(s.name)}</h1>
        <p class="lede">${esc(lede)}</p>
        <div class="tags">${tags}</div>
      </div>
      ${ph ? `<a class="credit-hero" href="${ph.file}">Photo: ${esc(ph.credit)}</a>` : ""}
    </header>
    <div class="wrap">
      <article>${html}</article>
      <aside class="glance">
        <h3>At a glance</h3><div class="rows">${glance}</div>
        <div id="minimap" class="${body}"></div>
        <a class="learn backlink" href="#${body}-${s.id}">VIEW ON THE ${label.toUpperCase()} ${body === "earth" ? "MAP" : "GLOBE"}</a>
      </aside>
    </div>
    <nav class="pager">
      <a href="#site-${body}-${prev.id}"><small>&larr; Previous</small><span>${esc(prev.name)}</span></a>
      <a href="#site-${body}-${next.id}"><small>Next &rarr;</small><span>${esc(next.name)}</span></a>
    </nav>
    <footer>
      TWIN — Terrestrial World Identification Network. Earth site data from the "Earth Analogs for the Moon and Mars" sheet; coordinates are approximate site centres.
      Photos from Wikipedia / Wikimedia Commons, credited on each image. Moon: LRO WAC mosaic; Mars: Viking MDIM 2.1 colour mosaic (NASA Moon Trek / Mars Trek). Borders: Natural Earth.
    </footer>`;

  // Minimap
  if (_miniMap) { _miniMap.remove(); _miniMap = null; }
  const mm = document.getElementById("minimap");
  if (body === "earth") {
    _miniMap = L.map(mm, { zoomControl: false, attributionControl: false, scrollWheelZoom: false, dragging: false, doubleClickZoom: false }).setView([s.lat, s.lng], 3);
    L.geoJSON(worldCountries(), { interactive: false, style: { color: "#56607a", weight: 0.7, fillColor: "#353b48", fillOpacity: 1 } }).addTo(_miniMap);
    L.marker([s.lat, s.lng], { icon: L.divIcon({ className: "pin-wrap", iconSize: [22, 22], iconAnchor: [11, 11], html: `<span class="pin ${s.analog === "Moon" ? "light" : ""}" style="--c:${c};width:22px;height:22px"></span>` }) }).addTo(_miniMap);
  } else {
    // Crop of the equirectangular mosaic, 120° wide, centred on the site.
    const spanX = 120, spanY = 60;
    const lat = Math.max(-90 + spanY / 2, Math.min(90 - spanY / 2, s.lat));
    const sizeX = 360 / spanX * 100, sizeY = 180 / spanY * 100;
    const fx = ((s.lng + 180) - spanX / 2) / (360 - spanX), fy = ((90 - lat) - spanY / 2) / (180 - spanY);
    mm.style.backgroundImage = `url('assets/${body}.jpg')`;
    mm.style.backgroundSize = `${sizeX}% ${sizeY}%`;
    mm.style.backgroundPosition = `${fx * 100}% ${fy * 100}%`;
    mm.style.backgroundRepeat = "repeat-x";
    const px = 50;
    const py = 50 + ((lat - s.lat) / spanY) * 100;
    mm.innerHTML = `<span class="pin" style="--c:${c};width:20px;height:20px;position:absolute;left:calc(${px}% - 10px);top:calc(${py}% - 10px)"></span>`;
  }
}
