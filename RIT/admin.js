/**
 * admin.js — RIT Smart Transport Admin Dashboard
 */

/* ============================================
   SIMULATED BUS DATA
============================================ */
const STATUS_TYPES = ['running', 'delayed', 'offline', 'reached'];

const DRIVER_DATA = [
  { id: 1, name: "Murugan R",       phone: "9876543210", route: "R01",  status: "running" },
  { id: 2, name: "Selvam K",        phone: "9876543211", route: "R01A", status: "running" },
  { id: 3, name: "Rajan P",         phone: "9876543212", route: "R02",  status: "delayed" },
  { id: 4, name: "Anbu S",          phone: "9876543213", route: "R03",  status: "running" },
  { id: 5, name: "Karthik M",       phone: "9876543214", route: "R04",  status: "reached" },
  { id: 6, name: "Vijay T",         phone: "9876543215", route: "R05",  status: "running" },
  { id: 7, name: "Babu N",          phone: "9876543216", route: "R06",  status: "offline" },
  { id: 8, name: "Suresh L",        phone: "9876543217", route: "R07",  status: "running" },
  { id: 9, name: "Mohan D",         phone: "9876543218", route: "R08",  status: "delayed" },
  { id: 10,"name": "Ravi G",        phone: "9876543219", route: "R09",  status: "running" },
];

const COMMON_STOPS_DATA = [
  { id: 1, name: "Koyambedu",        routes: ["R01A","R03","R05A","R09A","R10","R12","R13","R19","R21","R23","R28"], area: "Chennai West" },
  { id: 2, name: "Maduravoyal",      routes: ["R01A","R03B","R09","R09A","R10","R13A","R19","R23","R28"], area: "Chennai West" },
  { id: 3, name: "Vanagaram",        routes: ["R01A","R10","R12","R13","R23","R28"], area: "Chennai West" },
  { id: 4, name: "Porur",            routes: ["R06","R07","R08","R08A","R15A","R16","R16A","R16B","R17","R17A","R18","R18A","R18B","R26","R29"], area: "Chennai West" },
  { id: 5, name: "Guindy",           routes: ["R07","R08","R08A","R16","R16A","R16B","R18","R18A","R18B","R29"], area: "South Chennai" },
  { id: 6, name: "Poonamallee",      routes: ["R07","R10","R11","R11A","R12","R13","R14","R16","R16A","R17","R22","R25","R25A","R27","R27A","R28","R29"], area: "Poonamallee" },
  { id: 7, name: "Ambattur",         routes: ["R09A","R10","R12","R13","R13A","R19","R28"], area: "North Chennai" },
  { id: 8, name: "Thirumangalam",    routes: ["R03","R09A","R10","R13","R28"], area: "Anna Nagar" },
];

/* Simulated bus positions (lat/lng near Chennai) */
const BUS_POSITIONS = {};
let busMarkers   = {};
let adminMap     = null;
let commonMap    = null;
let currentDelayTarget = null;
let selectedDelayReason = '';
let pendingDelays = [];
let verifiedDelays = [];
let notifications  = [];
let drivers = [...DRIVER_DATA];
let nextDriverId = drivers.length + 1;
let commonStops  = [...COMMON_STOPS_DATA];
let selectedRouteForEdit = null;
let overviewFilter = 'all';
let tripFilter     = 'all';
let activityLog    = [];

/* ============================================
   INIT
============================================ */
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  initBusStatuses();
  refreshBusData();
  populateNotifRouteSelect();
  populateDriverRouteSelects();
  renderDriversTable();
  renderRouteMgmtList();
  renderTripStatus();
  renderCommonStops();
  simulateDelayAfterDelay();
});

