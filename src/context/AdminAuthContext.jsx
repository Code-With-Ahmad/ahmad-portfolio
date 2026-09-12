import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeAdminAuth } from '@/firebase/adminAuth';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [state, setState] = useState({ user: null, isAdmin: false, loading: true, configError: null });

  useEffect(() => {
    const unsubscribe = subscribeAdminAuth(({ user, isAdmin, configError }) => {
      setState({ user, isAdmin, loading: false, configError: configError || null });
    });
    return unsubscribe;
  }, []);

  return <AdminAuthContext.Provider value={state}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
