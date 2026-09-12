import { updateSite } from './content';
import { getCurrentIdToken } from './adminAuth';

// Files are uploaded to Cloudinary (not Firebase Storage — see README for
// why). The flow: ask our own serverless function for a signed upload
// (it verifies the caller is really the logged-in admin via their Firebase
// ID token before signing anything), then upload the file straight to
// Cloudinary from the browser using that signature. The file bytes never
// pass through our server, so there's no serverless body-size limit to hit.
async function getUploadSignature(folder) {
  const idToken = await getCurrentIdToken();
  const res = await fetch('/api/upload-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ folder }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Could not authorize upload.');
  }

  return res.json();
}

async function uploadToCloudinary(file, folder) {
  const { signature, timestamp, apiKey, cloudName } = await getUploadSignature(folder);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  // Non-image files (the resume PDF) must go through Cloudinary's "raw"
  // endpoint, not "image" — new Cloudinary accounts block direct delivery
  // of PDFs uploaded as an image resource for security reasons, which
  // otherwise surfaces as a 401 when a visitor clicks "Download Resume".
  const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || 'Upload to Cloudinary failed.');
  }

  const data = await res.json();
  return data.secure_url;
}

export async function uploadResume(file) {
  const url = await uploadToCloudinary(file, 'resume');
  await updateSite({ resumeUrl: url, resumeFileName: file.name });
  return url;
}

export async function uploadImage(file, folder = 'images/projects') {
  return uploadToCloudinary(file, folder);
}