/* ============================================
   CLOCK
============================================ */
function startClock() {
  const el = document.getElementById('topbarTime');
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================
   SECTION NAVIGATION
============================================ */
function showSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const sec = document.getElementById('section-' + name);
  if (sec) sec.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-section="${name}"]`);
  if (navItem) navItem.classList.add('active');

  const titles = {
    'overview':       'Overview',
    'live-monitoring':'Live Bus Monitoring',
    'delays':         'Delay Alerts',
    'notifications':  'Notifications',
    'drivers':        'Driver Management',
    'routes-mgmt':    'Route Management',
    'trips':          'Trip Status',
    'common-stops':   'Common Stops',
  };
  document.getElementById('topbarTitle').textContent = titles[name] || name;

  /* Initialise map lazily when section is opened */
  if (name === 'live-monitoring' && !adminMap) {
    setTimeout(() => initAdminMap(), 100);
  }
  if (name === 'common-stops' && !commonMap) {
    setTimeout(() => initCommonStopsMap(), 100);
  }

  /* Close mobile sidebar on nav */
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('mobile-open')) toggleSidebar();
}

/* ============================================
   SIDEBAR TOGGLE
============================================ */
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const main     = document.getElementById('adminMain');
  const isMobile = window.innerWidth <= 900;

  if (isMobile) {
    sidebar.classList.toggle('mobile-open');
    let overlay = document.getElementById('sidebarOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.id = 'sidebarOverlay';
      overlay.onclick = toggleSidebar;
      document.body.appendChild(overlay);
    }
    overlay.classList.toggle('visible', sidebar.classList.contains('mobile-open'));
  } else {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');
  }
}

/* ============================================
   BUS DATA SIMULATION
============================================ */
function initBusStatuses() {
  ROUTES.forEach((route, i) => {
    const statusIndex = i % 4 === 0 ? 3 : (i % 7 === 0 ? 2 : (i % 5 === 0 ? 1 : 0));
    BUS_POSITIONS[route.no] = {
      status: STATUS_TYPES[statusIndex],
      lat: 13.03 + (Math.random() * 0.2 - 0.1),
      lng: 80.04 + (Math.random() * 0.3 - 0.15),
      speed: Math.floor(Math.random() * 40 + 20),
      lastUpdate: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  });
}

function refreshBusData() {
  /* Update simulated positions slightly */
  ROUTES.forEach(route => {
    const b = BUS_POSITIONS[route.no];
    if (b && (b.status === 'running' || b.status === 'delayed')) {
      const campusLat = 13.0382427, campusLng = 80.0453935;
      const speed = b.status === 'delayed' ? 0.008 : 0.018;
      b.lat += (campusLat - b.lat) * speed + (Math.random() - 0.5) * 0.0008;
      b.lng += (campusLng - b.lng) * speed + (Math.random() - 0.5) * 0.0008;
      b.lastUpdate = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
  });

  updateStatCards();
  renderOverviewTable();
  renderBusList();
  if (adminMap) updateMapMarkers();
}

function getStatusCounts() {
  let active = 0, delayed = 0, offline = 0, reached = 0;
  ROUTES.forEach(r => {
    const s = BUS_POSITIONS[r.no]?.status;
    if (s === 'running')  active++;
    else if (s === 'delayed') { active++; delayed++; }
    else if (s === 'offline') offline++;
    else if (s === 'reached') reached++;
  });
  return { active, delayed, offline, reached };
}

function updateStatCards() {
  const c = getStatusCounts();
  document.getElementById('statActive').textContent    = c.active;
  document.getElementById('statDelayed').textContent   = c.delayed;
  document.getElementById('statOffline').textContent   = c.offline;
  document.getElementById('statCompleted').textContent = c.reached;
  const badge = document.getElementById('delayBadge');
  badge.textContent = pendingDelays.length;
  badge.style.display = pendingDelays.length > 0 ? 'inline' : 'none';
}

/* ============================================
   OVERVIEW TABLE
============================================ */
function renderOverviewTable() {
  const tbody = document.getElementById('overviewTableBody');
  const driver = (routeNo) => drivers.find(d => d.route === routeNo);

  const filteredRoutes = overviewFilter === 'all'
    ? ROUTES
    : ROUTES.filter(r => BUS_POSITIONS[r.no]?.status === overviewFilter);

  tbody.innerHTML = filteredRoutes.map(route => {
    const b = BUS_POSITIONS[route.no] || {};
    const d = driver(route.no);
    const st = b.status || 'offline';
    return `
      <tr>
        <td><span class="badge" style="font-size:11px">${route.no}</span></td>
        <td>${route.name}</td>
        <td>${d ? d.name : '<span style="color:#94a3b8">Unassigned</span>'}</td>
        <td>${route.depart}</td>
        <td><span class="status-badge status-${st}">${statusLabel(st)}</span></td>
        <td>
          <button class="btn-icon" onclick="showSection('live-monitoring')" title="View on map">🗺️</button>
          ${st !== 'delayed' ? `<button class="btn-icon" onclick="markDelayed('${route.no}')" title="Mark as delayed">⚠️</button>` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

function statusLabel(st) {
  return { running:'🟢 Running', delayed:'🟡 Delayed', offline:'🔴 Offline', reached:'🔵 Reached' }[st] || st;
}

function markDelayed(routeNo) {
  BUS_POSITIONS[routeNo].status = 'delayed';
  addPendingDelay(routeNo, 'Admin flagged');
  logActivity(`🚨 Route ${routeNo} manually flagged as delayed by admin`, 'warning');
  refreshBusData();
  showToast(`Route ${routeNo} marked as delayed`);
}

/* ============================================
   LIVE MAP
============================================ */
function initAdminMap() {
  adminMap = L.map('adminMapContainer', { zoomControl: true });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors & CARTO',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(adminMap);
  adminMap.setView([13.038, 80.045], 11);
  updateMapMarkers();
  /* Refresh map markers every 8 seconds */
  setInterval(() => { refreshBusData(); }, 8000);
}

const STATUS_COLORS = { running: '#16a34a', delayed: '#f59e0b', offline: '#ef4444', reached: '#7c3aed' };

function updateMapMarkers() {
  ROUTES.forEach(route => {
    const b = BUS_POSITIONS[route.no];
    if (!b) return;
    const color = STATUS_COLORS[b.status] || '#64748b';

    const icon = L.divIcon({
      className: '',
      html: `<div style="background:${color};color:#fff;font-size:10px;font-weight:700;
        padding:3px 7px;border-radius:12px;border:2px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.25);white-space:nowrap;">${route.no}</div>`,
      iconAnchor: [20, 12]
    });

    if (busMarkers[route.no]) {
      busMarkers[route.no].setLatLng([b.lat, b.lng]);
      busMarkers[route.no].setIcon(icon);
    } else {
      busMarkers[route.no] = L.marker([b.lat, b.lng], { icon })
        .addTo(adminMap)
        .bindPopup(`<strong>${route.no} — ${route.name}</strong><br>Status: ${b.status}<br>Speed: ${b.speed} km/h<br>Updated: ${b.lastUpdate}`);
    }
  });
}

/* ============================================
   BUS LIST PANEL
============================================ */
function renderBusList() {
  const panel = document.getElementById('busListPanel');
  if (!panel) return;
  panel.innerHTML = ROUTES.map(route => {
    const b = BUS_POSITIONS[route.no] || {};
    const color = STATUS_COLORS[b.status] || '#64748b';
    return `
      <div class="bus-list-item" onclick="focusBusOnMap('${route.no}')">
        <div class="bus-list-dot" style="background:${color}"></div>
        <div class="bus-list-info">
          <div class="bus-list-route">${route.no}</div>
          <div class="bus-list-name">${route.name}</div>
        </div>
        <span class="status-badge status-${b.status}" style="font-size:10px">${b.status||'—'}</span>
      </div>
    `;
  }).join('');
}

function filterBusList(q) {
  const items = document.querySelectorAll('.bus-list-item');
  const ql = q.toLowerCase();
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(ql) ? '' : 'none';
  });
}

