import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from './firebaseAdmin.js';

/**
 * Verifies the request carries a Firebase ID token for the admin identity
 * (the custom-token session minted by /api/admin-login.js). Returns true/false
 * — never trust the client's own claim of being an admin, always re-verify here.
 */
export async function isRequestFromAdmin(req) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return false;

  try {
    getAdminApp();
    const decoded = await getAuth().verifyIdToken(match[1]);
    return decoded.admin === true;
  } catch {
    return false;
  }
}
