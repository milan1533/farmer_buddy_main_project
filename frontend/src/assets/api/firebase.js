// Lightweight Firebase client with safe dynamic imports
// Works even if Firebase SDK is not installed or env is missing.

let _app = null;
let _db = null;

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function hasConfig() {
  return (
    !!cfg.apiKey &&
    !!cfg.authDomain &&
    !!cfg.projectId &&
    !!cfg.storageBucket &&
    !!cfg.appId
  );
}

export async function getFirestoreSafe() {
  if (!hasConfig()) return null;
  try {
    if (_db) return _db;
    const appMod = await import(/* @vite-ignore */ 'firebase/app');
    const { getFirestore } = await import(/* @vite-ignore */ 'firebase/firestore');
    if (!_app) _app = appMod.initializeApp(cfg);
    _db = getFirestore(_app);
    return _db;
  } catch {
    // SDK not installed or runtime error; return null to allow fallback
    return null;
  }
}

// Read published assistance items
export async function fetchAssistanceItems() {
  const db = await getFirestoreSafe();
  if (!db) return null;
  try {
    const { collection, query, where, orderBy, getDocs } = await import(/* @vite-ignore */ 'firebase/firestore');
    const q = query(
      collection(db, 'assistanceItems'),
      where('published', '==', true),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return rows;
  } catch {
    return null;
  }
}