function focusBusOnMap(routeNo) {
  const b = BUS_POSITIONS[routeNo];
  if (b && adminMap) {
    adminMap.setView([b.lat, b.lng], 14);
    if (busMarkers[routeNo]) busMarkers[routeNo].openPopup();
  }
}

/* ============================================
   DELAY SYSTEM
============================================ */
function simulateDelayAfterDelay() {
  /* Auto-generate delays for demo */
  const delayRoutes = ROUTES.filter(r => BUS_POSITIONS[r.no]?.status === 'delayed');
  delayRoutes.forEach(r => addPendingDelay(r.no, 'Simulated delay detected'));

  /* Add a new simulated delay every 30 seconds */
  setInterval(() => {
    const running = ROUTES.filter(r => BUS_POSITIONS[r.no]?.status === 'running');
    if (running.length > 0) {
      const pick = running[Math.floor(Math.random() * running.length)];
      BUS_POSITIONS[pick.no].status = 'delayed';
      addPendingDelay(pick.no, 'GPS speed drop detected');
      refreshBusData();
      showToast(`⚠️ New delay detected: Route ${pick.no}`);
    }
  }, 30000);
}

function addPendingDelay(routeNo, reason) {
  if (pendingDelays.find(d => d.routeNo === routeNo)) return;
  const route = ROUTES.find(r => r.no === routeNo);
  pendingDelays.push({
    routeNo,
    routeName: route ? route.name : routeNo,
    detectedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    autoReason: reason,
  });
  logActivity(`⚠️ Delay detected on Route ${routeNo} — ${route ? route.name : ''}`, 'warning');
  renderDelayLists();
  updateStatCards();
}

