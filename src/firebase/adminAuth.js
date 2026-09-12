import { getAuth, onAuthStateChanged, signInWithCustomToken, signOut } from 'firebase/auth';
import { app } from './config';

// Initialized here (not in config.js) so Auth is only ever loaded as part
// of the code-split admin bundle — an invalid/missing Firebase config
// (e.g. before the project has been set up) would otherwise break the
// entire public site. getAuth() throws synchronously on a bad config, so
// it's guarded here and surfaced as a normal state instead of a crash.
let auth = null;
let configError = null;
try {
  auth = getAuth(app);
} catch (err) {
  configError = err;
}

export function getAuthConfigError() {
  return configError;
}

export async function loginWithPassword(password) {
  if (configError) {
    throw new Error('Firebase is not configured yet — add your Firebase env vars and restart the app.');
  }

  const res = await fetch('/api/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Login failed');
  }

  const { token } = await res.json();
  const credential = await signInWithCustomToken(auth, token);
  return credential.user;
}

export async function getCurrentIdToken() {
  if (!auth?.currentUser) throw new Error('Not signed in.');
  return auth.currentUser.getIdToken();
}

export async function logout() {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeAdminAuth(callback) {
  if (configError) {
    callback({ user: null, isAdmin: false, configError });
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ user: null, isAdmin: false, configError: null });
      return;
    }
    const tokenResult = await user.getIdTokenResult();
    callback({ user, isAdmin: tokenResult.claims.admin === true, configError: null });
  });
}
