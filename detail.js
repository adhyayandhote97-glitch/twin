// "Learn more" detail view, rendered into #detail for #site-<world>-<id>.
let _miniMap = null;

// ---------- Citations (Harvard style) ----------
const _esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function citeHTML(s) {
  const year = s.year == null ? "n.d." : s.year;
  const body = s.kind === "paper"
    ? `&lsquo;${_esc(s.title)}&rsquo;, <em>${_esc(s.publisher)}</em>.`
    : `<em>${_esc(s.title)}</em>. ${_esc(s.publisher)}.`;
  const link = s.url
    ? ` Available at: <a href="${_esc(s.url)}" target="_blank" rel="noopener">${_esc(s.url)}</a>${s.accessed ? ` (Accessed: ${_esc(s.accessed)})` : ""}.`
    : "";
  return `${_esc(s.author)} (${year}) ${body}${link}`;
}
const byAuthor = (a, b) => a.author.localeCompare(b.author) || (a.year || 9999) - (b.year || 9999) || a.title.localeCompare(b.title);
function sourcesHTML(list) {
  return list.length
    ? `<ol class="cites">${[...list].sort(byAuthor).map(s => `<li>${citeHTML(s)}</li>`).join("")}</ol>`
    : `<p class="note">Citation pending.</p>`;
}

