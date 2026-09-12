import { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { uploadImage } from '@/firebase/storage';
import { notify } from '@/lib/toast';

const LABEL_CLASS = 'text-[13px] uppercase tracking-[0.1em] text-ink-muted';

export default function ImageUploadField({ label, hint, value, onChange, previewClassName, folder = 'images/branding' }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      notify.success(`${label} uploaded.`);
    } catch {
      notify.error(`Couldn't upload ${label.toLowerCase()} — try again.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className={LABEL_CLASS}>{label}</label>
      {hint && <p className="text-[13px] text-ink-muted">{hint}</p>}
      <div className="mt-1 flex items-center gap-4">
        {value && (
          <div className={previewClassName}>
            <img src={value} alt={label} className="h-full w-full object-contain" />
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] uppercase tracking-[0.08em] text-ink-muted hover:text-ink">
          <FiUploadCloud size={14} />
          {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[13px] uppercase tracking-[0.08em] text-ink-muted hover:text-ink"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
