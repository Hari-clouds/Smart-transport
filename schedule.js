/**
 * schedule.js — RIT Smart Transport Bus Schedule
 * Depends on: routes.js (ROUTES array)
 */

let schData      = [];
let schSortKey   = 'time';
let schSortAsc   = true;
let schSearchVal = '';

/* ---- Time helpers ---- */
function parseMinutes(str) {
  if (!str) return Infinity;
  const m = str.match(/(\d+):(\d+)\s*(am|pm)/i);
  if (!m) return Infinity;
  let h = parseInt(m[1]), min = parseInt(m[2]);
  if (m[3].toLowerCase() === 'pm' && h !== 12) h += 12;
  if (m[3].toLowerCase() === 'am' && h === 12) h = 0;
  return h * 60 + min;
}

function durationMins(depart, arrive) {
  const d = parseMinutes(depart);
  const a = parseMinutes(arrive);
  if (d === Infinity || a === Infinity) return null;
  const diff = a - d;
  return diff > 0 ? diff : null;
}

function fmtDuration(mins) {
  if (mins === null) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
}

function stopCount(route) {
  return route.stops ? route.stops.length : (route.boarding ? route.boarding.length : 0);
}

/* ---- Build enriched data ---- */
function _buildData() {
  schData = ROUTES.map(r => ({
    ...r,
    _departMins: parseMinutes(r.depart),
    _durMins:    durationMins(r.depart, r.arrive),
    _stops:      stopCount(r),
  }));
}

/* ---- Sort ---- */
function _sorted(arr) {
  const copy = [...arr];
  copy.sort((a, b) => {
    let va, vb;
    if (schSortKey === 'time')  { va = a._departMins; vb = b._departMins; }
    if (schSortKey === 'route') { va = a.no; vb = b.no; }
    if (schSortKey === 'dur')   { va = a._durMins ?? Infinity; vb = b._durMins ?? Infinity; }
    if (va < vb) return schSortAsc ? -1 : 1;
    if (va > vb) return schSortAsc ?  1 : -1;
    return 0;
  });
  return copy;
}

/* ---- Filter ---- */
function _filtered() {
  const q = schSearchVal.toLowerCase();
  if (!q) return schData;
  return schData.filter(r =>
    r.no.toLowerCase().includes(q) ||
    r.name.toLowerCase().includes(q)
  );
}

/* ---- Render table ---- */
function _renderTable() {
  const rows  = _sorted(_filtered());
  const tbody = document.getElementById('schBody');
  const empty = document.getElementById('schEmpty');
  const count = document.getElementById('schCount');

  count.textContent = rows.length + ' route' + (rows.length !== 1 ? 's' : '');

  if (rows.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = rows.map(r => {
    const dur = fmtDuration(r._durMins);
    const stops = r._stops > 0 ? r._stops : '—';
    const badge = r.pending
      ? `<span class="sch-badge sch-badge-pending">${r.no}</span>`
      : `<span class="sch-badge">${r.no}</span>`;

    return `
      <tr class="sch-row${r.pending ? ' sch-row-pending' : ''}" data-route="${r.no}">
        <td class="col-no">${badge}</td>
        <td class="col-area">${r.name}${r.pending ? ' <span class="sch-pending-tag">pending</span>' : ''}</td>
        <td class="col-depart"><span class="sch-time sch-depart">${r.depart}</span></td>
        <td class="col-arrive"><span class="sch-time sch-arrive">${r.arrive}</span></td>
        <td class="col-dur"><span class="sch-dur">${dur}</span></td>
        <td class="col-stops">${stops}</td>
        <td class="col-action print-hide">
          <a href="index.html?route=${encodeURIComponent(r.no)}" class="sch-action-btn">View</a>
        </td>
      </tr>`;
  }).join('');
}

/* ---- Summary cards ---- */
function _renderCards() {
  const valid = schData.filter(r => r._departMins < Infinity && !r.pending);
  if (!valid.length) return;

  const earliest = valid.reduce((a, b) => a._departMins < b._departMins ? a : b);
  const latest   = valid.reduce((a, b) => a._departMins > b._departMins ? a : b);
  const longest  = valid.filter(r => r._durMins).reduce((a, b) => (a._durMins > b._durMins ? a : b), valid[0]);
  const mostStops = valid.reduce((a, b) => a._stops > b._stops ? a : b);

  const cards = [
    { icon: '🌅', label: 'Earliest Departure', val: earliest.depart, sub: earliest.no + ' — ' + earliest.name },
    { icon: '🕐', label: 'Latest Departure',   val: latest.depart,   sub: latest.no + ' — ' + latest.name },
    { icon: '⏱',  label: 'Longest Journey',    val: fmtDuration(longest._durMins), sub: longest.no + ' — ' + longest.name },
    { icon: '📍', label: 'Most Stops',         val: mostStops._stops + ' stops', sub: mostStops.no + ' — ' + mostStops.name },
  ];

  document.getElementById('schCards').innerHTML = cards.map(c => `
    <div class="sch-card">
      <div class="sch-card-icon">${c.icon}</div>
      <div class="sch-card-body">
        <div class="sch-card-label">${c.label}</div>
        <div class="sch-card-val">${c.val}</div>
        <div class="sch-card-sub">${c.sub}</div>
      </div>
    </div>
  `).join('');
}

/* ---- Sort button active state ---- */
function _setSortActive() {
  ['sortTime', 'sortRoute', 'sortDur'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.remove('active');
  });
  const map = { time: 'sortTime', route: 'sortRoute', dur: 'sortDur' };
  const active = document.getElementById(map[schSortKey]);
  if (active) active.classList.add('active');
}

/* ---- Public: called by HTML ---- */
function schFilter() {
  schSearchVal = document.getElementById('schSearch').value.trim();
  _renderTable();
}

function schSort(key) {
  if (schSortKey === key) {
    schSortAsc = !schSortAsc;
  } else {
    schSortKey = key;
    schSortAsc = true;
  }
  _setSortActive();
  _renderTable();
}

/* ---- Init ---- */
_buildData();
_renderTable();
_renderCards();
