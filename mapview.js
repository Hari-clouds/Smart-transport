/**
 * mapview.js
 * RIT Smart Transport — OpenStreetMap Route View
 * Uses Leaflet.js + OSRM road routing (no API key required)
 *
 * Key fixes vs original:
 *  1. Map init is deferred via setTimeout so the modal DOM has fully
 *     laid out before Leaflet tries to measure the container.
 *  2. Uses standard OpenStreetMap tiles (most universally accessible).
 *  3. Calls invalidateSize() after init to handle any residual sizing issues.
 *  4. OSRM requests are chunked to <= 25 waypoints (API limit).
 *  5. renderMap has its own try/catch so errors surface cleanly.
 */

const RIT_CAMPUS = {
  lat: 13.0379,
  lng: 80.0448,
  label: "RIT Campus, Kuthambakkam, Poonamalle"
};

let mapInstance = null;
let mapModal    = null;

/* ============================================
   OPEN MAP MODAL
============================================ */
function openRouteMap(route) {
  createModalDOM(route);

  // Defer everything until the browser has fully painted the modal
  // and applied CSS dimensions to #mapContainer.
  // Without this timeout Leaflet sees a 0x0 container and throws.
  setTimeout(() => {
    try {
      renderMap(route);
    } catch (err) {
      console.error('Map render error:', err);
      showMapError(route.name);
    }
  }, 80);
}

/* ============================================
   CREATE MODAL DOM
============================================ */
function createModalDOM(route) {
  const existing = document.getElementById('mapModalOverlay');
  if (existing) existing.remove();

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  const overlay = document.createElement('div');
  overlay.className = 'map-modal-overlay';
  overlay.id = 'mapModalOverlay';

  overlay.innerHTML = `
    <div class="map-modal" id="mapModal">
      <div class="map-modal-header">
        <div class="map-modal-title">
          <span class="modal-badge">${route.no}</span>
          <span>${route.name} &rarr; RIT Campus</span>
        </div>
        <button class="map-close-btn" onclick="closeMapModal()" title="Close">&#x2715;</button>
      </div>
      <div class="map-modal-info">
        <span class="dot dot-start"></span>
        <span>Start: <strong>${route.name}</strong></span>
        <span class="map-sep">|</span>
        <span class="dot dot-end"></span>
        <span>End: <strong>RIT Campus, Poonamallee</strong></span>
        <span class="map-sep">|</span>
        <span>&#128336; Departs <strong>${route.depart}</strong></span>
      </div>
      <div id="mapContainer">
        <div class="map-loading">
          <div class="map-spinner"></div>
          <span>Loading map&hellip;</span>
        </div>
      </div>
    </div>
  `;

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeMapModal();
  });

  document.addEventListener('keydown', handleMapKeydown);
  document.body.appendChild(overlay);
  mapModal = overlay;
}