function renderDelayLists() {
  const pendingEl = document.getElementById('delayPendingList');
  const verifiedEl = document.getElementById('delayVerifiedList');
  document.getElementById('pendingCount').textContent = `${pendingDelays.length} pending`;

  pendingEl.innerHTML = pendingDelays.length === 0
    ? '<div style="padding:2rem;text-align:center;color:#94a3b8;font-size:13px">No pending delays ✅</div>'
    : pendingDelays.map(d => `
        <div class="delay-item">
          <div class="delay-item-info">
            <div class="delay-item-route">🚌 ${d.routeNo} — ${d.routeName}</div>
            <div class="delay-item-detail">Detected at ${d.detectedAt} · ${d.autoReason}</div>
          </div>
          <span class="status-badge status-pending">Pending</span>
          <button class="btn-primary btn-sm" onclick="openDelayModal('${d.routeNo}')">Verify</button>
        </div>
      `).join('');

  verifiedEl.innerHTML = verifiedDelays.length === 0
    ? '<div style="padding:2rem;text-align:center;color:#94a3b8;font-size:13px">No verified delays yet</div>'
    : verifiedDelays.map(d => `
        <div class="delay-item">
          <div class="delay-item-info">
            <div class="delay-item-route">🚌 ${d.routeNo} — ${d.routeName}</div>
            <div class="delay-item-detail">${d.reason} · +${d.minutes} min · Verified ${d.verifiedAt}</div>
          </div>
          <span class="status-badge status-delayed">Verified</span>
        </div>
      `).join('');
}

function openDelayModal(routeNo) {
  currentDelayTarget = routeNo;
  const route = ROUTES.find(r => r.no === routeNo);
  document.getElementById('delayModalInfo').innerHTML =
    `<strong>${routeNo}</strong> — ${route ? route.name : ''}<br>
     <span style="font-size:12px;color:#64748b">Departs: ${route ? route.depart : ''}</span>`;
  selectedDelayReason = '';
  document.querySelectorAll('.reason-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('delayMinutes').value = 15;
  document.getElementById('otherReasonGroup').style.display = 'none';
  openModal('delayModal');
}

function selectReason(btn, reason) {
  document.querySelectorAll('.reason-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedDelayReason = reason;
  document.getElementById('otherReasonGroup').style.display = reason === 'Other' ? 'block' : 'none';
}

function verifyDelay() {
  if (!selectedDelayReason) { showToast('Please select a delay reason'); return; }
  const reason = selectedDelayReason === 'Other'
    ? (document.getElementById('otherReasonInput').value.trim() || 'Other')
    : selectedDelayReason;
  const minutes = parseInt(document.getElementById('delayMinutes').value) || 15;

  const pending = pendingDelays.find(d => d.routeNo === currentDelayTarget);
  if (pending) {
    pendingDelays = pendingDelays.filter(d => d.routeNo !== currentDelayTarget);
    verifiedDelays.unshift({
      ...pending,
      reason,
      minutes,
      verifiedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    });
    /* Auto-add to notification feed */
    const route = ROUTES.find(r => r.no === currentDelayTarget);
    pushNotification('delay', currentDelayTarget,
      `Route ${currentDelayTarget} (${route?.name}) is delayed by approx. ${minutes} minutes due to ${reason}.`);
  }

  logActivity(`✅ Delay on Route ${currentDelayTarget} verified — ${reason}, +${minutes} min`, 'success');
  closeModal('delayModal');
  renderDelayLists();
  updateStatCards();
  showToast(`✅ Delay verified for ${currentDelayTarget}. Notification sent.`);
}

/* ============================================
   NOTIFICATIONS
============================================ */
function populateNotifRouteSelect() {
  const sel = document.getElementById('notifRoute');
  ROUTES.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.no;
    opt.textContent = `${r.no} — ${r.name}`;
    sel.appendChild(opt);
  });
}

