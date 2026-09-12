import { useState } from 'react';
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2 } from 'react-icons/fi';
import { experienceApi } from '@/firebase/content';
import { useAdminCollection } from '@/hooks/useAdminCollection';
import { formatDateRange } from '@/lib/utils';
import Loader from '@/components/ui/Loader';
import { notify } from '@/lib/toast';

const FIELD_CLASS =
  'border-b border-border bg-transparent py-1.5 text-[14px] text-ink outline-none transition-colors focus:border-accent';
const LABEL_CLASS = 'text-[12px] uppercase tracking-[0.08em] text-ink-muted';

const emptyForm = { company: '', role: '', location: '', startDate: '', endDate: 'Present', bullets: [''] };

function ExperienceForm({ initial, onCancel, onSubmit, submitLabel }) {
  const [form, setForm] = useState(initial);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateBullet = (i, value) => setForm((f) => ({ ...f, bullets: f.bullets.map((b, idx) => (idx === i ? value : b)) }));
  const addBullet = () => setForm((f) => ({ ...f, bullets: [...f.bullets, ''] }));
  const removeBullet = (i) => setForm((f) => ({ ...f, bullets: f.bullets.filter((_, idx) => idx !== i) }));

  return (
    <div className="flex flex-col gap-4 border border-border p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Company</label>
          <input value={form.company} onChange={(e) => setField('company', e.target.value)} className={FIELD_CLASS} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Role</label>
          <input value={form.role} onChange={(e) => setField('role', e.target.value)} className={FIELD_CLASS} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Location</label>
          <input value={form.location} onChange={(e) => setField('location', e.target.value)} className={FIELD_CLASS} />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <label className={LABEL_CLASS}>Start (YYYY-MM)</label>
            <input value={form.startDate} onChange={(e) => setField('startDate', e.target.value)} className={FIELD_CLASS} placeholder="2023-01" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label className={LABEL_CLASS}>End (YYYY-MM or Present)</label>
            <input value={form.endDate} onChange={(e) => setField('endDate', e.target.value)} className={FIELD_CLASS} placeholder="Present" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className={LABEL_CLASS}>Bullets</label>
        {form.bullets.map((bullet, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={bullet} onChange={(e) => updateBullet(i, e.target.value)} className={`${FIELD_CLASS} flex-1`} />
            <button type="button" onClick={() => removeBullet(i)} className="text-ink-muted hover:text-ink">
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addBullet}
          className="inline-flex w-fit items-center gap-1.5 text-[12px] uppercase tracking-[0.08em] text-ink-muted hover:text-ink"
        >
          <FiPlus size={12} /> Add bullet
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onSubmit({ ...form, bullets: form.bullets.filter((b) => b.trim()) })}
          className="bg-accent px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-accent-ink"
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

export default function ExperienceEditor() {
  const { items, loading, moveItem } = useAdminCollection(experienceApi);
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
      await experienceApi.remove(id);
      notify.success('Entry removed.');
    } catch {
      notify.error("Couldn't remove entry — try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Experience</h1>
      <p className="mt-2 text-[15px] text-ink-muted">Work history entries, in display order.</p>

      <div className="mt-10 flex flex-col gap-4">
        {items.map((role, i) =>
          editingId === role.id ? (
            <ExperienceForm
              key={role.id}
              initial={{ ...emptyForm, ...role, bullets: role.bullets?.length ? role.bullets : [''] }}
              submitLabel="Save"
              onCancel={() => setEditingId(null)}
              onSubmit={async (form) => {
                try {
                  await experienceApi.update(role.id, form);
                  setEditingId(null);
                  notify.success('Entry updated.');
                } catch {
                  notify.error("Couldn't update entry — try again.");
                }
              }}
            />
          ) : (
            <div key={role.id} className="flex items-center justify-between gap-4 border-t border-border py-4">
              <div>
                <p className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">
                  {formatDateRange(role.startDate, role.endDate)}
                </p>
                <p className="mt-1 text-[16px] text-ink">
                  {role.role} · {role.company}
                </p>
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
                <button type="button" onClick={() => setEditingId(role.id)} className="text-[13px] uppercase tracking-[0.1em] hover:text-ink">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(role.id)} className="hover:text-ink">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {adding ? (
        <div className="mt-8">
          <ExperienceForm
            initial={emptyForm}
            submitLabel="Add Entry"
            onCancel={() => setAdding(false)}
            onSubmit={async (form) => {
              try {
                await experienceApi.add({ ...form, order: items.length });
                setAdding(false);
                notify.success('Entry added.');
              } catch {
                notify.error("Couldn't add entry — try again.");
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
          <FiPlus size={14} /> Add Experience
        </button>
      )}
    </div>
  );
}
