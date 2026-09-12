import { Route, Routes } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboardHome from '@/components/admin/AdminDashboardHome';
import SiteInfoEditor from '@/components/admin/SiteInfoEditor';
import AboutEditor from '@/components/admin/AboutEditor';
import SkillsEditor from '@/components/admin/SkillsEditor';
import ExperienceEditor from '@/components/admin/ExperienceEditor';
import ProjectsEditor from '@/components/admin/ProjectsEditor';
import ResumeUploader from '@/components/admin/ResumeUploader';
import Loader from '@/components/ui/Loader';

function AdminGate() {
  const { isAdmin, loading, configError } = useAdminAuth();

  if (loading) {
    return <Loader className="min-h-screen bg-bg" />;
  }

  if (configError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6">
        <div className="max-w-sm">
          <h1 className="font-display text-2xl text-ink">Firebase isn't configured yet</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            The admin dashboard needs a Firebase project connected. Add your Firebase config to{' '}
            <code className="text-ink">.env</code> (see <code className="text-ink">.env.example</code>) and restart
            the app.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboardHome />} />
        <Route path="site" element={<SiteInfoEditor />} />
        <Route path="about" element={<AboutEditor />} />
        <Route path="skills" element={<SkillsEditor />} />
        <Route path="experience" element={<ExperienceEditor />} />
        <Route path="projects" element={<ProjectsEditor />} />
        <Route path="resume" element={<ResumeUploader />} />
      </Routes>
    </AdminLayout>
  );
}

export default function AdminRoot() {
  return (
    <AdminAuthProvider>
      <AdminGate />
    </AdminAuthProvider>
  );
}
