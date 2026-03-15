// ============================================================
// AUTH MODULE — Login / Signup / Logout + Firestore sync
// ============================================================

const Auth = {
  currentUser: null,
  isAdmin: false,
  impersonating: null, // { uid, name } when admin is viewing a tenant

  init() {
    this.bindEvents();
    this.initOfflineDetection();

    auth.onAuthStateChanged(async (user) => {
      const authBox    = document.getElementById('auth-container');
      const authCard   = document.getElementById('auth-card');
      const authLoader = document.getElementById('auth-loading');
      const appBox     = document.querySelector('.app-layout');
      const modalBox   = document.getElementById('modal');

      if (user) {
        this.currentUser = user;
        await this.checkRole(user.uid);

        // Check if account is disabled by admin
        const isDisabled = await this.checkDisabled(user.uid);
        if (isDisabled) {
          await auth.signOut();
          if (authLoader) authLoader.classList.add('hidden');
          if (authCard) authCard.classList.remove('hidden');
          authBox.classList.remove('hidden');
          appBox.classList.add('hidden');
          const loginErr = document.getElementById('login-error');
          if (loginErr) loginErr.textContent = 'This account has been disabled by an administrator.';
          return;
        }

        await this.loadUserData(user.uid);
        authBox.classList.add('hidden');
        appBox.classList.remove('hidden');
        const adminNav = document.getElementById('nav-admin');
        if (adminNav) {
          if (this.isAdmin) adminNav.classList.remove('hidden');
          else adminNav.classList.add('hidden');
        }
        App.init();
      } else {
        this.currentUser = null;
        this.isAdmin = false;
        // Show auth screen with card (not spinner)
        if (authLoader) authLoader.classList.add('hidden');
        if (authCard) authCard.classList.remove('hidden');
        authBox.classList.remove('hidden');
        appBox.classList.add('hidden');
        modalBox.classList.add('hidden');
      }
    });
  },

  async checkRole(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      this.isAdmin = doc.exists && doc.data().role === 'admin';
    } catch {
      this.isAdmin = false;
    }
  },

  async checkDisabled(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      return doc.exists && doc.data().disabled === true;
    } catch {
      return false;
    }
  },

  bindEvents() {
    const hideAllForms = () => {
      document.getElementById('login-form')?.classList.add('hidden');
      document.getElementById('signup-form')?.classList.add('hidden');
      document.getElementById('forgot-form')?.classList.add('hidden');
    };

    // Toggle login ↔ signup ↔ forgot
    document.getElementById('auth-toggle-signup')?.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllForms();
      document.getElementById('signup-form').classList.remove('hidden');
    });
    document.getElementById('auth-toggle-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllForms();
      document.getElementById('login-form').classList.remove('hidden');
    });
    document.getElementById('auth-toggle-forgot')?.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllForms();
      document.getElementById('forgot-form').classList.remove('hidden');
    });
    document.getElementById('auth-toggle-login-from-forgot')?.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllForms();
      document.getElementById('login-form').classList.remove('hidden');
    });

    // Login submit
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl  = document.getElementById('login-error');
      const btn      = e.target.querySelector('button[type="submit"]');
      errorEl.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Signing in…';

      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (err) {
        errorEl.textContent = this.friendlyError(err.code);
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });

    // Forgot password submit
    document.getElementById('forgot-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email     = document.getElementById('forgot-email').value.trim();
      const errorEl   = document.getElementById('forgot-error');
      const successEl = document.getElementById('forgot-success');
      const btn       = e.target.querySelector('button[type="submit"]');
      errorEl.textContent = '';
      successEl.textContent = '';
      successEl.classList.add('hidden');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        await auth.sendPasswordResetEmail(email);
        successEl.textContent = 'Reset link sent! Check your email inbox.';
        successEl.classList.remove('hidden');
        btn.textContent = 'Link Sent';
      } catch (err) {
        errorEl.textContent = this.friendlyError(err.code);
        btn.disabled = false;
        btn.textContent = 'Send Reset Link';
      }
    });

    // Signup submit
    document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name     = document.getElementById('signup-name').value.trim();
      const email    = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const errorEl  = document.getElementById('signup-error');
      const btn      = e.target.querySelector('button[type="submit"]');
      errorEl.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Creating account…';

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        // Create user profile in Firestore
        await db.collection('users').doc(cred.user.uid).set({
          email: email,
          businessName: name,
          role: 'user',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (err) {
        errorEl.textContent = this.friendlyError(err.code);
        btn.disabled = false;
        btn.textContent = 'Create Account';
      }
    });
  },

  /** Pull all store data from Firestore → localStorage */
  async loadUserData(uid) {
    try {
      const snapshot = await db.collection('users').doc(uid).collection('store').get();

      if (snapshot.empty) {
        // First login — clear stale local data, let Store.init() create defaults
        Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
        return;
      }

      // Build reverse map: Firestore doc ID → localStorage key
      const docToKey = {};
      Object.entries(FIRESTORE_DOC_MAP).forEach(([lsKey, docId]) => {
        docToKey[docId] = lsKey;
      });

      // Check if cloud data is newer than local (multi-device conflict detection)
      const localTimestamp = parseInt(localStorage.getItem('hc_last_sync') || '0', 10);
      let cloudNewest = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        const lsKey = docToKey[doc.id];
        if (lsKey) {
          localStorage.setItem(lsKey, JSON.stringify(data.value));
        }
        if (data.lastModified && data.lastModified > cloudNewest) {
          cloudNewest = data.lastModified;
        }
      });

      // Save sync timestamp
      localStorage.setItem('hc_last_sync', String(Date.now()));

      // Show conflict notification if cloud was updated since last local sync
      if (localTimestamp > 0 && cloudNewest > localTimestamp) {
        this.showConflictBanner();
      }
    } catch (err) {
      console.error('Failed to load user data from Firestore:', err);
    }
  },

  showConflictBanner() {
    // Remove existing if present
    document.getElementById('conflict-banner')?.remove();
    const banner = document.createElement('div');
    banner.id = 'conflict-banner';
    banner.className = 'conflict-banner';
    banner.innerHTML = `
      <i class="fa-solid fa-arrows-rotate"></i>
      <span>Data was updated from another device — your local view has been refreshed with the latest data.</span>
      <button class="btn btn-sm" onclick="this.parentElement.remove()">
        <i class="fa-solid fa-xmark"></i> Dismiss
      </button>`;
    document.querySelector('.main-content')?.prepend(banner);
    setTimeout(() => banner.remove(), 10000);
  },

  /** Sign out and clear local data */
  async logout() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('hc_current_view');
    await auth.signOut();
  },

  friendlyError(code) {
    const map = {
      'auth/invalid-email':        'Invalid email address.',
      'auth/user-disabled':        'This account has been disabled.',
      'auth/user-not-found':       'No account found with this email.',
      'auth/wrong-password':       'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password':        'Password must be at least 6 characters.',
      'auth/too-many-requests':    'Too many attempts. Please try again later.',
      'auth/invalid-credential':   'Invalid email or password.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  },

  /** Admin: enter a tenant's account (load their data, redirect writes) */
  async impersonate(uid, name) {
    if (!this.isAdmin) return;
    this.impersonating = { uid, name };
    // Load tenant data into localStorage
    await this.loadUserData(uid);
    // Re-init Store so it picks up the new data
    Store.init();
    // Show impersonation banner
    this.showImpersonationBanner(name);
    // Go to dashboard
    App.showView('dashboard');
  },

  /** Admin: return to own account */
  async exitImpersonation() {
    if (!this.impersonating) return;
    this.impersonating = null;
    // Reload admin's own data
    await this.loadUserData(this.currentUser.uid);
    Store.init();
    // Remove banner
    this.hideImpersonationBanner();
    // Go back to admin panel
    App.showView('admin');
  },

  /** Get the UID to use for Firestore writes (tenant's if impersonating) */
  getActiveUid() {
    if (this.impersonating) return this.impersonating.uid;
    return this.currentUser ? this.currentUser.uid : null;
  },

  showImpersonationBanner(name) {
    this.hideImpersonationBanner();
    const banner = document.createElement('div');
    banner.id = 'impersonation-banner';
    banner.className = 'impersonation-banner';
    banner.innerHTML = `
      <i class="fa-solid fa-user-secret"></i>
      <span>Viewing as: <strong>${name}</strong></span>
      <button class="btn btn-sm" onclick="Auth.exitImpersonation()">
        <i class="fa-solid fa-arrow-left"></i> Return to Admin
      </button>`;
    document.querySelector('.main-content')?.prepend(banner);
  },

  hideImpersonationBanner() {
    document.getElementById('impersonation-banner')?.remove();
  },

  initOfflineDetection() {
    const banner = document.getElementById('offline-banner');
    if (!banner) return;
    const update = () => {
      if (navigator.onLine) banner.classList.add('hidden');
      else banner.classList.remove('hidden');
    };
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  }
};

// Boot auth on DOM ready
document.addEventListener('DOMContentLoaded', () => Auth.init());
