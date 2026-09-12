import { useEffect } from 'react';
import { useFirestoreDoc } from './useFirestoreDoc';
import { subscribeSite } from '@/firebase/content';
import { useTheme } from '@/context/ThemeContext';

const THEME_COLORS = { dark: '#0b0b0c', light: '#f5f2ea' };

/**
 * Keeps browser chrome in sync with live content: the favicon follows the
 * admin-uploaded faviconUrl (falling back to the static default), and the
 * mobile theme-color meta tag follows the active theme.
 */
export function useSiteChrome() {
  const { data: site, loading } = useFirestoreDoc(subscribeSite);
  const { theme } = useTheme();

  useEffect(() => {
    const link = document.getElementById('favicon');
    if (link) {
      link.href = site.faviconUrl || '/favicon.svg';
      link.type = site.faviconUrl ? '' : 'image/svg+xml';
    }
  }, [site.faviconUrl]);

  useEffect(() => {
    const meta = document.getElementById('theme-color-meta');
    if (meta) meta.content = THEME_COLORS[theme] || THEME_COLORS.dark;
  }, [theme]);

  return { site, loading };
}
