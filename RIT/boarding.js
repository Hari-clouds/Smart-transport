/**
 * boarding.js
 * RIT Smart Transport — Boarding Points Modal
 */

/* ============================================
   OPEN BOARDING MODAL
============================================ */
function openBoardingPoints(route) {
  createBoardingModalDOM(route);
}

/* ============================================
   CREATE BOARDING MODAL DOM
============================================ */
function createBoardingModalDOM(route) {
  const existing = document.getElementById('boardingModalOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'boarding-modal-overlay';
  overlay.id = 'boardingModalOverlay';

  // Build stops rows
  let stopsHTML = '';

  if (route.boarding && route.boarding.length > 0) {
    route.boarding.forEach((item, i) => {
      const isFirst = i === 0;
      const isLast  = i === route.boarding.length - 1;

      let badgeStyle = '';
      let rowStyle   = '';
      let timeStyle  = '';

      if (isFirst) {
        badgeStyle = 'background:#f59e0b;color:#1a1a1a;';
        rowStyle   = 'background:#fff7ed;border-left:3px solid #f59e0b;';
        timeStyle  = 'color:#b45309;font-weight:700;';
      } else if (isLast) {
        badgeStyle = 'background:#16a34a;color:#fff;';
        rowStyle   = 'background:#f0fdf4;border-left:3px solid #16a34a;';
        timeStyle  = 'color:#15803d;font-weight:700;';
      } else {
        badgeStyle = 'background:#1a3a6b;color:#fff;';
        rowStyle   = 'background:#fff;border-left:3px solid #e2e8f0;';
        timeStyle  = 'color:#1e293b;font-weight:600;';
      }

     stopsHTML += `
        <div class="boarding-stop-row" style="${rowStyle}">
          <div class="boarding-stop-left">
            <span class="boarding-stop-number" style="${badgeStyle}">${i + 1}</span>
            <div class="boarding-stop-info">
              <span class="boarding-stop-name">
                ${!isFirst && !isLast ? '🚩 ' : ''}${item.stop}
              </span>
              ${isFirst ? '<span class="boarding-stop-tag">Departure</span>' : ''}
              ${isLast  ? '<span class="boarding-stop-tag rit-tag">RIT Campus</span>' : ''}
            </div>
          </div>
          <span class="boarding-stop-time" style="${timeStyle}">${item.time}</span>
        </div>
      `;  
    });
  } else {
    stopsHTML = `
      <div class="boarding-no-data">
        <span>⚠ Boarding points not yet available for this route.</span>
      </div>
    `;
  }

  overlay.innerHTML = `
    <div class="boarding-modal" id="boardingModal">

      <div class="boarding-modal-header">
        <div class="boarding-modal-title">
          <span class="boarding-modal-badge">${route.no}</span>
          <span>${route.name} — Boarding Points</span>
        </div>
        <button class="boarding-close-btn" onclick="closeBoardingModal()" title="Close">&#x2715;</button>
      </div>

      <div class="boarding-modal-subheader">
        <div class="boarding-subheader-item">
          <span class="boarding-subheader-label">Total Stops</span>
          <span class="boarding-subheader-value">${route.boarding ? route.boarding.length : 0}</span>
        </div>
        <div class="boarding-subheader-item">
          <span class="boarding-subheader-label">First Pickup</span>
          <span class="boarding-subheader-value" style="color:#b45309;">${route.boarding ? route.boarding[0].time : '—'}</span>
        </div>
        <div class="boarding-subheader-item">
          <span class="boarding-subheader-label">Campus Arrival</span>
          <span class="boarding-subheader-value" style="color:#15803d;">${route.arrive}</span>
        </div>
      </div>

      <div class="boarding-stops-list">
        ${stopsHTML}
      </div>

      <div class="boarding-modal-footer">
        <span>🏫 RIT Campus — Kuthambakkam Post, Poonamallee, Chennai - 600 124</span>
      </div>

    </div>
  `;

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeBoardingModal();
  });

  document.addEventListener('keydown', handleBoardingKeydown);
  document.body.appendChild(overlay);
}

/* ============================================
   CLOSE BOARDING MODAL
============================================ */
function closeBoardingModal() {
  document.removeEventListener('keydown', handleBoardingKeydown);
  const overlay = document.getElementById('boardingModalOverlay');
  if (overlay) overlay.remove();
}

function handleBoardingKeydown(e) {
  if (e.key === 'Escape') closeBoardingModal();
}