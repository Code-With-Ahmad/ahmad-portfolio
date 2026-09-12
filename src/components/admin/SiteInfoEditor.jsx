import { useEffect, useState } from 'react';
import { getDocById, updateSite } from '@/firebase/content';
import ImageUploadField from './ImageUploadField';
import Loader from '@/components/ui/Loader';
import { notify } from '@/lib/toast';

// Minimal empty shape so controlled inputs never see `undefined` on a fresh
// doc — not placeholder copy, just structurally-safe blank values.
const emptySiteForm = {
  name: '',
  title: '',
  tagline: '',
  heroDescription: '',
  availability: '',
  email: '',
  location: '',
  whatsapp: '',
  logoUrl: '',
  faviconUrl: '',
  socials: { github: '', linkedin: '', x: '' },
  aboutEyebrow: '',
  skillsEyebrow: '',
  skillsTitle: '',
  experienceEyebrow: '',
  experienceTitle: '',
  projectsEyebrow: '',
  projectsTitle: '',
  contactEyebrow: '',
  contactTitle: '',
};

const FIELD_CLASS =
  'border-b border-border bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-accent';
const LABEL_CLASS = 'text-[13px] uppercase tracking-[0.1em] text-ink-muted';

function Field({ label, value, onChange, type = 'text', textarea = false }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={LABEL_CLASS}>{label}</label>
      {textarea ? (
        <textarea
          rows={2}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${FIELD_CLASS} resize-none`}
        />
      ) : (
        <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className={FIELD_CLASS} />
      )}
    </div>
  );
}

export default function SiteInfoEditor() {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error

  useEffect(() => {
    getDocById('content', 'site').then((doc) => {
      setForm({ ...emptySiteForm, ...doc });
    });
  }, []);

  if (!form) return <Loader />;

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setSocial = (key, value) => setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateSite(form);
      setStatus('idle');
      notify.success('Site info saved.');
    } catch {
      setStatus('idle');
      notify.error("Couldn't save — try again.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Site Info</h1>
      <p className="mt-2 text-[15px] text-ink-muted">Your name, headline copy, contact details, and social links.</p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
        <Field label="Name" value={form.name} onChange={(v) => setField('name', v)} />
        <Field label="Title / Role" value={form.title} onChange={(v) => setField('title', v)} />
        <Field
          label="Hero tagline (large headline)"
          value={form.tagline}
          onChange={(v) => setField('tagline', v)}
          textarea
        />
        <Field
          label="Hero description"
          value={form.heroDescription}
          onChange={(v) => setField('heroDescription', v)}
          textarea
        />
        <Field label="Availability status" value={form.availability} onChange={(v) => setField('availability', v)} />
        <div className="flex flex-col gap-1.5">
          <Field label="Email" value={form.email} onChange={(v) => setField('email', v)} type="email" />
          <p className="text-[13px] text-ink-muted">
            Shown publicly, and this is also where messages from the contact form are delivered.
          </p>
        </div>
        <Field label="Location" value={form.location} onChange={(v) => setField('location', v)} />
        <div className="flex flex-col gap-1.5">
          <Field label="WhatsApp number" value={form.whatsapp} onChange={(v) => setField('whatsapp', v)} />
          <p className="text-[13px] text-ink-muted">
            Include the country code, digits only or with spaces/dashes — e.g. +92 300 1234567. Leave blank to hide
            the floating WhatsApp button entirely.
          </p>
        </div>

        <ImageUploadField
          label="Logo"
          hint="Shown in the nav bar in place of your initials. A wide/square transparent PNG or SVG works best."
          value={form.logoUrl}
          onChange={(v) => setField('logoUrl', v)}
          previewClassName="flex h-10 w-24 items-center justify-start border border-border bg-bg-elevated px-2"
        />

        <ImageUploadField
          label="Favicon"
          hint="The small icon shown in the browser tab. Upload a square image — 512×512 PNG recommended. Applies immediately, no rebuild needed."
          value={form.faviconUrl}
          onChange={(v) => setField('faviconUrl', v)}
          previewClassName="h-10 w-10 border border-border bg-bg-elevated p-1"
        />

        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Field label="GitHub URL" value={form.socials?.github} onChange={(v) => setSocial('github', v)} />
          <Field label="LinkedIn URL" value={form.socials?.linkedin} onChange={(v) => setSocial('linkedin', v)} />
          <Field label="X / Twitter URL" value={form.socials?.x} onChange={(v) => setSocial('x', v)} />
        </div>

        <div className="mt-4 border-t border-border pt-8">
          <h2 className="font-display text-xl text-ink">Section headings</h2>
          <p className="mt-2 text-[15px] text-ink-muted">
            The small eyebrow label and large heading shown above each section on the homepage.
          </p>

          <div className="mt-6 flex flex-col gap-6">
            <Field label="About — eyebrow" value={form.aboutEyebrow} onChange={(v) => setField('aboutEyebrow', v)} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Skills — eyebrow" value={form.skillsEyebrow} onChange={(v) => setField('skillsEyebrow', v)} />
              <Field label="Skills — heading" value={form.skillsTitle} onChange={(v) => setField('skillsTitle', v)} />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field
                label="Experience — eyebrow"
                value={form.experienceEyebrow}
                onChange={(v) => setField('experienceEyebrow', v)}
              />
              <Field
                label="Experience — heading"
                value={form.experienceTitle}
                onChange={(v) => setField('experienceTitle', v)}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field
                label="Projects — eyebrow"
                value={form.projectsEyebrow}
                onChange={(v) => setField('projectsEyebrow', v)}
              />
              <Field label="Projects — heading" value={form.projectsTitle} onChange={(v) => setField('projectsTitle', v)} />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field
                label="Contact — eyebrow"
                value={form.contactEyebrow}
                onChange={(v) => setField('contactEyebrow', v)}
              />
              <Field label="Contact — heading" value={form.contactTitle} onChange={(v) => setField('contactTitle', v)} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-5">
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
