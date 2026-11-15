// Data for the TWIN (Terrestrial World Identification Network).
// Earth sites: the 20 strongest analogs from the "Earth Analogs for the Moon and Mars" sheet
// (ranked by how many of the 8 analog dimensions each site matches, keeping a mix of Moon, Mars and Both).
// Coordinates are approximate site centres in decimal degrees. Moon and Mars longitudes are east-positive (-180..180).

const DIMENSIONS = [
  { key: "geo", label: "Geology & mineralogy" },
  { key: "terrain", label: "Terrain & topography" },
  { key: "temp", label: "Temperature, light & extremes" },
  { key: "water", label: "Water, ice & resources" },
  { key: "dust", label: "Dust, wind & erosion" },
  { key: "bio", label: "Biology & biosignatures" },
  { key: "caves", label: "Caves & subsurface" },
  { key: "ops", label: "Ops: landing, mobility, crew, construction" }
];

const ANALOG_COLORS = { Moon: "#f4f4f2", Mars: "#d9482b", Both: "#f2c230" };

const EARTH_SITES = [
  {
    id: "haughton", name: "Haughton Crater, Devon Island", region: "Canada (Nunavut)", group: "Polar regions",
    analog: "Both", category: "Impact crater", lat: 75.38, lng: -89.68,
    wiki: ["Haughton_impact_crater", "Devon_Island"],
    why: "~23 km impact crater in a polar desert: impact breccias, hydrothermal deposits, ground ice, patterned ground, gullies and valley networks on the largest uninhabited island on Earth.",
    counterpart: "Mars mid/high-latitude craters, valley networks; lunar impact processes",
    dims: ["geo", "terrain", "temp", "water", "dust", "bio", "ops"],
    usedBy: "Haughton-Mars Project (NASA/SETI); Flashline Mars Arctic Research Station (FMARS)",
    limits: "Has air, liquid water in summer and some vegetation; very hard logistics",
    mars: "Haughton is a cold, dry, rocky crater sitting in permafrost, which is about as close as Earth gets to a Martian crater in the mid-latitudes. Its gullies, polygon-patterned ground and small valley networks look like features seen from Mars orbit, and the hydrothermal minerals left by the impact show how a crater can create short-lived warm, wet habitats on a frozen world. Crews at the Flashline Mars Arctic Research Station have lived in a mock habitat here and practised spacesuit traverses and rover driving.",
    moon: "The crater preserves shocked rocks and impact breccias of the kind that cover the lunar surface, so geologists use it to practise reading impact history. The barren, grey, rubble-strewn terrain also lets teams test field gear and traverse planning in a place where help is days away."
  },
  {
    id: "iceland", name: "Iceland highlands (Askja, Holuhraun, Vatnajökull)", region: "Iceland", group: "Europe",
    analog: "Both", category: "Volcanic field", lat: 65.0, lng: -16.8,
    wiki: ["Askja", "Holuhraun"],
    why: "Fresh basalt lava and tephra plains with almost no plants; volcano–ice interaction; black sand deserts with frequent dust storms.",
    counterpart: "Lunar maria; Mars volcanic plains, glacio-volcanic terrain",
    dims: ["geo", "terrain", "temp", "water", "dust", "bio", "caves", "ops"],
    usedBy: "Apollo crew training; Artemis II crew training; JETT 2",
    limits: "Wet climate, glaciers and rivers; active weathering",
    moon: "Apollo astronauts trained in Askja in 1965 and 1967 because its basalt plains are a close stand-in for the dark lunar maria, which are also old basalt lava flows. Artemis II astronauts returned in 2023 for the same reason: picking samples and describing rock in barren volcanic ground is the core skill of a lunar field geologist.",
    mars: "Iceland is one of the few places where lava, ice and floods interact on a large scale, as they did on Mars. Holuhraun's 2014–15 lava field is a fresh model for young Martian flows, glacial outburst floods carve channels like smaller versions of Martian outflow channels, and the black sand deserts produce dust storms. It is the only site in the sheet that matches all eight analog dimensions."
  },
  {
    id: "ladakh", name: "Ladakh (Tso Kar, Puga valley)", region: "India (Ladakh)", group: "Asia",
    analog: "Both", category: "High cold desert", lat: 33.3, lng: 78.0,
    wiki: ["Tso_Kar", "Ladakh"],
    why: "Cold, arid desert at 4,000–5,000 m: low air pressure, strong UV, salty lakes, saline permafrost, borax and sulfur hot springs.",
    counterpart: "Early Mars climate and lakes; hydrothermal habitats; crew operations",
    dims: ["geo", "terrain", "temp", "water", "dust", "bio", "ops"],
    usedBy: "ISRO human analog missions (Leh 2024, Tso Kar); proposed Indian Mars/Moon analog station",
    limits: "Has vegetation and grazing; still Earth-like air",
    mars: "Ladakh combines several Mars-like stresses in one place: thin air at altitude, intense ultraviolet light, freezing nights and very little rain. The salty lake at Tso Kar resembles the evaporating lakes that once sat in Martian craters, and the Puga hot springs leave borax and sulfur deposits like the hydrothermal minerals rovers have found on Mars.",
    moon: "ISRO used the Leh region for its first human analog mission in 2024, testing a habitat, crew routines and isolation for future lunar and planetary missions. The barren high terrain and logistical distance make it useful for practising operations even though its geology is closer to Mars than the Moon."
  },
  {
    id: "lanzarote", name: "Lanzarote (Timanfaya, Corona lava tube)", region: "Spain (Canary Islands)", group: "Europe",
    analog: "Both", category: "Volcanic field / lava tube", lat: 29.16, lng: -13.44,
    wiki: ["Timanfaya_National_Park", "Lanzarote"],
    why: "Arid volcanic island with young basalt flows; the ~8 km Corona lava tube has skylight-like openings (jameos).",
    counterpart: "Lunar and Martian lava tubes and skylights; volcanic plains",
    dims: ["geo", "terrain", "dust", "bio", "caves", "ops"],
    usedBy: "ESA PANGAEA and CAVES astronaut training; PANGAEA-X lidar mapping",
    limits: "Tubes far smaller than lunar/Martian ones (lower gravity makes bigger tubes)",
    moon: "Lava tubes are prime candidates for sheltered lunar bases, because metres of rock overhead block radiation and smooth out temperature swings. The Corona tube, with its collapsed 'jameo' openings, is a close model for the skylight pits spotted by lunar orbiters, and ESA uses it to train astronauts in cave exploration and sampling.",
    mars: "Timanfaya's dry, young basalt fields look like Martian volcanic plains, and the lava tubes are analogs for cave openings seen on the flanks of Martian volcanoes such as Arsia Mons. Microbes in the caves give astrobiologists a test bed for looking for life underground."
  },
  {
    id: "maunakea", name: "Mauna Kea and Mauna Loa (incl. HI-SEAS)", region: "USA (Hawaii)", group: "Oceania & Pacific",
    analog: "Both", category: "Volcanic field", lat: 19.6, lng: -155.47,
    wiki: ["Mauna_Kea", "Mauna_Loa"],
    why: "High-altitude basaltic volcanoes; weathered Pu'u Nene tephra was the source of the JSC Mars-1 simulant; lunar ISRU field tests ran on Mauna Kea; HI-SEAS habitat sits on Mauna Loa.",
    counterpart: "Mars dust and soil spectra; lunar ISRU sites; habitat isolation",
    dims: ["geo", "terrain", "temp", "dust", "caves", "ops"],
    usedBy: "HI-SEAS crew missions; NASA/PISCES lunar ISRU demos",
    limits: "Cultural sensitivity on Mauna Kea; humid weathering",
    mars: "Hawaii's shield volcanoes are built the same way as Olympus Mons and the other giant Tharsis volcanoes, just far smaller. Weathered volcanic ash from Pu'u Nene has a spectrum close to Martian dust, which is why it became the JSC Mars-1 soil simulant. The HI-SEAS dome on Mauna Loa has hosted crews living in isolation for up to a year to study how people cope on long Mars missions.",
    moon: "NASA and partners ran in-situ resource utilisation (ISRU) demos on Mauna Kea, extracting oxygen from volcanic soil and testing drills and rovers, because the basalt chemistry is similar to lunar mare soil."
  },
  {
    id: "lavabeds", name: "Lava Beds National Monument", region: "USA (California)", group: "Americas",
    analog: "Both", category: "Lava tube", lat: 41.71, lng: -121.51,
    wiki: ["Lava_Beds_National_Monument"],
    why: "Hundreds of lava tube caves, some with year-round ice, with microbial mats on the walls.",
    counterpart: "Martian and lunar lava tubes; cave ice; cave biosignatures",
    dims: ["geo", "temp", "water", "bio", "caves", "ops"],
    usedBy: "NASA BRAILLE project (robotic cave life detection)",
    limits: "Small tubes; Earth-type cave biology",
    mars: "Caves on Mars could shelter water ice and, possibly, microbes protected from radiation. Lava Beds has both cave ice and mineral-rich microbial mats, so NASA's BRAILLE project sent robots into the tubes to map them and practise detecting signs of life underground.",
    moon: "The cave network is a training ground for mapping and moving through lava tubes like those inferred beneath the lunar maria, where future crews might shelter."
  },
  {
    id: "lonar", name: "Lonar Crater", region: "India (Maharashtra)", group: "Asia",
    analog: "Both", category: "Impact crater", lat: 19.976, lng: 76.508,
    wiki: ["Lonar_Lake", "Lonar_crater"],
    why: "~1.8 km crater, one of the best-preserved impact craters in basalt (Deccan Traps); saline, alkaline crater lake with extremophile microbes.",
    counterpart: "Basaltic craters on lunar maria and Mars; Mars crater paleolakes (Jezero, Gale)",
    dims: ["geo", "terrain", "water", "bio", "ops"],
    usedBy: "Indian research groups; proposed geopark and rover/drone test site",
    limits: "Wet tropical climate; vegetation and a lake fill the crater",
    moon: "Most of the Moon's dark maria and much of Mars is basalt, but very few young craters on Earth formed in basalt. Lonar is one of them, so its shocked basalt and glassy impact melts are a direct comparison for craters on the lunar maria.",
    mars: "Lonar holds a salty, alkaline lake inside a crater, the same setting rovers are exploring at Jezero and Gale, where lakes once filled craters billions of years ago. Microbes in the lake show what kinds of life could survive in such water and what traces they leave in sediments."
  },
  {
    id: "erebus", name: "Mount Erebus fumarolic ice caves", region: "Antarctica (Ross Island)", group: "Polar regions",
    analog: "Both", category: "Ice caves / volcanic", lat: -77.53, lng: 167.15,
    wiki: ["Mount_Erebus"],
    why: "Caves melted into ice by volcanic gases, warm and dark, hosting microbes that live without sunlight.",
    counterpart: "Volcano–ice caves; subsurface habitats on Mars",
    dims: ["geo", "temp", "water", "bio", "caves", "ops"],
    usedBy: "Cave microbiology and robotic exploration studies",
    limits: "Active volcano; very hard access",
    mars: "Where volcanic heat met ice on Mars, it could have made warm, wet pockets underground: exactly what exists in the ice caves of Erebus. The microbes there live in the dark on chemical energy, a model for life that might survive beneath the Martian surface.",
    moon: "The caves are used to test robots and instruments in dark, cold, hard-to-reach spaces, similar to the operational challenge of exploring lunar lava tubes and shadowed regions."
  },
  {
    id: "dryvalleys", name: "McMurdo Dry Valleys", region: "Antarctica", group: "Polar regions",
    analog: "Mars", category: "Polar desert", lat: -77.5, lng: 162.0,
    wiki: ["McMurdo_Dry_Valleys"],
    why: "Coldest, driest ice-free land on Earth: katabatic winds, ventifacts, patterned ground, buried ice (Beacon Valley), gullies, salty lakes and microbes living inside rocks.",
    counterpart: "Martian polar/mid-latitude ground ice, gullies, polygons; habitability limits",
    dims: ["geo", "terrain", "temp", "water", "dust", "bio", "caves", "ops"],
    usedBy: "US Antarctic Program; NASA astrobiology and drilling tests",
    limits: "Still far warmer and higher pressure than Mars; protected environment",
    mars: "The Dry Valleys are widely seen as the best overall Mars analog on Earth. Ice buried under a thin layer of dry soil in Beacon Valley has survived for millions of years, as ground ice does across Mars. Wind-carved rocks, polygon-cracked ground and gullies match features seen by orbiters, and microbes hiding inside sandstone show how life can hang on where the surface is too cold and dry. Don Juan Pond nearby stays liquid at very low temperatures because it is so salty, a model for Martian brines."
  },
  {
    id: "atacama", name: "Atacama Desert core (Yungay, Salar Grande)", region: "Chile", group: "Americas",
    analog: "Mars", category: "Hyperarid desert", lat: -24.1, lng: -70.0,
    wiki: ["Atacama_Desert"],
    why: "Driest non-polar desert: soils with perchlorates and nitrates, almost no life, intense UV; microbes living inside halite crusts.",
    counterpart: "Martian soils (perchlorate), habitability limits, life detection",
    dims: ["geo", "terrain", "temp", "water", "dust", "bio", "caves", "ops"],
    usedBy: "NASA ARADS rover drilling tests; many Mars instrument tests",
    limits: "Far warmer, denser air, occasional fog/rain",
    mars: "Parts of the Atacama have gone years without measurable rain. Its soils contain perchlorates, the same reactive salts the Phoenix lander found on Mars, and living cells are so scarce that instruments struggle to detect them. That makes it the standard proving ground for life-detection tools: NASA's ARADS project drilled here with a rover to see whether a robot could find traces of life as faint as those expected on Mars."
  },
  {
    id: "qaidam", name: "Qaidam Basin (Dalangtan, Lenghu)", region: "China (Qinghai)", group: "Asia",
    analog: "Mars", category: "High hyperarid desert", lat: 37.5, lng: 94.5,
    wiki: ["Qaidam_Basin"],
    why: "High-altitude salt playas, huge yardang fields and hyperarid soils; site of a Mars simulation base near Lenghu.",
    counterpart: "Martian yardangs (Medusae Fossae), salt deposits, playas",
    dims: ["geo", "terrain", "temp", "water", "dust", "bio", "ops"],
    usedBy: "Chinese Mars analog research; Mars camp near Lenghu",
    limits: "Earth atmosphere and weather",
    mars: "Qaidam sits about 3,000 m up and is one of the driest places in Asia. Wind has carved the soft lake sediments into fields of long ridges called yardangs, the same landforms that cover the Medusae Fossae Formation on Mars. Its salt flats and sulfate minerals record a lake drying out, much as Mars itself dried out, and a Mars simulation base near Lenghu hosts visitors and crew exercises."
  },
  {
    id: "deathvalley", name: "Death Valley (Badwater, Ubehebe)", region: "USA (California)", group: "Americas",
    analog: "Mars", category: "Hot desert / evaporite", lat: 36.24, lng: -116.82,
    wiki: ["Death_Valley"],
    why: "Hottest place on Earth: salt pans, playas, the Ubehebe maar crater, and wind-sculpted surfaces.",
    counterpart: "Martian evaporites, playas, volcanic craters",
    dims: ["geo", "terrain", "temp", "water", "dust", "bio", "ops"],
    usedBy: "Mars rover and instrument field tests",
    limits: "Hot rather than cold",
    mars: "Death Valley's salt pans formed as ancient lakes evaporated, leaving layers of chloride and sulfate salts like those orbiters have mapped on Mars. Rovers and instruments are tested on its rocky alluvial fans and playas, and the Ubehebe explosion crater is a model for small volcanic craters. It is hot instead of cold, but the dryness, salts and bare ground make it a convenient, accessible stand-in."
  },
  {
    id: "kutch", name: "Kutch: Matanomadh jarosite and Rann salt flats", region: "India (Gujarat)", group: "Asia",
    analog: "Mars", category: "Mineral / evaporite", lat: 23.54, lng: 68.95,
    wiki: ["Rann_of_Kutch", "Kutch_district"],
    why: "Jarosite (an acid-sulfate mineral found by Mars rovers), clays, evaporites and brines; huge flat salt desert with salt-loving microbes.",
    counterpart: "Meridiani Planum jarosite; Martian chloride and sulfate deposits",
    dims: ["geo", "terrain", "temp", "water", "bio", "ops"],
    usedBy: "ISRO Space Applications Centre; proposed Mars test site",
    limits: "Seasonal flooding of the Rann",
    mars: "When the Opportunity rover found jarosite at Meridiani Planum, it proved that acidic water once soaked the rocks there. Jarosite is rare on Earth, and Matanomadh in Kutch is one of the best places to study it alongside clays and salts. The vast white Rann salt flat next door is a model for Martian chloride deposits and the brines that may still form on Mars today."
  },
  {
    id: "svalbard", name: "Svalbard: Bockfjorden volcanic complex (AMASE)", region: "Norway (Svalbard)", group: "Polar regions",
    analog: "Mars", category: "Polar volcanic", lat: 79.43, lng: 13.33,
    wiki: ["Bockfjord_Volcanic_Complex", "Svalbard"],
    why: "Volcano with carbonate globules like those in Martian meteorite ALH84001, warm springs through permafrost, glaciers; very low sun angles and polar night.",
    counterpart: "Martian carbonates, springs and permafrost; low-sun lighting like the lunar south pole",
    dims: ["geo", "terrain", "temp", "water", "bio", "ops"],
    usedBy: "Arctic Mars Analog Svalbard Expedition (AMASE) instrument tests",
    limits: "Has vegetation, wildlife (polar bears)",
    mars: "Bockfjorden's volcanic rocks contain carbonate globules almost identical to those in ALH84001, the famous Martian meteorite once claimed to hold microfossils. Warm springs flowing through permafrost add a model for groundwater on a frozen planet. The AMASE expeditions used the site to test instruments later flown on Curiosity and ExoMars.",
    moon: "Svalbard's low sun angles and long polar night also give a taste of lunar south pole lighting, where the Sun skims the horizon and casts very long shadows."
  },
  {
    id: "riotinto", name: "Río Tinto", region: "Spain (Andalusia)", group: "Europe",
    analog: "Mars", category: "Acidic / mineral", lat: 37.7, lng: -6.6,
    wiki: ["Rio_Tinto_(river)"],
    why: "Acidic (pH ~2), iron-rich river with jarosite and hematite, and microbes that live in it.",
    counterpart: "Meridiani Planum acid-sulfate minerals; subsurface life",
    dims: ["geo", "water", "bio", "caves", "ops"],
    usedBy: "NASA MARTE drilling experiment",
    limits: "Acidity partly from mining",
    mars: "The blood-red Río Tinto runs acidic and iron-rich, and it deposits jarosite and hematite, the two minerals that told Opportunity that acid water once flowed at Meridiani Planum. Yet the river teems with microbes that thrive on iron and sulfur. NASA's MARTE experiment drilled into the rock nearby to test automated drilling and the search for life living below ground."
  },
  {
    id: "meteor", name: "Meteor Crater (Barringer)", region: "USA (Arizona)", group: "Americas",
    analog: "Moon", category: "Impact crater", lat: 35.027, lng: -111.022,
    wiki: ["Meteor_Crater"],
    why: "Young, very well preserved 1.2 km simple bowl crater with overturned rim layers and ejecta blanket.",
    counterpart: "Small fresh lunar craters; crater rim/ejecta traverses",
    dims: ["geo", "terrain", "ops"],
    usedBy: "Apollo and Artemis astronaut geology training",
    limits: "Sedimentary target rock, not basalt/anorthosite",
    moon: "The Moon is covered in simple bowl-shaped craters, and Meteor Crater is the best-preserved large example on Earth, only about 50,000 years old. Its rim shows rock layers flipped upside down by the impact, and its ejecta blanket is still easy to read. Apollo astronauts trained here to sample crater rims and ejecta, and Artemis crews still do."
  },
  {
    id: "mistastin", name: "Mistastin (Kamestastin) Lake crater", region: "Canada (Labrador)", group: "Americas",
    analog: "Moon", category: "Impact crater", lat: 55.88, lng: -63.31,
    wiki: ["Mistastin_crater"],
    why: "~28 km crater formed in anorthosite, the same rock that makes the lunar highlands; thick impact-melt rocks.",
    counterpart: "Lunar highlands craters, south pole region terrain",
    dims: ["geo", "terrain", "ops"],
    usedBy: "Artemis II crew training; Artemis geology team site reconnaissance",
    limits: "Glaciated and vegetated; remote",
    moon: "The bright lunar highlands, including the region around the south pole where Artemis will land, are made mostly of anorthosite. Mistastin is one of only two known impact craters on Earth that formed in anorthosite, so its impact melts and breccias are the closest Earth match to what Artemis astronauts will sample. Artemis II crew members trained here in 2024."
  },
  {
    id: "sfvf", name: "San Francisco Volcanic Field (SP Crater, Cinder Lake crater field)", region: "USA (Arizona)", group: "Americas",
    analog: "Moon", category: "Volcanic field", lat: 35.33, lng: -111.44,
    wiki: ["San_Francisco_volcanic_field", "SP_Crater"],
    why: "Basaltic cinder cones and lava flows; at Cinder Lake, NASA blasted an artificial crater field in the 1960s to copy the Apollo 11 site. Merriam crater cinders were the source of the JSC-1 lunar simulant.",
    counterpart: "Lunar maria, regolith-covered plains",
    dims: ["geo", "terrain", "dust", "ops"],
    usedBy: "Apollo training; Artemis geology training; Joint EVA Test Team (JETT 3, 5)",
    limits: "Earth gravity and air; vegetation in places",
    moon: "In 1967 the US Geological Survey used explosives to blast hundreds of craters into the dark cinder plain at Cinder Lake, recreating a patch of the Apollo 11 landing area so astronauts could rehearse. The fine basaltic cinders behave like lunar regolith underfoot, and ground-up cinders from nearby Merriam crater became JSC-1, a widely used lunar soil simulant. NASA's Joint EVA Test Team still runs Artemis moonwalk rehearsals here."
  },
  {
    id: "cratersmoon", name: "Craters of the Moon", region: "USA (Idaho)", group: "Americas",
    analog: "Moon", category: "Volcanic field", lat: 43.42, lng: -113.52,
    wiki: ["Craters_of_the_Moon_National_Monument_and_Preserve"],
    why: "Young basalt lava fields, cinder cones and lava tubes.",
    counterpart: "Lunar mare lavas, lava tubes",
    dims: ["geo", "terrain", "caves", "ops"],
    usedBy: "Apollo 14 crew training (1969); NASA SSERVI field studies",
    limits: "Basalt chemistry differs from lunar mare",
    moon: "Named for its lunar look, this field of fresh basalt flows trained the Apollo 14 crew in 1969 to recognise volcanic rocks. Its lava tubes and collapse pits are studied today by NASA's SSERVI teams as models for lunar lava tubes, and its rough flows are used to test how people and robots move over broken volcanic ground."
  },
  {
    id: "sudbury", name: "Sudbury Basin", region: "Canada (Ontario)", group: "Americas",
    analog: "Moon", category: "Impact crater", lat: 46.6, lng: -81.2,
    wiki: ["Sudbury_Basin"],
    why: "One of Earth's largest and oldest impact structures (~1.85 Ga); shatter cones, breccias and a huge impact-melt sheet (norite).",
    counterpart: "Large lunar basins (e.g. South Pole–Aitken), melt sheets",
    dims: ["geo", "water", "caves"],
    usedBy: "Apollo 16 and 17 geology training",
    limits: "Deformed and eroded; basin shape not visible on the ground",
    moon: "The Moon's biggest features are basins blasted out by huge impacts, filled with sheets of melted rock. Sudbury is one of the few places on Earth with a comparable melt sheet and abundant shatter cones and breccias, so Apollo 16 and 17 astronauts trained here to recognise them. Today it helps scientists interpret the South Pole–Aitken basin, the largest and oldest basin on the Moon."
  }
];

