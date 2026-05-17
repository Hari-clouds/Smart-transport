/**
 * tracker.js — RIT Smart Transport Live Bus Tracker
 * Simulates real-time bus position along a route's GPS stops.
 * Depends on: routes.js, Leaflet
 */

let trkMap        = null;
let trkBusMarker  = null;
let trkRouteLine  = null;
let trkStopMarkers = [];
let trkInterval   = null;
let trkStepTimer  = null;
let trkRouteData  = null;
let trkCurrentIdx = 0;
let trkProgress   = 0;   // 0-1 interpolation between stops

const TRK_STEP_MS   = 80;   // animation tick
const TRK_SPEED     = 0.012; // fraction of segment per tick

/* ============================================================
   OPEN TRACKER MODAL
============================================================ */
function openBusTracker(route) {
  closeBusTracker();
  trkRouteData  = route;
  trkCurrentIdx = 0;
  trkProgress   = 0;

  const stops = route.stops;
  if (!stops || stops.length < 2) {
    alert('GPS stop data not available for this route.');
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'trk-overlay';
  overlay.id = 'trkOverlay';

  overlay.innerHTML = `
    <div class="trk-modal" id="trkModal">

      <div class="trk-header">
        <div class="trk-header-left">
          <div class="trk-pulse-wrap"><div class="trk-pulse"></div></div>
          <div>
            <div class="trk-title">Live Tracking — ${route.no}</div>
            <div class="trk-subtitle">${route.name} &rarr; RIT Campus</div>
          </div>
        </div>
        <button class="trk-close-btn" onclick="closeBusTracker()" title="Close">&times;</button>
      </div>

      <div class="trk-body">

        <div class="trk-map-wrap">
          <div id="trkMap"></div>
          <div class="trk-map-legend">
            <span class="trk-leg-dot trk-leg-start"></span>Start
            <span class="trk-leg-dot trk-leg-bus"></span>Bus
            <span class="trk-leg-dot trk-leg-end"></span>Campus
          </div>
        </div>

        <div class="trk-panel">

          <div class="trk-eta-card">
            <div class="trk-eta-icon">&#128652;</div>
            <div class="trk-eta-info">
              <span class="trk-eta-label">Estimated Arrival</span>
              <span class="trk-eta-time" id="trkEta">—</span>
            </div>
            <div class="trk-status-badge" id="trkStatusBadge">En Route</div>
          </div>

          <div class="trk-next-stop">
            <div class="trk-ns-label">Next Stop</div>
            <div class="trk-ns-name" id="trkNextStop">—</div>
            <div class="trk-ns-dist" id="trkNextDist">—</div>
          </div>

          <div class="trk-progress-wrap">
            <div class="trk-prog-bar"><div class="trk-prog-fill" id="trkProgFill" style="width:0%"></div></div>
            <div class="trk-prog-labels">
              <span>${route.name}</span><span>RIT Campus</span>
            </div>
          </div>

          <div class="trk-stops-list" id="trkStopsList"></div>

        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeBusTracker(); });

  setTimeout(() => {
    _trkInitMap(stops);
    _trkRenderStopList(stops);
    _trkStartAnimation(stops);
  }, 120);
}

/* ============================================================
   CLOSE / CLEANUP
============================================================ */
function closeBusTracker() {
  clearInterval(trkInterval);
  clearTimeout(trkStepTimer);
  trkInterval = null;
  trkStepTimer = null;
  trkMap = null;
  trkBusMarker = null;
  trkRouteLine = null;
  trkStopMarkers = [];
  const el = document.getElementById('trkOverlay');
  if (el) el.remove();
}

/* ============================================================
   MAP INIT
============================================================ */
function _trkInitMap(stops) {
  const container = document.getElementById('trkMap');
  if (!container) return;

  trkMap = L.map('trkMap', { zoomControl: true, attributionControl: false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 19
  }).addTo(trkMap);

  const latlngs = stops.map(s => [s.lat, s.lng]);

  trkRouteLine = L.polyline(latlngs, {
    color: '#1a3a6b', weight: 3, opacity: 0.4, dashArray: '6 4'
  }).addTo(trkMap);

  const last = stops[stops.length - 1];
  const first = stops[0];

  L.marker([first.lat, first.lng], { icon: _trkDotIcon('#f59e0b', '▶') })
    .addTo(trkMap)
    .bindPopup(`<b>${first.name}</b><br>Departure point`);

  L.marker([last.lat, last.lng], { icon: _trkDotIcon('#16a34a', '🏫') })
    .addTo(trkMap)
    .bindPopup(`<b>RIT Campus</b><br>Arrival: 7:40 am`);

  stops.slice(1, -1).forEach(s => {
    const m = L.circleMarker([s.lat, s.lng], {
      radius: 5, color: '#1a3a6b', fillColor: '#fff',
      fillOpacity: 1, weight: 2, opacity: 0.6
    }).addTo(trkMap)
      .bindPopup(`<b>${s.name}</b>${s.time ? '<br>' + s.time : ''}`);
    trkStopMarkers.push(m);
  });

  trkBusMarker = L.marker([first.lat, first.lng], {
    icon: _trkBusIcon(), zIndexOffset: 1000
  }).addTo(trkMap).bindPopup(`<b>Route ${trkRouteData.no}</b><br>En route to RIT Campus`);

  trkMap.fitBounds(latlngs, { padding: [20, 20] });
}

function _trkDotIcon(color, label) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};color:#fff;font-size:12px;width:26px;height:26px;
      border-radius:50%;display:flex;align-items:center;justify-content:center;
      border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25);">${label}</div>`,
    iconAnchor: [13, 13]
  });
}

