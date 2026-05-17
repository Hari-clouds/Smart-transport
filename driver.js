/**
 * driver.js — RIT Smart Transport Driver Portal
 * Standalone page — no auth.js dependency.
 */

let currentDriverPhone = null;
let currentOTP = null;
let gpsWatchId = null;
let gpsInterval = null;
let currentRouteNo = null;

/* Demo driver assignments — in real app admin sets these */
const DEMO_DRIVER_ASSIGNMENTS = {
  '9876540001': { name: 'Murugan R',  routeNo: 'R01',  routeName: 'Ennore',       depart: '5:50 am', totalSeats: 50 },
  '9876540002': { name: 'Selvam K',   routeNo: 'R01A', routeName: 'Tondiarpet',    depart: '6:17 am', totalSeats: 48 },
  '9876540003': { name: 'Rajan P',    routeNo: 'R02',  routeName: 'Triplicane',    depart: '6:20 am', totalSeats: 52 },
  '9876540004': { name: 'Anbu S',     routeNo: 'R03',  routeName: 'Choolai',       depart: '6:20 am', totalSeats: 46 },
  '9876540005': { name: 'Karthik M',  routeNo: 'R05A', routeName: 'Loyola College',depart: '6:40 am', totalSeats: 50 },
};

/* ---- On load: check if already verified ---- */
(function() {
  const saved = localStorage.getItem('rit_driver_session');
  if (saved) {
    const d = JSON.parse(saved);
    currentDriverPhone = d.phone;
    currentRouteNo     = d.routeNo;
    showTripScreen(d);
  }
})();

/* ---- OTP flow ---- */
function sendOTP() {
  const phone = document.getElementById('driverPhone').value.trim();
  const errEl = document.getElementById('verifyError');
  errEl.classList.add('hidden');

  if (!/^\d{10}$/.test(phone)) {
    errEl.textContent = 'Please enter a valid 10-digit phone number.';
    errEl.classList.remove('hidden');
    return;
  }

  /* Check assignment exists */
  const assignment = getAssignment(phone);
  if (!assignment) {
    errEl.textContent = 'This phone number is not registered as a driver. Contact admin.';
    errEl.classList.remove('hidden');
    return;
  }

  currentDriverPhone = phone;
  currentOTP = String(Math.floor(1000 + Math.random() * 9000));

  document.getElementById('otpSection').style.display = 'block';
  document.getElementById('otpSentMsg').textContent =
    `OTP sent to ${phone.slice(0,4)}****${phone.slice(-3)}  —  Demo OTP: ${currentOTP}`;
  document.getElementById('otpInput').value = '';
  document.getElementById('otpInput').focus();
}

function verifyOTP() {
  const entered = document.getElementById('otpInput').value.trim();
  const errEl   = document.getElementById('verifyError');
  errEl.classList.add('hidden');

  if (entered !== currentOTP) {
    errEl.textContent = 'Incorrect OTP. Please try again.';
    errEl.classList.remove('hidden');
    return;
  }

  const assignment = getAssignment(currentDriverPhone);
  localStorage.setItem('rit_driver_session', JSON.stringify({
    phone: currentDriverPhone,
    routeNo: assignment.routeNo,
  }));
  currentRouteNo = assignment.routeNo;
  showTripScreen(assignment);
}

function getAssignment(phone) {
  /* Check admin-set assignments first */
  const adminAssign = JSON.parse(localStorage.getItem('rit_driver_assignments') || '{}');
  if (adminAssign[phone]) return adminAssign[phone];
  return DEMO_DRIVER_ASSIGNMENTS[phone] || null;
}

/* ---- Trip screen ---- */
function showTripScreen(data) {
  document.getElementById('screenVerify').classList.add('hidden');
  document.getElementById('screenTrip').classList.remove('hidden');

  const assignment = typeof data.routeNo === 'string' ? data : getAssignment(data.phone || currentDriverPhone);
  if (!assignment) return;

  document.getElementById('driverInfoCard').innerHTML = `
    <div style="background:rgba(255,255,255,0.15);border-radius:10px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">👤</div>
    <div>
      <div style="font-size:15px;font-weight:800">${assignment.name || 'Driver'}</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-top:2px">${currentDriverPhone || ''}</div>
    </div>
  `;

  document.getElementById('driverRouteNo').textContent   = assignment.routeNo;
  document.getElementById('driverRouteName').textContent = assignment.routeName;
  document.getElementById('driverRouteDepart').textContent = 'Departs ' + (assignment.depart || '—');

  currentRouteNo = assignment.routeNo;
  updateSeatsDisplay();
}

function updateSeatsDisplay() {
  const el = document.getElementById('driverSeatsInfo');
  if (!el || !currentRouteNo) return;
  const seats = JSON.parse(localStorage.getItem('rit_seats_' + currentRouteNo) || 'null');
  if (!seats) {
    el.textContent = 'Seats: Not configured by admin';
    return;
  }
  const avail = seats.total - seats.occupied;
  el.innerHTML = `Seats: <strong>${avail}</strong> available of <strong>${seats.total}</strong> total`;
}

/* ---- GPS trip ---- */
function startTrip() {
  if (!navigator.geolocation) {
    alert('GPS not supported on this device.');
    return;
  }
  document.getElementById('tripNotStarted').style.display = 'none';
  document.getElementById('tripInProgress').style.display = 'block';

  const dot  = document.getElementById('gpsDot');
  const text = document.getElementById('gpsStatusText');
  dot.classList.add('active');

  /* Broadcast GPS every 5 seconds */
  function broadcast(pos) {
    const gpsData = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      timestamp: Date.now(),
      routeNo: currentRouteNo,
      driverPhone: currentDriverPhone,
    };
    localStorage.setItem('bus_gps_' + currentRouteNo, JSON.stringify(gpsData));
    text.textContent = `GPS: Active — Lat ${gpsData.lat.toFixed(5)}, Lng ${gpsData.lng.toFixed(5)}`;
  }

  gpsWatchId = navigator.geolocation.watchPosition(broadcast, gpsError, {
    enableHighAccuracy: true, maximumAge: 5000, timeout: 10000
  });

  /* Refresh display every 5s */
  gpsInterval = setInterval(updateSeatsDisplay, 5000);
}

function gpsError(err) {
  document.getElementById('gpsStatusText').textContent = 'GPS: Error — ' + err.message;
}

function endTrip() {
  if (!confirm('End this trip?')) return;

  if (gpsWatchId !== null) { navigator.geolocation.clearWatch(gpsWatchId); gpsWatchId = null; }
  clearInterval(gpsInterval);

  /* Clear bus GPS */
  if (currentRouteNo) localStorage.removeItem('bus_gps_' + currentRouteNo);

  document.getElementById('tripNotStarted').style.display = 'block';
  document.getElementById('tripInProgress').style.display = 'none';

  const dot  = document.getElementById('gpsDot');
  const text = document.getElementById('gpsStatusText');
  dot.classList.remove('active');
  text.textContent = 'GPS: Inactive';
}

function driverLogout() {
  if (gpsWatchId !== null) { navigator.geolocation.clearWatch(gpsWatchId); }
  clearInterval(gpsInterval);
  if (currentRouteNo) localStorage.removeItem('bus_gps_' + currentRouteNo);
  localStorage.removeItem('rit_driver_session');
  currentDriverPhone = null;
  currentOTP = null;
  currentRouteNo = null;
  document.getElementById('screenTrip').classList.add('hidden');
  document.getElementById('screenVerify').classList.remove('hidden');
  document.getElementById('driverPhone').value = '';
  document.getElementById('otpSection').style.display = 'none';
}