// Status categories for Moon / Mars features (used for marker colour and filtering).
const PLANET_STATUS = {
  landed: { label: "Explored on the surface", color: "#4cc38a" },
  future: { label: "Future landing target", color: "#e8742c" },
  orbital: { label: "Studied from orbit", color: "#5b8def" }
};

const MOON_SITES = [
  {
    id: "apollo11", name: "Tranquility Base (Apollo 11)", type: "Mare plain", status: "landed",
    lat: 0.674, lng: 23.473, wiki: ["Apollo_11", "Mare_Tranquillitatis"],
    explored: "Apollo 11 (1969)",
    summary: "The first crewed landing site, on the flat basalt plain of Mare Tranquillitatis.",
    details: "Neil Armstrong and Buzz Aldrin landed on a smooth mare plain peppered with small craters and covered by fine, powdery regolith. Mare Tranquillitatis is a basin flooded by basalt lava about 3.6 billion years ago, and the samples returned confirmed the Moon's dark seas are volcanic rock.",
    earthAnalogs: ["sfvf", "meteor"],
    otherAnalogs: "Cinder Lake's blasted crater field recreated this exact landing area for crew rehearsals."
  },
  {
    id: "apollo14", name: "Fra Mauro highlands (Apollo 14)", type: "Impact ejecta", status: "landed",
    lat: -3.645, lng: -17.471, wiki: ["Fra_Mauro_formation", "Apollo_14"],
    explored: "Apollo 14 (1971)",
    summary: "Hilly terrain made of debris thrown out by the impact that formed the Imbrium basin.",
    details: "Apollo 14 targeted the Fra Mauro formation to sample material ejected from deep below the surface by the Imbrium impact. Astronauts Alan Shepard and Edgar Mitchell hiked toward the rim of Cone crater and returned breccias, rocks made of shattered fragments welded together by the impact.",
    earthAnalogs: ["cratersmoon", "meteor"],
    otherAnalogs: "The crew also trained at the Nördlinger Ries crater in Germany."
  },
  {
    id: "hadley", name: "Hadley Rille (Apollo 15)", type: "Lava channel (rille)", status: "landed",
    lat: 26.13, lng: 3.63, wiki: ["Rima_Hadley", "Apollo_15"],
    explored: "Apollo 15 (1971)",
    summary: "A sinuous channel cut by flowing lava at the foot of the Apennine mountains.",
    details: "Apollo 15 was the first mission with the lunar rover. Dave Scott and Jim Irwin drove to the edge of Hadley Rille, a winding valley about 1.5 km wide formed by flowing or collapsed lava, and collected the 'Genesis Rock', a piece of the Moon's early anorthosite crust.",
    earthAnalogs: ["iceland", "cratersmoon"],
    otherAnalogs: "The crew trained at the Rio Grande Gorge in New Mexico to study a canyon cut into basalt."
  },
  {
    id: "descartes", name: "Descartes Highlands (Apollo 16)", type: "Highlands", status: "landed",
    lat: -8.973, lng: 15.5, wiki: ["Descartes_Highlands", "Apollo_16"],
    explored: "Apollo 16 (1972)",
    summary: "The only Apollo landing in the bright lunar highlands.",
    details: "Scientists expected volcanic rocks here, but John Young and Charlie Duke found mostly impact breccias and anorthosite. That surprise showed how much of the highlands crust has been churned by impacts, and why craters formed in anorthosite on Earth are so valuable for training.",
    earthAnalogs: ["sudbury", "mistastin"],
    otherAnalogs: "The Stillwater Complex in Montana supplies anorthosite for lunar highland simulants."
  },
  {
    id: "taurus", name: "Taurus–Littrow valley (Apollo 17)", type: "Highland valley", status: "landed",
    lat: 20.19, lng: 30.77, wiki: ["Taurus–Littrow", "Apollo_17"],
    explored: "Apollo 17 (1972)",
    summary: "A deep valley at the edge of Mare Serenitatis, site of the last Apollo landing.",
    details: "Geologist Harrison Schmitt and Gene Cernan explored a valley floored by mare basalt and walled by massive highland blocks, and found orange volcanic glass beads from ancient fire-fountain eruptions. It was the most geologically diverse Apollo site.",
    earthAnalogs: ["sudbury", "sfvf"],
    otherAnalogs: null
  },
  {
    id: "shackleton", name: "Shackleton crater & south pole", type: "Polar crater", status: "future",
    lat: -89.6, lng: 129.8, wiki: ["Shackleton_(crater)", "Lunar_south_pole"],
    explored: "Artemis candidate region; mapped by LRO, Chandrayaan-2",
    summary: "A 21 km crater almost exactly at the south pole, its floor in permanent shadow.",
    details: "The Sun never rises above the rim of Shackleton's floor, so it is one of the coldest places in the Solar System and may hold water ice. Its rim gets near-constant sunlight, which makes the region a prime target for Artemis bases. The terrain is highlands anorthosite, lit by sunlight skimming the horizon. No place on Earth matches the ~40 K cold of its shadowed floor.",
    earthAnalogs: ["mistastin", "svalbard"],
    otherAnalogs: "The East Antarctic Plateau, Astrobotic's Mojave proving ground and KSC Swamp Works copy the cold or the low-sun lighting."
  },
  {
    id: "spa", name: "South Pole–Aitken basin", type: "Giant impact basin", status: "landed",
    lat: -53, lng: -169, wiki: ["South_Pole–Aitken_basin"],
    explored: "Chang'e 4 (2019), Chang'e 6 sample return (2024)",
    summary: "The largest and oldest impact basin on the Moon, about 2,500 km across.",
    details: "This basin on the far side may have dug into the lunar mantle. China's Chang'e 4 rover explored its floor and Chang'e 6 returned the first far-side samples in 2024. Understanding its melt sheet depends on comparisons with Earth's largest impact structures.",
    earthAnalogs: ["sudbury", "mistastin"],
    otherAnalogs: "Vredefort Dome in South Africa, Earth's largest verified impact structure, is another comparison."
  },
  {
    id: "tycho", name: "Tycho crater", type: "Fresh rayed crater", status: "landed",
    lat: -43.31, lng: -11.36, wiki: ["Tycho_(crater)", "Surveyor_7"],
    explored: "Surveyor 7 landed on its ejecta (1968)",
    summary: "An 85 km young crater whose bright rays stretch across the near side.",
    details: "About 100 million years old, Tycho is one of the youngest large craters on the Moon. Its rays of bright, freshly broken rock show how ejecta spreads out from an impact before it is darkened by space weathering.",
    earthAnalogs: ["meteor"],
    otherAnalogs: "Kamil crater in Egypt preserves tiny but similar bright ejecta rays."
  },
  {
    id: "marius", name: "Marius Hills skylight", type: "Lava tube skylight", status: "orbital",
    lat: 14.1, lng: -56.8, wiki: ["Marius_Hills", "Lunar_lava_tube"],
    explored: "Discovered by SELENE/Kaguya; imaged by LRO",
    summary: "A ~65 m pit that likely opens into an intact lava tube.",
    details: "Radar and gravity data suggest large empty lava tubes run beneath this volcanic region. Tubes could shelter a base from radiation, micrometeorites and the 300 °C temperature swing between lunar day and night.",
    earthAnalogs: ["lavabeds", "lanzarote", "cratersmoon", "maunakea"],
    otherAnalogs: "Kazumura Cave in Hawaii is one of the longest lava tubes on Earth."
  },
  {
    id: "orientale", name: "Mare Orientale", type: "Multi-ring basin", status: "orbital",
    lat: -19.4, lng: -92.8, wiki: ["Mare_Orientale"],
    explored: "Mapped by LRO and GRAIL",
    summary: "A bullseye of three mountain rings, the best-preserved large basin on the Moon.",
    details: "Orientale is about 930 km across and only partly flooded with lava, so its rings and melt sheet are exposed. It is the reference example for how giant impacts build multi-ring basins.",
    earthAnalogs: ["sudbury"],
    otherAnalogs: "Manicouagan in Quebec shows a ring-shaped eroded impact structure on Earth."
  },
  {
    id: "copernicus", name: "Copernicus crater", type: "Complex crater", status: "orbital",
    lat: 9.62, lng: -20.08, wiki: ["Copernicus_(lunar_crater)"],
    explored: "Imaged by Lunar Orbiter 2 and LRO",
    summary: "A 93 km complex crater with terraced walls and central peaks.",
    details: "Copernicus shows what large craters look like when they collapse: slumped terraces, a flat melt-covered floor and peaks pushed up from depth. Geologists read the same structures in eroded form at complex craters on Earth.",
    earthAnalogs: ["haughton", "mistastin"],
    otherAnalogs: null
  }
];

