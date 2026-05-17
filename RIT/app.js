/** 
 * app.js 
 * RIT Smart Transport — Route Selector Logic 
 * Depends on: routes.js (ROUTES array, CAMPUS_ARRIVAL constant) 
 */ 

/* ---- State ---- */ 
let selectedRoute  = null; 
let filteredRoutes = [...ROUTES]; 

/* ---- DOM Refs ---- */ 
const searchInput  = document.getElementById('searchInput'); 
const clearBtn     = document.getElementById('clearBtn'); 
const dropdown     = document.getElementById('dropdown'); 
const countPill    = document.getElementById('countPill'); 
const selectedCard = document.getElementById('selectedCard'); 

/* ==========================================
   RENDER ROUTE LIST
========================================== */ 
function renderList() { 
  const count = filteredRoutes.length; 
  countPill.textContent = 
    count === 0 ? 'No routes found' 
    : count + ' route' + (count !== 1 ? 's' : '') + ' available'; 

  if (count === 0) { 
    dropdown.innerHTML = '<div class="no-results">No matching routes. Try a different search.</div>'; 
    return; 
  } 

  dropdown.innerHTML = filteredRoutes.map(route => ` 
    <div 
      class="route-item${selectedRoute && selectedRoute.no === route.no ? ' active' : ''}${route.pending ? ' pending-route' : ''}" 
      data-route="${route.no}" 
    > 
      <span class="badge">${route.no}</span> 
      <span class="route-name">${route.name}${route.pending ? ' <em style="font-size:11px;color:#94a3b8">(pending)</em>' : ''}</span> 
      <span class="route-time">${route.depart}</span> 
    </div> 
  `).join(''); 

  dropdown.querySelectorAll('.route-item').forEach(item => { 
    item.addEventListener('click', () => selectRoute(item.dataset.route)); 
  }); 
} 

/* ==========================================
   SELECT A ROUTE
========================================== */ 
function selectRoute(routeNo) { 
  selectedRoute = ROUTES.find(r => r.no === routeNo); 
  if (!selectedRoute) return; 
  renderList(); 
  renderCard(selectedRoute); 
  selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
} 

/* ==========================================
   RENDER DETAIL CARD
========================================== */ 
function renderCard(route) { 
  const url = route.path 
    ? `https://www.rittransport.com/routes/${route.path}.php` 
    : null; 

  function parseTime(str) { 
    const m = str.match(/(\d+):(\d+)\s*(am|pm)/i); 
    if (!m) return null; 
    let h = parseInt(m[1]), min = parseInt(m[2]); 
    if (m[3].toLowerCase() === 'pm' && h !== 12) h += 12; 
    if (m[3].toLowerCase() === 'am' && h === 12) h = 0; 
    return h * 60 + min; 
  } 

  let durationStr = '—'; 
  const d = parseTime(route.depart); 
  const a = parseTime(route.arrive); 
  if (d !== null && a !== null) { 
    const diff = a - d; 
    const hrs  = Math.floor(diff / 60); 
    const mins = diff % 60; 
    durationStr = hrs > 0 
      ? `${hrs}h ${mins > 0 ? mins + 'm' : ''}`.trim() 
      : `${mins}m`; 
  } 
  const routeJson = JSON.stringify(route).replace(/'/g, "\\'").replace(/"/g, '&quot;');

  selectedCard.innerHTML = ` 
  
    <div class="selected-card"> 

      <div class="card-top"> 
        <span class="card-badge">${route.no}</span> 
        <span class="card-route-name">${route.name}</span> 
      </div> 

      <hr class="card-divider" /> 

      <div class="timing-row"> 
        <div class="timing-block"> 
          <span class="t-label">Departure</span> 
          <span class="t-value depart">${route.depart}</span> 
          <span class="t-sub">From ${route.name}</span> 
        </div> 

        <div class="timing-arrow">&#8594;</div> 

        <div class="timing-block"> 
          <div class="arrival-section">
            <span class="t-label">Campus Arrival</span> 
            <span class="t-value arrive">${route.arrive}</span> 
            <span class="t-sub">RIT Campus,Poonamalle</span> 
          </div>
          <div class="duration-section">
            <span class="t-label">Duration</span> 
            <span class="t-value" style="color:#7c3aed;">${durationStr}</span> 
            <span class="t-sub">approx. travel time</span> 
          </div>
        </div> 
      </div> 

      <div class="card-meta"> 
        <div class="meta-item"> 
          <span class="meta-label">Route No.</span> 
          <span class="meta-value">${route.no}</span> 
        </div> 
        <div class="meta-item"> 
          <span class="meta-label">Starting Area</span> 
          <span class="meta-value">${route.name}</span> 
        </div> 
        <div class="meta-item"> 
          <span class="meta-label">Destination</span> 
          <span class="meta-value">RIT Campus</span> 
        </div> 
      </div> 

      <div class="card-actions">
       ${route.boarding ? `
          <button class="boarding-btn" onclick="openBoardingPoints(${routeJson})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            View All Boarding Points
          </button>
        ` : '<p style="font-size:13px;color:#f59e0b;">⚠ Boarding points not yet available for this route.</p>'}

       <button class="map-btn" id="mapTriggerBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
          View Route Map
        </button>

        ${route.stops && route.stops.length >= 2 ? `
        <button class="trk-btn" id="trackTriggerBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <line x1="12" y1="2" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="22" y2="12"/>
          </svg>
          Track My Bus
        </button>
        ` : ''}
      </div>

    </div>
  `;
  const mapBtn = document.getElementById('mapTriggerBtn');
  if (mapBtn && typeof openRouteMap === 'function') {
    mapBtn.addEventListener('click', () => openRouteMap(route));
  }

  const trkBtn = document.getElementById('trackTriggerBtn');
  if (trkBtn && typeof openBusTracker === 'function') {
    trkBtn.addEventListener('click', () => openBusTracker(route));
  }
}

/* ==========================================
   SEARCH / FILTER
========================================== */ 
function filterRoutes() { 
  const q = searchInput.value.trim().toLowerCase(); 
  clearBtn.classList.toggle('visible', q.length > 0); 
  filteredRoutes = q 
    ? ROUTES.filter(r => 
        r.no.toLowerCase().includes(q) || 
        r.name.toLowerCase().includes(q) 
      ) 
    : [...ROUTES]; 
  renderList(); 
} 

/* ==========================================
   CLEAR SEARCH
========================================== */ 
function clearSearch() { 
  searchInput.value = ''; 
  clearBtn.classList.remove('visible'); 
  filteredRoutes = [...ROUTES]; 
  renderList(); 
  searchInput.focus(); 
} 

searchInput.addEventListener('keydown', e => { 
  if (e.key === 'Escape') clearSearch(); 
}); 

renderList();