function sendNotification() {
  const type    = document.getElementById('notifType').value;
  const routeNo = document.getElementById('notifRoute').value;
  const msg     = document.getElementById('notifMessage').value.trim();
  if (!msg) { showToast('Please enter a message'); return; }
  pushNotification(type, routeNo, msg);
  const targetLabel = routeNo === 'all' ? 'all routes' : routeNo;
  logActivity(`📢 ${type} notification sent to ${targetLabel}`, 'info');
  clearNotifForm();
  showToast('📢 Notification sent successfully!');
}

function pushNotification(type, routeNo, msg) {
  const route = ROUTES.find(r => r.no === routeNo);
  notifications.unshift({
    type,
    target: routeNo === 'all' ? 'All Routes' : `${routeNo}${route ? ' — ' + route.name : ''}`,
    msg,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  });
  renderNotifFeed();
}

function renderNotifFeed() {
  const feed = document.getElementById('notifFeed');
  if (!feed) return;
  if (notifications.length === 0) {
    feed.innerHTML = '<div class="notif-empty">No notifications sent yet.</div>';
    return;
  }
  feed.innerHTML = notifications.map(n => `
    <div class="notif-item">
      <div class="notif-item-header">
        <span class="notif-type-tag notif-${n.type}">${n.type}</span>
        <span class="notif-time">${n.time}</span>
      </div>
      <div class="notif-msg">${n.msg}</div>
      <div class="notif-target">Target: ${n.target}</div>
    </div>
  `).join('');
}

function clearNotifForm() {
  document.getElementById('notifMessage').value = '';
  document.getElementById('notifType').value = 'delay';
  document.getElementById('notifRoute').value = 'all';
}

function clearNotifFeed() {
  notifications = [];
  renderNotifFeed();
}

/* ============================================
   DRIVERS
============================================ */
function populateDriverRouteSelects() {
  ['driverRoute', 'editDriverRoute'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = '<option value="">— No Route —</option>';
    ROUTES.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.no;
      opt.textContent = `${r.no} — ${r.name}`;
      sel.appendChild(opt);
    });
  });
}

