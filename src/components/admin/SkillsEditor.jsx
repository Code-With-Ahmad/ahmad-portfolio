import { useState } from 'react';
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2 } from 'react-icons/fi';
import { skillsApi } from '@/firebase/content';
import { useAdminCollection } from '@/hooks/useAdminCollection';
import { getIcon, ICON_NAMES } from '@/lib/iconMap';
import IconPicker from './IconPicker';
import Loader from '@/components/ui/Loader';
import { notify } from '@/lib/toast';

const FIELD_CLASS =
  'border-b border-border bg-transparent py-1.5 text-[14px] text-ink outline-none transition-colors focus:border-accent';

function groupByCategory(items) {
  const groups = new Map();
  items.forEach((item, index) => {
    const key = item.category || 'Other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ ...item, flatIndex: index });
  });
  return Array.from(groups.entries());
}

function SkillRow({ skill, onSave, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: skill.name, category: skill.category, icon: skill.icon });
  const Icon = getIcon(skill.icon);

  if (editing) {
    return (
      <div className="flex flex-wrap items-end gap-3 border-t border-border py-3">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={`${FIELD_CLASS} w-32`}
          placeholder="Name"
        />
        <input
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={`${FIELD_CLASS} w-32`}
          placeholder="Category"
        />
        <IconPicker value={form.icon} onChange={(icon) => setForm((f) => ({ ...f, icon }))} className="w-40" />
        <button
          type="button"
          onClick={() => {
            onSave(form);
            setEditing(false);
          }}
          className="text-[13px] uppercase tracking-[0.1em] text-accent"
        >
          Save
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border py-3">
      <div className="flex items-center gap-3">
        <Icon className="text-ink-muted" size={16} />
        <span className="text-[15px] text-ink">{skill.name}</span>
      </div>
      <div className="flex items-center gap-3 text-ink-muted">
        <button type="button" onClick={onMoveUp} disabled={isFirst} className="disabled:opacity-30">
          <FiArrowUp size={14} />
        </button>
        <button type="button" onClick={onMoveDown} disabled={isLast} className="disabled:opacity-30">
          <FiArrowDown size={14} />
        </button>
        <button type="button" onClick={() => setEditing(true)} className="text-[13px] uppercase tracking-[0.1em] hover:text-ink">
          Edit
        </button>
        <button type="button" onClick={onDelete} className="hover:text-ink">
          <FiTrash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function SkillsEditor() {
  const { items, loading } = useAdminCollection(skillsApi);
  const [newSkill, setNewSkill] = useState({ name: '', category: '', icon: ICON_NAMES[0] });
  const groups = groupByCategory(items);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim() || !newSkill.category.trim()) return;
    try {
      const sameCategoryCount = items.filter((s) => s.category === newSkill.category).length;
      await skillsApi.add({ ...newSkill, order: sameCategoryCount });
      setNewSkill({ name: '', category: newSkill.category, icon: ICON_NAMES[0] });
      notify.success('Skill added.');
    } catch {
      notify.error("Couldn't add skill — try again.");
    }
  };

  const handleSave = async (id, form) => {
    try {
      await skillsApi.update(id, form);
      notify.success('Skill updated.');
    } catch {
      notify.error("Couldn't update skill — try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await skillsApi.remove(id);
      notify.success('Skill removed.');
    } catch {
      notify.error("Couldn't remove skill — try again.");
    }
  };

  const moveWithinCategory = async (categoryItems, indexInCategory, direction) => {
    const targetIndex = indexInCategory + direction;
    if (targetIndex < 0 || targetIndex >= categoryItems.length) return;
    const reordered = [...categoryItems];
    [reordered[indexInCategory], reordered[targetIndex]] = [reordered[targetIndex], reordered[indexInCategory]];
    try {
      await skillsApi.reorder(reordered);
    } catch {
      notify.error("Couldn't reorder — try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Skills</h1>
      <p className="mt-2 text-[15px] text-ink-muted">Grouped by category. Reorder with the arrows.</p>

      <div className="mt-10 flex flex-col gap-10">
        {groups.map(([category, categoryItems]) => (
          <div key={category}>
            <h2 className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">{category}</h2>
            <div>
              {categoryItems.map((skill, i) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  isFirst={i === 0}
                  isLast={i === categoryItems.length - 1}
                  onMoveUp={() => moveWithinCategory(categoryItems, i, -1)}
                  onMoveDown={() => moveWithinCategory(categoryItems, i, 1)}
                  onSave={(form) => handleSave(skill.id, form)}
                  onDelete={() => handleDelete(skill.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="mt-12 flex flex-wrap items-end gap-3 border-t border-border pt-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">Name</label>
          <input
            value={newSkill.name}
            onChange={(e) => setNewSkill((f) => ({ ...f, name: e.target.value }))}
            className={`${FIELD_CLASS} w-36`}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">Category</label>
          <input
            value={newSkill.category}
            onChange={(e) => setNewSkill((f) => ({ ...f, category: e.target.value }))}
            className={`${FIELD_CLASS} w-36`}
            list="skill-categories"
          />
          <datalist id="skill-categories">
            {[...new Set(items.map((s) => s.category))].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">Icon</label>
          <IconPicker value={newSkill.icon} onChange={(icon) => setNewSkill((f) => ({ ...f, icon }))} className="w-40" />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-accent px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] text-accent-ink"
        >
          <FiPlus size={14} /> Add Skill
        </button>
      </form>
    </div>
  );
}