const MARS_SITES = [
  {
    id: "jezero", name: "Jezero crater", type: "Crater paleolake & delta", status: "landed",
    lat: 18.38, lng: 77.58, wiki: ["Jezero_(crater)", "Perseverance_(rover)"],
    explored: "Perseverance rover (2021–)",
    summary: "A 45 km crater that once held a lake, with a river delta on its western rim.",
    details: "Perseverance is collecting rock cores here for future return to Earth. The delta and lake-bed sediments, and carbonates around the rim, are the best places on Mars to look for preserved signs of ancient microbial life.",
    earthAnalogs: ["lonar", "haughton"],
    otherAnalogs: "Lake Salda in Turkey, the Samail Ophiolite in Oman and the Pilbara in Australia are also used as comparisons."
  },
  {
    id: "gale", name: "Gale crater & Mount Sharp", type: "Crater paleolake", status: "landed",
    lat: -5.4, lng: 137.8, wiki: ["Gale_(crater)", "Curiosity_(rover)"],
    explored: "Curiosity rover (2012–)",
    summary: "A 154 km crater with a 5 km mound of layered sediment in the middle.",
    details: "Curiosity showed that Gale once held a long-lived lake with chemistry that microbes could have used. Climbing Mount Sharp, it reads the layers like pages of a climate record as Mars went from wet to dry, passing clays into sulfate salts.",
    earthAnalogs: ["lonar", "deathvalley"],
    otherAnalogs: "Lake Bosumtwi in Ghana and the Mars Desert Research Station badlands in Utah are other comparisons."
  },
  {
    id: "meridiani", name: "Meridiani Planum", type: "Sulfate plain", status: "landed",
    lat: -1.95, lng: -5.53, wiki: ["Meridiani_Planum", "Opportunity_(rover)"],
    explored: "Opportunity rover (2004–2018)",
    summary: "A plain where Opportunity found proof that acidic water once soaked the ground.",
    details: "Opportunity found jarosite, an acid-sulfate mineral, and millions of small hematite spheres nicknamed 'blueberries'. Together they showed that acidic groundwater moved through these rocks long ago.",
    earthAnalogs: ["riotinto", "kutch"],
    otherAnalogs: "Hematite concretions in Utah's Navajo Sandstone and jarosite at the Varkala cliffs in Kerala are close matches."
  },
  {
    id: "homeplate", name: "Home Plate, Gusev crater", type: "Hydrothermal deposit", status: "landed",
    lat: -14.64, lng: 175.53, wiki: ["Home_Plate", "Spirit_(rover)"],
    explored: "Spirit rover (2004–2010)",
    summary: "A volcanic plateau where Spirit found nearly pure silica from ancient hot springs.",
    details: "Spirit's stuck wheel churned up bright soil that was about 90% opaline silica, a sign of hot springs or steam vents. Knobby silica like this on Earth often forms around microbes, which makes it a strong target in the search for past life.",
    earthAnalogs: ["ladakh", "iceland"],
    otherAnalogs: "El Tatio geysers in Chile have almost identical knobby silica textures; Yellowstone is another comparison."
  },
  {
    id: "olympus", name: "Olympus Mons", type: "Shield volcano", status: "orbital",
    lat: 18.65, lng: -133.8, wiki: ["Olympus_Mons"],
    explored: "Mapped by Mariner 9, Mars Express, MRO",
    summary: "The tallest volcano in the Solar System, about 22 km high and 600 km wide.",
    details: "Olympus Mons is a shield volcano built from countless runny basalt flows, the same way Hawaii's volcanoes formed. It grew so large because Mars has no moving tectonic plates to carry it away from its magma source.",
    earthAnalogs: ["maunakea", "iceland"],
    otherAnalogs: null
  },
  {
    id: "ares", name: "Ares Vallis (Pathfinder)", type: "Outflow channel", status: "landed",
    lat: 19.13, lng: -33.22, wiki: ["Ares_Vallis", "Mars_Pathfinder"],
    explored: "Mars Pathfinder & Sojourner (1997)",
    summary: "The mouth of a giant flood channel, littered with rocks swept down by water.",
    details: "Pathfinder landed where catastrophic floods once burst out onto the northern plains, leaving a field of boulders stacked and tilted by the current. Such floods may have released more water than any river on Earth.",
    earthAnalogs: ["iceland", "atacama"],
    otherAnalogs: "The Channeled Scablands in Washington, carved by Ice Age megafloods, are the classic comparison."
  },
  {
    id: "medusae", name: "Medusae Fossae Formation", type: "Wind-eroded deposit", status: "orbital",
    lat: -3, lng: -160, wiki: ["Medusae_Fossae_Formation"],
    explored: "Mapped by MRO, Mars Express radar",
    summary: "A huge, soft deposit carved by wind into ridges called yardangs.",
    details: "This deposit stretches over 5,000 km along the equator and is likely made of volcanic ash. Wind has sculpted it into parallel ridges and grooves, the largest yardang fields in the Solar System. It is also the biggest single source of dust on Mars.",
    earthAnalogs: ["qaidam"],
    otherAnalogs: "The Lut Desert in Iran has giant yardangs too, and the Bodélé Depression in Chad is Earth's largest dust source."
  },
  {
    id: "boreum", name: "Planum Boreum (north polar cap)", type: "Polar ice cap", status: "orbital",
    lat: 86, lng: 15, wiki: ["Planum_Boreum", "Martian_polar_ice_caps"],
    explored: "Mapped by MRO SHARAD radar and Mars Express",
    summary: "A 3 km thick dome of water ice layered with dust.",
    details: "Radar shows the cap is built from many layers of ice and dust, recording swings in Mars' climate over millions of years. Spiral troughs cut by wind wind across its surface.",
    earthAnalogs: ["dryvalleys", "svalbard"],
    otherAnalogs: "The Greenland Ice Sheet is used to test ice drilling and radar sounding."
  },
  {
    id: "nili", name: "Nili Fossae", type: "Mineral-rich troughs", status: "orbital",
    lat: 22, lng: 75, wiki: ["Nili_Fossae"],
    explored: "Mapped by MRO CRISM; candidate landing site",
    summary: "Troughs exposing olivine, clays and carbonates, plus possible methane sources.",
    details: "Nili Fossae holds some of the clearest signs on Mars of olivine-rich rock reacting with water to form serpentine and carbonates, the same process that makes hydrogen and methane on Earth. It was a finalist landing site for Perseverance.",
    earthAnalogs: ["svalbard"],
    otherAnalogs: "The Tablelands in Newfoundland and the Samail Ophiolite in Oman show this serpentinisation happening today."
  },
  {
    id: "arsia", name: "Arsia Mons cave skylights", type: "Lava tube skylights", status: "orbital",
    lat: -8.26, lng: -120.09, wiki: ["Arsia_Mons"],
    explored: "Imaged by Mars Odyssey and MRO HiRISE",
    summary: "Dark pits on a giant volcano's flanks that may open into caves.",
    details: "The 'seven sisters' pits near Arsia Mons are among the best cave candidates on Mars. Caves would protect astronauts and possibly microbes from radiation, and could trap ice.",
    earthAnalogs: ["lavabeds", "lanzarote", "maunakea", "erebus"],
    otherAnalogs: null
  },
  {
    id: "utopia", name: "Utopia Planitia", type: "Ice-rich plain", status: "landed",
    lat: 25.07, lng: 109.93, wiki: ["Utopia_Planitia", "Zhurong_(rover)"],
    explored: "Viking 2 (1976), Zhurong rover (2021–2022)",
    summary: "A vast northern plain with polygon-cracked ground and buried ice.",
    details: "Orbital radar shows thick ice buried under Utopia's surface, and the ground is patterned with polygons and scalloped hollows formed as ice freezes, thaws and turns to vapour. Zhurong's radar found layered sediments beneath the plain.",
    earthAnalogs: ["haughton", "dryvalleys", "svalbard"],
    otherAnalogs: "Pingos at Tuktoyaktuk and the CRREL permafrost tunnel in Alaska are other comparisons."
  },
  {
    id: "phoenix", name: "Phoenix landing site", type: "Polar plain", status: "landed",
    lat: 68.22, lng: -125.75, wiki: ["Phoenix_(spacecraft)"],
    explored: "Phoenix lander (2008)",
    summary: "Arctic plain where Phoenix dug into water ice and found perchlorate salts.",
    details: "Phoenix scraped through a few centimetres of soil to hit bright water ice, which slowly vaporised in the sunlight. It also discovered perchlorate, a reactive salt that changed how scientists think about Martian chemistry and the search for organics.",
    earthAnalogs: ["dryvalleys", "atacama"],
    otherAnalogs: null
  },
  {
    id: "newton", name: "Newton crater slopes", type: "Recurring slope lineae", status: "orbital",
    lat: -41.1, lng: -158, wiki: ["Recurring_slope_lineae", "Newton_(Martian_crater)"],
    explored: "Imaged by MRO HiRISE",
    summary: "Dark streaks that appear on warm slopes each season.",
    details: "When first spotted these streaks were thought to be flows of salty water. Later work suggests they may be dry sand flows, but the debate shows why scientists study brines that stay liquid far below 0 °C on Earth.",
    earthAnalogs: ["dryvalleys", "atacama"],
    otherAnalogs: "Don Juan Pond, in the Dry Valleys, is the best Earth example of such a cold brine."
  }
];

