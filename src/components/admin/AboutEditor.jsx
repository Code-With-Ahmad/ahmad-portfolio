import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { getDocById, updateAbout } from '@/firebase/content';
import ImageUploadField from './ImageUploadField';
import Loader from '@/components/ui/Loader';
import { notify } from '@/lib/toast';

const FIELD_CLASS =
  'border-b border-border bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-accent';
const LABEL_CLASS = 'text-[13px] uppercase tracking-[0.1em] text-ink-muted';

// Minimal empty shape so controlled inputs never see `undefined` on a fresh
// doc — not placeholder copy, just structurally-safe blank values.
const emptyAboutForm = { heading: '', bio: [''], profileImageUrl: '' };

export default function AboutEditor() {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    getDocById('content', 'about').then((doc) => {
      const merged = { ...emptyAboutForm, ...doc };
      setForm({ ...merged, bio: merged.bio?.length ? merged.bio : [''] });
    });
  }, []);

  if (!form) return <Loader />;

  const updateParagraph = (index, value) => {
    setForm((f) => ({ ...f, bio: f.bio.map((p, i) => (i === index ? value : p)) }));
  };

  const addParagraph = () => setForm((f) => ({ ...f, bio: [...f.bio, ''] }));

  const removeParagraph = (index) => {
    setForm((f) => ({ ...f, bio: f.bio.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateAbout({ ...form, bio: form.bio.filter((p) => p.trim().length > 0) });
      setStatus('idle');
      notify.success('About section saved.');
    } catch {
      setStatus('idle');
      notify.error("Couldn't save — try again.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">About</h1>
      <p className="mt-2 text-[15px] text-ink-muted">The heading and bio paragraphs shown in the About section.</p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8">
        <ImageUploadField
          label="Your photo"
          hint="Shown on the hero section of the homepage. A portrait-orientation photo works best."
          value={form.profileImageUrl}
          onChange={(v) => setForm((f) => ({ ...f, profileImageUrl: v }))}
          previewClassName="aspect-[4/5] w-24 overflow-hidden border border-border bg-bg-elevated"
          folder="images/branding"
        />

        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS}>Heading</label>
          <textarea
            rows={2}
            value={form.heading}
            onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-5">
          <label className={LABEL_CLASS}>Bio paragraphs</label>
          {form.bio.map((paragraph, i) => (
            <div key={i} className="flex items-start gap-3">
              <textarea
                rows={3}
                value={paragraph}
                onChange={(e) => updateParagraph(i, e.target.value)}
                className={`${FIELD_CLASS} flex-1 resize-none`}
              />
              <button
                type="button"
                onClick={() => removeParagraph(i)}
                aria-label="Remove paragraph"
                className="mt-2 text-ink-muted transition-colors hover:text-ink"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="inline-flex w-fit items-center gap-1.5 text-[13px] uppercase tracking-[0.1em] text-ink-muted transition-colors hover:text-ink"
          >
            <FiPlus size={14} /> Add paragraph
          </button>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="bg-accent px-6 py-3 text-[13px] font-medium uppercase tracking-[0.12em] text-accent-ink transition-opacity disabled:opacity-60"
          >
            {status === 'saving' ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
