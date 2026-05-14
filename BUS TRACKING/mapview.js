/**
 * mapview.js
 * RIT Smart Transport — OpenStreetMap Route View
 * Uses Leaflet.js + OSRM road routing
 * No API key required.
 */

// RIT Campus coordinates
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
async function openRouteMap(route) {
  createModalDOM(route);
  showLoading();

  try {
    let startCoords;

    if (route.stops && route.stops.length > 0) {
      // Use first stop coordinates directly
      startCoords = { lat: route.stops[0].lat, lng: route.stops[0].lng, displayName: route.stops[0].name };
    } else {
      // Geocode if no stops
      startCoords = await geocodePlace(route.name + ", Chennai, Tamil Nadu, India");
      if (!startCoords) throw new Error("Location not found");
    }

    renderMap(route, startCoords);
  } catch (err) {
    showMapError(route.name);
  }
}

/* ============================================
   CREATE MODAL DOM
============================================ */
function createModalDOM(route) {
  const existing = document.getElementById('mapModalOverlay');
  if (existing) existing.remove();

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
      <div id="mapContainer"></div>
    </div>
  `;

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeMapModal();
  });

  document.addEventListener('keydown', handleMapKeydown);
  document.body.appendChild(overlay);
  mapModal = overlay;
}

/* ============================================
   SHOW LOADING STATE
============================================ */
function showLoading() {
  const container = document.getElementById('mapContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="map-loading">
      <div class="map-spinner"></div>
      <span>Finding route on map...</span>
    </div>
  `;
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
   GEOCODE USING NOMINATIM
============================================ */
async function geocodePlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name
  };
}

/* ============================================
   RENDER LEAFLET MAP
============================================ */
function renderMap(route, startCoords) {
  const container = document.getElementById('mapContainer');
  if (!container) return;

  container.innerHTML = '';

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  // Init map
  mapInstance = L.map('mapContainer', { zoomControl: true });

  // CARTO tile layer — no Referer restriction, free, no API key
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; © <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(mapInstance);
  // Start marker (amber)
  // Start marker (amber badge) – fixed box
const startIcon = L.divIcon({
  className: 'custom-marker-start',
  html: `<div style="
    background: #f59e0b;
    color: #1e293b;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    white-space: nowrap;
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
    line-height: 1.2;
  ">${route.no}</div>`,
  iconSize: [null, null],
  iconAnchor: [30, 16]   // Adjusted anchor – tweak if needed
});

// End marker (green badge)
const endIcon = L.divIcon({
  className: 'custom-marker-end',
  html: `<div style="
    background: #16a34a;
    color: white;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    white-space: nowrap;
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
    line-height: 1.2;
  ">RIT</div>`,
  iconSize: [null, null],
  iconAnchor: [24, 16]
});

  // Add start marker
  L.marker([startCoords.lat, startCoords.lng], { icon: startIcon })
    .addTo(mapInstance)
    .bindPopup(`
      <strong>${route.no} — ${route.name}</strong><br>
      &#128336; Departs: ${route.depart}
    `);

  // Add RIT end marker
  L.marker([RIT_CAMPUS.lat, RIT_CAMPUS.lng], { icon: endIcon })
    .addTo(mapInstance)
    .bindPopup(`
      <strong>RIT Campus</strong><br>
      Kuthambakkam Post, Poonamallee<br>
      Chennai - 600 124<br>
      &#128336; Arrival: ${route.arrive}
    `);

  // ---- ROAD ROUTING ----
  if (route.stops && route.stops.length > 0) {

    // Add small dot markers for intermediate stops
    route.stops.forEach((stop, i) => {
      if (i === 0 || i === route.stops.length - 1) return;
      if (stop.visible === false) return; // Skip invisible stops
      const flagIcon = L.divIcon({
        className: '',
        html: `<div style="font-size:20px;line-height:1;">🚩</div>`,
        iconAnchor: [10, 20]
      });
      L.marker([stop.lat, stop.lng], { icon: flagIcon })
        .addTo(mapInstance)
        .bindPopup(`<strong>${stop.name}</strong>`);
    });

    // Fit map to stops immediately while road loads
    const latlngs = route.stops.map(s => [s.lat, s.lng]);
    mapInstance.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] });

    // Build OSRM URL (lng,lat format)
    const coordStr = route.stops.map(s => `${s.lng},${s.lat}`).join(';');
    const osrmUrl  = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;

    // Fetch road route
    fetch(osrmUrl)
      .then(res => res.json())
      .then(data => {
        if (data.code === 'Ok') {
          // Draw actual road path
          const roadCoords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          L.polyline(roadCoords, {
            color: '#1a3a6b',
            weight: 4,
            opacity: 0.85
          }).addTo(mapInstance);
          mapInstance.fitBounds(L.latLngBounds(roadCoords), { padding: [40, 40] });
        } else {
          // OSRM failed — draw straight line through stops
          L.polyline(latlngs, {
            color: '#1a3a6b', weight: 3, dashArray: '8,8', opacity: 0.7
          }).addTo(mapInstance);
        }
      })
      .catch(() => {
        // Network error — draw straight line through stops
        L.polyline(latlngs, {
          color: '#1a3a6b', weight: 3, dashArray: '8,8', opacity: 0.7
        }).addTo(mapInstance);
      });

  } else {
    // No stops data — straight dashed line
    L.polyline(
      [[startCoords.lat, startCoords.lng], [RIT_CAMPUS.lat, RIT_CAMPUS.lng]],
      { color: '#1a3a6b', weight: 3, dashArray: '8, 8', opacity: 0.7 }
    ).addTo(mapInstance);

    mapInstance.fitBounds(
      L.latLngBounds(
        [startCoords.lat, startCoords.lng],
        [RIT_CAMPUS.lat, RIT_CAMPUS.lng]
      ),
      { padding: [40, 40] }
    );
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