import { v2 as cloudinary } from 'cloudinary';
import { isRequestFromAdmin } from './_lib/verifyAdmin.js';

const ALLOWED_FOLDERS = ['resume', 'images/projects', 'images/branding'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await isRequestFromAdmin(req))) {
    return res.status(401).json({ error: 'Not authorized.' });
  }

  const { folder } = req.body || {};
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return res.status(400).json({ error: 'Invalid folder.' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Cloudinary is not configured.' });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return res.status(200).json({ signature, timestamp, apiKey, cloudName, folder });
}