/* ============================================
   SHOW ERROR STATE
============================================ */
function showMapError(name) {
  const container = document.getElementById('mapContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="map-error">
      <div class="map-error-icon">&#128506;</div>
      <strong>Could not load map for "${name}"</strong>
      <span>Check your internet connection and try again.</span>
    </div>
  `;
}

/* ============================================
   RENDER LEAFLET MAP
   All Leaflet work happens here, already deferred.
============================================ */
function renderMap(route) {
  const container = document.getElementById('mapContainer');
  if (!container) throw new Error('mapContainer not found');

  // Clear the loading spinner — Leaflet needs a clean empty container
  container.innerHTML = '';

  // Destroy any stale instance
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  // ----- Initialise Leaflet -----
  mapInstance = L.map('mapContainer', {
    zoomControl: true,
    scrollWheelZoom: true
  });

  // Standard OpenStreetMap tiles — free, no API key, no referrer restriction
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapInstance);

  // Force Leaflet to re-measure the container after innerHTML was cleared
  mapInstance.invalidateSize();

  // ----- Markers -----
  const startStop = (route.stops && route.stops.length > 0) ? route.stops[0] : null;
  const startLat  = startStop ? startStop.lat : RIT_CAMPUS.lat;
  const startLng  = startStop ? startStop.lng : RIT_CAMPUS.lng;

  const startIcon = L.divIcon({
    className: '',
    html: `<div style="background:#f59e0b;color:#1a1a1a;font-size:12px;font-weight:700;
      padding:4px 10px;border-radius:20px;border:2px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);white-space:nowrap;
      font-family:'Segoe UI',sans-serif;">${route.no}</div>`,
    iconAnchor: [28, 14]
  });

  const endIcon = L.divIcon({
    className: '',
    html: `<div style="background:#16a34a;color:#fff;font-size:12px;font-weight:700;
      padding:4px 10px;border-radius:20px;border:2px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);white-space:nowrap;
      font-family:'Segoe UI',sans-serif;">RIT</div>`,
    iconAnchor: [22, 14]
  });

  L.marker([startLat, startLng], { icon: startIcon })
    .addTo(mapInstance)
    .bindPopup(`<strong>${route.no} \u2014 ${route.name}</strong><br>&#128336; Departs: ${route.depart}`);

  L.marker([RIT_CAMPUS.lat, RIT_CAMPUS.lng], { icon: endIcon })
    .addTo(mapInstance)
    .bindPopup(`<strong>RIT Campus</strong><br>Kuthambakkam, Poonamallee<br>&#128336; Arrives: ${route.arrive}`);

  // ----- Route path -----
  if (route.stops && route.stops.length > 1) {

    // Intermediate stop flags
    route.stops.forEach((stop, i) => {
      if (i === 0 || i === route.stops.length - 1) return;
      if (stop.visible === false) return;
      const icon = L.divIcon({
        className: '',
        html: `<div style="font-size:18px;line-height:1;">&#127987;&#65039;</div>`,
        iconAnchor: [9, 18]
      });
      L.marker([stop.lat, stop.lng], { icon })
        .addTo(mapInstance)
        .bindPopup(`<strong>${stop.name || 'Stop'}</strong>${stop.time ? '<br>&#128336; ' + stop.time : ''}`);
    });

    const latlngs = route.stops
      .filter(s => s.visible !== false)
      .map(s => [s.lat, s.lng]);

    // Fit map immediately
    mapInstance.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] });

    // Show a dashed preview line while OSRM loads
    const previewLine = L.polyline(latlngs, {
      color: '#1a3a6b', weight: 3, dashArray: '8,8', opacity: 0.5
    }).addTo(mapInstance);

    // Upgrade to real road route asynchronously
    fetchRoadRoute(latlngs).then(roadCoords => {
      if (roadCoords && roadCoords.length > 0) {
        previewLine.remove();
        L.polyline(roadCoords, {
          color: '#1a3a6b', weight: 4, opacity: 0.85
        }).addTo(mapInstance);
        mapInstance.fitBounds(L.latLngBounds(roadCoords), { padding: [40, 40] });
      }
      // On null the dashed preview stays — still usable
    });

  } else {
    // No stops — straight line
    const fallback = [[startLat, startLng], [RIT_CAMPUS.lat, RIT_CAMPUS.lng]];
    L.polyline(fallback, { color: '#1a3a6b', weight: 3, dashArray: '8,8', opacity: 0.7 })
      .addTo(mapInstance);
    mapInstance.fitBounds(L.latLngBounds(fallback), { padding: [40, 40] });
  }
}

/* ============================================
   FETCH ROAD ROUTE VIA OSRM
   Chunked to <=24 waypoints per request (OSRM demo server limit).
   Returns merged [lat, lng] array, or null on any failure.
============================================ */
async function fetchRoadRoute(latlngs) {
  const MAX_WP = 24;

  if (latlngs.length <= MAX_WP) {
    return await osrmRequest(latlngs);
  }

  // Build overlapping chunks so segments connect
  const segments = [];
  for (let i = 0; i < latlngs.length - 1; i += MAX_WP - 1) {
    segments.push(latlngs.slice(i, i + MAX_WP));
    if (i + MAX_WP >= latlngs.length) break;
  }

  const results = await Promise.all(segments.map(osrmRequest));

  const merged = [];
  for (let i = 0; i < results.length; i++) {
    if (!results[i]) return null;
    const seg = i === 0 ? results[i] : results[i].slice(1);
    merged.push(...seg);
  }
  return merged;
}

async function osrmRequest(latlngs) {
  try {
    const coordStr = latlngs.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;
    const res  = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code !== 'Ok') return null;
    return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
  } catch {
    return null;
  }
}

/* ============================================
   CLOSE MAP MODAL
============================================ */
function closeMapModal() {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
  document.removeEventListener('keydown', handleMapKeydown);
  const overlay = document.getElementById('mapModalOverlay');
  if (overlay) overlay.remove();
}

function handleMapKeydown(e) {
  if (e.key === 'Escape') closeMapModal();
}
