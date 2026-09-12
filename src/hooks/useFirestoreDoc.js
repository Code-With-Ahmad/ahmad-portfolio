import { useEffect, useState } from 'react';

/**
 * Subscribes to a singleton Firestore doc. No placeholder/fallback content —
 * if the doc doesn't exist yet, `data` is `{}` and callers must handle
 * missing fields themselves (conditional rendering), not by inventing copy.
 */
export function useFirestoreDoc(subscribeFn) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeFn((result) => {
      setData(result || {});
      setLoading(false);
    });
    return unsubscribe;
  }, [subscribeFn]);

  return { data, loading };
}
