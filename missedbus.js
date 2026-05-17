/**
 * missedbus.js
 * RIT Smart Transport — Missed Bus Assistance
 * Modular feature: does NOT modify any existing file.
 *
 * Depends on: routes.js (ROUTES array), mapview.js (mapInstance, RIT_CAMPUS),
 *             Leaflet (already loaded in index.html)
 */

/* ============================================================
   COMMON JUNCTIONS — curated from ROUTES boarding/stops data.
   These are the stops that appear across the most RIT routes.
============================================================ */
const MISSED_BUS_STOPS = [
    { name: "Porur",          lat: 13.0340, lng: 80.1555, icon: "🔵", routes_hint: 13 },
    { name: "Maduravoyal",    lat: 13.0600, lng: 80.1650, icon: "🟠", routes_hint: 11 },
    { name: "Guindy",         lat: 13.0100, lng: 80.2120, icon: "🟣", routes_hint: 10 },
    { name: "Koyambedu",      lat: 13.0694, lng: 80.1948, icon: "🔴", routes_hint: 9  },
    { name: "Vanagaram",      lat: 13.0530, lng: 80.1300, icon: "🟢", routes_hint: 7  },
    { name: "Villivakkam",    lat: 13.1100, lng: 80.2200, icon: "⚫", routes_hint: 7  },
    { name: "Velachery",      lat: 12.9800, lng: 80.2200, icon: "🔵", routes_hint: 7  },
    { name: "Ambattur",       lat: 13.1150, lng: 80.1600, icon: "🟡", routes_hint: 7  },
    { name: "Poonamallee",    lat: 13.0450, lng: 80.0900, icon: "🟢", routes_hint: 22 },
    { name: "Avadi",          lat: 13.1000, lng: 80.0950, icon: "🟠", routes_hint: 6  },
    { name: "Nolambur",       lat: 13.0850, lng: 80.1750, icon: "🔴", routes_hint: 4  },
    { name: "Vadapalani",     lat: 13.0500, lng: 80.2120, icon: "🟣", routes_hint: 4  },
    { name: "Arumbakkam",     lat: 13.0750, lng: 80.2100, icon: "⚫", routes_hint: 3  },
    { name: "Tambaram",       lat: 12.9236, lng: 80.1177, icon: "🔵", routes_hint: 2  },
  ];

/* ============================================================
   STATE
============================================================ */
let mbMapInstance     = null;   // Leaflet map inside the modal
let mbSelectedStop    = null;   // currently selected MISSED_BUS_STOPS entry
let mbStopMarker      = null;   // highlighted stop marker on the map
let mbRouteLines      = [];     // polylines drawn on the map
let mbBusMarkers      = [];     // animated bus markers
let mbNotifInterval   = null;   // countdown refresh timer

