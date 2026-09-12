import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/layout/CustomCursor';
import FloatingActions from '@/components/layout/FloatingActions';
import PageTransition from '@/components/layout/PageTransition';
import ScrollProgress from '@/components/layout/ScrollProgress';
import PersonSchema from '@/components/layout/PersonSchema';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import { useSiteChrome } from '@/hooks/useSiteChrome';

const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const AdminRoot = lazy(() => import('@/pages/AdminRoot'));

function RouteFallback() {
  return <div className="min-h-screen bg-bg" />;
}

function PublicLayout({ children }) {
  useSiteChrome();

  return (
    <>
      <ScrollProgress />
      <PersonSchema />
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/admin/*" element={<AdminRoot />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <PublicLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <PageTransition>
                <Suspense fallback={<RouteFallback />}>
                  <ProjectDetail />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </PublicLayout>
  );
}
