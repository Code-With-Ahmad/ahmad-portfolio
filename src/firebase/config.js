import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only the piece the public site needs (Firestore reads) is initialized
// here, since this module is imported by every page. Auth is initialized in
// its own module (firebase/adminAuth.js), only ever imported from the
// code-split /admin bundle — so a missing/invalid Firebase config never
// breaks the public site. File uploads use Cloudinary, not Firebase Storage
// (see README) — this project doesn't use Firebase Storage at all.
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