// Things no place on Earth can copy (from the sheet's Notes tab).
const EARTH_LIMITS = [
  ["Gravity", "Moon is 1/6 g and Mars 0.38 g. Lava tubes, slopes, dust behaviour and walking all change; only parabolic flights, buoyancy (NEEMO) or offload rigs approximate it."],
  ["Vacuum / thin CO2 air", "The Moon has no air; Mars has ~0.6 kPa of CO2 (under 1% of Earth's sea-level pressure). The highest Earth sites still have ~50% of sea-level pressure."],
  ["Radiation", "No magnetic field or thick air on the Moon or Mars, so surface radiation is far higher than anywhere on Earth."],
  ["Permanently shadowed regions", "Lunar south pole craters reach ~40 K (about -233 °C). Earth's coldest surface (~-98 °C) is far warmer."],
  ["Regolith properties", "Lunar regolith is sharp, glassy and electrostatically charged. Earth sites and simulants match chemistry or mechanics, rarely both."],
  ["Martian surface chemistry", "Planet-wide perchlorates and oxidants; the Atacama comes closest but only in places."],
  ["Sterility", "Every Earth site has life, so contamination and false positives are a constant issue for life-detection tests."]
];

const BODIES = {
  earth: { label: "Earth", sites: EARTH_SITES },
  moon: { label: "Moon", sites: MOON_SITES },
  mars: { label: "Mars", sites: MARS_SITES }
};