function _trkBusIcon() {
  return L.divIcon({
    className: '',
    html: `<div id="trkBusDot" style="background:#ef4444;color:#fff;font-size:11px;font-weight:700;
      padding:4px 8px;border-radius:14px;border:2px solid #fff;
      box-shadow:0 3px 10px rgba(239,68,68,0.5);white-space:nowrap;
      transition:transform 0.3s ease;">
      🚌 ${trkRouteData ? trkRouteData.no : ''}
    </div>`,
    iconAnchor: [24, 14]
  });
}

/* ============================================================
   STOP LIST RENDER
============================================================ */
function _trkRenderStopList(stops) {
  const el = document.getElementById('trkStopsList');
  if (!el) return;
  el.innerHTML = stops.map((s, i) => `
    <div class="trk-stop-row ${i === 0 ? 'trk-stop-passed' : ''}" id="trkStop_${i}">
      <div class="trk-stop-dot ${i === 0 ? 'trk-dot-passed' : i === stops.length - 1 ? 'trk-dot-campus' : ''}"></div>
      <div class="trk-stop-info">
        <span class="trk-stop-name">${s.name}</span>
        ${s.time ? `<span class="trk-stop-time">${s.time}</span>` : ''}
      </div>
      ${i === 0 ? '<span class="trk-stop-tag">Start</span>' : i === stops.length - 1 ? '<span class="trk-stop-tag trk-tag-campus">Campus</span>' : ''}
    </div>
  `).join('');
}

/* ============================================================
   ANIMATION ENGINE
============================================================ */
function _trkStartAnimation(stops) {
  function tick() {
    if (!trkMap) return;

    trkProgress += TRK_SPEED;

    if (trkProgress >= 1) {
      trkProgress = 0;
      trkCurrentIdx++;

      if (trkCurrentIdx >= stops.length - 1) {
        _trkReachCampus(stops);
        return;
      }
      _trkMarkStopPassed(trkCurrentIdx);
    }

    const from = stops[trkCurrentIdx];
    const to   = stops[trkCurrentIdx + 1];
    if (!from || !to) return;

    const lat = from.lat + (to.lat - from.lat) * trkProgress;
    const lng = from.lng + (to.lng - from.lng) * trkProgress;

    if (trkBusMarker) trkBusMarker.setLatLng([lat, lng]);

    _trkUpdatePanel(stops, lat, lng);
    trkStepTimer = setTimeout(tick, TRK_STEP_MS);
  }

  trkStepTimer = setTimeout(tick, TRK_STEP_MS);
}

function _trkMarkStopPassed(idx) {
  const row = document.getElementById(`trkStop_${idx}`);
  if (row) {
    row.classList.add('trk-stop-passed');
    const dot = row.querySelector('.trk-stop-dot');
    if (dot) dot.classList.add('trk-dot-passed');
    row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function _trkReachCampus(stops) {
  clearTimeout(trkStepTimer);
  const last = stops[stops.length - 1];
  if (trkBusMarker) trkBusMarker.setLatLng([last.lat, last.lng]);

  const badge = document.getElementById('trkStatusBadge');
  if (badge) { badge.textContent = 'Arrived'; badge.classList.add('trk-badge-arrived'); }

  const eta = document.getElementById('trkEta');
  if (eta) eta.textContent = '7:40 AM';

  const ns = document.getElementById('trkNextStop');
  if (ns) ns.textContent = 'RIT Campus';

  const nd = document.getElementById('trkNextDist');
  if (nd) nd.textContent = 'Arrived ✓';

  const fill = document.getElementById('trkProgFill');
  if (fill) fill.style.width = '100%';

  _trkMarkStopPassed(stops.length - 1);
}

function _trkUpdatePanel(stops, busLat, busLng) {
  const total   = stops.length - 1;
  const progPct = Math.min(100, Math.round(((trkCurrentIdx + trkProgress) / total) * 100));

  const fill = document.getElementById('trkProgFill');
  if (fill) fill.style.width = progPct + '%';

  const nextStop = stops[trkCurrentIdx + 1];
  const ns = document.getElementById('trkNextStop');
  if (ns && nextStop) ns.textContent = nextStop.name;

  const distM = nextStop ? _haversineM(busLat, busLng, nextStop.lat, nextStop.lng) : 0;
  const nd = document.getElementById('trkNextDist');
  if (nd) nd.textContent = distM < 1000
    ? Math.round(distM) + ' m away'
    : (distM / 1000).toFixed(1) + ' km away';

  const stopsLeft = total - trkCurrentIdx;
  const minsLeft  = Math.max(0, Math.round(stopsLeft * 4 - trkProgress * 4));
  const eta = document.getElementById('trkEta');
  if (eta) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minsLeft);
    eta.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  const badge = document.getElementById('trkStatusBadge');
  if (badge && progPct < 100) badge.textContent = progPct + '% complete';
}

function _haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
