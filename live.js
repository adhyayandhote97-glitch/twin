// Live sky figures, computed in the browser from published formulas (no network calls).
//   Moon phase: interpolated between NASA's tabulated times of the principal phases (Espenak).
//   Mars season, time and subsolar point: NASA GISS Mars24 algorithm (Allison and McEwen 2000).
//   Earth and Mars positions: JPL "Approximate Positions of the Planets", Table 1 (Standish and Williams).
// Every function returns null outside the range its source covers.
const Live = (function () {
  const D = Math.PI / 180;
  const mod = (x, m) => ((x % m) + m) % m;
  const lon180 = x => mod(x + 180, 360) - 180;

  // NASA GSFC, "Phases of the Moon: 2001 to 2100" (UT), 2026 to 2028. The list starts at a
  // full Moon and then runs last quarter, new, first quarter, full, ...
  const PHASE_TIMES = ["2026-01-03T10:03Z","2026-01-10T15:48Z","2026-01-18T19:52Z","2026-01-26T04:47Z","2026-02-01T22:09Z","2026-02-09T12:43Z","2026-02-17T12:01Z","2026-02-24T12:28Z","2026-03-03T11:38Z","2026-03-11T09:39Z","2026-03-19T01:23Z","2026-03-25T19:18Z","2026-04-02T02:12Z","2026-04-10T04:52Z","2026-04-17T11:52Z","2026-04-24T02:32Z","2026-05-01T17:23Z","2026-05-09T21:10Z","2026-05-16T20:01Z","2026-05-23T11:11Z","2026-05-31T08:45Z","2026-06-08T10:00Z","2026-06-15T02:54Z","2026-06-21T21:55Z","2026-06-29T23:57Z","2026-07-07T19:29Z","2026-07-14T09:43Z","2026-07-21T11:06Z","2026-07-29T14:36Z","2026-08-06T02:21Z","2026-08-12T17:37Z","2026-08-20T02:46Z","2026-08-28T04:18Z","2026-09-04T07:51Z","2026-09-11T03:27Z","2026-09-18T20:44Z","2026-09-26T16:49Z","2026-10-03T13:25Z","2026-10-10T15:50Z","2026-10-18T16:13Z","2026-10-26T04:12Z","2026-11-01T20:28Z","2026-11-09T07:02Z","2026-11-17T11:48Z","2026-11-24T14:53Z","2026-12-01T06:09Z","2026-12-09T00:52Z","2026-12-17T05:43Z","2026-12-24T01:28Z","2026-12-30T18:59Z","2027-01-07T20:24Z","2027-01-15T20:34Z","2027-01-22T12:17Z","2027-01-29T10:55Z","2027-02-06T15:56Z","2027-02-14T07:58Z","2027-02-20T23:23Z","2027-02-28T05:16Z","2027-03-08T09:29Z","2027-03-15T16:25Z","2027-03-22T10:44Z","2027-03-30T00:54Z","2027-04-06T23:51Z","2027-04-13T22:57Z","2027-04-20T22:27Z","2027-04-28T20:18Z","2027-05-06T10:58Z","2027-05-13T04:44Z","2027-05-20T10:59Z","2027-05-28T13:58Z","2027-06-04T19:40Z","2027-06-11T10:56Z","2027-06-19T00:44Z","2027-06-27T04:54Z","2027-07-04T03:02Z","2027-07-10T18:39Z","2027-07-18T15:45Z","2027-07-26T16:55Z","2027-08-02T10:05Z","2027-08-09T04:54Z","2027-08-17T07:29Z","2027-08-25T02:27Z","2027-08-31T17:41Z","2027-09-07T18:31Z","2027-09-15T23:04Z","2027-09-23T10:20Z","2027-09-30T02:36Z","2027-10-07T11:47Z","2027-10-15T13:47Z","2027-10-22T17:29Z","2027-10-29T13:36Z","2027-11-06T08:00Z","2027-11-14T03:26Z","2027-11-21T00:48Z","2027-11-28T03:24Z","2027-12-06T05:22Z","2027-12-13T16:09Z","2027-12-20T09:11Z","2027-12-27T20:12Z","2028-01-05T01:40Z","2028-01-12T04:03Z","2028-01-18T19:26Z","2028-01-26T15:12Z","2028-02-03T19:10Z","2028-02-10T15:04Z","2028-02-17T08:08Z","2028-02-25T10:37Z","2028-03-04T09:02Z","2028-03-11T01:06Z","2028-03-17T23:23Z","2028-03-26T04:31Z","2028-04-02T19:15Z","2028-04-09T10:27Z","2028-04-16T16:37Z","2028-04-24T19:47Z","2028-05-02T02:26Z","2028-05-08T19:49Z","2028-05-16T10:43Z","2028-05-24T08:16Z","2028-05-31T07:37Z","2028-06-07T06:09Z","2028-06-15T04:27Z","2028-06-22T18:27Z","2028-06-29T12:10Z","2028-07-06T18:11Z","2028-07-14T20:57Z","2028-07-22T03:02Z","2028-07-28T17:40Z","2028-08-05T08:10Z","2028-08-13T11:45Z","2028-08-20T10:44Z","2028-08-27T01:36Z","2028-09-03T23:48Z","2028-09-12T00:46Z","2028-09-18T18:24Z","2028-09-25T13:10Z","2028-10-03T16:25Z","2028-10-11T11:57Z","2028-10-18T02:57Z","2028-10-25T04:53Z","2028-11-02T09:17Z","2028-11-09T21:26Z","2028-11-16T13:18Z","2028-11-24T00:15Z","2028-12-02T01:40Z","2028-12-09T05:39Z","2028-12-16T02:06Z","2028-12-23T21:45Z","2028-12-31T16:48Z"].map(Date.parse);
  const FIRST_PHASE = 2; // 0 new, 1 first quarter, 2 full, 3 last quarter
  const PHASE_NAMES = ["New Moon", "First quarter", "Full Moon", "Last quarter"];

  function moon(now) {
    const t = now.getTime(), T = PHASE_TIMES;
    if (t < T[0] || t >= T[T.length - 1]) return null;
    let i = 0; while (T[i + 1] <= t) i++;
    const q = (FIRST_PHASE + i) % 4;
    const angle = mod(q * 90 + 90 * (t - T[i]) / (T[i + 1] - T[i]), 360);   // 0 new, 180 full
    const near = t - T[i] < 432e5 ? q : T[i + 1] - t < 432e5 ? (q + 1) % 4 : -1; // within 12 h
    const name = near >= 0 ? PHASE_NAMES[near]
      : angle < 90 ? "Waxing crescent" : angle < 180 ? "Waxing gibbous" : angle < 270 ? "Waning gibbous" : "Waning crescent";
    return {
      angle, name,
      illuminated: (1 - Math.cos(angle * D)) / 2,
      // Sun overhead: far side (180°) at new Moon, near side (0°) at full. Ignores libration (up to ~8°).
      subsolar: { lat: 0, lng: lon180(180 - angle) }
    };
  }

  // NASA GISS Mars24, "Algorithm and Worked Examples", steps A-2 to D-1.
  function mars(now, ttMinusUtc = 69.184) {
    const jdTT = 2440587.5 + now.getTime() / 864e5 + ttMinusUtc / 86400;
    const dt = jdTT - 2451545.0;
    const M = 19.3871 + 0.52402073 * dt;
    const aFMS = 270.3871 + 0.524038496 * dt;
    const A = [0.0071, 0.0057, 0.0039, 0.0037, 0.0021, 0.0020, 0.0018];
    const TAU = [2.2353, 2.7543, 1.1177, 15.7866, 2.1354, 2.4694, 32.8493];
    const PHI = [49.409, 168.173, 191.837, 21.736, 15.704, 95.528, 49.095];
    let pbs = 0;
    for (let i = 0; i < 7; i++) pbs += A[i] * Math.cos((0.985626 * dt / TAU[i] + PHI[i]) * D);
    const s = k => Math.sin(k * M * D);
    const eoc = (10.691 + 3.0e-7 * dt) * s(1) + 0.623 * s(2) + 0.050 * s(3) + 0.005 * s(4) + 0.0005 * s(5) + pbs;
    const Ls = mod(aFMS + eoc, 360);
    const sl = k => Math.sin(k * Ls * D);
    const eot = 2.861 * sl(2) - 0.071 * sl(4) + 0.002 * sl(6) - eoc;              // degrees
    const mst = mod(24 * ((jdTT - 2451549.5) / 1.0274912517 + 44796.0 - 0.0009626), 24);
    const subWest = mod(mst * 15 + eot + 180, 360);                                // degrees west
    const decl = Math.asin(0.42565 * sl(1)) / D + 0.25 * sl(1);
    return { Ls, mst, eot, subsolarWest: subWest, subsolar: { lat: decl, lng: lon180(-subWest) } };
  }

  // JPL Table 1 (valid 1800-2050): [a, e, I, L, long. perihelion, long. node], value and rate per century.
  const ELEMENTS = {
    earth: [[1.00000261, 0.00000562], [0.01671123, -0.00004392], [-0.00001531, -0.01294668],
            [100.46457166, 35999.37244981], [102.93768193, 0.32327364], [0.0, 0.0]],
    mars:  [[1.52371034, 0.00001847], [0.09339410, 0.00007882], [1.84969142, -0.00813131],
            [-4.55343205, 19140.30268499], [-23.94362959, 0.44441088], [49.55953891, -0.29257343]]
  };
  function helio(body, jdTT) {
    const T = (jdTT - 2451545.0) / 36525;
    const [a, e, I, L, wbar, node] = ELEMENTS[body].map(([v, r]) => v + r * T);
    const w = wbar - node;
    const M = lon180(L - wbar), es = e / D;
    let E = M + es * Math.sin(M * D);
    for (let k = 0; k < 20; k++) {
      const dE = (M - (E - es * Math.sin(E * D))) / (1 - e * Math.cos(E * D));
      E += dE; if (Math.abs(dE) <= 1e-6) break;
    }
    const x1 = a * (Math.cos(E * D) - e), y1 = a * Math.sqrt(1 - e * e) * Math.sin(E * D);
    const cw = Math.cos(w * D), sw = Math.sin(w * D), cO = Math.cos(node * D), sO = Math.sin(node * D), cI = Math.cos(I * D), sI = Math.sin(I * D);
    return [(cw * cO - sw * sO * cI) * x1 + (-sw * cO - cw * sO * cI) * y1,
            (cw * sO + sw * cO * cI) * x1 + (-sw * sO + cw * cO * cI) * y1,
            (sw * sI) * x1 + (cw * sI) * y1];
  }
  const AU_KM = 149597870.7, C_KMS = 299792.458;   // IAU 2012 Resolution B2; SI definition of c
  function earthMars(now, ttMinusUtc = 69.184) {
    const jdTT = 2440587.5 + now.getTime() / 864e5 + ttMinusUtc / 86400;
    const y = (jdTT - 2451545.0) / 365.25 + 2000;
    if (y < 1800 || y >= 2050) return null;
    const e = helio("earth", jdTT), m = helio("mars", jdTT);
    const au = Math.hypot(m[0] - e[0], m[1] - e[1], m[2] - e[2]);
    return { au, km: au * AU_KM, lightSeconds: au * AU_KM / C_KMS };
  }

  // Points 90° from the subsolar point: the line between day and night.
  function terminator(sub, n = 180) {
    const f = sub.lat * D, pts = [];
    for (let k = 0; k <= n; k++) {
      const b = (360 * k / n) * D;
      const lat = Math.asin(Math.cos(f) * Math.cos(b));
      const lng = sub.lng * D + Math.atan2(Math.sin(b) * Math.cos(f), -Math.sin(f) * Math.sin(lat));
      pts.push([lat / D, lon180(lng / D)]);
    }
    return pts;
  }

  return { moon, mars, earthMars, terminator };
})();