function findSite(body, id) {
  return (BODIES[body] && BODIES[body].sites.find(s => s.id === id)) || null;
}

// For an Earth site, the Moon/Mars features that list it as an analog.
function counterpartsFor(earthId) {
  const out = [];
  for (const body of ["moon", "mars"]) {
    for (const s of BODIES[body].sites) {
      if (s.earthAnalogs.includes(earthId)) out.push({ body, site: s });
    }
  }
  return out;
}

// Country outlines for the Earth map. Rings that cross the date line jump from +180° to -180°,
// which Leaflet draws as a stripe across the whole map; unwrap them so each ring stays continuous.
function worldCountries() {
  const fc = topojson.feature(WORLD_TOPO, WORLD_TOPO.objects.countries);
  const unwrap = ring => {
    let shift = 0;
    return ring.map((p, i) => {
      if (i > 0) {
        const d = p[0] - ring[i - 1][0];
        if (d > 180) shift -= 360; else if (d < -180) shift += 360;
      }
      return [p[0] + shift, p[1]];
    });
  };
  for (const f of fc.features) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === "Polygon") g.coordinates = g.coordinates.map(unwrap);
    else if (g.type === "MultiPolygon") g.coordinates = g.coordinates.map(poly => poly.map(unwrap));
  }
  return fc;
}

