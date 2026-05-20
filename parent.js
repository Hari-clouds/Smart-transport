// parent.js — RIT Smart Transport Parent Portal

const CAMPUS = { lat: 13.0382427, lng: 80.0453935 };
let parMap = null;
let busMarker = null;
let campusMarker = null;
let parMapInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  const sess = getSession();
  renderChildCard(sess);
  renderBoardingStatus(sess);
  renderNotifications(sess);
  initParentMap(sess);
  // Poll for updates every 10 seconds
  setInterval(() => {
    renderBoardingStatus(sess);
    renderNotifications(sess);
    updateBusMarker(sess);
  }, 10000);
});

function renderChildCard(sess) {
  const card = document.getElementById('parChildCard');
  if (!card) return;
  const bp = getBoardingPass(sess.regNo);
  const statusPill = bp
    ? '<span class="par-pill-boarded">✓ Boarded</span>'
    : '<span class="par-pill-pending">Not Boarded</span>';
  card.innerHTML = `
    <div class="par-child-name">${sess.studentName}</div>
    <div class="par-child-meta">
      <span class="par-child-reg">Reg No: ${sess.regNo}</span>
      <span class="badge" style="background:#f59e0b;color:#fff;font-size:12px">${sess.route}</span>
      ${statusPill}
    </div>
  `;
}

function getBoardingPass(regNo) {
  const raw = localStorage.getItem('rit_boarding_' + regNo);
  return raw ? JSON.parse(raw) : null;
}

function renderBoardingStatus(sess) {
  const bp = getBoardingPass(sess.regNo);
  const statusEl = document.getElementById('parBoardingStatus');
  const passSection = document.getElementById('parBoardingPassSection');
  const passCard = document.getElementById('parPassCard');

  if (bp && bp.status === 'boarded') {
    statusEl.innerHTML = `
      <div class="par-status-boarded">
        ✓ Your child has boarded the bus<br>
        <span style="font-size:14px;opacity:0.8">Boarded at ${bp.boardedAtTime} on ${bp.boardedAtDate}</span>
      </div>
    `;
    passSection.style.display = '';
    passCard.innerHTML = buildBoardingPassHTML(bp);
    // Also update child card pill
    const card = document.getElementById('parChildCard');
    if (card) {
      const pill = card.querySelector('.par-pill-pending');
      if (pill) { pill.className = 'par-pill-boarded'; pill.textContent = '✓ Boarded'; }
    }
  } else {
    statusEl.innerHTML = `
      <div class="par-status-not-boarded">
        ⏳ Your child has not boarded the bus yet<br>
        <span style="font-size:13px;opacity:0.8">You will see the boarding confirmation here once they board.</span>
      </div>
    `;
    passSection.style.display = 'none';
  }
}

function buildBoardingPassHTML(bp) {
  return `
    <div class="par-pass-inner">
      <div class="par-pass-left">
        <div class="par-pass-label">Passenger</div>
        <div class="par-pass-value">${bp.name}</div>
        <div class="par-pass-label" style="margin-top:12px">Register No.</div>
        <div class="par-pass-value">${bp.regNo}</div>
        <div class="par-pass-label" style="margin-top:12px">Boarded At</div>
        <div class="par-pass-value">${bp.boardedAtTime}</div>
        <div style="font-size:11px;color:#94a3b8">${bp.boardedAtDate}</div>
      </div>
      <div class="par-pass-divider"></div>
      <div class="par-pass-right">
        <div class="par-pass-label">Route</div>
        <div class="par-pass-badge">${bp.routeNo}</div>
        <div class="par-pass-label" style="margin-top:12px">Destination</div>
        <div class="par-pass-value">RIT Campus</div>
        <div style="font-size:11px;color:#94a3b8">Poonamallee</div>
        <div class="par-pass-label" style="margin-top:12px">Campus Arrival</div>
        <div class="par-pass-value">7:40 AM</div>
        <div class="par-pass-confirmed">BOARDING CONFIRMED</div>
      </div>
    </div>
  `;
}

function renderNotifications(sess) {
  const list = document.getElementById('parNotifList');
  const badge = document.getElementById('parNotifBadge');
  const all = JSON.parse(localStorage.getItem('rit_notifications') || '[]');
  const relevant = all.filter(n => n.routeNo === 'all' || n.routeNo === sess.route);
  if (relevant.length === 0) {
    list.innerHTML = '<div class="par-notif-empty">No notifications for your child\'s route yet.</div>';
    badge.style.display = 'none';
    return;
  }
  badge.textContent = relevant.length;
  badge.style.display = 'inline';
  list.innerHTML = relevant.map(n => `
    <div class="par-notif-item">
      <span class="par-notif-type par-notif-${n.type}">${n.type}</span>
      <div class="par-notif-msg">${n.message}</div>
      <div class="par-notif-time">${n.timeStr}</div>
    </div>
  `).join('');
}

function initParentMap(sess) {
  const routeLabel = document.getElementById('parRouteLabel');
  if (routeLabel) routeLabel.textContent = sess.route;

  parMap = L.map('parMapContainer', { zoomControl: true });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors & CARTO',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(parMap);
  parMap.setView([13.05, 80.06], 12);

  // Campus marker
  campusMarker = L.marker([CAMPUS.lat, CAMPUS.lng], {
    icon: L.divIcon({ className: '', html: '<div style="background:#1a3a6b;color:#fff;font-size:11px;font-weight:700;padding:4px 8px;border-radius:6px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3)">RIT Campus</div>', iconAnchor: [40, 14] })
  }).addTo(parMap);

  updateBusMarker(sess);
}

function updateBusMarker(sess) {
  const gpsRaw = localStorage.getItem('bus_gps_' + sess.route);
  const statusEl = document.getElementById('parMapStatus');
  if (!gpsRaw) {
    if (statusEl) statusEl.textContent = 'Bus GPS not active yet — driver has not started the trip.';
    return;
  }
  const gps = JSON.parse(gpsRaw);
  const ageMin = Math.round((Date.now() - gps.timestamp) / 60000);
  if (statusEl) statusEl.textContent = `Bus last seen ${ageMin < 1 ? 'just now' : ageMin + ' min ago'} · GPS live`;

  if (!busMarker) {
    busMarker = L.marker([gps.lat, gps.lng], {
      icon: L.divIcon({ className: '', html: '<div style="background:#16a34a;color:#fff;font-size:18px;padding:6px;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🚌</div>', iconAnchor: [16, 16] })
    }).addTo(parMap);
    parMap.setView([gps.lat, gps.lng], 13);
  } else {
    busMarker.setLatLng([gps.lat, gps.lng]);
  }
}