/* ============================================================
   OPEN THE MISSED BUS PANEL
============================================================ */
function openMissedBusPanel() {
  const existing = document.getElementById('mbOverlay');
  if (existing) existing.remove();
  _mbCleanup();

  const overlay = document.createElement('div');
  overlay.className = 'mb-overlay';
  overlay.id = 'mbOverlay';

  overlay.innerHTML = `
    <div class="mb-modal" id="mbModal">

      <!-- Header -->
      <div class="mb-header">
        <div class="mb-header-left">
          <span class="mb-header-icon">🚌</span>
          <div>
            <div class="mb-header-title">Missed Bus Assistance</div>
            <div class="mb-header-sub">Find alternate RIT buses at common stops</div>
          </div>
        </div>
        <button class="mb-close-btn" onclick="closeMissedBusPanel()" title="Close">&#x2715;</button>
      </div>

      <!-- Stop Selector -->
      <div class="mb-stop-selector">
        <div class="mb-section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Select a Common Junction Stop
        </div>
        <div class="mb-stops-grid" id="mbStopsGrid">
          ${MISSED_BUS_STOPS.map(s => `
            <button class="mb-stop-chip" data-stop="${s.name}" onclick="selectMissedBusStop('${s.name}')">
              <span class="mb-chip-icon">${s.icon}</span>
              <span class="mb-chip-name">${s.name}</span>
              <span class="mb-chip-count" title="Routes through this stop">~${s.routes_hint}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Results (hidden until stop selected) -->
      <div class="mb-results-area" id="mbResultsArea" style="display:none">

        <!-- Stats subheader -->
        <div class="mb-subheader" id="mbSubheader">
          <div class="mb-sub-item"><span class="mb-sub-label">Routes</span><span class="mb-sub-val" id="mbSubRoutes">—</span></div>
          <div class="mb-sub-item"><span class="mb-sub-label">Next Bus</span><span class="mb-sub-val" id="mbSubNext">—</span></div>
          <div class="mb-sub-item"><span class="mb-sub-label">Campus Arrival</span><span class="mb-sub-val" id="mbSubArrival">—</span></div>
        </div>

        <!-- Live status bar -->
        <div class="mb-live-bar" id="mbLiveBar">
          <span class="mb-notif-dot"></span>
          <span id="mbNotifTitle">Select a stop above</span>
        </div>

        <!-- Map -->
        <div id="mbMapContainer"></div>

        <!-- Bus Rows -->
        <div class="mb-bus-list" id="mbBusList"></div>

        <!-- All-crossed message -->
        <div class="mb-all-crossed" id="mbAllCrossed" style="display:none">
          <span class="mb-all-crossed-icon">⛔</span>
          <strong>All alternate buses for this stop have crossed.</strong>
          <span>You may need to arrange private transport to RIT Campus.</span>
        </div>

      </div>

    </div>
  `;

  overlay.addEventListener('click', e => { if (e.target === overlay) closeMissedBusPanel(); });
  document.addEventListener('keydown', _mbKeydown);
  document.body.appendChild(overlay);
}

/* ============================================================
   SELECT A STOP — core orchestration
============================================================ */
function selectMissedBusStop(stopName) {
  mbSelectedStop = MISSED_BUS_STOPS.find(s => s.name === stopName);
  if (!mbSelectedStop) return;

  // Highlight chip
  document.querySelectorAll('.mb-stop-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.stop === stopName);
  });

  // Show results area
  const resultsArea = document.getElementById('mbResultsArea');
  resultsArea.style.display = 'block';

  // Find matching routes
  const matchedRoutes = _findRoutesForStop(stopName);

  // Populate subheader
  _renderSubheader(matchedRoutes, mbSelectedStop);

  // Render bus rows & live bar
  _renderBusCards(matchedRoutes, mbSelectedStop);
  _renderNotifications(matchedRoutes, mbSelectedStop);

  // Map — defer for layout
  setTimeout(() => _initMbMap(mbSelectedStop, matchedRoutes), 80);

  // Refresh every 30s
  if (mbNotifInterval) clearInterval(mbNotifInterval);
  mbNotifInterval = setInterval(() => {
    _renderBusCards(matchedRoutes, mbSelectedStop);
    _renderNotifications(matchedRoutes, mbSelectedStop);
    _renderSubheader(matchedRoutes, mbSelectedStop);
  }, 30000);

  // Scroll results into view
  resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ============================================================
   POPULATE SUBHEADER
============================================================ */
function _renderSubheader(matchedRoutes, stop) {
  const elRoutes  = document.getElementById('mbSubRoutes');
  const elNext    = document.getElementById('mbSubNext');
  const elArrival = document.getElementById('mbSubArrival');
  if (!elRoutes) return;

  elRoutes.textContent = matchedRoutes.length;

  // Next available bus time
  const upcoming = matchedRoutes
    .map(r => ({ time: r.stopTime, mins: _toMins(r.stopTime) }))
    .filter(r => {
      const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
      return r.mins !== null && r.mins >= nowMins - 2;
    });

  if (upcoming.length > 0) {
    elNext.textContent = upcoming[0].time;
    elArrival.textContent = '7:40 AM';
  } else {
    elNext.textContent = 'None';
    elArrival.textContent = '—';
  }
}

/* ============================================================
   FIND ROUTES THAT PASS THROUGH A STOP
   Uses case-insensitive partial match on boarding stop names.
============================================================ */
function _findRoutesForStop(stopName) {
  const q = stopName.toLowerCase();
  const results = [];

  ROUTES.forEach(route => {
    if (!route.boarding) return;
    const match = route.boarding.find(b => b.stop.toLowerCase().includes(q));
    if (!match) return;

    // Also find in stops[] for lat/lng
    let stopCoord = null;
    if (route.stops) {
      const s = route.stops.find(s => s.name.toLowerCase().includes(q));
      if (s) stopCoord = { lat: s.lat, lng: s.lng };
    }

    results.push({
      route,
      stopTime: match.time,
      stopName: match.stop,
      coord: stopCoord
    });
  });

  // Sort by stop time ascending
  results.sort((a, b) => _toMins(a.stopTime) - _toMins(b.stopTime));
  return results;
}

/* ============================================================
   STATUS LOGIC
   Compares actual current time against stop's scheduled time.
============================================================ */
function _getStatus(stopTimeStr) {
  const now     = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const busMins = _toMins(stopTimeStr);
  if (busMins === null) return { type: 'unknown', label: 'Time N/A', mins: null };

  const diff = busMins - nowMins;

  if (diff < -2)  return { type: 'crossed',     label: 'Crossed',                mins: diff };
  if (diff <= 5)  return { type: 'approaching',  label: 'Approaching',            mins: diff };
  if (diff <= 15) return { type: 'arriving',     label: `Arriving in ${diff} min`, mins: diff };
  return              { type: 'arriving',     label: `Arriving in ${diff} min`, mins: diff };
}

function _toMins(timeStr) {
  if (!timeStr) return null;
  const m = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
  if (!m) return null;
  let h = parseInt(m[1]), min = parseInt(m[2]);
  const meridiem = m[3].toLowerCase();
  if (meridiem === 'pm' && h !== 12) h += 12;
  if (meridiem === 'am' && h === 12) h = 0;
  return h * 60 + min;
}

/* ============================================================
   RENDER BUS ROWS
============================================================ */
function _renderBusCards(matchedRoutes, stop) {
  const list       = document.getElementById('mbBusList');
  const allCrossed = document.getElementById('mbAllCrossed');
  if (!list) return;

  if (matchedRoutes.length === 0) {
    list.innerHTML = `<div class="mb-no-routes">No RIT buses found passing through <strong>${stop.name}</strong>.</div>`;
    allCrossed.style.display = 'none';
    return;
  }

  const statuses = matchedRoutes.map(r => _getStatus(r.stopTime));
  const allGone  = statuses.every(s => s.type === 'crossed');

  allCrossed.style.display = allGone ? 'flex' : 'none';

  list.innerHTML = matchedRoutes.map((item, i) => {
    const st    = statuses[i];
    const route = item.route;
    const rowColor =
      st.type === 'crossed'     ? '#ef4444' :
      st.type === 'approaching' ? '#f59e0b' :
                                  '#16a34a';

    return `
      <div class="mb-bus-row ${st.type === 'crossed' ? 'mb-row-crossed' : ''}" style="border-left-color:${rowColor}">
        <span class="mb-bus-badge">${route.no}</span>
        <div class="mb-bus-info">
          <span class="mb-bus-name">${route.name}</span>
          <span class="mb-bus-sub">At ${stop.name}: ${item.stopTime}</span>
        </div>
        <span class="mb-status-tag mb-tag-${st.type}">${st.label}</span>
      </div>
    `;
  }).join('');
}

/* ============================================================
   RENDER LIVE BAR
============================================================ */
function _renderNotifications(matchedRoutes, stop) {
  const liveBar = document.getElementById('mbLiveBar');
  const title   = document.getElementById('mbNotifTitle');
  if (!liveBar) return;

  const statuses  = matchedRoutes.map(r => _getStatus(r.stopTime));
  const available = statuses.filter(s => s.type !== 'crossed').length;

  liveBar.innerHTML = `
    <span class="mb-notif-dot"></span>
    <span>${available > 0
      ? `${available} bus${available !== 1 ? 'es' : ''} available at ${stop.name}`
      : 'All buses have crossed this stop'
    }</span>
  `;
}

/* ============================================================
   INIT MINI MAP
============================================================ */
function _initMbMap(stop, matchedRoutes) {
  const container = document.getElementById('mbMapContainer');
  if (!container) return;

  // Destroy previous instance
  if (mbMapInstance) { mbMapInstance.remove(); mbMapInstance = null; }
  mbStopMarker = null;
  mbRouteLines = [];
  mbBusMarkers = [];

  container.innerHTML = '';

  mbMapInstance = L.map('mbMapContainer', { zoomControl: true, scrollWheelZoom: true });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(mbMapInstance);

  mbMapInstance.invalidateSize();

  // ---- Highlighted Stop Marker ----
  const stopIcon = L.divIcon({
    className: '',
    html: `<div class="mb-map-stop-marker">
      <span class="mb-map-stop-pulse"></span>
      <span class="mb-map-stop-label">${stop.name}</span>
    </div>`,
    iconAnchor: [0, 16]
  });

  mbStopMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon })
    .addTo(mbMapInstance)
    .bindPopup(`<strong>📍 ${stop.name}</strong><br>Common Junction Stop`);

  // ---- RIT Campus Marker ----
  const ritIcon = L.divIcon({
    className: '',
    html: `<div style="background:#16a34a;color:#fff;font-size:11px;font-weight:700;
      padding:3px 8px;border-radius:20px;border:2px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);white-space:nowrap;
      font-family:'Segoe UI',sans-serif;">RIT</div>`,
    iconAnchor: [20, 12]
  });
  L.marker([RIT_CAMPUS.lat, RIT_CAMPUS.lng], { icon: ritIcon })
    .addTo(mbMapInstance)
    .bindPopup('<strong>🏫 RIT Campus</strong><br>Kuthambakkam, Poonamallee');

  // ---- Route Lines from stop → RIT ----
  const colors = ['#1a3a6b','#f59e0b','#7c3aed','#dc2626','#0891b2','#16a34a'];
  const bounds = [[stop.lat, stop.lng], [RIT_CAMPUS.lat, RIT_CAMPUS.lng]];

  matchedRoutes.slice(0, 6).forEach((item, i) => {
    const st = _getStatus(item.stopTime);
    if (st.type === 'crossed') return; // don't draw crossed routes

    const color  = colors[i % colors.length];
    const startC = item.coord || { lat: stop.lat, lng: stop.lng };
    const coords = [[startC.lat, startC.lng], [RIT_CAMPUS.lat, RIT_CAMPUS.lng]];

    const line = L.polyline(coords, {
      color, weight: 3, opacity: 0.7, dashArray: '6,6'
    }).addTo(mbMapInstance);
    line.bindPopup(`<strong>${item.route.no} — ${item.route.name}</strong><br>
      Via ${item.stopName}<br>⏱ ${item.stopTime} at this stop`);
    mbRouteLines.push(line);

    // Animated bus marker on this route
    _animateBusMarker(startC, { lat: RIT_CAMPUS.lat, lng: RIT_CAMPUS.lng }, item.route, color, st);

    bounds.push([startC.lat, startC.lng]);
  });

  mbMapInstance.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
}