// ---------- Compare & rank ----------
// TWIN's editorial ratings (0–10) of how closely each Earth site matches the Moon and
// Mars on each analog dimension, in DIMENSIONS order:
//   [geo, terrain, temp, water, dust, bio, caves, ops]
// For the Moon, "water" rewards dryness/polar ice and "bio" rewards barren, lifeless ground.
// Estimates are based on the source sheet's dimension matches plus published analog research.
const ANALOG_SCORES = {
  haughton:    { moon: [7, 6, 6, 4, 4, 5, 1, 7], mars: [8, 8, 8, 8, 6, 8, 2, 9] },
  iceland:     { moon: [8, 7, 4, 2, 6, 6, 7, 9], mars: [8, 8, 5, 8, 7, 6, 7, 8] },
  ladakh:      { moon: [3, 5, 6, 4, 5, 4, 1, 6], mars: [7, 7, 8, 7, 6, 7, 1, 7] },
  lanzarote:   { moon: [7, 6, 3, 3, 6, 6, 8, 7], mars: [7, 6, 3, 3, 6, 5, 8, 6] },
  maunakea:    { moon: [8, 6, 5, 2, 8, 6, 6, 9], mars: [8, 7, 5, 3, 7, 4, 6, 8] },
  lavabeds:    { moon: [6, 4, 4, 2, 3, 3, 9, 5], mars: [6, 4, 4, 5, 3, 7, 9, 5] },
  lonar:       { moon: [7, 6, 2, 1, 3, 2, 1, 5], mars: [8, 6, 2, 6, 2, 7, 1, 5] },
  erebus:      { moon: [4, 3, 6, 2, 2, 2, 6, 5], mars: [6, 4, 7, 7, 2, 8, 7, 6] },
  dryvalleys:  { moon: [3, 5, 7, 5, 4, 7, 2, 6], mars: [8, 9, 9, 9, 8, 9, 3, 8] },
  atacama:     { moon: [3, 5, 4, 6, 6, 8, 2, 6], mars: [9, 8, 7, 8, 8, 10, 3, 9] },
  qaidam:      { moon: [2, 5, 5, 5, 6, 6, 1, 4], mars: [7, 9, 7, 7, 9, 7, 1, 7] },
  deathvalley: { moon: [3, 5, 3, 5, 5, 5, 1, 5], mars: [7, 7, 4, 7, 7, 5, 1, 6] },
  kutch:       { moon: [1, 3, 2, 3, 3, 3, 0, 3], mars: [8, 6, 3, 7, 4, 7, 0, 5] },
  svalbard:    { moon: [3, 4, 6, 3, 2, 2, 1, 5], mars: [8, 6, 7, 7, 3, 7, 2, 8] },
  riotinto:    { moon: [1, 2, 1, 1, 1, 1, 3, 3], mars: [9, 4, 2, 8, 2, 9, 5, 7] },
  meteor:      { moon: [7, 9, 4, 4, 5, 6, 0, 8], mars: [6, 8, 3, 2, 4, 3, 0, 5] },
  mistastin:   { moon: [9, 6, 4, 3, 3, 3, 0, 6], mars: [5, 5, 4, 3, 2, 2, 0, 3] },
  sfvf:        { moon: [8, 9, 4, 3, 8, 5, 3, 9], mars: [5, 6, 3, 2, 6, 3, 3, 5] },
  cratersmoon: { moon: [8, 7, 4, 3, 6, 6, 8, 8], mars: [5, 5, 3, 2, 5, 4, 7, 5] },
  sudbury:     { moon: [8, 3, 2, 2, 1, 1, 4, 4], mars: [5, 2, 1, 3, 1, 2, 4, 2] }
};

