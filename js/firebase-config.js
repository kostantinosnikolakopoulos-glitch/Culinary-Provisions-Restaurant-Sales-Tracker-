// ============================================================
// FIREBASE CONFIGURATION — Culinary Provisions
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyB0NFDxOauSQ0TNQ0DzJ9JQB1R2hOKm62Q",
  authDomain: "culinaryprovisions-restaurant.firebaseapp.com",
  projectId: "culinaryprovisions-restaurant",
  storageBucket: "culinaryprovisions-restaurant.firebasestorage.app",
  messagingSenderId: "694198113373",
  appId: "1:694198113373:web:1a694aa6942e17ca81a9b4"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// Map localStorage keys → Firestore document IDs
const FIRESTORE_DOC_MAP = {
  'hc_menu':          'menu',
  'hc_categories':    'categories',
  'hc_staff':         'staff',
  'hc_orders':        'orders',
  'hc_settings':      'settings',
  'hc_day_log':       'dayLog',
  'hc_week_log':      'weekLog',
  'hc_month_log':     'monthLog',
  'hc_business_date': 'businessDate',
  'hc_pantry':        'pantry',
  'hc_time_clock':    'timeClock',
};