/* ============================================================
   ANIMATED BUS MARKER
   Moves the bus icon along the line over time.
============================================================ */
function _animateBusMarker(start, end, route, color, status) {
  if (!mbMapInstance) return;
  if (status.type === 'crossed') return;

  // Progress: if arriving in X mins out of ~60 total travel, estimate position
  const totalMins = 60; // rough trip length
  const minsLeft  = status.mins !== null ? Math.max(0, status.mins) : 30;
  const progress  = Math.min(1, Math.max(0, 1 - (minsLeft / totalMins)));

  const lat = start.lat + (end.lat - start.lat) * progress;
  const lng = start.lng + (end.lng - start.lng) * progress;

  const busIcon = L.divIcon({
    className: '',
    html: `<div class="mb-animated-bus" style="background:${color}">
      <span>${route.no}</span>
    </div>`,
    iconAnchor: [22, 12]
  });

  const marker = L.marker([lat, lng], { icon: busIcon, zIndexOffset: 1000 })
    .addTo(mbMapInstance)
    .bindPopup(`<strong>${route.no} — ${route.name}</strong><br>${_getStatus(route.depart ? '' : '').label}`);

  mbBusMarkers.push(marker);
}

/* ============================================================
   CLOSE + CLEANUP
============================================================ */
function closeMissedBusPanel() {
  _mbCleanup();
  document.removeEventListener('keydown', _mbKeydown);
  const overlay = document.getElementById('mbOverlay');
  if (overlay) overlay.remove();
}

function _mbCleanup() {
  if (mbNotifInterval) { clearInterval(mbNotifInterval); mbNotifInterval = null; }
  if (mbMapInstance)   { mbMapInstance.remove(); mbMapInstance = null; }
  mbStopMarker = null;
  mbRouteLines = [];
  mbBusMarkers = [];
  mbSelectedStop = null;
}

function _mbKeydown(e) {
  if (e.key === 'Escape') closeMissedBusPanel();
}
