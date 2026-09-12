import { useEffect, useState } from 'react';

/**
 * Subscribes to a Firestore collection. No placeholder/fallback content —
 * an empty collection stays an empty array; callers decide how to render
 * (or hide) that state.
 */
export function useFirestoreCollection(subscribeFn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeFn((result) => {
      setData(result);
      setLoading(false);
    });
    return unsubscribe;
  }, [subscribeFn]);

  return { data, loading };
}