function renderDriversTable() {
  const tbody = document.getElementById('driversTableBody');
  tbody.innerHTML = drivers.map((d, i) => {
    const route = ROUTES.find(r => r.no === d.route);
    return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${d.name}</strong></td>
        <td>${d.phone}</td>
        <td>${route ? `<span class="badge" style="font-size:11px">${d.route}</span> ${route.name}` : '—'}</td>
        <td><span class="status-badge status-${d.status}">${statusLabel(d.status)}</span></td>
        <td>
          <div class="action-btns">
            <a class="btn-icon" href="tel:${d.phone}" title="Call driver">📞</a>
            <button class="btn-icon" onclick="openEditDriverModal(${d.id})" title="Edit">✏️</button>
            <button class="btn-icon btn-danger" style="background:#fee2e2;color:#b91c1c;border:none;border-radius:6px;padding:5px;cursor:pointer" onclick="removeDriver(${d.id})" title="Remove">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddDriverModal() {
  document.getElementById('driverName').value = '';
  document.getElementById('driverPhone').value = '';
  document.getElementById('driverRoute').value = '';
  openModal('addDriverModal');
}

function saveDriver() {
  const name  = document.getElementById('driverName').value.trim();
  const phone = document.getElementById('driverPhone').value.trim();
  const route = document.getElementById('driverRoute').value;
  if (!name || !phone) { showToast('Please fill in name and phone'); return; }
  drivers.push({ id: nextDriverId++, name, phone, route, status: 'running' });
  logActivity(`👤 Driver "${name}" added${route ? ' → Route ' + route : ''}`, 'info');
  renderDriversTable();
  closeModal('addDriverModal');
  showToast(`Driver ${name} added`);
}

function openEditDriverModal(id) {
  const d = drivers.find(x => x.id === id);
  if (!d) return;
  document.getElementById('editDriverId').value    = id;
  document.getElementById('editDriverName').value  = d.name;
  document.getElementById('editDriverPhone').value = d.phone;
  populateDriverRouteSelects();
  document.getElementById('editDriverRoute').value = d.route;
  openModal('editDriverModal');
}

function updateDriver() {
  const id    = parseInt(document.getElementById('editDriverId').value);
  const name  = document.getElementById('editDriverName').value.trim();
  const phone = document.getElementById('editDriverPhone').value.trim();
  const route = document.getElementById('editDriverRoute').value;
  if (!name || !phone) { showToast('Please fill all fields'); return; }
  const d = drivers.find(x => x.id === id);
  if (d) { d.name = name; d.phone = phone; d.route = route; }
  renderDriversTable();
  closeModal('editDriverModal');
  showToast('Driver updated');
}

function removeDriver(id) {
  const d = drivers.find(x => x.id === id);
  if (!d) return;
  if (!confirm(`Remove driver ${d.name}?`)) return;
  drivers = drivers.filter(x => x.id !== id);
  logActivity(`👤 Driver "${d.name}" removed`, 'info');
  renderDriversTable();
  showToast(`Driver ${d.name} removed`);
}

/* ============================================
   ROUTE MANAGEMENT
============================================ */
function renderRouteMgmtList() {
  const list = document.getElementById('routeMgmtList');
  list.innerHTML = ROUTES.map(r => `
    <div class="route-mgmt-item" onclick="selectRouteForEdit('${r.no}', this)">
      <span class="route-mgmt-badge">${r.no}</span>
      <span class="route-mgmt-name">${r.name}</span>
      <span class="route-mgmt-time">${r.depart}</span>
    </div>
  `).join('');
}

function selectRouteForEdit(routeNo, el) {
  document.querySelectorAll('.route-mgmt-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  selectedRouteForEdit = ROUTES.find(r => r.no === routeNo);
  renderRouteEditPanel();
}

function renderRouteEditPanel() {
  const r = selectedRouteForEdit;
  const panel = document.getElementById('routeEditPanel');
  const stops = r.boarding || [];

  panel.innerHTML = `
    <div class="admin-card-header">
      <h3>Edit Route — <span class="badge" style="font-size:12px">${r.no}</span></h3>
    </div>
    <div class="route-edit-content">
      <div class="form-group">
        <label>Route Number</label>
        <input type="text" value="${r.no}" readonly style="background:#f8fafd" />
      </div>
      <div class="form-group">
        <label>Starting Area</label>
        <input type="text" id="editRouteName" value="${r.name}" />
      </div>
      <div class="form-group">
        <label>Departure Time</label>
        <input type="text" id="editRouteDepart" value="${r.depart}" />
      </div>
      <div style="margin-bottom:8px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748b;margin-bottom:8px">
          Boarding Stops (${stops.length})
        </div>
        ${stops.length === 0 ? '<div style="color:#94a3b8;font-size:13px;padding:8px 0">No stops added yet.</div>' : ''}
        ${stops.map((s, i) => `
          <div class="stop-row">
            <span style="font-size:11px;color:#94a3b8;min-width:20px">${i + 1}</span>
            <span class="stop-row-name">${s.stop}</span>
            <span class="stop-row-time">${s.time}</span>
            <button class="btn-icon" onclick="removeStopFromRoute('${r.no}',${i})" title="Remove">🗑️</button>
          </div>
        `).join('')}
        <div class="add-stop-form">
          <input type="text" id="newStopNameEdit" placeholder="Stop name…" />
          <input type="text" id="newStopTimeEdit" placeholder="Time e.g. 6:30 am" />
          <button class="btn-primary btn-sm" onclick="addStopToRoute('${r.no}')">+ Add Stop</button>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px">
        <button class="btn-primary btn-sm" onclick="saveRouteEdit('${r.no}')">Save Changes</button>
        <button class="btn-outline btn-sm" onclick="renderRouteEditPanel()">Reset</button>
      </div>
    </div>
  `;
}

function saveRouteEdit(routeNo) {
  const r = ROUTES.find(x => x.no === routeNo);
  if (!r) return;
  r.name   = document.getElementById('editRouteName').value.trim() || r.name;
  r.depart = document.getElementById('editRouteDepart').value.trim() || r.depart;
  renderRouteMgmtList();
  renderRouteEditPanel();
  renderOverviewTable();
  showToast(`Route ${routeNo} updated`);
}

function openAddRouteModal() {
  document.getElementById('newRouteNo').value    = '';
  document.getElementById('newRouteName').value  = '';
  document.getElementById('newRouteDepart').value= '';
  openModal('addRouteModal');
}

function saveNewRoute() {
  const no     = document.getElementById('newRouteNo').value.trim().toUpperCase();
  const name   = document.getElementById('newRouteName').value.trim();
  const depart = document.getElementById('newRouteDepart').value.trim();
  if (!no || !name || !depart) { showToast('Please fill all fields'); return; }
  if (ROUTES.find(r => r.no === no)) { showToast('Route number already exists'); return; }
  ROUTES.push({ no, name, depart, arrive: '7:40 am', path: '', boarding: [] });
  logActivity(`🗺️ New route ${no} (${name}) added`, 'info');
  renderRouteMgmtList();
  renderOverviewTable();
  closeModal('addRouteModal');
  showToast(`Route ${no} added`);
}

/* ============================================
   TRIP STATUS
============================================ */
function renderTripStatus() {
  const grid = document.getElementById('tripsGrid');
  const visibleRoutes = tripFilter === 'all'
    ? ROUTES
    : ROUTES.filter(r => BUS_POSITIONS[r.no]?.status === tripFilter);
  grid.innerHTML = visibleRoutes.map(route => {
    const b = BUS_POSITIONS[route.no] || {};
    const color = { running:'#1a3a6b', delayed:'#f59e0b', offline:'#ef4444', reached:'#16a34a' }[b.status] || '#64748b';
    return `
      <div class="trip-card" style="border-top-color:${color}">
        <div class="trip-card-top">
          <span class="trip-route-no">${route.no}</span>
          <span class="status-badge status-${b.status}" style="font-size:10px">${b.status||'—'}</span>
        </div>
        <div class="trip-route-name">${route.name}</div>
        <div class="trip-time">Departs ${route.depart}</div>
      </div>
    `;
  }).join('');
}

/* ============================================
   COMMON STOPS
============================================ */
function renderCommonStops() {
  const el = document.getElementById('commonStopsList');
  el.innerHTML = commonStops.map(s => `
    <div class="common-stop-item">
      <div class="stop-icon">📍</div>
      <div class="common-stop-info">
        <div class="common-stop-name">${s.name}</div>
        <div class="common-stop-routes">${s.routes.slice(0, 6).join(', ')}${s.routes.length > 6 ? ` +${s.routes.length - 6} more` : ''}</div>
      </div>
      <span style="font-size:11px;color:#64748b">${s.area}</span>
      <button class="btn-icon" onclick="removeCommonStop(${s.id})" title="Remove">🗑️</button>
    </div>
  `).join('');
}

function initCommonStopsMap() {
  commonMap = L.map('commonStopsMap', { zoomControl: true });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors & CARTO',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(commonMap);

  const stopCoords = {
    'Koyambedu':     [13.0694, 80.1948],
    'Maduravoyal':   [13.060,  80.165],
    'Vanagaram':     [13.053,  80.130],
    'Porur':         [13.034,  80.1555],
    'Guindy':        [13.010,  80.212],
    'Poonamallee':   [13.045,  80.090],
    'Ambattur':      [13.115,  80.160],
    'Thirumangalam': [13.075,  80.200],
  };

  const markers = [];
  commonStops.forEach(s => {
    const coords = stopCoords[s.name];
    if (coords) {
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:#1a3a6b;color:#fff;font-size:10px;padding:3px 7px;border-radius:10px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.2);white-space:nowrap;">${s.name}</div>`,
        iconAnchor: [30, 10]
      });
      L.marker(coords, { icon }).addTo(commonMap)
        .bindPopup(`<strong>${s.name}</strong><br>Routes: ${s.routes.join(', ')}`);
      markers.push(coords);
    }
  });

  if (markers.length) commonMap.fitBounds(L.latLngBounds(markers), { padding: [30, 30] });
}

function openAddStopModal() {
  document.getElementById('newStopName').value   = '';
  document.getElementById('newStopRoutes').value = '';
  document.getElementById('newStopArea').value   = '';
  openModal('addStopModal');
}

function saveCommonStop() {
  const name   = document.getElementById('newStopName').value.trim();
  const routes = document.getElementById('newStopRoutes').value.split(',').map(r => r.trim()).filter(Boolean);
  const area   = document.getElementById('newStopArea').value.trim();
  if (!name) { showToast('Please enter a stop name'); return; }
  commonStops.push({ id: Date.now(), name, routes, area });
  renderCommonStops();
  closeModal('addStopModal');
  showToast(`Common stop "${name}" added`);
}

function removeCommonStop(id) {
  commonStops = commonStops.filter(s => s.id !== id);
  renderCommonStops();
  showToast('Stop removed');
}

/* ============================================
   MODAL HELPERS
============================================ */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/* Close modals on overlay click */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
  }
});

