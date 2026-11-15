// TWIN (Terrestrial World Identification Network): one page, hash-routed.
//   #earth | #moon | #mars                 world view
//   #earth-<id> | #moon-<id> | #mars-<id>  world view with a site card open
//   #site-<world>-<id>                     "Learn more" detail view
//   #references                            every citation on the site
(function () {
  const KIND = {
    "Impact crater": "Impact craters",
    "Volcanic field": "Volcanic & lava tubes",
    "Volcanic field / lava tube": "Volcanic & lava tubes",
    "Lava tube": "Volcanic & lava tubes",
    "Ice caves / volcanic": "Polar & ice",
    "Polar desert": "Polar & ice",
    "Polar volcanic": "Polar & ice",
    "High cold desert": "Deserts & salt flats",
    "Hyperarid desert": "Deserts & salt flats",
    "High hyperarid desert": "Deserts & salt flats",
    "Hot desert / evaporite": "Deserts & salt flats",
    "Mineral / evaporite": "Minerals & acidic water",
    "Acidic / mineral": "Minerals & acidic water"
  };
  const kindOf = s => KIND[s.category] || "Other";
  const GROUP_ORDER = ["Americas", "Europe", "Asia", "Oceania & Pacific", "Polar regions"];
  const TEXTURE = { moon: "assets/moon.jpg", mars: "assets/mars.jpg" };
  const ATMOS = { earth: "#6f9be0", moon: "#9aa4b5", mars: "#e07a4f" };
  const START = { earth: { lat: 20, lng: 10 }, moon: { lat: 15, lng: 10 }, mars: { lat: 15, lng: -60 } };

  const state = { body: null, selected: null, search: "", f: {} };
  let globe = null, globeEls = {}, countries = null;

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const siteColor = (body, s) => body === "earth" ? ANALOG_COLORS[s.analog] : PLANET_STATUS[s.status].color;
  const setHash = h => { if (location.hash !== "#" + h) history.replaceState(null, "", "#" + h); };

  // ---------- Filters ----------
  function filterDefs(body) {
    if (body === "earth") {
      return [
        { key: "analog", title: "Analog for", two: true, opts: ["Moon", "Mars", "Both"].map(v => ({ v, label: v === "Both" ? "Moon & Mars" : v, color: ANALOG_COLORS[v] })), test: (s, v) => s.analog === v },
        { key: "kind", title: "Site type", opts: [...new Set(EARTH_SITES.map(kindOf))].map(v => ({ v, label: v })), test: (s, v) => kindOf(s) === v },
        { key: "dim", title: "Matches on", opts: DIMENSIONS.map(d => ({ v: d.key, label: d.label })), test: (s, v) => s.dims.includes(v), all: true }
      ];
    }
    const sites = BODIES[body].sites;
    const statuses = Object.keys(PLANET_STATUS).filter(k => sites.some(s => s.status === k));
    return [
      { key: "status", title: "Status", opts: statuses.map(v => ({ v, label: PLANET_STATUS[v].label, color: PLANET_STATUS[v].color })), test: (s, v) => s.status === v },
      { key: "analogs", title: "Has an Earth analog for", two: true, opts: ["Moon", "Mars", "Both"].map(v => ({ v, label: v === "Both" ? "Moon & Mars" : v + " only", color: ANALOG_COLORS[v] })),
        test: (s, v) => s.earthAnalogs.some(id => findSite("earth", id).analog === v) }
    ];
  }

  function renderFilters() {
    $("filters").innerHTML = filterDefs(state.body).map(d => `
      <div class="filter-group">
        <h3>${esc(d.title)}</h3>
        <div class="checks ${d.two ? "two" : ""}">
          ${d.opts.map(o => `
            <label class="check">
              <input type="checkbox" data-key="${d.key}" value="${esc(o.v)}" ${state.f[d.key] && state.f[d.key].has(o.v) ? "checked" : ""}>
              <span>${esc(o.label)}</span>${o.color ? `<span class="dot" style="background:${o.color};${o.color === ANALOG_COLORS.Moon ? "box-shadow:0 0 0 1px #777" : ""}"></span>` : ""}
            </label>`).join("")}
        </div>
      </div>`).join("");
    $("filters").querySelectorAll("input").forEach(inp => inp.addEventListener("change", () => {
      const set = state.f[inp.dataset.key] || (state.f[inp.dataset.key] = new Set());
      inp.checked ? set.add(inp.value) : set.delete(inp.value);
      applyFilters();
    }));
  }

  function visibleSites() {
    const defs = filterDefs(state.body);
    const q = state.search.trim().toLowerCase();
    return BODIES[state.body].sites.filter(s => {
      if (q && !(s.name + " " + (s.region || "") + " " + (s.type || s.category)).toLowerCase().includes(q)) return false;
      for (const d of defs) {
        const set = state.f[d.key];
        if (!set || !set.size) continue;
        const vals = [...set];
        if (!(d.all ? vals.every(v => d.test(s, v)) : vals.some(v => d.test(s, v)))) return false;
      }
      return true;
    });
  }

  function applyFilters() {
    const vis = visibleSites();
    const ids = new Set(vis.map(s => s.id));
    visSites = BODIES[state.body].sites.filter(s => ids.has(s.id));
    refreshHtml();
    const noun = state.body === "earth" ? "Earth sites" : (state.body === "moon" ? "lunar sites" : "Martian sites");
    $("count").textContent = `${vis.length} ${noun}`;
    renderList(vis);
  }

  function renderList(vis) {
    let groups = state.body === "earth"
      ? GROUP_ORDER.map(g => [g, vis.filter(s => s.group === g)])
      : Object.keys(PLANET_STATUS).map(k => [PLANET_STATUS[k].label, vis.filter(s => s.status === k)]);
    groups = groups.filter(([, arr]) => arr.length);
    $("list").innerHTML = groups.length ? groups.map(([g, arr]) => `
      <div class="list-group">
        <h3>${esc(g)}</h3>
        ${arr.map(s => `<button class="list-item ${state.selected === s.id ? "active" : ""}" data-id="${s.id}">
          <span class="dot" style="background:${siteColor(state.body, s)};${state.body === "earth" && s.analog === "Moon" ? "box-shadow:0 0 0 1px #777" : ""}"></span><span>${esc(s.name)}</span></button>`).join("")}
      </div>`).join("") : `<p class="empty">No sites match these filters.</p>`;
    $("list").querySelectorAll(".list-item").forEach(b => b.addEventListener("click", () => pick(b.dataset.id)));
  }

  function renderLegend() {
    const items = state.body === "earth"
      ? [["Moon analog", ANALOG_COLORS.Moon], ["Mars analog", ANALOG_COLORS.Mars], ["Both", ANALOG_COLORS.Both]]
      : Object.keys(PLANET_STATUS).filter(k => BODIES[state.body].sites.some(s => s.status === k)).map(k => [PLANET_STATUS[k].label, PLANET_STATUS[k].color]);
    $("legend").innerHTML = items.map(([l, c]) => `<span><i class="dot" style="background:${c};border:1px solid rgba(255,255,255,.6)"></i>${l}</span>`).join("") +
      `<span class="hint">Drag to spin · scroll or +/− to zoom</span>`;
  }

  function pinHTML(body, s) {
    const light = body === "earth" && s.analog === "Moon";
    return `<span class="pin ${light ? "light" : ""} ${state.selected === s.id ? "selected" : ""}" style="--c:${siteColor(body, s)}"></span><span class="pin-label">${esc(s.name)}</span>`;
  }


  // ---------- Region labels (big + tier 1 always, tier 2 once zoomed in) ----------
  // [name, lat, lng, tier, "big"] — "big" = oceans, maria, large basins/plains.
  const EARTH_LABELS = [
    // oceans
    ["PACIFIC OCEAN", 0, -150, 0, "ocean"], ["PACIFIC OCEAN", 5, 170, 0, "ocean"], ["ATLANTIC OCEAN", 25, -42, 0, "ocean"],
    ["ATLANTIC OCEAN", -22, -18, 0, "ocean"], ["INDIAN OCEAN", -18, 78, 0, "ocean"], ["SOUTHERN OCEAN", -60, 20, 0, "ocean"],
    ["ARCTIC OCEAN", 83, 0, 0, "ocean"],
    // large countries & regions
    ["Canada", 58, -103, 1], ["United States", 39, -99, 1], ["Mexico", 23, -102, 1], ["Brazil", -10, -53, 1],
    ["Argentina", -36, -65, 1], ["Peru", -9.5, -75, 1], ["Colombia", 4, -73, 1], ["Chile", -27, -70.5, 1],
    ["Greenland", 73, -41, 1], ["Iceland", 65, -18.5, 1], ["Russia", 61, 97, 1], ["Kazakhstan", 48, 67, 1],
    ["China", 34, 102, 1], ["Mongolia", 46.5, 103, 1], ["India", 22, 79, 1], ["Iran", 32.5, 54, 1],
    ["Saudi Arabia", 24, 45, 1], ["Algeria", 28, 2.5, 1], ["Libya", 27, 17.5, 1], ["Egypt", 26.5, 30, 1],
    ["Sudan", 16, 30, 1], ["Mali", 17.5, -3, 1], ["Niger", 17, 9.5, 1], ["Chad", 15.5, 18.5, 1],
    ["Nigeria", 9.5, 8, 1], ["Ethiopia", 8.5, 39.5, 1], ["DR Congo", -3, 23.5, 1], ["Angola", -12.5, 17.5, 1],
    ["South Africa", -30, 24.5, 1], ["Madagascar", -19.5, 46.7, 1], ["Australia", -25, 134, 1], ["Indonesia", -2, 117, 1],
    ["Antarctica", -80, 30, 1], ["Antarctica", -82, -120, 1],
    ["Spain", 40, -3.7, 1], ["France", 46.6, 2.4, 1], ["Germany", 51, 10.3, 1], ["Norway", 63, 9.5, 1],
    ["Sweden", 63.5, 16, 1], ["Finland", 63.5, 26.5, 1], ["Ukraine", 49, 31.5, 1], ["Turkey", 39, 35, 1],
    ["Japan", 37, 138.5, 1], ["Pakistan", 30, 69.5, 1], ["Afghanistan", 33.8, 66, 1], ["Venezuela", 7, -66, 1],
    ["Bolivia", -17, -64.5, 1], ["New Zealand", -42, 172.5, 1], ["Svalbard", 78.5, 17, 1],
    // smaller places, shown when zoomed in
    ["United Kingdom", 53, -1.8, 2], ["Ireland", 53.2, -8, 2], ["Portugal", 39.6, -8, 2], ["Italy", 42.8, 12.6, 2],
    ["Poland", 52, 19.3, 2], ["Romania", 45.8, 24.9, 2], ["Greece", 39.3, 22, 2], ["Belarus", 53.6, 28, 2],
    ["Morocco", 31.8, -6.5, 2], ["Tunisia", 34, 9.5, 2], ["Mauritania", 20.3, -10.5, 2], ["Senegal", 14.4, -14.5, 2],
    ["Ghana", 7.9, -1.1, 2], ["Cameroon", 5.7, 12.4, 2], ["Kenya", 0.4, 37.9, 2], ["Somalia", 6, 46, 2],
    ["Tanzania", -6.3, 34.8, 2], ["Zambia", -13.5, 27.8, 2], ["Mozambique", -17.5, 35.5, 2], ["Namibia", -22.5, 17.5, 2],
    ["Botswana", -22.3, 24, 2], ["Zimbabwe", -19, 29.8, 2], ["Iraq", 33, 43.7, 2], ["Syria", 35, 38.5, 2],
    ["Yemen", 15.8, 47.5, 2], ["Oman", 21, 57, 2], ["Uzbekistan", 41.5, 64, 2], ["Turkmenistan", 39, 59.5, 2],
    ["Nepal", 28.3, 84, 2], ["Bangladesh", 23.8, 90.3, 2], ["Myanmar", 21, 96, 2], ["Thailand", 15.5, 101, 2],
    ["Vietnam", 15.5, 107.5, 2], ["Philippines", 12, 122.5, 2], ["Malaysia", 3.8, 102, 2], ["Papua New Guinea", -6.3, 144.5, 2],
    ["South Korea", 36.3, 127.9, 2], ["North Korea", 40.2, 127.2, 2], ["Sri Lanka", 7.7, 80.7, 2], ["Taiwan", 23.7, 121, 2],
    ["Cuba", 21.8, -79, 2], ["Guatemala", 15.6, -90.3, 2], ["Ecuador", -1.5, -78.3, 2], ["Paraguay", -23.3, -58.4, 2],
    ["Uruguay", -32.8, -56, 2], ["Guyana", 5, -58.9, 2], ["Hawaii", 20.3, -156.5, 2], ["Alaska", 64.5, -152, 2],
    ["Canary Islands", 28.6, -15.5, 2], ["Ladakh", 34.2, 77.6, 2], ["Tibetan Plateau", 33, 88, 2]
  ];
  const MOON_LABELS = [
    ["OCEANUS PROCELLARUM", 18, -57, 0, "big"], ["MARE IMBRIUM", 33, -16, 0, "big"], ["MARE SERENITATIS", 28, 17.5, 0, "big"],
    ["MARE TRANQUILLITATIS", 8.5, 31, 0, "big"], ["MARE CRISIUM", 17, 59, 0, "big"], ["MARE FECUNDITATIS", -8, 51, 0, "big"],
    ["MARE NECTARIS", -15, 35, 0, "big"], ["MARE NUBIUM", -21, -17, 0, "big"], ["MARE HUMORUM", -24, -39, 0, "big"],
    ["MARE FRIGORIS", 56, 1, 0, "big"], ["MARE AUSTRALE", -46, 91, 0, "big"], ["MARE MOSCOVIENSE", 27, 148, 0, "big"],
    ["SOUTH POLE–AITKEN BASIN", -50, -160, 0, "big"], ["FAR SIDE HIGHLANDS", 18, 170, 0, "big"], ["SOUTHERN HIGHLANDS", -38, 12, 0, "big"],
    ["Mare Smythii", -1.3, 87, 1], ["Mare Vaporum", 13.3, 3.6, 1], ["Sinus Medii", 2, 1, 1], ["Mare Insularum", 7.5, -30.9, 1],
    ["Mare Cognitum", -10, -23, 1], ["Montes Apenninus", 19, -3, 1], ["Plato", 51.6, -9.4, 1], ["Clavius", -58.4, -14.4, 1],
    ["Grimaldi", -5.2, -68.6, 1], ["Aristarchus", 23.7, -47.4, 1], ["Kepler", 8.1, -38, 2], ["Langrenus", -8.9, 61, 1],
    ["Mare Ingenii", -33.7, 163.5, 1], ["Tsiolkovskiy", -20.4, 129.1, 1], ["Hertzsprung", 2.4, -129, 1], ["Korolev", -4, -157, 1],
    ["Apollo Basin", -36, -151, 1],
    ["Ptolemaeus", -9.3, -1.9, 2], ["Alphonsus", -13.4, -3.2, 2], ["Archimedes", 29.7, -4, 2], ["Eratosthenes", 14.5, -11.3, 2],
    ["Petavius", -25.1, 60.4, 2], ["Theophilus", -11.4, 26.4, 2], ["Posidonius", 31.9, 29.9, 2], ["Mare Marginis", 13, 86.5, 2],
    ["Schickard", -44.4, -54.6, 2], ["Gassendi", -17.6, -40, 2], ["Montes Carpatus", 14.5, -24.4, 2], ["Rupes Recta", -22, -7.5, 2],
    ["Mendeleev", 5.7, 140.9, 2], ["Daedalus", -5.9, 179.4, 2], ["Von Kármán", -44.8, 175.9, 2], ["Schrödinger", -75, 132.4, 2],
    ["Mare Orientale", -19.4, -92.8, 2], ["Montes Rook", -20, -83, 2]
  ];
  const MARS_LABELS = [
    ["THARSIS", 2, -100, 0, "big"], ["ARABIA TERRA", 21, 5, 0, "big"], ["HELLAS PLANITIA", -42, 70, 0, "big"],
    ["VALLES MARINERIS", -13, -65, 0, "big"], ["VASTITAS BOREALIS", 65, -30, 0, "big"], ["NOACHIS TERRA", -45, -5, 0, "big"],
    ["TERRA CIMMERIA", -35, 145, 0, "big"], ["TERRA SIRENUM", -40, -150, 0, "big"], ["AMAZONIS PLANITIA", 24, -160, 0, "big"],
    ["ELYSIUM PLANITIA", 3, 155, 0, "big"], ["UTOPIA PLANITIA", 40, 100, 0, "big"],
    ["Argyre Planitia", -50, -43, 1], ["Acidalia Planitia", 47, -22, 1], ["Chryse Planitia", 27, -42, 1], ["Isidis Planitia", 12, 88, 1],
    ["Syrtis Major", 8, 69, 1], ["Elysium Mons", 25, 147, 1], ["Alba Mons", 40, -110, 1], ["Tempe Terra", 40, -70, 1],
    ["Promethei Terra", -60, 100, 1], ["Planum Australe", -84, 160, 1], ["Tyrrhena Terra", -15, 90, 1], ["Hesperia Planum", -22, 110, 1],
    ["Ascraeus Mons", 11.8, -104.5, 2], ["Pavonis Mons", 1.5, -113, 2], ["Lunae Planum", 10, -67, 2], ["Daedalia Planum", -20, -125, 2],
    ["Solis Planum", -25, -90, 2], ["Xanthe Terra", 5, -45, 2], ["Margaritifer Terra", -5, -25, 2], ["Terra Sabaea", 0, 40, 2],
    ["Aeolis Mensae", -3, 140, 2], ["Noctis Labyrinthus", -7, -102, 2], ["Kasei Valles", 24, -65, 2], ["Huygens", -14, 55.6, 2],
    ["Schiaparelli", -2.7, 16.7, 2], ["Lyot", 50.5, 29.3, 2], ["Tharsis Tholus", 13.4, -90.8, 2], ["Hecates Tholus", 32, 150, 2]
  ];
  const LABELS = {};
  for (const [body, list] of [["earth", EARTH_LABELS], ["moon", MOON_LABELS], ["mars", MARS_LABELS]])
    LABELS[body] = list.map(([name, lat, lng, tier, kind]) => ({ name, lat, lng, tier, big: kind === "ocean" || kind === "big" }));
  let labelTier = 0, visSites = [], curLabels = [], pinClickAt = 0;
  const backgroundClick = () => { if (Date.now() - pinClickAt > 400 && !Compare.isOpen()) close(); };
  // A pin or list click opens the site's card, or adds/removes it while Compare is open.
  // Compare needs every pin element, including ones globe.gl has detached on the far side.
  window.TWIN_PINS = () => state.body === "earth" ? globeEls : {};
  const pick = id => state.body === "earth" && Compare.isOpen() ? Compare.toggle(id) : select(id, true);
  // Pins and region labels share globe.gl's single HTML layer.
  const refreshHtml = () => globe.htmlElementsData(visSites.concat(curLabels));
  function updateLabels(force) {
    const tier = globe.pointOfView().altitude < 1.1 ? 2 : 1;
    if (tier === labelTier && !force) return;
    labelTier = tier;
    curLabels = LABELS[state.body].filter(l => l.tier <= tier);
    refreshHtml();
  }

  // ---------- 3D globe (Earth, Moon, Mars) ----------
  function initGlobe(body) {
    if (!globe) {
      globe = Globe({ animateIn: false })($("globe"))
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true).atmosphereAltitude(0.12)
        .htmlLat("lat").htmlLng("lng").htmlAltitude(0.005)
        .htmlElement(s => {
          if (s.tier !== undefined) {
            const el = document.createElement("div");
            el.className = `globe-label t${s.tier}${s.big ? " big" : ""}`;
            el.textContent = s.name;
            return el;
          }
          const wrap = document.createElement("div");
          wrap.className = "pin-wrap globe-pin";
          wrap.innerHTML = pinHTML(state.body, s);
          // Keep the pin's click from also reaching the globe/country underneath (which closes the card).
          for (const ev of ["pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"])
            wrap.addEventListener(ev, e => e.stopPropagation());
          wrap.dataset.site = s.id;
          wrap.addEventListener("click", e => { e.stopPropagation(); pinClickAt = Date.now(); pick(s.id); });
          if (state.body === "earth") Compare.decoratePin(wrap, s.id);
          globeEls[s.id] = wrap;
          return wrap;
        })
        .polygonAltitude(0.004)
        .polygonCapColor(() => "#3a4150").polygonSideColor(() => "rgba(0,0,0,0)").polygonStrokeColor(() => "#6a7590")
        .onGlobeClick(() => backgroundClick())
        .onPolygonClick(() => backgroundClick())
        .onZoom(() => updateLabels());
      ocean = globe.globeMaterial().color.clone();
      const ctr = globe.controls();
      ctr.minDistance = 112;   // close-up
      ctr.maxDistance = 1400;  // far zoom-out
      ctr.zoomSpeed = 1.2;
      window.addEventListener("resize", sizeGlobe);
    }
    globeEls = {};
    const isEarth = body === "earth";
    if (isEarth && !countries) countries = worldCountries().features;
    // Earth: dark ocean sphere with country shapes on top. Moon/Mars: photo mosaics.
    globe.globeImageUrl(isEarth ? null : TEXTURE[body]).atmosphereColor(ATMOS[body]);
    if (isEarth) { setTimeout(paintOcean, 0); setTimeout(paintOcean, 1200); }
    else {
      // Undo the ocean tint so the photo texture isn't darkened (globe.gl keeps
      // the last rendered colour once it nulls the material colour).
      const mat = globe.globeMaterial();
      if (mat.color) { mat.color.set("#ffffff"); mat.needsUpdate = true; }
    }
    globe.polygonsData(isEarth ? countries : []);
    labelTier = -1; visSites = []; curLabels = [];
    globe.htmlElementsData([]);
    globe.pointOfView({ ...START[body], altitude: 2.6 }, 0);
    updateLabels(true);
  }

  // globe.gl keeps the last photo texture when the image URL is cleared, so
  // strip it and colour the sphere as ocean (re-run once late in case a
  // Moon/Mars texture finished loading after the switch).
  let ocean = null;
  function paintOcean() {
    if (state.body !== "earth") return;
    const mat = globe.globeMaterial();
    if (mat.map) { mat.map = null; }
    if (!mat.color) mat.color = ocean;
    mat.color.set("#1a2233");
    mat.needsUpdate = true;
  }

  function sizeGlobe() {
    if (!globe) return;
    const r = $("mapwrap").getBoundingClientRect();
    globe.width(r.width).height(r.height);
  }

  // ---------- Card ----------
  const row = (k, v) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`;

  function cardHTML(body, s) {
    let rows, desc;
    if (body === "earth") {
      rows = row("Type", esc(s.category).replace(" / ", "<br>")) + row("Location", esc(s.region)) +
        row("Matches", `${s.dims.length} of 8 analog dimensions`) +
        row("Twin of", s.twins.length ? esc(s.twins.map(id => findAny(id).site.name.split(/[,(&:]/)[0].trim()).join(", ")) : "Citation pending") +
        row("Analog for", `<span class="pill ${s.analog}">${s.analog === "Both" ? "Moon &amp; Mars" : s.analog}</span>`);
      desc = s.why;
    } else {
      const names = s.twins.map(id => findSite("earth", id).name.split(/[,(:]/)[0].trim());
      rows = row("Feature", esc(s.type)) + row("Explored by", esc(s.explored)) + row("Earth twins", names.length ? esc(names.join(", ")) : "Citation pending") +
        row("Status", `<span class="pill" style="background:${PLANET_STATUS[s.status].color}">${PLANET_STATUS[s.status].label}</span>`);
      desc = s.summary + " " + s.details;
    }
    const ph = PHOTOS[`${body}-${s.id}`];
    return `
      <div class="card-img ${ph ? "" : "noimg"}" data-caption="${esc(BODIES[body].label)}" ${ph ? `style="background-image:url('${ph.src}')"` : ""}>
        <button class="card-close" id="card-close" aria-label="Close">
          <svg width="26" height="26" viewBox="0 0 24 24" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
        </button>
        ${ph ? `<span class="credit">Photo: ${esc(ph.credit)}</span>` : ""}
      </div>
      <div class="card-body">
        <h2>${esc(s.name)}</h2>
        <div class="rows">${rows}</div>
        <p class="desc">${esc(desc)}</p>
        <a class="learn" href="#site-${body}-${s.id}">LEARN MORE</a>
        ${body === "earth" ? `<button class="learn learn-2" id="card-compare">COMPARE &amp; RANK THIS SITE</button>` : ""}
      </div>`;
  }

  function markSelected(id, on) {
    const el = globeEls[id];
    const pin = el && el.querySelector(".pin");
    pin && pin.classList.toggle("selected", on);
    if (el) el.style.zIndex = on ? 1000 : "";
  }

  function select(id, move) {
    const body = state.body;
    const s = findSite(body, id);
    if (!s) return;
    if (state.selected) markSelected(state.selected, false);
    state.selected = id;
    markSelected(id, true);
    setHash(`${body}-${id}`);

    const card = $("card");
    card.innerHTML = cardHTML(body, s);
    card.hidden = false;
    card.scrollTop = 0;
    $("card-close").addEventListener("click", e => { e.stopPropagation(); close(); });
    if ($("card-compare")) $("card-compare").addEventListener("click", () => { close(); Compare.open(id); });
    renderList(visibleSites());
    if (!move) return;

    // Turn the globe so the site sits to the right of the card.
    const wide = window.innerWidth > 900;
    const alt = Math.min(globe.pointOfView().altitude, 2.2);
    globe.pointOfView({ lat: s.lat * 0.85, lng: s.lng - (wide ? 40 : 0), altitude: alt }, move === "instant" ? 0 : 1000);
  }

  function close() {
    $("card").hidden = true;
    if (state.selected) markSelected(state.selected, false);
    state.selected = null;
    setHash(state.body);
    renderList(visibleSites());
  }

  // ---------- World switching ----------
  const SUBTITLES = {
    earth: "Places on Earth that scientists and astronauts use to stand in for the Moon and Mars. White points copy the Moon, red points copy Mars, yellow points copy both.",
    moon: "Landing sites and landmarks on the Moon, each linked to the places on Earth used to study or rehearse them.",
    mars: "Landing sites and landmarks on Mars, each linked to the places on Earth used to study or rehearse them."
  };

  function setBody(body) {
    Compare.close();
    state.body = body; state.selected = null; state.f = {}; state.search = ""; $("search").value = "";
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.body === body));
    $("subtitle").textContent = SUBTITLES[body];
    $("search").placeholder = body === "earth" ? "Find a site" : body === "moon" ? "Find a place on the Moon" : "Find a place on Mars";
    $("card").hidden = true;
    $("mapwrap").className = "map-wrap " + body;
    initGlobe(body); sizeGlobe();
    renderFilters(); renderLegend(); applyFilters();
  }

  // ---------- Router ----------
  function route() {
    const h = decodeURIComponent(location.hash.replace("#", ""));
    if (h === "references" || h.startsWith("refs-")) {
      const fresh = document.title !== "References · TWIN";
      document.body.classList.add("detail-mode");
      $("app").hidden = true; $("detail").hidden = false;
      if (fresh) renderReferences();
      const target = h.startsWith("refs-") && document.getElementById(h);
      if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
      return;
    }
    const m = h.match(/^site-(earth|moon|mars)-([a-z0-9]+)$/);
    if (m && findSite(m[1], m[2])) {
      document.body.classList.add("detail-mode");
      $("app").hidden = true; $("detail").hidden = false;
      renderDetail(m[1], m[2]);
      window.scrollTo(0, 0);
      return;
    }
    document.body.classList.remove("detail-mode");
    $("detail").hidden = true; $("app").hidden = false;
    document.title = "TWIN · Terrestrial World Identification Network";
    const [b, id] = h.split("-");
    const body = BODIES[b] ? b : "earth";
    if (body !== state.body) setBody(body);
    else sizeGlobe();
    if (id && findSite(body, id)) { if (id !== state.selected) setTimeout(() => select(id, "instant"), 0); }
    else if (state.selected) close();
    else setHash(body);
  }

  // ---------- Wire up ----------
  document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => { location.hash = t.dataset.body; }));
  $("search").addEventListener("input", e => { state.search = e.target.value; applyFilters(); });
  $("reset").addEventListener("click", () => { state.f = {}; state.search = ""; $("search").value = ""; renderFilters(); applyFilters(); close(); });
  $("zin").addEventListener("click", () => {
    const p = globe.pointOfView(); globe.pointOfView({ altitude: Math.max(0.15, p.altitude * 0.65) }, 400);
  });
  $("zout").addEventListener("click", () => {
    const p = globe.pointOfView(); globe.pointOfView({ altitude: Math.min(12, p.altitude * 1.5) }, 400);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("app").hidden) Compare.isOpen() ? Compare.close() : close(); });
  $("cmp-open").addEventListener("click", () => { if (state.selected) close(); });
  // ---------- Resizable sidebar ----------
  (function sidebarResizer() {
    const app = $("app"), handle = $("resizer"), KEY = "twin-sidebar-w", DEFAULT = 420, MIN = 300;
    const maxW = () => Math.max(MIN, Math.min(720, window.innerWidth * 0.6));
    const clamp = w => Math.round(Math.min(maxW(), Math.max(MIN, w)));
    let width = DEFAULT, frame = 0;
    const apply = (w, persist) => {
      width = clamp(w);
      app.style.setProperty("--sidebar-w", width + "px");
      handle.setAttribute("aria-valuenow", width);
      handle.setAttribute("aria-valuemin", MIN);
      handle.setAttribute("aria-valuemax", Math.round(maxW()));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sizeGlobe);
      if (persist) try { localStorage.setItem(KEY, width); } catch (e) {}
    };
    let saved = NaN;
    try { saved = Number(localStorage.getItem(KEY)); } catch (e) {}
    apply(saved || DEFAULT, false);

    handle.addEventListener("pointerdown", e => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      document.body.classList.add("resizing");
      const left = app.getBoundingClientRect().left;
      const move = ev => apply(ev.clientX - left, false);
      const up = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
        document.body.classList.remove("resizing");
        apply(width, true);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
    handle.addEventListener("dblclick", () => apply(DEFAULT, true));
    handle.addEventListener("keydown", e => {
      const step = e.shiftKey ? 60 : 20;
      if (e.key === "ArrowLeft") apply(width - step, true);
      else if (e.key === "ArrowRight") apply(width + step, true);
      else if (e.key === "Home") apply(MIN, true);
      else if (e.key === "End") apply(maxW(), true);
      else return;
      e.preventDefault();
    });
    window.addEventListener("resize", () => { if (width > maxW()) apply(width, false); });
  })();

  window.addEventListener("hashchange", route);
  route();
})();
