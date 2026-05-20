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

function bookSeat(routeNo, userId, boardingInfo) {
  const seats = getSeats(routeNo);
  if (!seats) return { success: false, msg: 'Seat data not configured for this route.' };
  if (seats.passengers.includes(userId)) return { success: false, msg: 'You have already checked in for this route.' };
  if (seats.occupied >= seats.total) return { success: false, msg: 'Bus is full — no seats available.' };
  seats.occupied++;
  seats.passengers.push(userId);
  localStorage.setItem(SEATS_KEY(routeNo), JSON.stringify(seats));
  /* Store boarding pass so parents can check child's boarding status */
  if (boardingInfo && boardingInfo.regNo) {
    const now = new Date();
    const bp = {
      ...boardingInfo,
      routeNo,
      boardedAt: now.getTime(),
      boardedAtTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      boardedAtDate: now.toLocaleDateString('en-IN'),
      status: 'boarded'
    };
    localStorage.setItem('rit_boarding_' + boardingInfo.regNo, JSON.stringify(bp));
  }
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

/* GPS Attendance Check — driver GPS optional */
let attendanceTimer = null;
let attendanceSeconds = 0;

function startAttendanceCheck(routeNo, userId, boardingInfo, onSuccess, onFail, onProgress) {
  /* Prototype mode: accept any location, no proximity check */
  const doBook = () => {
    attendanceSeconds = 0;
    onProgress(3);
    clearInterval(attendanceTimer);
    attendanceTimer = setInterval(() => {
      attendanceSeconds++;
      onProgress(3 - attendanceSeconds);
      if (attendanceSeconds >= 3) {
        clearInterval(attendanceTimer);
        const result = bookSeat(routeNo, userId, boardingInfo);
        if (result.success) {
          if (result.available === 0) _notifyBusFull(routeNo, boardingInfo.routeName);
          onSuccess(result.available);
        } else {
          onFail(result.msg);
        }
      }
    }, 1000);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => doBook(),
      () => doBook(), /* proceed even if location denied */
      { timeout: 3000 }
    );
  } else {
    doBook();
  }
}

function _notifyBusFull(routeNo, routeName) {
  const stored = JSON.parse(localStorage.getItem('rit_notifications') || '[]');
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  stored.unshift({
    id: Date.now(), type: 'info', routeNo,
    message: `Bus ${routeNo} (${routeName || routeNo}) — All seats are now filled.`,
    timeStr, timestamp: Date.now()
  });
  if (stored.length > 50) stored.length = 50;
  localStorage.setItem('rit_notifications', JSON.stringify(stored));
}

function cancelAttendanceCheck() {
  clearInterval(attendanceTimer);
  attendanceSeconds = 0;
}
