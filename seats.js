/**
 * seats.js — RIT Smart Transport Seat Management
 * Include in index.html and admin.html
 */

const SEATS_KEY = (routeNo) => 'rit_seats_' + routeNo;

function initSeats(routeNo, total) {
  const existing = getSeats(routeNo);
  if (existing && existing.total === total) return existing;
  const data = { total, occupied: 0, passengers: [] };
  localStorage.setItem(SEATS_KEY(routeNo), JSON.stringify(data));
  return data;
}

function getSeats(routeNo) {
  const raw = localStorage.getItem(SEATS_KEY(routeNo));
  return raw ? JSON.parse(raw) : null;
}

function bookSeat(routeNo, userId) {
  const seats = getSeats(routeNo);
  if (!seats) return { success: false, msg: 'Seat data not configured for this route.' };
  if (seats.passengers.includes(userId)) return { success: false, msg: 'You have already checked in for this route.' };
  if (seats.occupied >= seats.total) return { success: false, msg: 'Bus is full — no seats available.' };
  seats.occupied++;
  seats.passengers.push(userId);
  localStorage.setItem(SEATS_KEY(routeNo), JSON.stringify(seats));
  return { success: true, available: seats.total - seats.occupied };
}

function releaseSeat(routeNo, userId) {
  const seats = getSeats(routeNo);
  if (!seats) return;
  seats.passengers = seats.passengers.filter(p => p !== userId);
  seats.occupied   = Math.max(0, seats.occupied - 1);
  localStorage.setItem(SEATS_KEY(routeNo), JSON.stringify(seats));
}

function seatAvailabilityHTML(routeNo) {
  const seats = getSeats(routeNo);
  if (!seats) return '<span class="seat-na">Seats: Not configured</span>';
  const avail  = seats.total - seats.occupied;
  const pct    = Math.round((avail / seats.total) * 100);
  const color  = avail === 0 ? '#ef4444' : avail < seats.total * 0.2 ? '#f59e0b' : '#16a34a';
  return `
    <div class="seat-avail-wrap">
      <div class="seat-avail-bar-bg">
        <div class="seat-avail-bar-fill" style="width:${pct}%;background:${color}"></div>
      </div>
      <div class="seat-avail-text">
        <span style="color:${color};font-weight:700">${avail} seats available</span>
        <span style="color:#94a3b8">of ${seats.total}</span>
      </div>
    </div>
  `;
}

/* Haversine distance in metres */
function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* GPS Attendance Check */
let attendanceTimer = null;
let attendanceSeconds = 0;

function startAttendanceCheck(routeNo, userId, onSuccess, onFail, onProgress) {
  if (!navigator.geolocation) { onFail('GPS not supported on this device.'); return; }

  const busGps = JSON.parse(localStorage.getItem('bus_gps_' + routeNo) || 'null');
  if (!busGps) { onFail('Bus GPS not active. The driver has not started the trip yet.'); return; }

  const gpsAge = Date.now() - busGps.timestamp;
  if (gpsAge > 60000) { onFail('Bus GPS signal is outdated. Please try again when the bus is nearby.'); return; }

  navigator.geolocation.getCurrentPosition(pos => {
    const dist = haversineM(pos.coords.latitude, pos.coords.longitude, busGps.lat, busGps.lng);
    if (dist > 20) {
      onFail(`You are ${Math.round(dist)}m from the bus. Move within 20 metres to check in.`);
      return;
    }

    /* Within range — start 20 second countdown */
    attendanceSeconds = 0;
    onProgress(0, 20);
    clearInterval(attendanceTimer);
    attendanceTimer = setInterval(() => {
      attendanceSeconds++;
      /* Re-verify position every tick */
      navigator.geolocation.getCurrentPosition(pos2 => {
        const d2 = haversineM(pos2.coords.latitude, pos2.coords.longitude, busGps.lat, busGps.lng);
        if (d2 > 20) {
          clearInterval(attendanceTimer);
          onFail(`You moved away from the bus (${Math.round(d2)}m). Please try again.`);
          return;
        }
        onProgress(attendanceSeconds, 20);
        if (attendanceSeconds >= 20) {
          clearInterval(attendanceTimer);
          const result = bookSeat(routeNo, userId);
          if (result.success) onSuccess(result.available);
          else onFail(result.msg);
        }
      }, () => {}, { enableHighAccuracy: true, timeout: 3000 });
    }, 1000);
  }, err => {
    onFail('Could not get your location: ' + err.message);
  }, { enableHighAccuracy: true, timeout: 10000 });
}

function cancelAttendanceCheck() {
  clearInterval(attendanceTimer);
  attendanceSeconds = 0;
}
