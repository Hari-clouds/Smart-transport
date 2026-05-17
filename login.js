/**
 * login.js — RIT Smart Transport Login Page Logic
 */

let currentRole = null;
let currentPassengerType = null;

/* Redirect if already logged in */
(function() {
  const user = getSession();
  if (user) {
    if (user.role === 'admin') window.location.href = 'admin.html';
    else window.location.href = 'index.html';
  }
})();

function selectRole(role) {
  currentRole = role;
  if (role === 'admin') {
    showStep(3);
    document.getElementById('step3BackBtn').onclick = () => goBack(1);
    document.getElementById('formTitle').textContent = 'Admin Sign In';
    document.getElementById('usernameLabel').textContent = 'Username';
    document.getElementById('passwordLabel').textContent = 'Password';
    document.getElementById('usernameInput').type = 'text';
    document.getElementById('usernameInput').placeholder = 'admin';
    document.getElementById('passwordInput').placeholder = '••••••••••';
    document.getElementById('demoHint').innerHTML = `
      <strong>Demo Credentials</strong>
      Username: <code>admin</code> &nbsp; Password: <code>RIT@admin123</code>
    `;
  } else {
    showStep(2);
  }
}

function selectPassengerType(type) {
  currentPassengerType = type;
  showStep(3);
  document.getElementById('step3BackBtn').onclick = () => goBack(2);

  if (type === 'student') {
    document.getElementById('formTitle').textContent = 'Student Sign In';
    document.getElementById('usernameLabel').textContent = 'College Email Address';
    document.getElementById('passwordLabel').textContent = 'Register Number';
    document.getElementById('usernameInput').type = 'email';
    document.getElementById('usernameInput').placeholder = 'yourname@rit.edu';
    document.getElementById('passwordInput').placeholder = 'e.g. 211001';
    document.getElementById('demoHint').innerHTML = `
      <strong>Demo Credentials</strong>
      Email: <code>student1@rit.edu</code><br>
      Register No: <code>211001</code>
    `;
  } else {
    document.getElementById('formTitle').textContent = 'Faculty / Staff Sign In';
    document.getElementById('usernameLabel').textContent = 'Staff ID';
    document.getElementById('passwordLabel').textContent = 'Phone Number';
    document.getElementById('usernameInput').type = 'text';
    document.getElementById('usernameInput').placeholder = 'e.g. FAC001';
    document.getElementById('passwordInput').placeholder = '10-digit phone number';
    document.getElementById('demoHint').innerHTML = `
      <strong>Demo Credentials</strong>
      Staff ID: <code>FAC001</code><br>
      Phone: <code>9876543210</code>
    `;
  }
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('usernameInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();
  const errorEl  = document.getElementById('loginError');
  errorEl.classList.add('hidden');

  let success = false;

  if (currentRole === 'admin') {
    success = loginAdmin(username, password);
    if (success) { window.location.href = 'admin.html'; return; }
  } else if (currentPassengerType === 'student') {
    const session = loginStudent(username, password);
    if (session) { window.location.href = 'index.html'; return; }
  } else if (currentPassengerType === 'staff') {
    const session = loginStaff(username, password);
    if (session) { window.location.href = 'index.html'; return; }
  }

  errorEl.classList.remove('hidden');
  document.getElementById('passwordInput').value = '';
  document.getElementById('passwordInput').focus();
}

function showStep(n) {
  document.getElementById('step1').classList.add('hidden');
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('step' + n).classList.remove('hidden');
  /* Clear error and form when switching */
  const err = document.getElementById('loginError');
  if (err) err.classList.add('hidden');
}

function goBack(toStep) {
  showStep(toStep);
  if (toStep === 1) { currentRole = null; currentPassengerType = null; }
  if (toStep === 2) { currentPassengerType = null; }
}
