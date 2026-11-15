// Data for the TWIN (Terrestrial World Identification Network).
// Earth sites: the 20 strongest analogs from the "Earth Analogs for the Moon and Mars" sheet
// (ranked by how many of the 8 analog dimensions each site matches, keeping a mix of Moon, Mars and Both).
// Coordinates are in decimal degrees. Earth: approximate site centres (WGS84).
// Moon and Mars: planetocentric latitude, east-positive longitude in the range -180..180.
// Named features use the centre given in the IAU/USGS Gazetteer of Planetary Nomenclature (Mars values
// converted from 0..360 by subtracting 360 above 180); landing sites use the published landing position.

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

// ---------- Sources ----------
// Every citation used on the site. Each site's `sources` array points at entries here, and the
// References page lists them all. `year: null` means the page carries no publication date ("n.d.").
const SRC = {
  lee2005: { label: "Lee and Osinski (2005)", author: "Lee, P. and Osinski, G.R.", year: 2005, title: "The Haughton-Mars Project: Overview of science investigations at the Haughton impact structure and surrounding terrains, and relevance to planetary studies",
    publisher: "Meteoritics & Planetary Science", url: "https://doi.org/10.1111/j.1945-5100.2005.tb00144.x", accessed: "15 November 2026", kind: "paper" },
  osinski2005: { label: "Osinski et al. (2005)", author: "Osinski, G.R. et al.", year: 2005, title: "A case study of impact-induced hydrothermal activity: The Haughton impact structure, Devon Island, Canadian High Arctic",
    publisher: "Meteoritics & Planetary Science", url: "https://doi.org/10.1111/j.1945-5100.2005.tb00150.x", accessed: "15 November 2026", kind: "paper" },
  pandey2019: { label: "Pandey et al. (2019)", author: "Pandey, S. et al.", year: 2019, title: "Ladakh: diverse, high-altitude extreme environments for off-earth analogue and astrobiology research",
    publisher: "International Journal of Astrobiology", url: "https://doi.org/10.1017/s1473550419000119", accessed: "15 November 2026", kind: "paper" },
  sarkar2022: { label: "Sarkar et al. (2022)", author: "Sarkar, S. et al.", year: 2022, title: "Spectroscopic studies on the Puga Hot Spring Deposits, Ladakh: a possible astrobiological Martian analog site in India",
    publisher: "ESS Open Archive (preprint)", url: "https://doi.org/10.1002/essoar.10510829.1", accessed: "15 November 2026", kind: "paper" },
  sauro2020: { label: "Sauro et al. (2020)", author: "Sauro, F. et al.", year: 2020, title: "Lava tubes on Earth, Moon and Mars: A review on their size and morphology revealed by comparative planetology",
    publisher: "Earth-Science Reviews", url: "https://doi.org/10.1016/j.earscirev.2020.103288", accessed: "15 November 2026", kind: "paper" },
  allen1998: { label: "Allen et al. (1998)", author: "Allen, C.C. et al.", year: 1998, title: "Martian soil simulant available for scientific, educational study",
    publisher: "Eos, Transactions American Geophysical Union", url: "https://doi.org/10.1029/98eo00309", accessed: "15 November 2026", kind: "paper" },
  sanders2011: { label: "Sanders and Larson (2011)", author: "Sanders, G.B. and Larson, W.E.", year: 2011, title: "Integration of In-Situ Resource Utilization into lunar/Mars exploration through field analogs",
    publisher: "Advances in Space Research", url: "https://doi.org/10.1016/j.asr.2010.08.020", accessed: "15 November 2026", kind: "paper" },
  leveille2010: { label: "Léveillé and Datta (2010)", author: "Léveillé, R.J. and Datta, S.", year: 2010, title: "Lava tubes and basaltic caves as astrobiological targets on Earth and Mars: A review",
    publisher: "Planetary and Space Science", url: "https://doi.org/10.1016/j.pss.2009.06.004", accessed: "15 November 2026", kind: "paper" },
  fredriksson1973: { label: "Fredriksson et al. (1973)", author: "Fredriksson, K. et al.", year: 1973, title: "Lonar Lake, India: An Impact Crater in Basalt",
    publisher: "Science", url: "https://doi.org/10.1126/science.180.4088.862", accessed: "15 November 2026", kind: "paper" },
  maloof2009: { label: "Maloof et al. (2009)", author: "Maloof, A.C. et al.", year: 2009, title: "Geology of Lonar Crater, India",
    publisher: "Geological Society of America Bulletin", url: "https://doi.org/10.1130/b26474.1", accessed: "15 November 2026", kind: "paper" },
  wright2011: { label: "Wright et al. (2011)", author: "Wright, S.P., Christensen, P.R. and Sharp, T.G.", year: 2011, title: "Laboratory thermal emission spectroscopy of shocked basalt from Lonar Crater, India, and implications for Mars orbital and sample data",
    publisher: "Journal of Geophysical Research: Planets", url: "https://doi.org/10.1029/2010je003785", accessed: "15 November 2026", kind: "paper" },
  bamber2023: { label: "Bamber et al. (2023)", author: "Bamber, E. et al.", year: 2023, title: "Investigating Crater Inlet Valley Formation: Field Study at Lonar Crater, India",
    publisher: "EGU General Assembly 2023", url: "https://doi.org/10.5194/egusphere-egu23-1437", accessed: "15 November 2026", kind: "paper" },
  tebo2015: { label: "Tebo et al. (2015)", author: "Tebo, B.M. et al.", year: 2015, title: "Microbial communities in dark oligotrophic volcanic ice cave ecosystems of Mt. Erebus, Antarctica",
    publisher: "Frontiers in Microbiology", url: "https://doi.org/10.3389/fmicb.2015.00179", accessed: "15 November 2026", kind: "paper" },
  marchant2007: { label: "Marchant and Head (2007)", author: "Marchant, D.R. and Head, J.W.", year: 2007, title: "Antarctic dry valleys: Microclimate zonation, variable geomorphic processes, and implications for assessing climate change on Mars",
    publisher: "Icarus", url: "https://doi.org/10.1016/j.icarus.2007.06.018", accessed: "15 November 2026", kind: "paper" },
  dickson2013: { label: "Dickson et al. (2013)", author: "Dickson, J.L. et al.", year: 2013, title: "Don Juan Pond, Antarctica: Near-surface CaCl2-brine feeding Earth's most saline lake and implications for Mars",
    publisher: "Scientific Reports", url: "https://doi.org/10.1038/srep01166", accessed: "15 November 2026", kind: "paper" },
  tamppari2012: { label: "Tamppari et al. (2012)", author: "Tamppari, L.K. et al.", year: 2012, title: "Effects of extreme cold and aridity on soils and habitability: McMurdo Dry Valleys as an analogue for the Mars Phoenix landing site",
    publisher: "Antarctic Science", url: "https://doi.org/10.1017/s0954102011000800", accessed: "15 November 2026", kind: "paper" },
  levy2010: { label: "Levy et al. (2010)", author: "Levy, J.S., Marchant, D.R. and Head, J.W.", year: 2010, title: "Thermal contraction crack polygons on Mars: A synthesis from HiRISE, Phoenix, and terrestrial analog studies",
    publisher: "Icarus", url: "https://doi.org/10.1016/j.icarus.2009.09.005", accessed: "15 November 2026", kind: "paper" },
  navarro2003: { label: "Navarro-González et al. (2003)", author: "Navarro-González, R. et al.", year: 2003, title: "Mars-Like Soils in the Atacama Desert, Chile, and the Dry Limit of Microbial Life",
    publisher: "Science", url: "https://doi.org/10.1126/science.1089143", accessed: "15 November 2026", kind: "paper" },
  catling2010: { label: "Catling et al. (2010)", author: "Catling, D.C. et al.", year: 2010, title: "Atmospheric origins of perchlorate on Mars and in the Atacama",
    publisher: "Journal of Geophysical Research: Planets", url: "https://doi.org/10.1029/2009je003425", accessed: "15 November 2026", kind: "paper" },
  xiao2017: { label: "Xiao et al. (2017)", author: "Xiao, L. et al.", year: 2017, title: "A new terrestrial analogue site for Mars research: The Qaidam Basin, Tibetan Plateau (NW China)",
    publisher: "Earth-Science Reviews", url: "https://doi.org/10.1016/j.earscirev.2016.11.003", accessed: "15 November 2026", kind: "paper" },
  baldridge2004: { label: "Baldridge et al. (2004)", author: "Baldridge, A.M., Farmer, J.D. and Moersch, J.E.", year: 2004, title: "Mars remote‐sensing analog studies in the Badwater Basin, Death Valley, California",
    publisher: "Journal of Geophysical Research: Planets", url: "https://doi.org/10.1029/2004je002315", accessed: "15 November 2026", kind: "paper" },
  bhattacharya2016: { label: "Bhattacharya et al. (2016)", author: "Bhattacharya, S. et al.", year: 2016, title: "Jarosite occurrence in the Deccan Volcanic Province of Kachchh, western India: Spectroscopic studies on a Martian analog locality",
    publisher: "Journal of Geophysical Research: Planets", url: "https://doi.org/10.1002/2015je004949", accessed: "15 November 2026", kind: "paper" },
  treiman2002: { label: "Treiman et al. (2002)", author: "Treiman, A.H. et al.", year: 2002, title: "Hydrothermal origin for carbonate globules in Martian meteorite ALH84001: a terrestrial analogue from Spitsbergen (Norway)",
    publisher: "Earth and Planetary Science Letters", url: "https://doi.org/10.1016/s0012-821x(02)00998-6", accessed: "15 November 2026", kind: "paper" },
  steele2007: { label: "Steele et al. (2007)", author: "Steele, A. et al.", year: 2007, title: "Comprehensive imaging and Raman spectroscopy of carbonate globules from Martian meteorite ALH 84001 and a terrestrial analogue from Svalbard",
    publisher: "Meteoritics & Planetary Science", url: "https://doi.org/10.1111/j.1945-5100.2007.tb00590.x", accessed: "15 November 2026", kind: "paper" },
  fernandez2005: { label: "Fernández-Remolar et al. (2005)", author: "Fernández-Remolar, D.C. et al.", year: 2005, title: "The Río Tinto Basin, Spain: Mineralogy, sedimentary geobiology, and implications for interpretation of outcrop rocks at Meridiani Planum, Mars",
    publisher: "Earth and Planetary Science Letters", url: "https://doi.org/10.1016/j.epsl.2005.09.043", accessed: "15 November 2026", kind: "paper" },
  stoker2008: { label: "Stoker et al. (2008)", author: "Stoker, C.R. et al.", year: 2008, title: "The 2005 MARTE Robotic Drilling Experiment in Río Tinto, Spain: Objectives, Approach, and Results of a Simulated Mission to Search for Life in the Martian Subsurface",
    publisher: "Astrobiology", url: "https://doi.org/10.1089/ast.2007.0217", accessed: "15 November 2026", kind: "paper" },
  marion2010: { label: "Marion and Sylvester (2010)", author: "Marion, C.L. and Sylvester, P.J.", year: 2010, title: "Composition and heterogeneity of anorthositic impact melt at Mistastin Lake crater, Labrador",
    publisher: "Planetary and Space Science", url: "https://doi.org/10.1016/j.pss.2009.09.018", accessed: "15 November 2026", kind: "paper" },
  grieve1991: { label: "Grieve et al. (1991)", author: "Grieve, R.A.F., Stöffler, D. and Deutsch, A.", year: 1991, title: "The Sudbury structure: Controversial or misunderstood?",
    publisher: "Journal of Geophysical Research: Planets", url: "https://doi.org/10.1029/91je02513", accessed: "15 November 2026", kind: "paper" },
  haruyama2009: { label: "Haruyama et al. (2009)", author: "Haruyama, J. et al.", year: 2009, title: "Possible lunar lava tube skylight observed by SELENE cameras",
    publisher: "Geophysical Research Letters", url: "https://doi.org/10.1029/2009gl040635", accessed: "15 November 2026", kind: "paper" },
  kaku2017: { label: "Kaku et al. (2017)", author: "Kaku, T. et al.", year: 2017, title: "Detection of Intact Lava Tubes at Marius Hills on the Moon by SELENE (Kaguya) Lunar Radar Sounder",
    publisher: "Geophysical Research Letters", url: "https://doi.org/10.1002/2017gl074998", accessed: "15 November 2026", kind: "paper" },
  zuber2012: { label: "Zuber et al. (2012)", author: "Zuber, M.T. et al.", year: 2012, title: "Constraints on the volatile distribution within Shackleton crater at the lunar south pole",
    publisher: "Nature", url: "https://doi.org/10.1038/nature11216", accessed: "15 November 2026", kind: "paper" },
  squyres2008: { label: "Squyres et al. (2008)", author: "Squyres, S.W. et al.", year: 2008, title: "Detection of Silica-Rich Deposits on Mars",
    publisher: "Science", url: "https://doi.org/10.1126/science.1155429", accessed: "15 November 2026", kind: "paper" },
  ruff2016: { label: "Ruff and Farmer (2016)", author: "Ruff, S.W. and Farmer, J.D.", year: 2016, title: "Silica deposits on Mars with features resembling hot spring biosignatures at El Tatio in Chile",
    publisher: "Nature Communications", url: "https://doi.org/10.1038/ncomms13554", accessed: "15 November 2026", kind: "paper" },
  ojha2018: { label: "Ojha et al. (2018)", author: "Ojha, L. et al.", year: 2018, title: "The Medusae Fossae Formation as the single largest source of dust on Mars",
    publisher: "Nature Communications", url: "https://doi.org/10.1038/s41467-018-05291-5", accessed: "15 November 2026", kind: "paper" },
  hecht2009: { label: "Hecht et al. (2009)", author: "Hecht, M.H. et al.", year: 2009, title: "Detection of Perchlorate and the Soluble Chemistry of Martian Soil at the Phoenix Lander Site",
    publisher: "Science", url: "https://doi.org/10.1126/science.1172466", accessed: "15 November 2026", kind: "paper" },
  mcewen2011: { label: "McEwen et al. (2011)", author: "McEwen, A.S. et al.", year: 2011, title: "Seasonal Flows on Warm Martian Slopes",
    publisher: "Science", url: "https://doi.org/10.1126/science.1204816", accessed: "15 November 2026", kind: "paper" },
  dundas2017: { label: "Dundas et al. (2017)", author: "Dundas, C.M. et al.", year: 2017, title: "Granular flows at recurring slope lineae on Mars indicate a limited role for liquid water",
    publisher: "Nature Geoscience", url: "https://doi.org/10.1038/s41561-017-0012-5", accessed: "15 November 2026", kind: "paper" },
  cushing2007: { label: "Cushing et al. (2007)", author: "Cushing, G.E. et al.", year: 2007, title: "THEMIS observes possible cave skylights on Mars",
    publisher: "Geophysical Research Letters", url: "https://doi.org/10.1029/2007gl030709", accessed: "15 November 2026", kind: "paper" },
  ehlmann2008: { label: "Ehlmann et al. (2008)", author: "Ehlmann, B.L. et al.", year: 2008, title: "Orbital Identification of Carbonate-Bearing Rocks on Mars",
    publisher: "Science", url: "https://doi.org/10.1126/science.1164759", accessed: "15 November 2026", kind: "paper" },
  stuurman2016: { label: "Stuurman et al. (2016)", author: "Stuurman, C.M. et al.", year: 2016, title: "SHARAD detection and characterization of subsurface water ice deposits in Utopia Planitia, Mars",
    publisher: "Geophysical Research Letters", url: "https://doi.org/10.1002/2016gl070138", accessed: "15 November 2026", kind: "paper" },
  squyres2004: { label: "Squyres et al. (2004)", author: "Squyres, S.W. et al.", year: 2004, title: "In Situ Evidence for an Ancient Aqueous Environment at Meridiani Planum, Mars",
    publisher: "Science", url: "https://doi.org/10.1126/science.1104559", accessed: "15 November 2026", kind: "paper" },
  phillips2008: { label: "Phillips et al. (2008)", author: "Phillips, R.J. et al.", year: 2008, title: "Mars North Polar Deposits: Stratigraphy, Age, and Geodynamical Response",
    publisher: "Science", url: "https://doi.org/10.1126/science.1157546", accessed: "15 November 2026", kind: "paper" },
  plescia2004: { label: "Plescia (2004)", author: "Plescia, J.B.", year: 2004, title: "Morphometric properties of Martian volcanoes",
    publisher: "Journal of Geophysical Research: Planets", url: "https://doi.org/10.1029/2002je002031", accessed: "15 November 2026", kind: "paper" },
  grotzinger2014: { label: "Grotzinger et al. (2014)", author: "Grotzinger, J.P. et al.", year: 2014, title: "A Habitable Fluvio-Lacustrine Environment at Yellowknife Bay, Gale Crater, Mars",
    publisher: "Science", url: "https://doi.org/10.1126/science.1242777", accessed: "15 November 2026", kind: "paper" },
  golombek1997: { label: "Golombek et al. (1997)", author: "Golombek, M.P. et al.", year: 1997, title: "Overview of the Mars Pathfinder Mission and Assessment of Landing Site Predictions",
    publisher: "Science", url: "https://doi.org/10.1126/science.278.5344.1743", accessed: "15 November 2026", kind: "paper" },
  smith2009: { label: "Smith et al. (2009)", author: "Smith, P.H. et al.", year: 2009, title: "H 2 O at the Phoenix Landing Site",
    publisher: "Science", url: "https://doi.org/10.1126/science.1172339", accessed: "15 November 2026", kind: "paper" },
  mangold2021: { label: "Mangold et al. (2021)", author: "Mangold, N. et al.", year: 2021, title: "Perseverance rover reveals an ancient delta-lake system and flood deposits at Jezero crater, Mars",
    publisher: "Science", url: "https://doi.org/10.1126/science.abl4051", accessed: "15 November 2026", kind: "paper" },
  farley2022: { label: "Farley et al. (2022)", author: "Farley, K.A. et al.", year: 2022, title: "Aqueously altered igneous rocks sampled on the floor of Jezero crater, Mars",
    publisher: "Science", url: "https://doi.org/10.1126/science.abo2196", accessed: "15 November 2026", kind: "paper" },
  milliken2010: { label: "Milliken et al. (2010)", author: "Milliken, R.E., Grotzinger, J.P. and Thomson, B.J.", year: 2010, title: "Paleoclimate of Mars as captured by the stratigraphic record in Gale Crater",
    publisher: "Geophysical Research Letters", url: "https://doi.org/10.1029/2009GL041870", accessed: "15 November 2026", kind: "paper" },
  nasaIceland: { label: "NASA (n.d.)", author: "NASA", year: null, title: "Artemis II Crew Geology Training in Iceland",
    publisher: "NASA", url: "https://www.nasa.gov/video-detail/jsc2025m000399-artemis-ii-crew-geology-training-icelandorig-2/", accessed: "15 November 2026", kind: "agency" },
  csaIceland2024: { label: "Canadian Space Agency (2024)", author: "Canadian Space Agency", year: 2024, title: "Artemis II crew refines lunar geology skills in Iceland",
    publisher: "Canadian Space Agency", url: "https://www.asc-csa.gc.ca/eng/news/articles/2024/2024-08-22-artemis-ii-crew-refines-lunar-geology-skills-in-iceland.asp", accessed: "15 November 2026", kind: "agency" },
  csaMistastin2023: { label: "Canadian Space Agency (2023)", author: "Canadian Space Agency", year: 2023, title: "15 photos of lunar geology training in Canada",
    publisher: "Canadian Space Agency", url: "https://www.asc-csa.gc.ca/eng/blog/2023/09/19/15-photos-of-lunar-geology-training-in-canada.asp", accessed: "15 November 2026", kind: "agency" },
  bailey1967: { label: "Bailey (1967)", author: "Bailey, N.G.", year: 1967, title: "Cinder Lake crater field location test",
    publisher: "U.S. Geological Survey Open-File Report 67-7", url: "https://pubs.usgs.gov/publication/ofr677", accessed: "15 November 2026", kind: "agency" },
  portree2019: { label: "Portree (2019)", author: "Portree, D.", year: 2019, title: "The Moon in Arizona",
    publisher: "Lunar Reconnaissance Orbiter Camera, Arizona State University", url: "https://www.lroc.asu.edu/images/1107", accessed: "15 November 2026", kind: "agency" },
  caswell2023: { label: "Caswell et al. (n.d.)", author: "Caswell, T.E. et al.", year: null, title: "JETT3: A Holistic, Integrated Analog for Artemis Lunar Surface Exploration",
    publisher: "NASA Technical Reports Server", url: "https://ntrs.nasa.gov/citations/20230000146", accessed: "15 November 2026", kind: "agency" },
  nps: { label: "National Park Service (n.d.)", author: "National Park Service", year: null, title: "Space Exploration Research and Astronaut Training",
    publisher: "Craters of the Moon National Monument & Preserve", url: "https://www.nps.gov/crmo/learn/historyculture/space-exploration-research-and-astronaut-training.htm", accessed: "15 November 2026", kind: "agency" },
  dence1972: { label: "Dence et al. (1972)", author: "Dence, M.B., Boudette, E.L. and Lucchitta, I.", year: 1972, title: "Guide to the geology of Sudbury Basin, Ontario, Canada (Apollo 17 Training Exercise 5/23/1972-5/25/1972)",
    publisher: "U.S. Geological Survey Open-File Report 72-87", url: "https://pubs.usgs.gov/publication/ofr7287", accessed: "15 November 2026", kind: "agency" },
  gsa2008: { label: "Geological Society of America (2008)", author: "Geological Society of America", year: 2008, title: "Sudbury Structure: An Analog Site for Past Lunar Geologists and Future Planetary Scientists",
    publisher: "2008 Joint Annual Meeting, abstract 146513", url: "https://gsa.confex.com/gsa/2008AM/webprogram/Paper146513.html", accessed: "15 November 2026", kind: "paper" },
  nasaBraille2019: { label: "NASA (2019)", author: "NASA", year: 2019, title: "Using a 'Cave Rover,' NASA Learns to Search for Life Underground",
    publisher: "NASA", url: "https://www.nasa.gov/universe/using-a-cave-rover-nasa-learns-to-search-for-life-underground/", accessed: "15 November 2026", kind: "agency" },
  nasaArads: { label: "NASA (n.d.)", author: "NASA", year: null, title: "Astrobiology Technology - Atacama Rover Astrobiology Drilling Studies",
    publisher: "NASA", url: "https://www.nasa.gov/image-article/astrobiology-technology-atacama-rover-astrobiology-drilling-studies/", accessed: "15 November 2026", kind: "agency" },
  newsonair2024: { label: "Akashvani News (2024)", author: "Akashvani News (Government of India)", year: 2024, title: "ISRO Starts India's First Analog Space Mission To Plan Lunar Mission Experiments",
    publisher: "News On AIR", url: "https://www.newsonair.gov.in/isro-starts-indias-first-analog-space-mission-at-leh-in-ladakh-to-plan-lunar-mission-experiments", accessed: "15 November 2026", kind: "agency" },
  uhHiseas2013: { label: "University of Hawaii (2013)", author: "University of Hawaiʻi", year: 2013, title: "HI-SEAS to study human performance for long-duration space exploration",
    publisher: "University of Hawaiʻi System News", url: "https://www.hawaii.edu/news/2013/06/14/long-duration-space-exploration-study-awarded-nasa-grant/", accessed: "15 November 2026", kind: "agency" },
  naiAmase2010: { label: "NASA Astrobiology Institute (2010)", author: "NASA Astrobiology Institute", year: 2010, title: "Project 6: Application of Laboratory Experimentation to Flight Instrument Testing (2010 Annual Science Report)",
    publisher: "NASA Astrobiology Institute", url: "https://astrobiology.nasa.gov/nai/annual-reports/2010/ciw/project-6-application-of-laboratory-experimentation-to-flight-instrument-testing/index.html", accessed: "15 November 2026", kind: "agency" },
  kekesi2004: { label: "Kekesi (2004)", author: "Kekesi, A.", year: 2004, title: "Earth-Mars Volcano Comparisons: Final Composite",
    publisher: "NASA Scientific Visualization Studio", url: "https://svs.gsfc.nasa.gov/2864", accessed: "15 November 2026", kind: "agency" },
  esaLanzarote2021: { label: "European Space Agency (2021)", author: "European Space Agency", year: 2021, title: "Rocky roads through Lanzarote",
    publisher: "European Space Agency", url: "https://www.esa.int/ESA_Multimedia/Images/2021/11/Rocky_roads_through_Lanzarote", accessed: "15 November 2026", kind: "agency" },
  nssA11: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Apollo 11 Lunar Module / EASEP (1969-059C)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C", accessed: "15 November 2026", kind: "mission" },
  nssA14: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Apollo 14 Lunar Module / ALSEP (1971-008C)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-008C", accessed: "15 November 2026", kind: "mission" },
  nssA15: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Apollo 15 Lunar Module / ALSEP (1971-063C)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C", accessed: "15 November 2026", kind: "mission" },
  nssA16: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Apollo 16 Lunar Module / ALSEP (1972-031C)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-031C", accessed: "15 November 2026", kind: "mission" },
  nssA17: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Apollo 17 Lunar Module / ALSEP (1972-096C)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096C", accessed: "15 November 2026", kind: "mission" },
  nssSurveyor7: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Surveyor 7 (1968-001A)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1968-001A", accessed: "15 November 2026", kind: "mission" },
  nssPathfinder: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Mars Pathfinder (1996-068A)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A", accessed: "15 November 2026", kind: "mission" },
  nssPhoenix: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Phoenix Mars Lander (2007-034A)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A", accessed: "15 November 2026", kind: "mission" },
  nssViking2: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Viking 2 Lander (1975-083C)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C", accessed: "15 November 2026", kind: "mission" },
  nssSpirit: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Spirit (2003-027A)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A", accessed: "15 November 2026", kind: "mission" },
  nssOpportunity: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Opportunity (2003-032A)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A", accessed: "15 November 2026", kind: "mission" },
  nssMSL: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Mars Science Laboratory (MSL) (2011-070A)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A", accessed: "15 November 2026", kind: "mission" },
  nssM2020: { label: "NASA Space Science Data Coordinated Archive (n.d.)", author: "NASA Space Science Data Coordinated Archive", year: null, title: "Mars 2020 (2020-052A)",
    publisher: "NSSDCA Master Catalog", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A", accessed: "15 November 2026", kind: "mission" },
  gazStatio: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Statio Tranquillitatis (feature 5684)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/5684", accessed: "15 November 2026", kind: "gazetteer" },
  gazFraMauro: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Fra Mauro (feature 2007)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/2007", accessed: "15 November 2026", kind: "gazetteer" },
  gazRimaHadley: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Rima Hadley (feature 5064)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/5064", accessed: "15 November 2026", kind: "gazetteer" },
  gazDescartes: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Descartes (feature 1498)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/1498", accessed: "15 November 2026", kind: "gazetteer" },
  gazTaurus: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Taurus Littrow Valley (feature 5881)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/5881", accessed: "15 November 2026", kind: "gazetteer" },
  gazShackleton: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Shackleton (feature 5450)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/5450", accessed: "15 November 2026", kind: "gazetteer" },
  gazTycho: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Tycho (feature 6163)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/6163", accessed: "15 November 2026", kind: "gazetteer" },
  gazOrientale: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Mare Orientale (feature 3685)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/3685", accessed: "15 November 2026", kind: "gazetteer" },
  gazCopernicus: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Copernicus (feature 1296)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/1296", accessed: "15 November 2026", kind: "gazetteer" },
  gazJezero: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Jezero (feature 14300)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/14300", accessed: "15 November 2026", kind: "gazetteer" },
  gazGale: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Gale (feature 2071)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/2071", accessed: "15 November 2026", kind: "gazetteer" },
  gazMeridiani: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Meridiani Planum (feature 3854)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/3854", accessed: "15 November 2026", kind: "gazetteer" },
  gazGusev: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Gusev (feature 2289)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/2289", accessed: "15 November 2026", kind: "gazetteer" },
  gazOlympus: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Olympus Mons (feature 4453)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/4453", accessed: "15 November 2026", kind: "gazetteer" },
  gazAres: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Ares Vallis (feature 358)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/358", accessed: "15 November 2026", kind: "gazetteer" },
  gazMedusae: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Medusae Fossae (feature 3795)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/3795", accessed: "15 November 2026", kind: "gazetteer" },
  gazBoreum: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Planum Boreum (feature 4754)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/4754", accessed: "15 November 2026", kind: "gazetteer" },
  gazNili: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Nili Fossae (feature 4271)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/4271", accessed: "15 November 2026", kind: "gazetteer" },
  gazArsia: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Arsia Mons (feature 394)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/394", accessed: "15 November 2026", kind: "gazetteer" },
  gazUtopia: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Utopia Planitia (feature 6260)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/6260", accessed: "15 November 2026", kind: "gazetteer" },
  gazNewton: { label: "IAU Gazetteer of Planetary Nomenclature (n.d.)", author: "International Astronomical Union Working Group for Planetary System Nomenclature", year: null, title: "Newton (feature 4236)",
    publisher: "Gazetteer of Planetary Nomenclature, USGS Astrogeology Science Center", url: "https://planetarynames.wr.usgs.gov/Feature/4236", accessed: "15 November 2026", kind: "gazetteer" },
};

const EARTH_SITES = [
  {
    id: "haughton", name: "Haughton Crater, Devon Island", region: "Canada (Nunavut)", group: "Polar regions",
    twins: [], twinReason: null,
    sources: [SRC.lee2005, SRC.osinski2005],
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
    twins: [], twinReason: null,
    sources: [SRC.nasaIceland, SRC.csaIceland2024],
    analog: "Both", category: "Volcanic field", lat: 65.0, lng: -16.8,
    wiki: ["Askja", "Holuhraun"],
    why: "Fresh basalt lava and tephra plains with almost no plants; volcano–ice interaction; black sand deserts with frequent dust storms.",
    counterpart: "Lunar maria; Mars volcanic plains, glacio-volcanic terrain",
    dims: ["geo", "terrain", "temp", "water", "dust", "bio", "caves", "ops"],
    usedBy: "Apollo crew training; Artemis II crew training; JETT 2",
    limits: "Wet climate, glaciers and rivers; active weathering",
    moon: "Apollo astronauts trained in Askja in 1965 and 1967 because its basalt plains are a close stand-in for the dark lunar maria, which are also old basalt lava flows. Artemis II astronauts returned in 2024 for the same reason: picking samples and describing rock in barren volcanic ground is the core skill of a lunar field geologist.",
    mars: "Iceland is one of the few places where lava, ice and floods interact on a large scale, as they did on Mars. Holuhraun's 2014–15 lava field is a fresh model for young Martian flows, glacial outburst floods carve channels like smaller versions of Martian outflow channels, and the black sand deserts produce dust storms. It is the only site in the sheet that matches all eight analog dimensions."
  },
  {
    id: "ladakh", name: "Ladakh (Tso Kar, Puga valley)", region: "India (Ladakh)", group: "Asia",
    twins: ["homeplate"], twinReason: "The Puga hot springs leave mineral deposits in a cold, dry, high-altitude setting, matching the ancient hot-spring deposits at Home Plate.",
    sources: [SRC.pandey2019, SRC.sarkar2022, SRC.newsonair2024],
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
    twins: ["marius", "arsia"], twinReason: "The Corona lava tube and its collapsed roof openings match the lava tubes and skylight pits found at Marius Hills on the Moon and on Arsia Mons on Mars.",
    sources: [SRC.sauro2020, SRC.esaLanzarote2021],
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
    twins: ["olympus"], twinReason: "Mauna Loa and Mauna Kea are basaltic shield volcanoes, the same landform as Olympus Mons, which NASA compares directly with Mauna Loa.",
    sources: [SRC.kekesi2004, SRC.allen1998, SRC.sanders2011, SRC.uhHiseas2013],
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
    twins: ["arsia"], twinReason: "Basalt lava tube caves holding cave ice and microbial mats match the cave skylights found on the flanks of Arsia Mons.",
    sources: [SRC.leveille2010, SRC.nasaBraille2019],
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
    twins: ["jezero"], twinReason: "A crater breached by an inlet valley that feeds a lake inside it matches the setting of Jezero's ancient crater lake.",
    sources: [SRC.bamber2023, SRC.fredriksson1973, SRC.maloof2009, SRC.wright2011],
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
    twins: [], twinReason: null,
    sources: [SRC.tebo2015],
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
    twins: ["phoenix", "newton", "utopia"], twinReason: "Cold, dry soil over ice-cemented ground, polygon-cracked surfaces and salty brine seeps match the Phoenix landing site, Utopia Planitia and the seasonal streaks at Newton crater.",
    sources: [SRC.tamppari2012, SRC.dickson2013, SRC.levy2010, SRC.marchant2007],
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
    twins: ["phoenix"], twinReason: "Its hyperarid soils hold perchlorate salts at abundances close to those the Phoenix lander measured in Martian soil.",
    sources: [SRC.catling2010, SRC.navarro2003, SRC.nasaArads],
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
    twins: ["medusae"], twinReason: "Wind-carved yardang ridges in dry lake sediments match the yardang fields of the Medusae Fossae Formation.",
    sources: [SRC.xiao2017],
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
    twins: ["gale"], twinReason: "Badwater Basin's salt pans, left as lakes evaporated, match the sulfate-salt layers recorded in Gale crater's Mount Sharp.",
    sources: [SRC.baldridge2004],
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
    twins: ["meridiani"], twinReason: "Matanomadh hosts jarosite formed by acidic water in weathered basalt, the mineral that marked past acid water at Meridiani Planum.",
    sources: [SRC.bhattacharya2016],
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
    twins: ["nili"], twinReason: "Carbonate minerals formed by warm water in volcanic rock match the carbonate-bearing rocks mapped at Nili Fossae.",
    sources: [SRC.treiman2002, SRC.steele2007, SRC.naiAmase2010],
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
    twins: ["meridiani"], twinReason: "Acidic, iron-rich water here deposits jarosite and hematite, the same minerals Opportunity found at Meridiani Planum.",
    sources: [SRC.fernandez2005, SRC.stoker2008],
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
    twins: [], twinReason: null,
    sources: [],
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
    twins: ["descartes"], twinReason: "The crater formed in anorthosite, the rock of the lunar highlands that Apollo 16 sampled at the Descartes site.",
    sources: [SRC.csaMistastin2023, SRC.marion2010],
    analog: "Moon", category: "Impact crater", lat: 55.88, lng: -63.31,
    wiki: ["Mistastin_crater"],
    why: "~28 km crater formed in anorthosite, the same rock that makes the lunar highlands; thick impact-melt rocks.",
    counterpart: "Lunar highlands craters, south pole region terrain",
    dims: ["geo", "terrain", "ops"],
    usedBy: "Artemis II crew training; Artemis geology team site reconnaissance",
    limits: "Glaciated and vegetated; remote",
    moon: "The bright lunar highlands, including the region around the south pole where Artemis will land, are made mostly of anorthosite. Mistastin is one of only two known impact craters on Earth that formed in anorthosite, so its impact melts and breccias are the closest Earth match to what Artemis astronauts will sample. Artemis II crew members Jeremy Hansen and Christina Koch trained here in 2023."
  },
  {
    id: "sfvf", name: "San Francisco Volcanic Field (SP Crater, Cinder Lake crater field)", region: "USA (Arizona)", group: "Americas",
    twins: ["apollo11"], twinReason: "The USGS blasted the Cinder Lake crater field in 1967 as a full-scale copy of a cratered patch of Mare Tranquillitatis, so crater sizes, spacing and the loose basaltic cinder surface match the Apollo 11 landing area.",
    sources: [SRC.bailey1967, SRC.portree2019, SRC.caswell2023],
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
    twins: ["apollo14"], twinReason: "Barren, broken basalt lava and cinder terrain stood in for the lunar surface when the Apollo 14 crew rehearsed field geology here in 1969.",
    sources: [SRC.nps],
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
    twins: ["descartes", "taurus"], twinReason: "Shatter cones, impact breccia and impact-melt rock here match what the Apollo 16 and 17 crews were trained to recognise on the Moon.",
    sources: [SRC.gsa2008, SRC.dence1972, SRC.grieve1991],
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
    twins: ["sfvf"], twinReason: "Its small craters on a basalt mare plain were copied at full scale at Cinder Lake in the San Francisco Volcanic Field.",
    sources: [SRC.nssA11, SRC.gazStatio, SRC.bailey1967, SRC.portree2019],
    lat: 0.674, lng: 23.473, wiki: ["Apollo_11", "Mare_Tranquillitatis"],
    explored: "Apollo 11 (1969)",
    summary: "The first crewed landing site, on the flat basalt plain of Mare Tranquillitatis.",
    details: "Neil Armstrong and Buzz Aldrin landed on a smooth mare plain peppered with small craters and covered by fine, powdery regolith. Mare Tranquillitatis is a basin flooded by basalt lava about 3.6 billion years ago, and the samples returned confirmed the Moon's dark seas are volcanic rock.",
    earthAnalogs: ["sfvf", "meteor"],
    otherAnalogs: "Cinder Lake's blasted crater field recreated this exact landing area for crew rehearsals."
  },
  {
    id: "apollo14", name: "Fra Mauro highlands (Apollo 14)", type: "Impact ejecta", status: "landed",
    twins: ["cratersmoon"], twinReason: "Its crew rehearsed field geology on the barren lava fields of Craters of the Moon.",
    sources: [SRC.nssA14, SRC.gazFraMauro, SRC.nps],
    lat: -3.645, lng: -17.471, wiki: ["Fra_Mauro_formation", "Apollo_14"],
    explored: "Apollo 14 (1971)",
    summary: "Hilly terrain made of debris thrown out by the impact that formed the Imbrium basin.",
    details: "Apollo 14 targeted the Fra Mauro formation to sample material ejected from deep below the surface by the Imbrium impact. Astronauts Alan Shepard and Edgar Mitchell hiked toward the rim of Cone crater and returned breccias, rocks made of shattered fragments welded together by the impact.",
    earthAnalogs: ["cratersmoon", "meteor"],
    otherAnalogs: "The crew also trained at the Nördlinger Ries crater in Germany."
  },
  {
    id: "hadley", name: "Hadley Rille (Apollo 15)", type: "Lava channel (rille)", status: "landed",
    twins: [], twinReason: null,
    sources: [SRC.nssA15, SRC.gazRimaHadley],
    lat: 26.13, lng: 3.63, wiki: ["Rima_Hadley", "Apollo_15"],
    explored: "Apollo 15 (1971)",
    summary: "A sinuous channel cut by flowing lava at the foot of the Apennine mountains.",
    details: "Apollo 15 was the first mission with the lunar rover. Dave Scott and Jim Irwin drove to the edge of Hadley Rille, a winding valley about 1.5 km wide formed by flowing or collapsed lava, and collected the 'Genesis Rock', a piece of the Moon's early anorthosite crust.",
    earthAnalogs: ["iceland", "cratersmoon"],
    otherAnalogs: "The crew trained at the Rio Grande Gorge in New Mexico to study a canyon cut into basalt."
  },
  {
    id: "descartes", name: "Descartes Highlands (Apollo 16)", type: "Highlands", status: "landed",
    twins: ["sudbury", "mistastin"], twinReason: "Its anorthosite and impact breccia are matched by Mistastin's anorthosite and by Sudbury's breccias, where the Apollo 16 crew trained.",
    sources: [SRC.nssA16, SRC.gazDescartes, SRC.gsa2008, SRC.csaMistastin2023],
    lat: -8.973, lng: 15.5, wiki: ["Descartes_Highlands", "Apollo_16"],
    explored: "Apollo 16 (1972)",
    summary: "The only Apollo landing in the bright lunar highlands.",
    details: "Scientists expected volcanic rocks here, but John Young and Charlie Duke found mostly impact breccias and anorthosite. That surprise showed how much of the highlands crust has been churned by impacts, and why craters formed in anorthosite on Earth are so valuable for training.",
    earthAnalogs: ["sudbury", "mistastin"],
    otherAnalogs: "The Stillwater Complex in Montana supplies anorthosite for lunar highland simulants."
  },
  {
    id: "taurus", name: "Taurus–Littrow valley (Apollo 17)", type: "Highland valley", status: "landed",
    twins: ["sudbury"], twinReason: "Its crew trained on Sudbury's shatter cones, breccias and impact-melt rock in May 1972.",
    sources: [SRC.nssA17, SRC.gazTaurus, SRC.dence1972],
    lat: 20.19, lng: 30.77, wiki: ["Taurus–Littrow", "Apollo_17"],
    explored: "Apollo 17 (1972)",
    summary: "A deep valley at the edge of Mare Serenitatis, site of the last Apollo landing.",
    details: "Geologist Harrison Schmitt and Gene Cernan explored a valley floored by mare basalt and walled by massive highland blocks, and found orange volcanic glass beads from ancient fire-fountain eruptions. It was the most geologically diverse Apollo site.",
    earthAnalogs: ["sudbury", "sfvf"],
    otherAnalogs: null
  },
  {
    id: "shackleton", name: "Shackleton crater & south pole", type: "Polar crater", status: "future",
    twins: [], twinReason: null,
    sources: [SRC.zuber2012, SRC.gazShackleton],
    lat: -89.67, lng: 129.78, wiki: ["Shackleton_(crater)", "Lunar_south_pole"],
    explored: "Artemis candidate region; mapped by LRO, Chandrayaan-2",
    summary: "A 21 km crater almost exactly at the south pole, its floor in permanent shadow.",
    details: "The Sun never rises above the rim of Shackleton's floor, so it is one of the coldest places in the Solar System and may hold water ice. Its rim gets near-constant sunlight, which makes the region a prime target for Artemis bases. The terrain is highlands anorthosite, lit by sunlight skimming the horizon. No place on Earth matches the ~40 K cold of its shadowed floor.",
    earthAnalogs: ["mistastin", "svalbard"],
    otherAnalogs: "The East Antarctic Plateau, Astrobotic's Mojave proving ground and KSC Swamp Works copy the cold or the low-sun lighting."
  },
  {
    id: "spa", name: "South Pole–Aitken basin", type: "Giant impact basin", status: "landed",
    twins: [], twinReason: null,
    sources: [],
    lat: -53, lng: -169, wiki: ["South_Pole–Aitken_basin"],
    explored: "Chang'e 4 (2019), Chang'e 6 sample return (2024)",
    summary: "The largest and oldest impact basin on the Moon, about 2,500 km across.",
    details: "This basin on the far side may have dug into the lunar mantle. China's Chang'e 4 rover explored its floor and Chang'e 6 returned the first far-side samples in 2024. Understanding its melt sheet depends on comparisons with Earth's largest impact structures.",
    earthAnalogs: ["sudbury", "mistastin"],
    otherAnalogs: "Vredefort Dome in South Africa, Earth's largest verified impact structure, is another comparison."
  },
  {
    id: "tycho", name: "Tycho crater", type: "Fresh rayed crater", status: "landed",
    twins: [], twinReason: null,
    sources: [SRC.gazTycho, SRC.nssSurveyor7],
    lat: -43.30, lng: -11.22, wiki: ["Tycho_(crater)", "Surveyor_7"],
    explored: "Surveyor 7 landed on its ejecta (1968)",
    summary: "An 85 km young crater whose bright rays stretch across the near side.",
    details: "About 100 million years old, Tycho is one of the youngest large craters on the Moon. Its rays of bright, freshly broken rock show how ejecta spreads out from an impact before it is darkened by space weathering.",
    earthAnalogs: ["meteor"],
    otherAnalogs: "Kamil crater in Egypt preserves tiny but similar bright ejecta rays."
  },
  {
    id: "marius", name: "Marius Hills skylight", type: "Lava tube skylight", status: "orbital",
    twins: ["lanzarote"], twinReason: "A skylight pit over an intact lava tube is matched by the Corona lava tube and its roof collapses on Lanzarote.",
    sources: [SRC.haruyama2009, SRC.kaku2017, SRC.sauro2020],
    lat: 14.1, lng: -56.8, wiki: ["Marius_Hills", "Lunar_lava_tube"],
    explored: "Discovered by SELENE/Kaguya; imaged by LRO",
    summary: "A ~65 m pit that likely opens into an intact lava tube.",
    details: "Radar and gravity data suggest large empty lava tubes run beneath this volcanic region. Tubes could shelter a base from radiation, micrometeorites and the 300 °C temperature swing between lunar day and night.",
    earthAnalogs: ["lavabeds", "lanzarote", "cratersmoon", "maunakea"],
    otherAnalogs: "Kazumura Cave in Hawaii is one of the longest lava tubes on Earth."
  },
  {
    id: "orientale", name: "Mare Orientale", type: "Multi-ring basin", status: "orbital",
    twins: [], twinReason: null,
    sources: [SRC.gazOrientale],
    lat: -19.87, lng: -94.67, wiki: ["Mare_Orientale"],
    explored: "Mapped by LRO and GRAIL",
    summary: "A bullseye of three mountain rings, the best-preserved large basin on the Moon.",
    details: "Orientale is about 930 km across and only partly flooded with lava, so its rings and melt sheet are exposed. It is the reference example for how giant impacts build multi-ring basins.",
    earthAnalogs: ["sudbury"],
    otherAnalogs: "Manicouagan in Quebec shows a ring-shaped eroded impact structure on Earth."
  },
  {
    id: "copernicus", name: "Copernicus crater", type: "Complex crater", status: "orbital",
    twins: [], twinReason: null,
    sources: [SRC.gazCopernicus],
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
    twins: ["lonar"], twinReason: "A crater lake fed through an inlet valley is matched by Lonar Crater and its lake.",
    sources: [SRC.gazJezero, SRC.nssM2020, SRC.mangold2021, SRC.farley2022, SRC.bamber2023],
    lat: 18.41, lng: 77.69, wiki: ["Jezero_(crater)", "Perseverance_(rover)"],
    explored: "Perseverance rover (2021–)",
    summary: "A 45 km crater that once held a lake, with a river delta on its western rim.",
    details: "Perseverance is collecting rock cores here for future return to Earth. The delta and lake-bed sediments, and carbonates around the rim, are the best places on Mars to look for preserved signs of ancient microbial life.",
    earthAnalogs: ["lonar", "haughton"],
    otherAnalogs: "Lake Salda in Turkey, the Samail Ophiolite in Oman and the Pilbara in Australia are also used as comparisons."
  },
  {
    id: "gale", name: "Gale crater & Mount Sharp", type: "Crater paleolake", status: "landed",
    twins: ["deathvalley"], twinReason: "Layered sulfate salts left as water dried up are matched by the evaporite salt pans of Death Valley.",
    sources: [SRC.gazGale, SRC.nssMSL, SRC.grotzinger2014, SRC.milliken2010, SRC.baldridge2004],
    lat: -5.4, lng: 137.8, wiki: ["Gale_(crater)", "Curiosity_(rover)"],
    explored: "Curiosity rover (2012–)",
    summary: "A 154 km crater with a 5 km mound of layered sediment in the middle.",
    details: "Curiosity showed that Gale once held a long-lived lake with chemistry that microbes could have used. Climbing Mount Sharp, it reads the layers like pages of a climate record as Mars went from wet to dry, passing clays into sulfate salts.",
    earthAnalogs: ["lonar", "deathvalley"],
    otherAnalogs: "Lake Bosumtwi in Ghana and the Mars Desert Research Station badlands in Utah are other comparisons."
  },
  {
    id: "meridiani", name: "Meridiani Planum", type: "Sulfate plain", status: "landed",
    twins: ["riotinto", "kutch"], twinReason: "Jarosite and hematite left by acidic water are matched at Río Tinto and at Matanomadh in Kutch.",
    sources: [SRC.gazMeridiani, SRC.nssOpportunity, SRC.squyres2004, SRC.fernandez2005, SRC.bhattacharya2016],
    lat: -1.95, lng: -5.53, wiki: ["Meridiani_Planum", "Opportunity_(rover)"],
    explored: "Opportunity rover (2004–2018)",
    summary: "A plain where Opportunity found proof that acidic water once soaked the ground.",
    details: "Opportunity found jarosite, an acid-sulfate mineral, and millions of small hematite spheres nicknamed 'blueberries'. Together they showed that acidic groundwater moved through these rocks long ago.",
    earthAnalogs: ["riotinto", "kutch"],
    otherAnalogs: "Hematite concretions in Utah's Navajo Sandstone and jarosite at the Varkala cliffs in Kerala are close matches."
  },
  {
    id: "homeplate", name: "Home Plate, Gusev crater", type: "Hydrothermal deposit", status: "landed",
    twins: ["ladakh"], twinReason: "Hot-spring mineral deposits are matched by the Puga hot-spring deposits of Ladakh.",
    sources: [SRC.gazGusev, SRC.nssSpirit, SRC.squyres2008, SRC.ruff2016, SRC.pandey2019],
    lat: -14.64, lng: 175.53, wiki: ["Home_Plate", "Spirit_(rover)"],
    explored: "Spirit rover (2004–2010)",
    summary: "A volcanic plateau where Spirit found nearly pure silica from ancient hot springs.",
    details: "Spirit's stuck wheel churned up bright soil that was about 90% opaline silica, a sign of hot springs or steam vents. Knobby silica like this on Earth often forms around microbes, which makes it a strong target in the search for past life.",
    earthAnalogs: ["ladakh", "iceland"],
    otherAnalogs: "El Tatio geysers in Chile have almost identical knobby silica textures; Yellowstone is another comparison."
  },
  {
    id: "olympus", name: "Olympus Mons", type: "Shield volcano", status: "orbital",
    twins: ["maunakea"], twinReason: "A giant basaltic shield volcano, the same landform as Hawaii's Mauna Loa and Mauna Kea.",
    sources: [SRC.gazOlympus, SRC.plescia2004, SRC.kekesi2004],
    lat: 18.65, lng: -133.8, wiki: ["Olympus_Mons"],
    explored: "Mapped by Mariner 9, Mars Express, MRO",
    summary: "The tallest volcano in the Solar System, about 22 km high and 600 km wide.",
    details: "Olympus Mons is a shield volcano built from countless runny basalt flows, the same way Hawaii's volcanoes formed. It grew so large because Mars has no moving tectonic plates to carry it away from its magma source.",
    earthAnalogs: ["maunakea", "iceland"],
    otherAnalogs: null
  },
  {
    id: "ares", name: "Ares Vallis (Pathfinder)", type: "Outflow channel", status: "landed",
    twins: [], twinReason: null,
    sources: [SRC.gazAres, SRC.nssPathfinder, SRC.golombek1997],
    lat: 19.13, lng: -33.22, wiki: ["Ares_Vallis", "Mars_Pathfinder"],
    explored: "Mars Pathfinder & Sojourner (1997)",
    summary: "The mouth of a giant flood channel, littered with rocks swept down by water.",
    details: "Pathfinder landed where catastrophic floods once burst out onto the northern plains, leaving a field of boulders stacked and tilted by the current. Such floods may have released more water than any river on Earth.",
    earthAnalogs: ["iceland", "atacama"],
    otherAnalogs: "The Channeled Scablands in Washington, carved by Ice Age megafloods, are the classic comparison."
  },
  {
    id: "medusae", name: "Medusae Fossae Formation", type: "Wind-eroded deposit", status: "orbital",
    twins: ["qaidam"], twinReason: "Wind-carved yardangs are matched by the yardang fields of the Qaidam Basin.",
    sources: [SRC.gazMedusae, SRC.ojha2018, SRC.xiao2017],
    lat: -2.17, lng: -164.2, wiki: ["Medusae_Fossae_Formation"],
    explored: "Mapped by MRO, Mars Express radar",
    summary: "A huge, soft deposit carved by wind into ridges called yardangs.",
    details: "This deposit stretches over 5,000 km along the equator and is likely made of volcanic ash. Wind has sculpted it into parallel ridges and grooves, the largest yardang fields in the Solar System. It is also the biggest single source of dust on Mars.",
    earthAnalogs: ["qaidam"],
    otherAnalogs: "The Lut Desert in Iran has giant yardangs too, and the Bodélé Depression in Chad is Earth's largest dust source."
  },
  {
    id: "boreum", name: "Planum Boreum (north polar cap)", type: "Polar ice cap", status: "orbital",
    twins: [], twinReason: null,
    sources: [SRC.gazBoreum, SRC.phillips2008],
    lat: 87.32, lng: 54.96, wiki: ["Planum_Boreum", "Martian_polar_ice_caps"],
    explored: "Mapped by MRO SHARAD radar and Mars Express",
    summary: "A 3 km thick dome of water ice layered with dust.",
    details: "Radar shows the cap is built from many layers of ice and dust, recording swings in Mars' climate over millions of years. Spiral troughs cut by wind wind across its surface.",
    earthAnalogs: ["dryvalleys", "svalbard"],
    otherAnalogs: "The Greenland Ice Sheet is used to test ice drilling and radar sounding."
  },
  {
    id: "nili", name: "Nili Fossae", type: "Mineral-rich troughs", status: "orbital",
    twins: ["svalbard"], twinReason: "Carbonate-bearing rocks formed where water altered volcanic rock are matched by the Bockfjorden volcanic complex on Svalbard.",
    sources: [SRC.gazNili, SRC.ehlmann2008, SRC.treiman2002],
    lat: 22.02, lng: 76.69, wiki: ["Nili_Fossae"],
    explored: "Mapped by MRO CRISM; candidate landing site",
    summary: "Troughs exposing olivine, clays and carbonates, plus possible methane sources.",
    details: "Nili Fossae holds some of the clearest signs on Mars of olivine-rich rock reacting with water to form serpentine and carbonates, the same process that makes hydrogen and methane on Earth. It was a finalist landing site for Perseverance.",
    earthAnalogs: ["svalbard"],
    otherAnalogs: "The Tablelands in Newfoundland and the Samail Ophiolite in Oman show this serpentinisation happening today."
  },
  {
    id: "arsia", name: "Arsia Mons cave skylights", type: "Lava tube skylights", status: "orbital",
    twins: ["lanzarote", "lavabeds"], twinReason: "Lava tube skylights are matched by the lava tubes of Lanzarote and Lava Beds.",
    sources: [SRC.gazArsia, SRC.cushing2007, SRC.sauro2020, SRC.leveille2010],
    lat: -8.26, lng: -120.09, wiki: ["Arsia_Mons"],
    explored: "Imaged by Mars Odyssey and MRO HiRISE",
    summary: "Dark pits on a giant volcano's flanks that may open into caves.",
    details: "The 'seven sisters' pits near Arsia Mons are among the best cave candidates on Mars. Caves would protect astronauts and possibly microbes from radiation, and could trap ice.",
    earthAnalogs: ["lavabeds", "lanzarote", "maunakea", "erebus"],
    otherAnalogs: null
  },
  {
    id: "utopia", name: "Utopia Planitia", type: "Ice-rich plain", status: "landed",
    twins: ["dryvalleys"], twinReason: "Ice-rich ground with polygon cracks is matched by the ice-cemented, polygon-patterned ground of the McMurdo Dry Valleys.",
    sources: [SRC.gazUtopia, SRC.nssViking2, SRC.stuurman2016, SRC.levy2010],
    lat: 25.07, lng: 109.93, wiki: ["Utopia_Planitia", "Zhurong_(rover)"],
    explored: "Viking 2 (1976), Zhurong rover (2021–2022)",
    summary: "A vast northern plain with polygon-cracked ground and buried ice.",
    details: "Orbital radar shows thick ice buried under Utopia's surface, and the ground is patterned with polygons and scalloped hollows formed as ice freezes, thaws and turns to vapour. Zhurong's radar found layered sediments beneath the plain.",
    earthAnalogs: ["haughton", "dryvalleys", "svalbard"],
    otherAnalogs: "Pingos at Tuktoyaktuk and the CRREL permafrost tunnel in Alaska are other comparisons."
  },
  {
    id: "phoenix", name: "Phoenix landing site", type: "Polar plain", status: "landed",
    twins: ["dryvalleys", "atacama"], twinReason: "Cold, dry, perchlorate-bearing soil over ground ice is matched by Dry Valleys soils and Atacama perchlorate deposits.",
    sources: [SRC.nssPhoenix, SRC.smith2009, SRC.hecht2009, SRC.tamppari2012, SRC.catling2010],
    lat: 68.22, lng: -125.75, wiki: ["Phoenix_(spacecraft)"],
    explored: "Phoenix lander (2008)",
    summary: "Arctic plain where Phoenix dug into water ice and found perchlorate salts.",
    details: "Phoenix scraped through a few centimetres of soil to hit bright water ice, which slowly vaporised in the sunlight. It also discovered perchlorate, a reactive salt that changed how scientists think about Martian chemistry and the search for organics.",
    earthAnalogs: ["dryvalleys", "atacama"],
    otherAnalogs: null
  },
  {
    id: "newton", name: "Newton crater slopes", type: "Recurring slope lineae", status: "orbital",
    twins: ["dryvalleys"], twinReason: "Seasonal dark streaks on warm slopes are matched by the brine-fed water tracks at Don Juan Pond in the Dry Valleys.",
    sources: [SRC.gazNewton, SRC.mcewen2011, SRC.dundas2017, SRC.dickson2013],
    lat: -40.5, lng: -158.03, wiki: ["Recurring_slope_lineae", "Newton_(Martian_crater)"],
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

// Twin links must be two-way. Logs any pair listed on one side only.
(function checkTwins() {
  const all = {};
  for (const b of Object.keys(BODIES)) for (const s of BODIES[b].sites) all[s.id] = s;
  for (const s of Object.values(all)) for (const t of s.twins)
    if (!all[t] || !all[t].twins.includes(s.id)) console.warn("TWIN: one-way twin link", s.id, "->", t);
})();

// The world a site id belongs to, and the site itself: { body, site } or null.
function findAny(id) {
  for (const body of Object.keys(BODIES)) { const site = findSite(body, id); if (site) return { body, site }; }
  return null;
}

// ---------- Compare & rank ----------
// Scores are built from each Earth site's `dims` ticks (from the research sheet), the weights
// below, and cited twin links. There are no hand-entered ratings.
// How much each dimension counts (0–5) for each benchmark: TWIN's stated method, shown in the
// panel as "Ranked by" and adjustable there. Unlisted dimensions count 0.5.
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

// ---------- Map data and software (References page) ----------
const DATA_SOURCES = [
  { author: "TWIN team", year: 2026, title: "Earth Analogs for the Moon and Mars: research sheet (89 sites, eight analog dimensions)",
    publisher: "Unpublished team dataset", url: null, accessed: null, kind: "data" },
  { author: "USGS Astrogeology Science Center", year: null, title: "Moon LRO LROC WAC Global Morphology Mosaic 100m",
    publisher: "Astropedia", url: "https://astrogeology.usgs.gov/search/map/moon_lro_lroc_wac_global_morphology_mosaic_100m", accessed: "15 November 2026", kind: "data" },
  { author: "USGS Astrogeology Science Center", year: null, title: "Mars Viking Colorized Global Mosaic 232m",
    publisher: "Astropedia", url: "https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m", accessed: "15 November 2026", kind: "data" },
  { author: "NASA", year: null, title: "Moon Trek", publisher: "NASA Solar System Treks", url: "https://trek.nasa.gov/moon/", accessed: "15 November 2026", kind: "data" },
  { author: "NASA", year: null, title: "Mars Trek", publisher: "NASA Solar System Treks", url: "https://trek.nasa.gov/mars/", accessed: "15 November 2026", kind: "data" },
  { author: "Natural Earth", year: null, title: "Free vector and raster map data (country boundaries)",
    publisher: "Natural Earth", url: "https://www.naturalearthdata.com/", accessed: "15 November 2026", kind: "data" },
  { author: "TopoJSON", year: null, title: "world-atlas: pre-built TopoJSON from Natural Earth",
    publisher: "GitHub", url: "https://github.com/topojson/world-atlas", accessed: "15 November 2026", kind: "data" }
];
const SOFTWARE_SOURCES = [
  { author: "Asturiano, V.", year: null, title: "globe.gl (version 2.46.2)", publisher: "GitHub", url: "https://github.com/vasturiano/globe.gl", accessed: "15 November 2026", kind: "software" },
  { author: "Agafonkin, V. and contributors", year: null, title: "Leaflet (version 1.9.4)", publisher: "Leaflet", url: "https://leafletjs.com/", accessed: "15 November 2026", kind: "software" },
  { author: "Bostock, M.", year: null, title: "topojson-client (version 3.1.0)", publisher: "GitHub", url: "https://github.com/topojson/topojson-client", accessed: "15 November 2026", kind: "software" }
];