// #references: every citation on the site in one place.
function renderReferences() {
  document.title = "References · TWIN";
  // Which sites use each source.
  const usedBy = new Map();
  for (const body of Object.keys(BODIES)) for (const site of BODIES[body].sites) for (const src of site.sources) {
    if (!usedBy.has(src)) usedBy.set(src, []);
    usedBy.get(src).push({ body, site });
  }
  const short = x => x.name.split(/[,(&:]/)[0].trim();
  const cited = [...usedBy.keys()].sort(byAuthor);
  const pending = [];
  for (const body of Object.keys(BODIES)) for (const site of BODIES[body].sites) if (!site.sources.length) pending.push({ body, site });
  const photos = [];
  for (const body of Object.keys(BODIES)) for (const site of BODIES[body].sites) {
    const ph = PHOTOS[`${body}-${site.id}`];
    if (ph) photos.push({ body, site, ph });
  }
  const plain = list => `<ol class="cites">${[...list].sort(byAuthor).map(s => `<li>${citeHTML(s)}</li>`).join("")}</ol>`;
  document.getElementById("detail").innerHTML = `
    <header class="refs-head">
      <a class="refs-back" href="#earth"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>Back to the globe</a>
      <h1>References</h1>
      <p>Every source used on TWIN, in Harvard style. ${cited.length} sources back the ${EARTH_SITES.length} Earth sites and ${MOON_SITES.length + MARS_SITES.length} Moon and Mars places; each one lists the pages that rely on it.</p>
      <nav class="refs-nav"><a href="#refs-sites">Sites and missions</a><a href="#refs-photos">Photographs</a><a href="#refs-data">Maps and data</a><a href="#refs-software">Software</a></nav>
    </header>
    <div class="refs-wrap">
      <section id="refs-sites"><h2>Sites and missions</h2>
        <ol class="cites">${cited.map(src => `<li>${citeHTML(src)}
          <span class="usedby">Used for: ${usedBy.get(src).map(u => `<a href="#site-${u.body}-${u.site.id}">${_esc(short(u.site))}</a>`).join(", ")}</span></li>`).join("")}</ol>
        ${pending.length ? `<p class="note">Citation pending for: ${pending.map(u => `<a href="#site-${u.body}-${u.site.id}">${_esc(short(u.site))}</a>`).join(", ")}.</p>` : ""}
      </section>
      <section id="refs-photos"><h2>Photographs</h2>
        <p class="note">All photographs are from Wikimedia Commons. Each entry gives the creator and licence as recorded on the file page.</p>
        <ol class="cites">${photos.map(({ body, site, ph }) => `<li>${_esc(ph.credit)}. <em>Photograph used for ${_esc(short(site))}</em>. Wikimedia Commons. Available at: <a href="${_esc(ph.file)}" target="_blank" rel="noopener">${_esc(decodeURIComponent(ph.file))}</a>.</li>`).join("")}</ol>
      </section>
      <section id="refs-data"><h2>Maps and data</h2>${plain(DATA_SOURCES)}</section>
      <section id="refs-software"><h2>Software</h2>${plain(SOFTWARE_SOURCES)}</section>
    </div>
    <footer>TWIN — Terrestrial World Identification Network.</footer>`;
}

function renderSky() {
  document.title = "Live sky · TWIN";
  const live = DATA_SOURCES.slice(-5);
  const stel = SOFTWARE_SOURCES[SOFTWARE_SOURCES.length - 1];
  document.getElementById("detail").innerHTML = `
    <header class="refs-head">
      <a class="refs-back" href="#earth"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>Back to the globe</a>
      <h1>Live sky</h1>
      <p>Where the Moon and Mars are right now. Every figure is worked out in your browser from published NASA and JPL formulas, so nothing is fetched and nothing is tracked. The Moon and Mars globes draw the same day/night line.</p>
    </header>
    <div class="refs-wrap about">
      <section><h2>Right now</h2><div class="sky-grid" id="sky-grid"></div></section>
      <section><h2>Tonight's sky</h2>
        <p>Stellarium Web is a free planetarium that shows the stars and planets above you in real time. It is run by a third party, so it only loads if you ask for it.</p>
        <div class="sky-frame" id="sky-frame"><button class="learn" id="sky-load" type="button">SHOW THE LIVE STAR MAP</button></div>
        <p class="note"><a href="https://stellarium-web.org/" target="_blank" rel="noopener">Open Stellarium Web in a new tab</a></p>
      </section>
      <section><h2>How the numbers are worked out</h2>
        <p>Moon phase: interpolated between NASA's tabulated times of new Moon, first quarter, full Moon and last quarter (2026 to 2028). Mars season, Mars time and the point where the Sun is overhead: the NASA GISS Mars24 algorithm. Earth&ndash;Mars distance: JPL's approximate planetary positions (valid 1800 to 2050), with signal time at the speed of light. The Moon's day/night line ignores libration, so it can be off by up to about 8&deg; of longitude. Outside a formula's valid range the figure is shown as &ldquo;n.d.&rdquo;.</p>
        <ol class="cites">${[...live, stel].sort(byAuthor).map(s => `<li>${citeHTML(s)}</li>`).join("")}</ol>
      </section>
    </div>
    <footer>TWIN &mdash; Terrestrial World Identification Network. <a href="#about">About</a> &middot; <a href="#references">References</a></footer>`;
  document.getElementById("sky-load").addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.src = "https://stellarium-web.org/"; f.title = "Stellarium Web live star map";
    f.referrerPolicy = "no-referrer"; f.allow = "fullscreen; geolocation";
    document.getElementById("sky-frame").replaceChildren(f);
  });
  const fig = (k, v, n) => `<div class="sky-fig"><span class="k">${k}</span><span class="v">${v}</span>${n ? `<span class="n">${n}</span>` : ""}</div>`;
  const tick = () => {
    const grid = document.getElementById("sky-grid");
    if (!grid) { clearInterval(timer); return; }
    const now = new Date(), m = Live.moon(now), r = Live.mars(now), em = Live.earthMars(now);
    const hm = h => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.floor((h % 1) * 60)).padStart(2, "0")}`;
    const ll = p => `${Math.abs(p.lat).toFixed(1)}&deg; ${p.lat < 0 ? "S" : "N"}, ${Math.abs(p.lng).toFixed(1)}&deg; ${p.lng < 0 ? "W" : "E"}`;
    grid.innerHTML = [
      fig("Time now", now.toISOString().slice(0, 19).replace("T", " ") + " UTC"),
      fig("Moon phase", m ? m.name : "n.d.", m ? `${Math.round(m.illuminated * 100)}% of the near side lit` : ""),
      fig("Sun overhead on the Moon", m ? ll(m.subsolar) : "n.d.", "Approximate, ignores libration"),
      fig("Mars time at 0&deg; longitude", hm(r.mst), "Mean solar time (Coordinated Mars Time)"),
      fig("Mars season", `L<sub>s</sub> ${r.Ls.toFixed(1)}&deg;`, "0&deg; is the start of northern spring"),
      fig("Sun overhead on Mars", ll(r.subsolar)),
      fig("Earth to Mars", em ? `${(em.km / 1e6).toFixed(1)} million km` : "n.d.", em ? `${em.au.toFixed(3)} AU` : ""),
      fig("Signal time, one way", em ? `${Math.floor(em.lightSeconds / 60)} min ${Math.round(em.lightSeconds % 60)} s` : "n.d.", "At the speed of light")
    ].join("");
  };
  const timer = setInterval(tick, 1000);
  tick();
}

function renderAbout() {
  document.title = "About · TWIN";
  const all = [...EARTH_SITES, ...MOON_SITES, ...MARS_SITES];
  const pairs = EARTH_SITES.reduce((n, s) => n + s.twins.length, 0);
  const cited = all.filter(s => s.sources.length).length;
  document.getElementById("detail").innerHTML = `
    <header class="refs-head">
      <a class="refs-back" href="#earth"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>Back to the globe</a>
      <h1>About TWIN</h1>
      <p>TWIN, the Terrestrial World Identification Network, matches places on Earth to places on the Moon and Mars, so astronauts and rovers can practise here first. It was made for the NASA Space Apps Challenge 2026 and is an independent project: it is not a NASA product and NASA has not endorsed it.</p>
    </header>
    <div class="refs-wrap about">
      <section><h2>How a twin is made</h2>
        <p>A pairing appears only if it can be cited. Either one source links both places directly, or the two places share a feature type and each is cited on its own, such as a lava tube with skylights on Earth and on Mars. ${pairs} Earth-to-Moon or Earth-to-Mars links are listed this way. Pairs that could not be cited are left out and the page says &ldquo;citation pending&rdquo;.</p></section>
      <section><h2>How Compare &amp; rank scores</h2>
        <p>Each Earth site is ticked or not on eight analog dimensions (geology and mineralogy, terrain, temperature and light, water and ice, dust and wind, biology, caves and subsurface, and mission operations), taken from the team&rsquo;s research sheet. For the Moon or Mars as a whole, or for one chosen place, TWIN weights those dimensions on a 0&ndash;5 scale. A site&rsquo;s score is the weighted share of dimensions it matches, times 100, plus 8 points if it is a cited twin of the chosen place. The weights are TWIN&rsquo;s own choices and you can change them in the panel. The ticks are coarse, so ties are common. Sites not listed as an analog for the chosen world are marked &ldquo;not scored&rdquo;.</p></section>
      <section><h2>Coordinates and imagery</h2>
        <p>Moon and Mars positions use planetocentric latitude and east-positive longitude from &minus;180&deg; to 180&deg;. Feature positions follow the IAU Gazetteer of Planetary Nomenclature; landing sites follow the mission records. The Moon and Mars globes use the LRO WAC and Viking colourised mosaics. Missing values are shown as &ldquo;n.d.&rdquo; or &ldquo;citation pending&rdquo;, never as zero.</p></section>
      <section><h2>Sources</h2>
        <p>${cited} of ${all.length} places have at least one source listed on their page. Every source is listed in Harvard style on the <a href="#references">References</a> page.</p></section>
      <section><h2>Privacy and security</h2>
        <p>TWIN is a static site. It sets no cookies, collects no personal data and loads every script, font and image from its own address.</p></section>
    </div>
    <footer>TWIN &mdash; Terrestrial World Identification Network. <a href="#references">References</a></footer>`;
}

function renderDetail(body, id) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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

  html += `<section class="sources"><h2>Sources</h2>${sourcesHTML(s.sources)}
    <p class="note"><a href="#references">See all references</a></p></section>`;

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
      Photos from Wikipedia / Wikimedia Commons, credited on each image. Moon: LRO WAC mosaic; Mars: Viking MDIM 2.1 colour mosaic (NASA Moon Trek / Mars Trek). Borders: Natural Earth. <a href="#references">References</a>.
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
