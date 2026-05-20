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

const DEMO_PARENTS = [
  { parentPhone: '9900000001', regNo: '211001', studentName: 'Rahul Kumar',  route: 'R01'  },
  { parentPhone: '9900000002', regNo: '211002', studentName: 'Priya Singh',  route: 'R05A' },
  { parentPhone: '9900000003', regNo: '211003', studentName: 'Arun M',       route: 'R16'  },
  { parentPhone: '9900000004', regNo: '211004', studentName: 'Deepa R',      route: 'R03'  },
  { parentPhone: '9900000005', regNo: '211005', studentName: 'Karthik V',    route: 'R09'  },
];

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
  const stored = JSON.parse(localStorage.getItem('rit_students') || '[]');
  const users = [...DEMO_STUDENTS, ...stored.filter(u => !DEMO_STUDENTS.find(d => d.email === u.email))];
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.regNo === regNo.trim());
  if (!user) return null;
  const session = { role: 'student', name: user.name, id: user.email, regNo: user.regNo, route: user.route };
  setSession(session);
  return session;
}

function loginStaff(staffId, phone) {
  const stored = JSON.parse(localStorage.getItem('rit_staff') || '[]');
  const users = [...DEMO_STAFF, ...stored.filter(u => !DEMO_STAFF.find(d => d.staffId === u.staffId))];
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

function loginParent(regNo, parentPhone) {
  const stored = JSON.parse(localStorage.getItem('rit_parents') || '[]');
  const users = [...DEMO_PARENTS, ...stored.filter(u => !DEMO_PARENTS.find(d => d.regNo === u.regNo))];
  const user = users.find(u => u.regNo === regNo.trim() && u.parentPhone === parentPhone.trim());
  if (!user) return null;
  const session = { role: 'parent', name: 'Parent of ' + user.studentName, id: 'parent_' + user.regNo, regNo: user.regNo, studentName: user.studentName, route: user.route };
  setSession(session);
  return session;
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
