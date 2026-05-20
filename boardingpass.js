/**
 * boardingpass.js — Boarding Pass Modal + Notification Bell
 * Loaded in index.html after app.js
 */

/* ===================== BOARDING PASS ===================== */

function showBoardingPass(bp) {
  closeBoardingPass();
  const overlay = document.createElement('div');
  overlay.className = 'bp-overlay';
  overlay.id = 'bpOverlay';
  overlay.innerHTML = `
    <div class="bp-modal">
      <div class="bp-modal-header">
        <span class="bp-modal-title">🎟️ Boarding Pass</span>
        <button class="bp-modal-close" onclick="closeBoardingPass()">×</button>
      </div>
      <div class="bp-pass">
        <div class="bp-pass-left">
          <div class="bp-pass-airline">RIT Smart Transport</div>
          <div class="bp-pass-name">${bp.name}</div>
          <div class="bp-pass-regno">Reg No: ${bp.regNo}</div>
          <div class="bp-pass-row">
            <div class="bp-pass-label">Boarded At</div>
            <div class="bp-pass-val">${bp.boardedAtTime}</div>
          </div>
          <div class="bp-pass-row">
            <div class="bp-pass-label">Date</div>
            <div class="bp-pass-val">${bp.boardedAtDate}</div>
          </div>
        </div>
        <div class="bp-tear-line"></div>
        <div class="bp-pass-right">
          <div class="bp-route-badge">${bp.routeNo}</div>
          <div class="bp-pass-right-row">
            <div class="bp-pass-right-label">From</div>
            <div class="bp-pass-right-val">${bp.routeName}</div>
          </div>
          <div class="bp-pass-right-row">
            <div class="bp-pass-right-label">To</div>
            <div class="bp-pass-right-val">RIT Campus</div>
          </div>
          <div class="bp-pass-right-row">
            <div class="bp-pass-right-label">Arrives</div>
            <div class="bp-pass-right-val">7:40 AM</div>
          </div>
          <div class="bp-confirmed-stamp">Boarding Confirmed</div>
        </div>
      </div>
      <div class="bp-modal-footer">
        Your boarding is confirmed. Show this pass if required. &nbsp;
        <button onclick="closeBoardingPass()" style="background:none;border:none;color:#1a3a6b;font-weight:700;cursor:pointer;font-family:inherit">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeBoardingPass(); });
}

function closeBoardingPass() {
  const el = document.getElementById('bpOverlay');
  if (el) el.remove();
}

/* Also allow passenger to re-view their boarding pass via a button */
function viewMyBoardingPass() {
  const sess = typeof getSession === 'function' ? getSession() : null;
  if (!sess) return;
  const regNo = sess.id || '';
  const bp = JSON.parse(localStorage.getItem('rit_boarding_' + regNo) || 'null');
  if (bp) showBoardingPass(bp);
  else alert('You have not checked in yet. Use the Check In (GPS) button on your route card.');
}

/* ===================== NOTIFICATION BELL ===================== */

let notifOpen = false;

function toggleNotifDropdown() {
  notifOpen = !notifOpen;
  const dd = document.getElementById('notifDropdown');
  if (!dd) return;
  dd.style.display = notifOpen ? '' : 'none';
  if (notifOpen) refreshNotifDropdown();
}

function refreshNotifDropdown() {
  const sess = typeof getSession === 'function' ? getSession() : null;
  const body = document.getElementById('notifDropdownBody');
  const countEl = document.getElementById('notifBellCount');
  if (!body) return;

  const all = JSON.parse(localStorage.getItem('rit_notifications') || '[]');
  const relevant = sess
    ? all.filter(n => n.routeNo === 'all' || n.routeNo === sess.route)
    : all;

  if (countEl) {
    if (relevant.length > 0) { countEl.textContent = relevant.length; countEl.style.display = ''; }
    else countEl.style.display = 'none';
  }

  if (relevant.length === 0) {
    body.innerHTML = '<div class="notif-empty-msg">No notifications for your route yet.</div>';
    return;
  }

  body.innerHTML = relevant.map(n => `
    <div class="notif-row">
      <span class="notif-row-type ${n.type}">${n.type}</span>
      <span class="notif-row-msg">${n.message}</span>
      <span class="notif-row-time">${n.timeStr}</span>
    </div>
  `).join('');
}

/* Poll notifications every 30 seconds */
document.addEventListener('DOMContentLoaded', () => {
  refreshNotifDropdown();
  setInterval(() => {
    refreshNotifDropdown();
  }, 30000);

  /* Close dropdown when clicking outside */
  document.addEventListener('click', e => {
    if (notifOpen && !e.target.closest('#notifDropdown') && !e.target.closest('#notifBellBtn')) {
      notifOpen = false;
      const dd = document.getElementById('notifDropdown');
      if (dd) dd.style.display = 'none';
    }
  });
});
