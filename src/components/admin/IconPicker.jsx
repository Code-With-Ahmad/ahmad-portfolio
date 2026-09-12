import { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { getIcon, ICON_NAMES } from '@/lib/iconMap';

export default function IconPicker({ value, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const Icon = getIcon(value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 border-b border-border py-1.5 text-[14px] text-ink"
      >
        <Icon size={16} />
        <span className="flex-1 text-left">{value.replace(/^(Si|Fa)/, '')}</span>
        <FiChevronDown size={13} className="text-ink-muted" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-64 w-56 overflow-y-auto border border-border bg-bg-elevated py-1">
          {ICON_NAMES.map((name) => {
            const OptionIcon = getIcon(name);
            const active = name === value;
            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-bg ${
                  active ? 'text-accent' : 'text-ink'
                }`}
              >
                <OptionIcon size={15} />
                {name.replace(/^(Si|Fa)/, '')}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
