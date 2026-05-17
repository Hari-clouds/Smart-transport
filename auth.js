/**
 * auth.js — RIT Smart Transport Shared Auth Utilities
 * Include in ALL pages before other scripts.
 */

const RIT_SESSION_KEY = 'rit_session';

const DEMO_STUDENTS = [
  { email: 'student1@rit.edu', regNo: '211001', name: 'Rahul Kumar',   route: 'R01'  },
  { email: 'student2@rit.edu', regNo: '211002', name: 'Priya Singh',   route: 'R05A' },
  { email: 'student3@rit.edu', regNo: '211003', name: 'Arun M',        route: 'R16'  },
  { email: 'student4@rit.edu', regNo: '211004', name: 'Deepa R',       route: 'R03'  },
  { email: 'student5@rit.edu', regNo: '211005', name: 'Karthik V',     route: 'R09'  },
];

const DEMO_STAFF = [
  { staffId: 'FAC001', phone: '9876543210', name: 'Dr. Ramesh Kumar',  route: 'R03' },
  { staffId: 'FAC002', phone: '9876543211', name: 'Prof. Meena S',     route: 'R05' },
  { staffId: 'FAC003', phone: '9876543212', name: 'Dr. Suresh P',      route: 'R16' },
];

const ADMIN_CREDS = { username: 'admin', password: 'RIT@admin123' };

function setSession(userObj) {
  sessionStorage.setItem(RIT_SESSION_KEY, JSON.stringify(userObj));
}

function getSession() {
  const s = sessionStorage.getItem(RIT_SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

function clearSession() {
  sessionStorage.removeItem(RIT_SESSION_KEY);
  window.location.href = 'login.html';
}

function checkAuth(allowedRoles) {
  const user = getSession();
  if (!user) { window.location.href = 'login.html'; return null; }
  if (allowedRoles && !allowedRoles.includes(user.role)) { window.location.href = 'login.html'; return null; }
  return user;
}

function loginStudent(email, regNo) {
  const stored = JSON.parse(localStorage.getItem('rit_students') || 'null');
  const users = stored || DEMO_STUDENTS;
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.regNo === regNo.trim());
  if (!user) return null;
  const session = { role: 'student', name: user.name, id: user.email, route: user.route };
  setSession(session);
  return session;
}

function loginStaff(staffId, phone) {
  const stored = JSON.parse(localStorage.getItem('rit_staff') || 'null');
  const users = stored || DEMO_STAFF;
  const user = users.find(u => u.staffId === staffId.trim() && u.phone === phone.trim());
  if (!user) return null;
  const session = { role: 'staff', name: user.name, id: user.staffId, route: user.route };
  setSession(session);
  return session;
}

function loginAdmin(username, password) {
  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    setSession({ role: 'admin', name: 'Administrator', id: 'admin' });
    return true;
  }
  return false;
}

function injectLogoutBtn(containerId) {
  const user = getSession();
  if (!user) return;
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <span style="font-size:12px;color:rgba(255,255,255,0.7);margin-right:6px">${user.name}</span>
    <button onclick="clearSession()" style="background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.85);font-size:12px;font-weight:600;padding:5px 12px;border-radius:7px;cursor:pointer;font-family:inherit;">Logout</button>
  `;
}