/* ============================================
   TOAST
============================================ */
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================================
   ACTIVITY LOG
============================================ */
function logActivity(msg, type) {
  activityLog.unshift({
    msg, type,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  });
  if (activityLog.length > 60) activityLog.pop();
  renderActivityLog();
}

function renderActivityLog() {
  const el = document.getElementById('activityLog');
  if (!el) return;
  if (activityLog.length === 0) {
    el.innerHTML = '<div class="activity-empty">No recent activity.</div>';
    return;
  }
  el.innerHTML = activityLog.map(a => `
    <div class="activity-item activity-${a.type}">
      <span class="activity-time">${a.time}</span>
      <span class="activity-msg">${a.msg}</span>
    </div>
  `).join('');
}

function clearActivityLog() {
  activityLog = [];
  renderActivityLog();
}

/* ============================================
   OVERVIEW TABLE FILTER
============================================ */
function filterOverview(status, btn) {
  overviewFilter = status;
  if (btn) {
    document.querySelectorAll('#overviewFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  renderOverviewTable();
}

/* ============================================
   TRIP STATUS FILTER
============================================ */
function filterTrips(status, btn) {
  tripFilter = status;
  if (btn) {
    document.querySelectorAll('#tripFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    /* Update "All" label with count */
    const allBtn = document.querySelector('#tripFilterTabs .filter-tab');
    if (allBtn) allBtn.textContent = `All (${ROUTES.length})`;
  }
  renderTripStatus();
}

/* ============================================
   ROUTE STOP MANAGEMENT
============================================ */
function addStopToRoute(routeNo) {
  const r = ROUTES.find(x => x.no === routeNo);
  if (!r) return;
  const nameEl = document.getElementById('newStopNameEdit');
  const timeEl = document.getElementById('newStopTimeEdit');
  const name = nameEl ? nameEl.value.trim() : '';
  const time = timeEl ? timeEl.value.trim() : '';
  if (!name) { showToast('Please enter a stop name'); return; }
  if (!r.boarding) r.boarding = [];
  r.boarding.push({ stop: name, time });
  logActivity(`📍 Stop "${name}" added to Route ${routeNo}`, 'info');
  renderRouteEditPanel();
  showToast(`Stop "${name}" added`);
}

function removeStopFromRoute(routeNo, idx) {
  const r = ROUTES.find(x => x.no === routeNo);
  if (!r || !r.boarding) return;
  const removed = r.boarding[idx];
  r.boarding.splice(idx, 1);
  logActivity(`📍 Stop "${removed.stop}" removed from Route ${routeNo}`, 'info');
  renderRouteEditPanel();
  showToast('Stop removed');
}