// How much each dimension counts (0–5) for each benchmark. Unlisted dimensions count 0.5.
const BENCHMARKS = {
  moon: {
    overall: { label: "The Moon as a whole", blurb: "Weights rock type, terrain and crew operations most: what matters for landing on, walking across and sampling the lunar surface.",
      w: { geo: 3, terrain: 3, temp: 2, water: 1, dust: 2, bio: 1, caves: 1.5, ops: 2.5 } },
    places: {
      apollo11:   { geo: 3, terrain: 3, dust: 3, ops: 3, temp: 1 },
      apollo14:   { geo: 3, terrain: 3, dust: 1.5, ops: 2.5, temp: 1 },
      hadley:     { geo: 3, terrain: 3, caves: 2, ops: 2, dust: 1 },
      descartes:  { geo: 4, terrain: 2, ops: 2, dust: 1 },
      taurus:     { geo: 3, terrain: 2.5, dust: 2, ops: 2 },
      shackleton: { temp: 4, water: 4, terrain: 2, ops: 2.5, geo: 2 },
      spa:        { geo: 4, terrain: 2, temp: 1.5, water: 1.5 },
      tycho:      { geo: 3, terrain: 4, ops: 1.5 },
      marius:     { caves: 4, geo: 3, terrain: 2, ops: 1 },
      orientale:  { geo: 3, terrain: 3.5 },
      copernicus: { geo: 3, terrain: 3.5, ops: 1 }
    }
  },
  mars: {
    overall: { label: "Mars as a whole", blurb: "Weights rock and minerals, past water and signs of life most: the questions Mars rovers and future crews are sent to answer.",
      w: { geo: 3, terrain: 2.5, temp: 2, water: 3, dust: 2, bio: 2.5, caves: 1, ops: 1.5 } },
    places: {
      jezero:    { water: 4, bio: 4, geo: 3, terrain: 2 },
      gale:      { geo: 3.5, water: 3.5, bio: 2, terrain: 2 },
      meridiani: { geo: 4, water: 3.5, bio: 2 },
      homeplate: { geo: 3.5, water: 3, bio: 3.5 },
      olympus:   { geo: 3, terrain: 3.5, caves: 1.5, ops: 1 },
      ares:      { terrain: 3.5, water: 3, geo: 2.5, dust: 1.5, ops: 2 },
      medusae:   { dust: 4, terrain: 3.5, geo: 2 },
      boreum:    { temp: 4, water: 4, terrain: 2.5 },
      nili:      { geo: 4, water: 3, bio: 3 },
      arsia:     { caves: 4, geo: 3, terrain: 2, bio: 1.5 },
      utopia:    { water: 4, terrain: 3, temp: 3 },
      phoenix:   { temp: 3.5, water: 3.5, bio: 2.5, geo: 2.5 },
      newton:    { water: 4, terrain: 3, bio: 2.5, temp: 2 }
    }
  }
};
