import { NavLink } from 'react-router-dom';
import { FiExternalLink, FiLogOut } from 'react-icons/fi';
import { logout } from '@/firebase/adminAuth';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/site', label: 'Site Info' },
  { to: '/admin/about', label: 'About' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/resume', label: 'Resume' },
];

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink md:flex-row">
      <aside className="flex shrink-0 flex-col justify-between border-b border-border p-6 md:fixed md:inset-y-0 md:left-0 md:w-60 md:overflow-y-auto md:border-b-0 md:border-r md:p-8">
        <div>
          <p className="font-display text-xl text-ink">Admin</p>
          <nav className="mt-8 flex flex-row flex-wrap gap-x-5 gap-y-2 md:flex-col md:gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-[13px] uppercase tracking-[0.1em] transition-colors ${
                    isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-row gap-5 md:mt-0 md:flex-col md:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.1em] text-ink-muted transition-colors hover:text-ink"
          >
            View site <FiExternalLink size={13} />
          </a>
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.1em] text-ink-muted transition-colors hover:text-ink"
          >
            Log out <FiLogOut size={13} />
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 py-10 md:px-12 md:py-14 md:ml-60">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
