import { useEffect, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { getDocById } from '@/firebase/content';
import { uploadResume } from '@/firebase/storage';
import { notify } from '@/lib/toast';
import Loader from '@/components/ui/Loader';

export default function ResumeUploader() {
  const [current, setCurrent] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getDocById('content', 'site').then((doc) => {
      setCurrent({ resumeUrl: doc?.resumeUrl || '', resumeFileName: doc?.resumeFileName || '' });
    });
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      notify.error('Please upload a PDF file.');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadResume(file);
      setCurrent({ resumeUrl: url, resumeFileName: file.name });
      notify.success('Resume updated.');
    } catch {
      notify.error('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!current) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Resume</h1>
      <p className="mt-2 text-[15px] text-ink-muted">
        Uploading a new file replaces the one served by the public "Download Resume" button immediately.
      </p>

      <div className="mt-10 border border-border p-6">
        <p className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">Current file</p>
        <p className="mt-2 text-[15px] text-ink">
          {current?.resumeFileName || 'No resume uploaded yet.'}
        </p>
        {current?.resumeUrl && (
          <a href={current.resumeUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[13px] text-accent underline underline-offset-4">
            View current file
          </a>
        )}
      </div>

      <label className="mt-8 inline-flex cursor-pointer items-center gap-2 bg-accent px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] text-accent-ink">
        <FiUploadCloud size={16} />
        {uploading ? 'Uploading…' : 'Upload New Resume (PDF)'}
        <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}
