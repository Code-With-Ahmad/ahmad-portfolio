import { useEffect, useState } from 'react';

/**
 * Subscribes to a singleton Firestore doc. Merges the result over the
 * placeholder defaults FIELD BY FIELD (not just "doc exists or not") — a
 * document that exists but is missing some fields (e.g. right after the
 * first-ever write only set one field) would otherwise leave those fields
 * `undefined` everywhere they're used, instead of gracefully falling back.
 */
export function useFirestoreDoc(subscribeFn, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeFn((result) => {
      setData(result ? { ...fallback, ...result } : fallback);
      setLoading(false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}
