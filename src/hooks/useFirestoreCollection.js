import { useEffect, useState } from 'react';

/**
 * Subscribes to a Firestore collection. Falls back to placeholder content
 * when the collection is still empty (fresh project, not seeded), so the
 * site never looks broken before the admin dashboard has been used.
 */
export function useFirestoreCollection(subscribeFn, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeFn((result) => {
      setData(result.length > 0 ? result : fallback);
      setLoading(false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}
