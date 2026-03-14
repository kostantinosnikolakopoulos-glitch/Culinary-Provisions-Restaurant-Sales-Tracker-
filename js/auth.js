// ============================================================
// AUTH MODULE — Login / Signup / Logout + Firestore sync
// ============================================================

const Auth = {
  currentUser: null,
  isAdmin: false,

  init() {
    this.bindEvents();

    auth.onAuthStateChanged(async (user) => {
      const authBox  = document.getElementById('auth-container');
      const appBox   = document.querySelector('.app-layout');
      const modalBox = document.getElementById('modal');

      if (user) {
        this.currentUser = user;
        // Check admin role
        await this.checkRole(user.uid);
        // Pull cloud data into localStorage
        await this.loadUserData(user.uid);
        // Boot the app
        authBox.classList.add('hidden');
        appBox.classList.remove('hidden');
        // Show/hide admin nav
        const adminNav = document.getElementById('nav-admin');
        if (adminNav) {
          if (this.isAdmin) adminNav.classList.remove('hidden');
          else adminNav.classList.add('hidden');
        }
        App.init();
      } else {
        this.currentUser = null;
        this.isAdmin = false;
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

  bindEvents() {
    // Toggle login ↔ signup
    document.getElementById('auth-toggle-signup')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').classList.add('hidden');
      document.getElementById('signup-form').classList.remove('hidden');
    });
    document.getElementById('auth-toggle-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signup-form').classList.add('hidden');
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

      snapshot.forEach(doc => {
        const lsKey = docToKey[doc.id];
        if (lsKey) {
          localStorage.setItem(lsKey, JSON.stringify(doc.data().value));
        }
      });
    } catch (err) {
      console.error('Failed to load user data from Firestore:', err);
    }
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
  }
};

// Boot auth on DOM ready
document.addEventListener('DOMContentLoaded', () => Auth.init());
