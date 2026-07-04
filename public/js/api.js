// api.js — tiny fetch wrapper shared by all pages
const API = {
  async _req(method, url, body) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    let data = null;
    try { data = await res.json(); } catch (_) { /* no body */ }
    if (!res.ok) {
      const err = new Error((data && data.error) || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  },
  get(url) { return this._req('GET', url); },
  post(url, body) { return this._req('POST', url, body); },
};

// Redirects to /login.html if the current session isn't authenticated.
// Returns the logged-in user object if it is.
async function requireAuthOrRedirect() {
  try {
    const { user } = await API.get('/api/auth/me');
    return user;
  } catch (e) {
    window.location.href = '/login.html';
    return null;
  }
}

async function logout() {
  try { await API.post('/api/auth/logout'); } catch (_) {}
  window.location.href = '/login.html';
}

// Populates the shared header (avatar/username + logout) once a user is known.
function paintUserHeader(user) {
  const nameEl = document.getElementById('headerUsername');
  const avatarEl = document.getElementById('headerAvatar');
  if (nameEl) nameEl.textContent = user.username;
  if (avatarEl) avatarEl.textContent = user.avatarEmoji || '🧑‍🚀';
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}
