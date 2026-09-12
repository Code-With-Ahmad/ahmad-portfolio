import { useState } from 'react';
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { projectsApi } from '@/firebase/content';
import { uploadImage } from '@/firebase/storage';
import { useAdminCollection } from '@/hooks/useAdminCollection';
import { slugify } from '@/lib/utils';
import Loader from '@/components/ui/Loader';
import { notify } from '@/lib/toast';

const FIELD_CLASS =
  'border-b border-border bg-transparent py-1.5 text-[14px] text-ink outline-none transition-colors focus:border-accent';
const LABEL_CLASS = 'text-[12px] uppercase tracking-[0.08em] text-ink-muted';

const emptyForm = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  tags: '',
  coverImageUrl: '',
  images: [],
  liveUrl: '',
  repoUrl: '',
  featured: false,
};

function toFormState(project) {
  return {
    ...emptyForm,
    ...project,
    tags: Array.isArray(project?.tags) ? project.tags.join(', ') : project?.tags || '',
    images: project?.images || [],
  };
}

function toSaveState(form) {
  return {
    ...form,
    tags: form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

function ProjectForm({ initial, onCancel, onSubmit, submitLabel }) {
  const [form, setForm] = useState(toFormState(initial));
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file, 'images/projects');
      setField('coverImageUrl', url);
      notify.success('Cover image uploaded.');
    } catch {
      notify.error('Cover image upload failed. Try again.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    try {
      const url = await uploadImage(file, 'images/projects');
      setForm((f) => ({ ...f, images: [...f.images, url] }));
      notify.success('Image added.');
    } catch {
      notify.error('Image upload failed. Try again.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (url) => {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }));
  };

  return (
    <div className="flex flex-col gap-4 border border-border p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Title</label>
          <input
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: f.slug ? f.slug : slugify(title) }));
            }}
            className={FIELD_CLASS}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Slug</label>
          <input value={form.slug} onChange={(e) => setField('slug', slugify(e.target.value))} className={FIELD_CLASS} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS}>Summary (short, shown in the list)</label>
        <textarea rows={2} value={form.summary} onChange={(e) => setField('summary', e.target.value)} className={`${FIELD_CLASS} resize-none`} />
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS}>Description (case-study body — blank lines start new paragraphs)</label>
        <textarea rows={5} value={form.description} onChange={(e) => setField('description', e.target.value)} className={`${FIELD_CLASS} resize-none`} />
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS}>Tags (comma separated)</label>
        <input value={form.tags} onChange={(e) => setField('tags', e.target.value)} className={FIELD_CLASS} placeholder="React, Firebase, Tailwind CSS" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Live URL</label>
          <input value={form.liveUrl} onChange={(e) => setField('liveUrl', e.target.value)} className={FIELD_CLASS} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Repo URL</label>
          <input value={form.repoUrl} onChange={(e) => setField('repoUrl', e.target.value)} className={FIELD_CLASS} />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-[13px] text-ink-muted">
        <input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} />
        Featured
      </label>

      <div className="flex flex-col gap-2">
        <label className={LABEL_CLASS}>Cover image</label>
        <div className="flex items-center gap-4">
          {form.coverImageUrl && (
            <div className="h-16 w-24 overflow-hidden border border-border">
              <img src={form.coverImageUrl} alt="Cover preview" className="h-full w-full object-cover" />
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] uppercase tracking-[0.08em] text-ink-muted hover:text-ink">
            <FiUploadCloud size={14} />
            {uploadingCover ? 'Uploading…' : 'Upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploadingCover} />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL_CLASS}>Gallery images</label>
        <div className="flex flex-wrap gap-3">
          {form.images.map((url) => (
            <div key={url} className="relative h-16 w-24 overflow-hidden border border-border">
              <img src={url} alt="Gallery" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(url)}
                className="absolute right-1 top-1 bg-bg/80 p-0.5 text-ink"
                aria-label="Remove image"
              >
                <FiTrash2 size={12} />
              </button>
            </div>
          ))}
          <label className="inline-flex h-16 w-24 cursor-pointer items-center justify-center border border-dashed border-border text-ink-muted hover:text-ink">
            {uploadingGallery ? '…' : <FiPlus size={16} />}
            <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onSubmit(toSaveState(form))}
          disabled={!form.title || !form.slug}
          className="bg-accent px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-accent-ink disabled:opacity-50"
        >
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ProjectsEditor() {
  const { items, loading, moveItem } = useAdminCollection(projectsApi);
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleMove = async (index, direction) => {
    try {
      await moveItem(index, direction);
    } catch {
      notify.error("Couldn't reorder — try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await projectsApi.remove(id);
      notify.success('Project removed.');
    } catch {
      notify.error("Couldn't remove project — try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Projects</h1>
      <p className="mt-2 text-[15px] text-ink-muted">Case studies shown in the Work section, in display order.</p>

      <div className="mt-10 flex flex-col gap-4">
        {items.map((project, i) =>
          editingId === project.id ? (
            <ProjectForm
              key={project.id}
              initial={project}
              submitLabel="Save"
              onCancel={() => setEditingId(null)}
              onSubmit={async (form) => {
                try {
                  await projectsApi.update(project.id, form);
                  setEditingId(null);
                  notify.success('Project updated.');
                } catch {
                  notify.error("Couldn't update project — try again.");
                }
              }}
            />
          ) : (
            <div key={project.id} className="flex items-center justify-between gap-4 border-t border-border py-4">
              <div>
                <p className="text-[16px] text-ink">{project.title}</p>
                <p className="mt-1 text-[13px] text-ink-muted">/{project.slug}</p>
              </div>
              <div className="flex items-center gap-3 text-ink-muted">
                <button type="button" onClick={() => handleMove(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                  <FiArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(i, 1)}
                  disabled={i === items.length - 1}
                  className="disabled:opacity-30"
                >
                  <FiArrowDown size={14} />
                </button>
                <button type="button" onClick={() => setEditingId(project.id)} className="text-[13px] uppercase tracking-[0.1em] hover:text-ink">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(project.id)} className="hover:text-ink">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {adding ? (
        <div className="mt-8">
          <ProjectForm
            initial={emptyForm}
            submitLabel="Add Project"
            onCancel={() => setAdding(false)}
            onSubmit={async (form) => {
              try {
                await projectsApi.add({ ...form, order: items.length });
                setAdding(false);
                notify.success('Project added.');
              } catch {
                notify.error("Couldn't add project — try again.");
              }
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-8 inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.1em] text-ink-muted hover:text-ink"
        >
          <FiPlus size={14} /> Add Project
        </button>
      )}
    </div>
  );
}
