import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { experienceApi, projectsApi, skillsApi } from '@/firebase/content';

export default function AdminDashboardHome() {
  const { data: skills } = useFirestoreCollection(skillsApi.subscribeAll, []);
  const { data: experience } = useFirestoreCollection(experienceApi.subscribeAll, []);
  const { data: projects } = useFirestoreCollection(projectsApi.subscribeAll, []);

  const stats = [
    { label: 'Skills', value: skills.length, to: '/admin/skills' },
    { label: 'Experience entries', value: experience.length, to: '/admin/experience' },
    { label: 'Projects', value: projects.length, to: '/admin/projects' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Overview</h1>
      <p className="mt-2 text-[15px] text-ink-muted">
        Everything you edit here reflects on the live site immediately — no redeploy needed.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="border border-border p-5 transition-colors hover:border-accent"
          >
            <div className="font-display text-3xl text-ink">{stat.value}</div>
            <div className="mt-1 text-[13px] uppercase tracking-[0.1em] text-ink-muted">{stat.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
