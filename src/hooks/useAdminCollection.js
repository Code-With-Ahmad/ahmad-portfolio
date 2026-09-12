import { useEffect, useState } from 'react';

/**
 * Live-subscribes an admin editor to a Firestore collection API
 * (see firebase/content.js's makeCollectionApi) and provides a
 * swap-based reorder helper for simple up/down move controls.
 */
export function useAdminCollection(api) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = api.subscribeAll((data) => {
      setItems(data);
      setLoading(false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveItem = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    await api.reorder(reordered);
  };

  return { items, loading, moveItem };
}
